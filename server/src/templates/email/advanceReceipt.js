import baseEmailTemplate from './baseTemplate.js';

export const advanceReceiptTemplate = ({
  name,
  issueCode,
  issueTitle,
  invoiceNumber,
  amountPaidFormatted,
  balanceDueFormatted,
  trackingUrl,
}) => {
  const content = `
    <h2>Advance Payment Confirmed!</h2>
    <p>Dear ${name},</p>
    <p>Thank you for submitting your civic issue report. We have received your 50% advance service payment. Your issue has now been officially transitioned to <strong>Submitted</strong> status and dispatched to our municipal operations team for resolver assignment.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Invoice Number:</strong> ${invoiceNumber}<br>
        <strong>Advance Paid:</strong> ₹${amountPaidFormatted}<br>
        <strong>Balance Due Upon Completion:</strong> ₹${balanceDueFormatted}
      </p>
    </div>

    <p>Your official advance invoice PDF is attached to this email for your financial records. You can also track live progress and view certified contractor updates anytime from your Citizen Portal.</p>
  `;

  return baseEmailTemplate({
    title: `Payment Receipt: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'Track Your Issue',
      url: trackingUrl,
    },
  });
};

export default advanceReceiptTemplate;
