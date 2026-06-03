const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const capsuleRoutes = require('./routes/capsuleRoutes');
const messageRoutes = require('./routes/messageRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { schedulePendingMessages } = require('./cron/scheduler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GhostMode API is running' });
});

app.use(errorHandler);

schedulePendingMessages();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GhostMode backend running on port ${PORT}`);
});
