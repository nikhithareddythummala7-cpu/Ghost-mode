const ScheduledMessage = require('../models/ScheduledMessage');

const MAX_MESSAGES_PER_DAY = 20;
const MAX_RECIPIENTS_PER_MESSAGE = 5;

module.exports = async (req, res, next) => {
  if (req.method !== 'POST' || !req.path.startsWith('/')) {
    return next();
  }

  try {
    const { recipientEmail } = req.body;
    if (!recipientEmail) {
      return res.status(400).json({ message: 'Recipient email is required' });
    }

    const recipients = recipientEmail
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    if (recipients.length > MAX_RECIPIENTS_PER_MESSAGE) {
      return res.status(400).json({ message: 'Max 5 recipients per message' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sentCount = await ScheduledMessage.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: today }
    });

    if (sentCount >= MAX_MESSAGES_PER_DAY) {
      return res.status(429).json({ message: 'Daily sending limit reached' });
    }

    req.recipientCount = recipients.length;
    next();
  } catch (error) {
    next(error);
  }
};
