const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../services/tokenService');
const { sendWelcomeEmail, sendResetPasswordEmail } = require('../services/emailService');
const validator = require('validator');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    // Basic presence checks
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Email validation
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Password strength validation BEFORE any DB write
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
      return res.status(400).json({ message: 'Password should be strong' });
    }

    // Check existing user BEFORE creating
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // All validations passed — now hash and create user
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hashed });

    // Send welcome email asynchronously (do not block response or fail registration on email errors)
    sendWelcomeEmail(user).catch((emailError) => {
      console.error('Welcome email failed:', emailError && emailError.message ? emailError.message : emailError);
    });

    const token = generateToken({ id: user._id });
    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken({ id: user._id });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: 'If the account exists, a reset email was sent' });
  }
  const resetToken = generateToken({ id: user._id }, '1h');
  try {
    await sendResetPasswordEmail({ email: user.email, token: resetToken });
  } catch (emailError) {
    console.error('Password reset email failed:', emailError.message || emailError);
  }
  res.json({ message: 'Password reset email sent' });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }
  if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
    return res.status(400).json({ message: 'Password must be stronger' });
  }
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Expired or invalid token' });
  }
};

exports.profile = async (req, res) => {
  const user = req.user;
  const { name, avatar } = req.body;
  if (name) user.name = name;
  if (avatar) user.avatar = avatar;
  await user.save();
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isActive: user.isActive } });
};
