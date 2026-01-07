const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || '<no-reply@sportall.io>';

let resendClient = null;
let resendErrorLogged = false;

function getResendClient() {
  if (!RESEND_API_KEY) {
    if (!resendErrorLogged) {
      console.warn('RESEND_API_KEY is not configured. Email verification will not work.');
      resendErrorLogged = true;
    }
    return null;
  }

  if (resendClient) return resendClient;

  try {
    // Lazy require to avoid blocking startup if the SDK does heavy setup.
    const { Resend } = require('resend');
    resendClient = new Resend(RESEND_API_KEY);
    return resendClient;
  } catch (err) {
    if (!resendErrorLogged) {
      console.error('Failed to initialize Resend client', err);
      resendErrorLogged = true;
    }
    return null;
  }
}

async function sendEmail({ to, subject, html }) {
  const resend = getResendClient();
  if (!resend) {
    if (!resendErrorLogged) {
      console.warn('Resend client not initialized, skipping email send');
      resendErrorLogged = true;
    }
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

async function sendVerificationCode(to, code) {
  await sendEmail({
    to,
    subject: 'Your Portal verification code',
    html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  })
}

module.exports = {
  sendEmail,
  sendVerificationCode,
};
