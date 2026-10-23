import baseEmailTemplate from './baseTemplate.js';

export const issueResolvedTemplate = ({
  recipientName,
  issueCode,
  issueTitle,
  resolverName,
  remarks,
  viewUrl,
  isCitizen = true,
}) => {
  const content = `
    <h2>Repair Work Completed: ${issueCode}</h2>
    <p>Hello ${recipientName},</p>
    <p>${
      isCitizen
        ? 'Great news! Your reported civic issue has been resolved by our certified contractor and photographic completion proof has been uploaded.'
        : `Contractor ${resolverName} has marked civic issue ${issueCode} as Resolved and submitted photographic proof.`
    }</p>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 14px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #065F46;">
        <strong>Issue Code:</strong> ${issueCode}<br>
        <strong>Title:</strong> ${issueTitle}<br>
        <strong>Contractor:</strong> ${resolverName}<br>
        <strong>Completion Remarks:</strong> "${remarks}"
      </p>
    </div>

    <p>${
      isCitizen
        ? 'Please inspect the before and after repair evidence in your portal to confirm satisfaction and settle any remaining balance fee.'
        : 'Please review the resolution proof in the operations command center.'
    }</p>
  `;

  return baseEmailTemplate({
    title: `Repairs Completed: ${issueCode} - Crowd Report`,
    content,
    actionButton: {
      text: isCitizen ? 'Inspect Repair & Settle Balance' : 'Review Resolution Proof',
      url: viewUrl,
    },
  });
};

export default issueResolvedTemplate;
