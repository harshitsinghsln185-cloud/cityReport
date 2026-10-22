import baseEmailTemplate from './baseTemplate.js';

export const resolverApprovedTemplate = ({ name, dashboardUrl }) => {
  const content = `
    <h2>Congratulations ${name}, You Are Approved!</h2>
    <p>We are delighted to inform you that your certified resolver application and government ID proof have been approved by operations.</p>
    <div style="background-color: #DCFCE7; border-left: 4px solid #16A34A; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #166534;">
        <strong>Status: Approved & Active</strong><br>
        Your resolver account is fully operational. You will now receive task notifications for civic issues reported in your coverage zone.
      </p>
    </div>
    <p>Sign in to your resolver console to manage your availability, view assigned issues, and submit completion proofs for payout settlements.</p>
  `;

  return baseEmailTemplate({
    title: 'Resolver Account Approved - Crowd Report',
    content,
    actionButton: {
      text: 'Go to Resolver Console',
      url: dashboardUrl,
    },
  });
};

export default resolverApprovedTemplate;
