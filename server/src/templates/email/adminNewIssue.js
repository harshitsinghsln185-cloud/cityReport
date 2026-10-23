import baseEmailTemplate from './baseTemplate.js';

export const adminNewIssueTemplate = ({
  adminName = 'Operations Team',
  issueCode,
  issueTitle,
  categoryName,
  priority,
  address,
  totalFeeFormatted,
  adminIssueUrl,
}) => {
  const content = `
    <h2>New Civic Issue Submitted</h2>
    <p>Hello ${adminName},</p>
    <p>A citizen has confirmed their advance payment and submitted a new civic repair request. The issue is awaiting operations triage and resolver candidate assignment.</p>
    
    <div style="background-color: #F8F7FC; border-left: 4px solid #171A3B; padding: 14px 16px; margin: 20px 0; border-radius: 4px; border: 1px solid #E2E8F0;">
      <p style="margin: 0; font-size: 14px; color: #1E293B;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Category:</strong> ${categoryName}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Priority:</strong> ${priority}<br>
        <strong>Location:</strong> ${address}<br>
        <strong>Total Quoted Fee:</strong> ₹${totalFeeFormatted} (Advance Paid)
      </p>
    </div>

    <p>Please review the issue details and assign a certified resolver from the candidate queue.</p>
  `;

  return baseEmailTemplate({
    title: `New Issue Submitted: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'View Issue in Admin Console',
      url: adminIssueUrl,
    },
  });
};

export default adminNewIssueTemplate;
