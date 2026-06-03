const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin123@gmail.com').trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
  const adminName = process.env.SEED_ADMIN_NAME || 'GhostMode Admin';

  const normalizedEmail = adminEmail.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    if (existing.role !== 'admin') {
      console.error('A non-admin user already exists with the seed admin email. Remove or change that user first.');
      process.exit(1);
    }

    existing.password = await bcrypt.hash(adminPassword, 12);
    existing.isActive = true;
    await existing.save();
    console.log('Admin user already exists. Password reset to default admin credentials.');
    process.exit(0);
  }

  const password = await bcrypt.hash(adminPassword, 12);
  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    password,
    role: 'admin',
    isActive: true
  });
  console.log('Seeded admin user:', admin.email);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error('Seeding error', error);
  process.exit(1);
});
