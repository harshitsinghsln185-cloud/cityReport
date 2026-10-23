import baseEmailTemplate from './baseTemplate.js';

export const quoteReadyTemplate = ({
  name,
  issueCode,
  issueTitle,
  totalFeeFormatted,
  advanceFeeFormatted,
  checkoutUrl,
}) => {
  const content = `
    <h2>Fee Quote Ready for ${issueCode}</h2>
    <p>Dear ${name},</p>
    <p>Great news! Operations administration has reviewed your out-of-coverage civic repair request <strong>"${issueTitle}"</strong> and prepared a customized service quote.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Total Approved Service Fee:</strong> ₹${totalFeeFormatted}<br>
        <strong>Advance Payable to Dispatch:</strong> ₹${advanceFeeFormatted} (50%)<br>
        <strong>Remaining Balance:</strong> ₹${advanceFeeFormatted} (Due upon resolution)
      </p>
    </div>

    <p>To proceed with contractor dispatch and field repair, please confirm your 50% advance deposit via the secure checkout link below.</p>
  `;

  return baseEmailTemplate({
    title: `Fee Quote Ready: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'Proceed to Checkout',
      url: checkoutUrl,
    },
  });
};

export default quoteReadyTemplate;
