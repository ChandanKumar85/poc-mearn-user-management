// jobs/sessionCleaner.js
const cron = require('node-cron');
const User = require('../models/User');

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  try {
    const result = await User.updateMany(
      { sessionExpiresAt: { $lte: now }, activeId: { $ne: null } },
      { $set: { activeId: null, sessionExpiresAt: null } } // ✅ SAFE update
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Cleared ${result.modifiedCount} expired sessions at ${now}`);
    }
  } catch (err) {
    console.error('❌ Cron job error:', err);
  }
});
