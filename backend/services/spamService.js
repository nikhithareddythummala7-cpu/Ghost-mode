const ScheduledMessage = require('../models/ScheduledMessage');

const SPAM_KEYWORDS = [
  'free money',
  'buy now',
  'click here',
  'limited offer',
  'earn cash',
  'act now',
  'subscribe now',
  'winner',
  'prize',
  'urgent response',
  'risk free'
];

const safeString = (value) => (typeof value === 'string' ? value.trim() : '');

const countLinks = (text) => {
  const matches = (text || '').match(/https?:\/\/[^\s]+/gi);
  return matches ? matches.length : 0;
};

const uppercaseRatio = (text) => {
  const input = safeString(text);
  if (!input.length) return 0;
  const letters = input.match(/[A-Za-z]/g) || [];
  if (!letters.length) return 0;
  const upper = letters.filter((ch) => ch === ch.toUpperCase()).length;
  return upper / letters.length;
};

const countKeywordMatches = (text) => {
  const value = safeString(text).toLowerCase();
  return SPAM_KEYWORDS.reduce((count, keyword) => (value.includes(keyword) ? count + 1 : count), 0);
};

const normalizeRecipients = (recipientEmail) => {
  if (!recipientEmail) return [];
  return recipientEmail
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length);
};

const buildFlagReason = (reasons) => [...new Set(reasons)].join('; ');

exports.assessMessageForSpam = async ({ userId, recipientEmail, subject, message }) => {
  const recipients = normalizeRecipients(recipientEmail);
  const body = `${safeString(subject)} ${safeString(message)}`.trim();
  let score = 0;
  const reasons = [];

  const linkCount = countLinks(body);
  if (linkCount >= 2) {
    score += 25;
    reasons.push('Multiple links detected');
  } else if (linkCount === 1) {
    score += 10;
    reasons.push('Link detected');
  }

  const keywordMatches = countKeywordMatches(body);
  if (keywordMatches > 0) {
    score += Math.min(40, keywordMatches * 15);
    reasons.push('Common spam keywords');
  }

  const upperRatio = uppercaseRatio(body);
  if (upperRatio >= 0.65 && body.length > 30) {
    score += 20;
    reasons.push('Excessive uppercase text');
  }

  const identicalCount = await ScheduledMessage.countDocuments({
    userId,
    subject: safeString(subject),
    message: safeString(message),
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });

  if (identicalCount > 0) {
    score += 30;
    reasons.push('Repeated identical message');
  }

  if (recipients.length > 3) {
    score += 10;
    reasons.push('Many recipients');
  }

  const isFlagged = score >= 15;
  const spamScore = Math.min(100, Math.round(score));
  const flagReason = isFlagged ? buildFlagReason(reasons) : '';
  const reviewStatus = isFlagged ? 'pending' : 'approved';

  return { isFlagged, spamScore, flagReason, reviewStatus, recipients };
};
