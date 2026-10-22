import baseEmailTemplate from './baseTemplate.js';

export const resolverRegisteredTemplate = ({ name, portalUrl }) => {
  const content = `
    <h2>Welcome to Crowd Report Resolver Network, ${name}!</h2>
    <p>Thank you for submitting your application to become a certified civic issue resolver in your community.</p>
    <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #312E81;">
        <strong>Application Status: Under Review</strong><br>
        Our operations team is currently verifying your government ID proof and skills qualifications.
      </p>
    </div>
    <p>Once approved by an administrator, your console will activate and you will be able to receive task offers within your selected service territory.</p>
  `;

  return baseEmailTemplate({
    title: 'Resolver Application Received - Crowd Report',
    content,
    actionButton: {
      text: 'View Application Status',
      url: portalUrl,
    },
  });
};

export default resolverRegisteredTemplate;
