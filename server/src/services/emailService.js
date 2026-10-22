import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter = null;

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

export const sendMail = async ({ to, subject, html, attachments = [] }) => {
  const from = process.env.MAIL_FROM || '"Crowd Report Platform" <noreply@crowdreport.local>';

  try {
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
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`, { error: err });
    // Non-blocking for auth requests
    return { messageId: null, error: err.message };
  }
};

export default {
  sendMail,
};
