import baseEmailTemplate from './baseTemplate.js';

export const adminNewResolverTemplate = ({ resolverName, email, phone, reviewUrl }) => {
  const content = `
    <h2>New Contractor Application Pending Verification</h2>
    <p>A new certified resolver has registered on the platform and submitted their government identification for administrative inspection.</p>
    <div style="background-color: #F8F7FC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 4px 0;"><strong>Name:</strong> ${resolverName}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #92400E; font-weight: 600;">Pending Review</span></p>
    </div>
    <p>Please log in to the Operations Command Center to review their ID proof via the authenticated secure viewer and approve or reject the request.</p>
  `;

  return baseEmailTemplate({
    title: 'Action Required: New Resolver Verification',
    content,
    actionButton: {
      text: 'Review Application in Admin Console',
      url: reviewUrl,
    },
  });
};

export default adminNewResolverTemplate;
