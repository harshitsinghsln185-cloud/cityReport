export const baseEmailTemplate = ({ title, preheader = '', content, actionButton = null }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8F7FC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      background-color: #F8F7FC;
      padding: 30px 15px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .header {
      background-color: #171A3B;
      padding: 28px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #FFFFFF;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 4px 0 0 0;
      color: #EDE9FE;
      font-size: 13px;
    }
    .body {
      padding: 32px 28px;
    }
    .body h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #1E293B;
      font-weight: 600;
    }
    .btn-container {
      margin: 28px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #7C3AED;
      color: #FFFFFF !important;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .footer {
      background-color: #F8F7FC;
      border-top: 1px solid #E2E8F0;
      padding: 20px 24px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Crowd Report Platform</h1>
        <p>Neighborhood Civic Issue Resolution</p>
      </div>
      <div class="body">
        ${content}
        ${
          actionButton
            ? `
          <div class="btn-container">
            <a href="${actionButton.url}" class="btn" target="_blank">${actionButton.text}</a>
          </div>
          <p style="font-size: 12px; color: #64748B; word-break: break-all;">
            If the button doesn't work, copy and paste this link in your browser:<br>
            <a href="${actionButton.url}" style="color: #7C3AED;">${actionButton.url}</a>
          </p>
        `
            : ''
        }
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Crowd Report Platform. All rights reserved.</p>
        <p>This is an automated system email. Please do not reply directly to this message.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export default baseEmailTemplate;
