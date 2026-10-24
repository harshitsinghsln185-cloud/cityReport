import baseEmailTemplate from './baseTemplate.js';
import { env } from '../../config/env.js';

export const queryReplyTemplate = ({
  name,
  subject,
  originalMessage,
  replyText,
  repliedAt = new Date(),
  portalUrl = env.CLIENT_URL,
}) => {
  const formattedDate = new Date(repliedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const content = `
    <h2>Response to Your Civic Query</h2>
    <p>Dear ${name},</p>
    <p>Thank you for reaching out to Crowd Report Municipal Operations. Our administration team has reviewed your inquiry regarding <strong>"${subject}"</strong>.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; color: #312E81; font-size: 14px;">Administrator Response:</h4>
      <p style="margin: 0; font-size: 14px; color: #1E293B; line-height: 1.6; white-space: pre-wrap;">${replyText}</p>
      <p style="margin: 10px 0 0 0; font-size: 11px; color: #6D28D9;">Answered on ${formattedDate}</p>
    </div>

    <div style="background-color: #F8F7FC; border: 1px solid #E2E8F0; padding: 12px 14px; margin: 16px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 12px; color: #64748B;">
        <strong>Your Original Message:</strong><br>
        <em>"${originalMessage}"</em>
      </p>
    </div>

    <p style="font-size: 13px; color: #475569;">
      If you require immediate field remediation for a specific street hazard, road damage, or civic outage, you can also report it directly via our citizen portal.
    </p>
  `;

  return baseEmailTemplate({
    title: `Re: ${subject} - Crowd Report Support`,
    content,
    actionButton: {
      text: 'Visit Crowd Report Portal',
      url: portalUrl,
    },
  });
};

export default queryReplyTemplate;
