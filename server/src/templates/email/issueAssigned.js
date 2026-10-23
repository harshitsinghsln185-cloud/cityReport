import baseEmailTemplate from './baseTemplate.js';

export const issueAssignedTemplate = ({
  resolverName,
  issueCode,
  issueTitle,
  categoryName,
  address,
  priority,
  taskUrl,
}) => {
  const content = `
    <h2>New Task Assigned: ${issueCode}</h2>
    <p>Hello ${resolverName},</p>
    <p>A new civic issue in your coverage territory has been assigned to you by operations administration.</p>
    
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Category:</strong> ${categoryName}<br>
        <strong>Priority:</strong> ${priority}<br>
        <strong>Location:</strong> ${address}
      </p>
    </div>

    <p>Please review the assignment in your Resolver Console and accept the task to begin work on-site.</p>
  `;

  return baseEmailTemplate({
    title: `Task Assignment: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: 'View Task in Console',
      url: taskUrl,
    },
  });
};

export default issueAssignedTemplate;
