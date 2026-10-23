import baseEmailTemplate from './baseTemplate.js';

export const balanceDueTemplate = ({
  citizenName,
  issueCode,
  issueTitle,
  balanceAmountFormatted,
  issueUrl,
}) => {
  const content = `
    <h2>Resolution Proof Verified: ${issueCode}</h2>
    <p>Hello ${citizenName},</p>
    <p>Municipal administration has verified the completed repair proof submitted by the contractor for your civic issue report.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Remaining Balance Due:</strong> ₹${balanceAmountFormatted}<br>
        <strong>Status:</strong> Ready for Final Settlement
      </p>
    </div>

    <p>Please inspect the before and after photographic proof in your citizen portal and complete the remaining balance payment to finalize and close your issue.</p>
  `;

  return baseEmailTemplate({
    title: `Balance Payment Due: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'Inspect Proof & Pay Balance',
      url: issueUrl,
    },
  });
};

export default balanceDueTemplate;
