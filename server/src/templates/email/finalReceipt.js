import baseEmailTemplate from './baseTemplate.js';

export const finalReceiptTemplate = ({
  citizenName,
  issueCode,
  issueTitle,
  invoiceNumber,
  totalAmountFormatted,
  issueUrl,
}) => {
  const content = `
    <h2>Issue Formally Closed: ${issueCode}</h2>
    <p>Hello ${citizenName},</p>
    <p>Thank you! Your balance payment has been confirmed, and your reported civic issue has been officially marked as <strong>Closed</strong>.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Final Invoice Number:</strong> ${invoiceNumber}<br>
        <strong>Total Settlement:</strong> ₹${totalAmountFormatted}<br>
        <strong>Remaining Balance:</strong> ₹0.00
      </p>
    </div>

    <p>Your official Final Settlement Invoice has been generated and is archived in your citizen payment history. Please take a moment to rate the repair work and provide your feedback.</p>
  `;

  return baseEmailTemplate({
    title: `Final Settlement & Invoice: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'View Closed Issue & Feedback',
      url: issueUrl,
    },
  });
};

export default finalReceiptTemplate;
