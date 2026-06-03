const cron = require('node-cron');
const { sendPending } = require('../controllers/messageController');

exports.schedulePendingMessages = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await sendPending();
      console.log('GhostMode scheduler checked pending messages');
    } catch (error) {
      console.error('GhostMode cron error', error.message);
    }
  });
};
