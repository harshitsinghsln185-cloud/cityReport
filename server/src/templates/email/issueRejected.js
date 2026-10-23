import baseEmailTemplate from './baseTemplate.js';

export const issueRejectedTemplate = ({
  name,
  issueCode,
  issueTitle,
  reason,
  refundAmountFormatted,
}) => {
  const content = `
    <h2>Civic Issue Report Update: ${issueCode}</h2>
    <p>Dear ${name},</p>
    <p>We are writing to inform you that your civic report <strong>"${issueTitle}"</strong> could not be approved for field resolution by municipal operations.</p>
    
    <div style="background-color: #FEE2E2; border-left: 4px solid #DC2626; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #991B1B;">
        <strong>Reason for Rejection:</strong><br>
        ${reason}
      </p>
    </div>

    ${
      refundAmountFormatted
        ? `
      <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #312E81;">
          <strong>Advance Refund Processed:</strong><br>
          Your advance deposit of <strong>₹${refundAmountFormatted}</strong> has been refunded to your original payment method.
        </p>
      </div>
    `
        : ''
    }

    <p>If you believe this determination was made in error or have additional details to submit, please feel free to report a new issue with updated photos and location landmarks.</p>
  `;

  return baseEmailTemplate({
    title: `Issue Report Update: ${issueCode} - Crowd Report`,
    content,
  });
};

export default issueRejectedTemplate;
