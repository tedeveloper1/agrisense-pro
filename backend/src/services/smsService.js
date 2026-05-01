/**
 * SMS Service (mock-ready).
 * Replace `sendSMS` with a real provider (e.g. Africa's Talking, Twilio).
 * Reads SMS_API_KEY / SMS_API_URL from env when wired up.
 */

async function sendSMS({ to, message }) {
  if (!to || !message) throw new Error('sendSMS requires `to` and `message`');
  // In dev: just log. In prod: call provider.
  console.log(`[sms] -> ${to}: ${message}`);
  return { success: true, to, providerId: `mock_${Date.now()}` };
}

async function sendBulkSMS(recipients, message) {
  return Promise.all(recipients.map((to) => sendSMS({ to, message })));
}

module.exports = { sendSMS, sendBulkSMS };
