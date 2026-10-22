import { baseEmailTemplate } from './baseTemplate.js';

export const resetPasswordTemplate = ({ name, resetUrl }) => {
  const content = `
    <h2>Password Reset Request</h2>
    <p>Hello ${name},</p>
    <p>
      We received a request to reset the password for your Crowd Report account. Click the button below to choose a new password.
    </p>
    <p>
      This password reset link is valid for <strong>1 hour</strong>. If you did not request this change, you can safely ignore this email; your password will remain unchanged.
    </p>
  `;

  return baseEmailTemplate({
    title: 'Reset Your Password - Crowd Report',
    content,
    actionButton: {
      text: 'Reset Password',
      url: resetUrl,
    },
  });
};

export default resetPasswordTemplate;
