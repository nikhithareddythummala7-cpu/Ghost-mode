const ScheduledMessage = require('../models/ScheduledMessage');
const { sendScheduledMessage } = require('../services/emailService');
const { assessMessageForSpam } = require('../services/spamService');

exports.getMessages = async (req, res) => {
  const messages = await ScheduledMessage.find({ userId: req.user._id }).sort({ deliveryDate: 1 });
  res.json(messages);
};

exports.createMessage = async (req, res) => {
  const { recipientEmail, subject, message, deliveryDate, attachment } = req.body;
  if (!recipientEmail || !subject || !message || !deliveryDate) {
    return res.status(400).json({ message: 'All message fields are required' });
  }

  const spamAssessment = await assessMessageForSpam({
    userId: req.user._id,
    recipientEmail,
    subject,
    message
  });

  const scheduledMessage = await ScheduledMessage.create({
    recipientEmail,
    recipientCount: spamAssessment.recipients.length,
    subject,
    message,
    deliveryDate,
    status: spamAssessment.reviewStatus === 'blocked' ? 'blocked' : 'pending',
    reviewStatus: spamAssessment.reviewStatus,
    isFlagged: spamAssessment.isFlagged,
    spamScore: spamAssessment.spamScore,
    flagReason: spamAssessment.flagReason,
    attachment: attachment || '',
    userId: req.user._id
  });
  res.status(201).json({
    id: scheduledMessage._id,
    recipientEmail: scheduledMessage.recipientEmail,
    recipientCount: scheduledMessage.recipientCount,
    deliveryDate: scheduledMessage.deliveryDate,
    status: scheduledMessage.status,
    isFlagged: scheduledMessage.isFlagged,
    spamScore: scheduledMessage.spamScore,
    flagReason: scheduledMessage.flagReason,
    createdAt: scheduledMessage.createdAt
  });
};

exports.updateMessage = async (req, res) => {
  const scheduledMessage = await ScheduledMessage.findOne({ _id: req.params.id, userId: req.user._id });
  if (!scheduledMessage) {
    return res.status(404).json({ message: 'Scheduled message not found' });
  }
  const { recipientEmail, subject, message, deliveryDate, attachment } = req.body;
  if (recipientEmail) scheduledMessage.recipientEmail = recipientEmail;
  if (subject) scheduledMessage.subject = subject;
  if (message) scheduledMessage.message = message;
  if (deliveryDate) scheduledMessage.deliveryDate = deliveryDate;
  if (attachment !== undefined) scheduledMessage.attachment = attachment;
  await scheduledMessage.save();
  res.json(scheduledMessage);
};

exports.deleteMessage = async (req, res) => {
  const scheduledMessage = await ScheduledMessage.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!scheduledMessage) {
    return res.status(404).json({ message: 'Scheduled message not found' });
  }
  res.json({ message: 'Scheduled message canceled' });
};

exports.sendPending = async () => {
  const messages = await ScheduledMessage.find({
    status: 'pending',
    reviewStatus: 'approved',
    deliveryDate: { $lte: new Date() }
  });

  for (const message of messages) {
    try {
      await sendScheduledMessage({ recipientEmail: message.recipientEmail, subject: message.subject, message: message.message });
      message.status = 'delivered';
    } catch (err) {
      console.error('Scheduled message failed:', err.message || err);
      message.status = 'failed';
    }

    try {
      await message.save();
    } catch (saveError) {
      console.error('Failed to persist scheduled message status:', saveError.message || saveError);
    }
  }
};
