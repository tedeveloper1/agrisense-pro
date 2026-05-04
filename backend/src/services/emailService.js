/**
 * Email service using nodemailer.
 * Configure SMTP_* env vars to send real emails. If unset, emails are logged
 * to the console (dev mode) so the app remains fully runnable without setup.
 */
const nodemailer = require('nodemailer');

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: String(SMTP_SECURE || 'false') === 'true',
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

const FROM = process.env.EMAIL_FROM || 'Rwanda Beyond <no-reply@rwandabeyond.rw>';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

function shell(title, bodyHtml) {
  return `
  <div style="background:#f3f6fb;padding:32px 12px;font-family:Inter,Arial,sans-serif;color:#0f172a">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#0a1024,#10b981);padding:24px;color:#fff">
        <div style="font-weight:700;font-size:18px;letter-spacing:.2px">🌱 Rwanda Beyond</div>
        <div style="opacity:.85;font-size:13px;margin-top:2px">Smart Farming Decision Support</div>
      </div>
      <div style="padding:28px 28px 20px">
        <h1 style="margin:0 0 12px;font-size:20px">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 28px 24px;border-top:1px solid #f1f5f9;color:#64748b;font-size:12px">
        © ${new Date().getFullYear()} Rwanda Beyond. Smart farming for Rwanda &amp; beyond.
      </div>
    </div>
  </div>`;
}

async function sendEmail({ to, subject, html, text }) {
  if (!to) return { skipped: true };
  const t = getTransporter();
  if (!t) {
    console.log(`[email:dev] -> ${to} | ${subject}`);
    return { success: true, dev: true };
  }
  const info = await t.sendMail({ from: FROM, to, subject, html, text });
  return { success: true, messageId: info.messageId };
}

async function sendVerificationEmail(user, token) {
  const link = `${APP_URL}/verify-email?token=${token}`;
  const html = shell(
    `Confirm your email, ${user.name?.split(' ')[0] || 'farmer'} 👋`,
    `<p style="color:#475569;line-height:1.55">Welcome to <b>Rwanda Beyond</b>. Please confirm your email address to activate your account and start receiving smart farming insights.</p>
     <p style="margin:28px 0">
       <a href="${link}" style="background:#10b981;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block">Verify my email</a>
     </p>
     <p style="color:#64748b;font-size:13px">Or copy this link:<br/><a href="${link}" style="color:#10b981;word-break:break-all">${link}</a></p>
     <p style="color:#94a3b8;font-size:12px;margin-top:24px">This link expires in 24 hours. If you did not sign up, you can safely ignore this email.</p>`
  );
  return sendEmail({
    to: user.email,
    subject: 'Confirm your Rwanda Beyond account',
    html,
    text: `Welcome to Rwanda Beyond. Verify your email: ${link}`,
  });
}

async function sendBroadcastEmail({ to, title, message, severity = 'info' }) {
  const tone = severity === 'critical' ? '#ef4444' : severity === 'warning' ? '#f59e0b' : '#10b981';
  const html = shell(
    title,
    `<div style="border-left:4px solid ${tone};padding:6px 14px;background:#f8fafc;border-radius:6px;color:#334155;line-height:1.55">${message}</div>
     <p style="color:#64748b;font-size:13px;margin-top:24px">Open your dashboard: <a href="${APP_URL}" style="color:#10b981">${APP_URL}</a></p>`
  );
  return sendEmail({ to, subject: title, html, text: message });
}

async function sendBulkEmail(recipients, payload) {
  const list = (recipients || []).filter(Boolean);
  const results = await Promise.allSettled(
    list.map((to) => sendBroadcastEmail({ ...payload, to }))
  );
  return {
    sent: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
  };
}

module.exports = { sendEmail, sendVerificationEmail, sendBroadcastEmail, sendBulkEmail };
