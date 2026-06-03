# GhostMode

GhostMode is a digital legacy platform built with a full MERN stack. It enables users to store memories, schedule future messages, create time capsules, upload media, configure emergency contacts, and manage legacy content.

## Setup

### Backend
1. Navigate to `backend`
2. Copy `.env.example` to `.env`
3. Fill in MongoDB Atlas, Cloudinary, and email credentials
4. Install dependencies:
   ```bash
   npm install
   ```
5. Seed admin user (optional):
   ```bash
   npm run seed-admin
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

### Frontend
1. Navigate to `frontend`
2. Copy `.env.example` to `.env`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm start
   ```

## Features

- JWT authentication
- Password reset flow
- Time capsules with unlock scheduling
- Scheduled message delivery using cron
- Memory vault uploads via Cloudinary
- Emergency contacts management
- Admin dashboard with user management and platform metrics
- Responsive Tailwind CSS UI

## Notes

- Ensure the backend is running before using the frontend.
- Use a valid email provider and Cloudinary account for file uploads and email delivery.
