import baseEmailTemplate from './baseTemplate.js';

export const resolverRejectedTemplate = ({ name, reason, appealsUrl }) => {
  const content = `
    <h2>Application Status Update, ${name}</h2>
    <p>Thank you for your interest in joining the Crowd Report Resolver Network. After reviewing your credentials and ID proof, our operations team was unable to approve your application at this time.</p>
    <div style="background-color: #FEE2E2; border-left: 4px solid #DC2626; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #991B1B;">Reason for Decision:</p>
      <p style="margin: 0; font-size: 14px; color: #7F1D1D;">${reason}</p>
    </div>
    <p>You may view your application details, review the administrator's feedback, and re-submit your verification documents through your contractor portal.</p>
  `;

  return baseEmailTemplate({
    title: 'Resolver Application Status Update - Crowd Report',
    content,
    actionButton: {
      text: 'View Feedback & Application',
      url: appealsUrl,
    },
  });
};

export default resolverRejectedTemplate;
