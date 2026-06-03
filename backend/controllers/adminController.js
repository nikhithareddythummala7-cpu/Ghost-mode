const mongoose = require('mongoose');
const User = require('../models/User');
const TimeCapsule = require('../models/TimeCapsule');
const ScheduledMessage = require('../models/ScheduledMessage');
const MemoryVault = require('../models/MemoryVault');
const EmergencyContact = require('../models/EmergencyContact');
const PlatformSetting = require('../models/PlatformSetting');
const { assessMessageForSpam } = require('../services/spamService');

const buildSearchRegex = (query) => {
  if (!query) return null;
  return new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, ''), 'i');
};

const formatMonthlySeries = (results, startDate) => {
  const series = [];
  const cursor = new Date(startDate);

  for (let i = 0; i < 6; i += 1) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    const label = cursor.toLocaleString('default', { month: 'short', year: 'numeric' });
    const match = results.find((item) => {
      if (!item?._id) return false;
      if (typeof item._id === 'string') {
        const [resultYear, resultMonth] = item._id.split('-').map(Number);
        return resultYear === year && resultMonth === month;
      }
      return item._id.year === year && item._id.month === month;
    });
    series.push({ month: label, count: match?.count ?? 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return series;
};

const buildMonthlyAggregation = async (Model, dateField, startDate) => {
  const results = await Model.aggregate([
    { $match: { [dateField]: { $gte: startDate } } },
    { $project: { year: { $year: `$${dateField}` }, month: { $month: `$${dateField}` } } },
    {
      $group: {
        _id: { year: '$year', month: '$month' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
  return formatMonthlySeries(results, startDate);
};

exports.getUsers = async (req, res) => {
  const { search, status } = req.query;
  const filter = {};

  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;

  const searchRegex = buildSearchRegex(search);
  if (searchRegex) {
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { role: searchRegex }
    ];
  }

  const users = await User.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'timecapsules',
        localField: '_id',
        foreignField: 'userId',
        as: 'capsules'
      }
    },
    {
      $lookup: {
        from: 'scheduledmessages',
        localField: '_id',
        foreignField: 'userId',
        as: 'messages'
      }
    },
    {
      $lookup: {
        from: 'memoryvaults',
        localField: '_id',
        foreignField: 'userId',
        as: 'vaultItems'
      }
    },
    {
      $lookup: {
        from: 'emergencycontacts',
        localField: '_id',
        foreignField: 'userId',
        as: 'contacts'
      }
    },
    {
      $project: {
        capsulesCount: { $size: '$capsules' },
        messagesCount: { $size: '$messages' },
        vaultItemCount: { $size: '$vaultItems' },
        contactCount: { $size: '$contacts' },
        name: 1,
        email: 1,
        role: 1,
        isActive: 1,
        createdAt: 1
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  res.json(users);
};

exports.changeUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (typeof req.body.isActive !== 'boolean') {
    return res.status(400).json({ message: 'isActive must be a boolean' });
  }
  user.isActive = req.body.isActive;
  await user.save();
  res.json({ message: 'User status updated', user: { id: user._id, email: user.email, isActive: user.isActive } });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User deleted' });
};

exports.getCapsules = async (req, res) => {
  const { status, user } = req.query;
  const filter = {};

  if (status === 'locked' || status === 'unlocked') filter.status = status;
  if (user) {
    const userRegex = buildSearchRegex(user);
    if (userRegex) {
      const ids = await User.find({ $or: [{ name: userRegex }, { email: userRegex }] }).select('_id');
      filter.userId = { $in: ids.map((item) => item._id) };
    }
  }

  const capsules = await TimeCapsule.find(filter)
    .select('_id userId unlockDate status createdAt isSuspicious')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(capsules);
};

exports.markCapsuleSuspicious = async (req, res) => {
  const { isSuspicious } = req.body;
  const capsule = await TimeCapsule.findById(req.params.id);
  if (!capsule) {
    return res.status(404).json({ message: 'Capsule not found' });
  }
  capsule.isSuspicious = Boolean(isSuspicious);
  await capsule.save();
  res.json({ message: `Capsule marked ${capsule.isSuspicious ? 'suspicious' : 'safe'}.`, capsule });
};

exports.deleteCapsule = async (req, res) => {
  const capsule = await TimeCapsule.findByIdAndDelete(req.params.id);
  if (!capsule) {
    return res.status(404).json({ message: 'Capsule not found' });
  }
  res.json({ message: 'Capsule deleted' });
};

exports.getMessages = async (req, res) => {
  const { search, status, flagged } = req.query;
  const filter = {};

  if (['pending', 'delivered', 'failed', 'blocked'].includes(status)) filter.status = status;
  if (flagged === 'true') {
    filter.isFlagged = true;
    filter.reviewStatus = 'pending_review';
  }

  const searchRegex = buildSearchRegex(search);
  if (searchRegex) {
    filter.recipientEmail = searchRegex;
  }

  const messages = await ScheduledMessage.find(filter)
    .select('_id recipientEmail recipientCount deliveryDate status isFlagged spamScore flagReason createdAt userId')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(messages);
};

exports.reviewMessage = async (req, res) => {
  const { action } = req.body;
  const message = await ScheduledMessage.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  if (action === 'approve') {
    message.reviewStatus = 'approved';
    message.flagReason = message.flagReason ? `${message.flagReason}; Admin approved` : 'Admin approved';
    await message.save();
    return res.json({ message: 'Message approved for delivery', reviewStatus: message.reviewStatus });
  }

  if (action === 'block') {
    message.reviewStatus = 'blocked';
    message.status = 'blocked';
    message.flagReason = message.flagReason ? `${message.flagReason}; Blocked by admin` : 'Blocked by admin';
    await message.save();
    return res.json({ message: 'Message blocked from delivery', reviewStatus: message.reviewStatus });
  }

  res.status(400).json({ message: 'Invalid review action' });
};

exports.deleteMessage = async (req, res) => {
  const message = await ScheduledMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    return res.status(404).json({ message: 'Scheduled message not found' });
  }
  res.json({ message: 'Scheduled message deleted' });
};

exports.getVault = async (req, res) => {
  const overview = req.query.overview === 'true';
  const { search, type } = req.query;
  if (overview) {
    const data = await MemoryVault.aggregate([
      {
        $group: {
          _id: '$userId',
          fileCount: { $sum: 1 },
          totalSize: { $sum: '$fileSize' },
          latestUpload: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          userName: '$user.name',
          userEmail: '$user.email',
          fileCount: 1,
          totalSize: 1,
          latestUpload: 1
        }
      },
      { $sort: { latestUpload: -1 } }
    ]);

    return res.json(data);
  }

  const filter = {};
  if (type) filter.fileType = type;

  if (search) {
    const userRegex = buildSearchRegex(search);
    if (userRegex) {
      const ids = await User.find({
        $or: [{ name: userRegex }, { email: userRegex }]
      }).select('_id');
      filter.userId = { $in: ids.map((item) => item._id) };
    }
  }

  const items = await MemoryVault.find(filter)
    .select('_id userId fileType fileSize createdAt')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(items);
};

exports.deleteVaultItem = async (req, res) => {
  const item = await MemoryVault.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Vault item not found' });
  }
  res.json({ message: 'Vault item deleted' });
};

exports.getContacts = async (req, res) => {
  const overview = req.query.overview === 'true';
  if (overview) {
    const data = await EmergencyContact.aggregate([
      {
        $group: {
          _id: '$userId',
          contactCount: { $sum: 1 },
          relationships: { $addToSet: '$relationship' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          userName: '$user.name',
          userEmail: '$user.email',
          contactCount: 1,
          relationships: 1
        }
      },
      { $sort: { contactCount: -1 } }
    ]);

    return res.json(data);
  }

  const contacts = await EmergencyContact.find()
    .select('_id userId relationship')
    .populate('userId', 'name email')
    .sort({ _id: -1 });
  res.json(contacts);
};

exports.deleteContact = async (req, res) => {
  const contact = await EmergencyContact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json({ message: 'Emergency contact deleted' });
};

exports.getStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const disabledUsers = await User.countDocuments({ isActive: false });
  const totalCapsules = await TimeCapsule.countDocuments();
  const totalMessages = await ScheduledMessage.countDocuments();
  const totalVaultItems = await MemoryVault.countDocuments();
  const totalContacts = await EmergencyContact.countDocuments();
  const lockedCapsules = await TimeCapsule.countDocuments({ status: 'locked' });
  const unlockedCapsules = await TimeCapsule.countDocuments({ status: 'unlocked' });
  const pendingMessages = await ScheduledMessage.countDocuments({ status: 'pending' });
  const deliveredMessages = await ScheduledMessage.countDocuments({ status: 'delivered' });
  const failedMessages = await ScheduledMessage.countDocuments({ status: 'failed' });
  const flaggedMessages = await ScheduledMessage.countDocuments({ isFlagged: true, reviewStatus: 'pending_review' });
  const totalStorage = await MemoryVault.aggregate([
    { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
  ]);

  res.json({
    totalUsers,
    activeUsers,
    disabledUsers,
    totalCapsules,
    totalMessages,
    totalVaultItems,
    totalContacts,
    lockedCapsules,
    unlockedCapsules,
    pendingMessages,
    deliveredMessages,
    failedMessages,
    flaggedMessages,
    storageUsage: totalStorage[0]?.totalSize || 0
  });
};

exports.getPlatformSettings = async (req, res) => {
  let settings = await PlatformSetting.findOne().lean();
  if (!settings) {
    settings = await PlatformSetting.create({});
  }
  res.json(settings);
};

exports.updatePlatformSettings = async (req, res) => {
  const {
    platformName,
    defaultTheme,
    maxMessagesPerDay,
    spamDetectionEnabled,
    maintenanceMode,
    autoDeleteFailedMessages
  } = req.body;

  const settings = await PlatformSetting.findOneAndUpdate(
    {},
    {
      platformName,
      defaultTheme,
      maxMessagesPerDay,
      spamDetectionEnabled,
      maintenanceMode,
      autoDeleteFailedMessages,
      updatedAt: new Date()
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  res.json(settings);
};

exports.getActivity = async (req, res) => {
  const [users, capsules, messages, vaultItems] = await Promise.all([
    User.find().sort({ createdAt: -1 }).limit(4).select('name email createdAt').lean(),
    TimeCapsule.find().sort({ createdAt: -1 }).limit(4).select('userId unlockDate status createdAt').populate('userId', 'name email').lean(),
    ScheduledMessage.find().sort({ createdAt: -1 }).limit(4).select('recipientEmail status createdAt userId').populate('userId', 'name email').lean(),
    MemoryVault.find().sort({ createdAt: -1 }).limit(4).select('fileType fileSize createdAt userId').populate('userId', 'name email').lean()
  ]);

  const activity = [
    ...users.map((item) => ({
      type: 'User Registered',
      user: item.name,
      email: item.email,
      createdAt: item.createdAt
    })),
    ...capsules.map((item) => ({
      type: 'Capsule Created',
      user: item.user?.name || 'Unknown',
      createdAt: item.createdAt
    })),
    ...messages.map((item) => ({
      type: 'Message Scheduled',
      user: item.user?.name || 'Unknown',
      email: item.recipientEmail,
      createdAt: item.createdAt
    })),
    ...vaultItems.map((item) => ({
      type: 'File Uploaded',
      user: item.user?.name || 'Unknown',
      fileType: item.fileType,
      createdAt: item.createdAt
    }))
  ];

  activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(activity.slice(0, 6));
};

exports.getAnalytics = async (req, res) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [userGrowth, capsuleGrowth, messageGrowth, vaultGrowth, spamAttempts, deliveryTotals, stats] = await Promise.all([
    buildMonthlyAggregation(User, 'createdAt', startDate),
    buildMonthlyAggregation(TimeCapsule, 'createdAt', startDate),
    buildMonthlyAggregation(ScheduledMessage, 'createdAt', startDate),
    buildMonthlyAggregation(MemoryVault, 'createdAt', startDate),
    ScheduledMessage.countDocuments({ isFlagged: true }),
    ScheduledMessage.aggregate([
      {
        $group: {
          _id: null,
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          total: { $sum: 1 }
        }
      }
    ]),
    User.countDocuments()
  ]);

  const deliverySuccessRate = deliveryTotals[0]?.total ? Math.round((deliveryTotals[0].delivered / deliveryTotals[0].total) * 100) : 0;

  res.json({
    userGrowth,
    capsuleGrowth,
    messageGrowth,
    vaultGrowth,
    spamAttempts,
    deliverySuccessRate,
    summary: {
      totalUsers: stats,
      totalCapsules: await TimeCapsule.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      disabledUsers: await User.countDocuments({ isActive: false }),
      pendingMessages: await ScheduledMessage.countDocuments({ status: 'pending' }),
      deliveredMessages: await ScheduledMessage.countDocuments({ status: 'delivered' }),
      failedMessages: await ScheduledMessage.countDocuments({ status: 'failed' }),
      flaggedMessages: await ScheduledMessage.countDocuments({ isFlagged: true, reviewStatus: 'pending_review' })
    }
  });
};
