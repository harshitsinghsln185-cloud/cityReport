import baseEmailTemplate from './baseTemplate.js';

export const payoutPaidTemplate = ({
  resolverName,
  issueCode,
  grossAmountFormatted,
  commissionFormatted,
  netAmountFormatted,
  payoutId,
  earningsUrl,
}) => {
  const content = `
    <h2>Payout Disbursed for Issue: ${issueCode}</h2>
    <p>Hello ${resolverName},</p>
    <p>Your contractor remediation payout has been processed and disbursed by municipal operations administration.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Disbursement Reference:</strong> ${payoutId}<br>
        <strong>Associated Issue:</strong> ${issueCode}<br>
        <strong>Gross Service Fee:</strong> ₹${grossAmountFormatted}<br>
        <strong>Platform Commission:</strong> -₹${commissionFormatted}<br>
        <strong>Net Disbursed to You:</strong> ₹${netAmountFormatted}
      </p>
    </div>

    <p>The funds have been transferred to your registered settlement account. You can review your cumulative earnings breakdown in the resolver console.</p>
  `;

  return baseEmailTemplate({
    title: `Payout Disbursed: ₹${netAmountFormatted} for ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'View Earnings Ledger',
      url: earningsUrl,
    },
  });
};

export default payoutPaidTemplate;
