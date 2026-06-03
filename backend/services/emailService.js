require('dotenv').config();
const nodemailer = require('nodemailer');

const gmailUser = process.env.GOOGLE_USER || process.env.EMAIL_USER;
const fromName = process.env.EMAIL_FROM_NAME || 'GhostMode';
const fromEmail = process.env.EMAIL_FROM_EMAIL || gmailUser;
const fromAddress = fromEmail ? `${fromName} <${fromEmail}>` : fromName;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: gmailUser,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

if (gmailUser && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
  transporter.verify((error) => {
    if (error) {
      console.error('Error connecting to email server:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });
} else {
  console.warn('Email server not configured: missing Gmail OAuth environment variables');
}

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to || !subject) {
    throw new Error('Email recipient and subject are required');
  }

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html,
  });

  console.log('Message sent: %s', info.messageId);
  return info;
};

const sendWelcomeEmail = async (user) => {
  const name = user?.name || 'there';
  const email = user?.email;

  return sendEmail({
    to: email,
    subject: 'Welcome to GhostMode',
    text: `Hi ${name},\n\nWelcome to GhostMode! Your account is ready.`,
    html: `<p>Hi ${name},</p><p>Welcome to GhostMode! Your account is ready.</p>`,
  });
};

const sendResetPasswordEmail = async ({ email, token }) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: 'Reset your GhostMode password',
    text: `Use this link to reset your password: ${resetUrl}`,
    html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });
};

const sendScheduledMessage = async ({ recipientEmail, subject, message }) => {
  return sendEmail({
    to: recipientEmail,
    subject,
    text: message,
    html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
  });
};

const sendCapsuleUnlockNotification = async ({ email, title }) => {
  return sendEmail({
    to: email,
    subject: 'Your GhostMode time capsule is unlocked',
    text: `Your time capsule "${title}" is now unlocked and ready to view.`,
    html: `<p>Your time capsule <strong>${title}</strong> is now unlocked and ready to view.</p>`,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendScheduledMessage,
  sendCapsuleUnlockNotification,
};