import { baseEmailTemplate } from './baseTemplate.js';

export const welcomeVerifyTemplate = ({ name, verifyUrl }) => {
  const content = `
    <h2>Welcome to Crowd Report, ${name}!</h2>
    <p>
      Thank you for registering on the Crowd Report Platform. To activate your account and start reporting civic issues in your neighborhood, please verify your email address.
    </p>
    <p>
      This verification link is valid for <strong>24 hours</strong>.
    </p>
  `;

  return baseEmailTemplate({
    title: 'Verify Your Email Address - Crowd Report',
    content,
    actionButton: {
      text: 'Verify Email Address',
      url: verifyUrl,
    },
  });
};

export default welcomeVerifyTemplate;
