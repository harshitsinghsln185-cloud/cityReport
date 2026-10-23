import baseEmailTemplate from './baseTemplate.js';

export const assignmentRejectedTemplate = ({
  adminName = 'Operations Team',
  issueCode,
  issueTitle,
  resolverName,
  declineReason,
  triageUrl,
}) => {
  const content = `
    <h2>⚠️ Assignment Declined: ${issueCode}</h2>
    <p>Hello ${adminName},</p>
    <p>A contractor has declined a civic issue assignment. The issue has been automatically transitioned to <strong>ReassignNeeded</strong> and requires immediate re-triage.</p>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #991B1B;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Declined By:</strong> ${resolverName}<br>
        <strong>Reason for Decline:</strong> "${declineReason}"
      </p>
    </div>

    <p>Please open the operations console to assign an alternative qualified contractor or adjust the territory radius.</p>
  `;

  return baseEmailTemplate({
    title: `Action Required: Assignment Declined for ${issueCode}`,
    content,
    actionButton: {
      text: 'Reassign Issue Now',
      url: triageUrl,
    },
  });
};

export default assignmentRejectedTemplate;
