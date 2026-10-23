import baseEmailTemplate from './baseTemplate.js';

export const resolverAcceptedTemplate = ({
  citizenName,
  issueCode,
  issueTitle,
  resolverName,
  resolverPhone,
  issueUrl,
}) => {
  const content = `
    <h2>Task Accepted by Contractor: ${issueCode}</h2>
    <p>Hello ${citizenName},</p>
    <p>Good news! A certified contractor has officially accepted your reported civic issue and will begin on-site inspection and repairs.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Assigned Contractor:</strong> ${resolverName}<br>
        <strong>Contractor Contact:</strong> ${resolverPhone || 'Available via platform'}
      </p>
    </div>

    <p>You can track the progress of your repair, communicate with the contractor, and view updates directly from your citizen portal.</p>
  `;

  return baseEmailTemplate({
    title: `Task Accepted: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'View Issue Progress',
      url: issueUrl,
    },
  });
};

export default resolverAcceptedTemplate;
