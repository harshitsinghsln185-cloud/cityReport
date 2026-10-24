import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter = null;
let simulateFailure = false;
let failureReason = 'Simulated SMTP connection failure';

export const setSimulateFailure = (shouldFail, reason = 'Simulated SMTP connection failure') => {
  simulateFailure = shouldFail;
  failureReason = reason;
};

export const getSimulateFailure = () => simulateFailure;

export const resetTransporter = () => {
  transporter = null;
};

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    // In dev / test with no credentials, create a lightweight transporter that logs
    transporter = {
      sendMail: async (mailOptions) => {
        logger.info(`[DEV EMAIL SIMULATION] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
        return { messageId: `mock-${Date.now()}` };
      },
    };
  }

  return transporter;
};

/**
 * Direct SMTP send operation that THROWS on error so queue can handle retry
 */
export const sendMailDirect = async ({ to, subject, html, attachments = [] }) => {
  if (simulateFailure) {
    throw new Error(failureReason);
  }

  const from = process.env.MAIL_FROM || '"Crowd Report Platform" <noreply@crowdreport.local>';
  const client = getTransporter();
  const result = await client.sendMail({
    from,
    to,
    subject,
    html,
    attachments,
  });
  logger.info(`Email sent successfully to ${to}: ${result.messageId}`);
  return { messageId: result.messageId };
};

/**
 * Standard sendMail wrapper for direct calls if needed
 */
export const sendMail = async ({ to, subject, html, attachments = [] }) => {
  try {
    return await sendMailDirect({ to, subject, html, attachments });
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`, { error: err });
    return { messageId: null, error: err.message };
  }
};

export default {
  sendMail,
  sendMailDirect,
  setSimulateFailure,
  getSimulateFailure,
  resetTransporter,
};
