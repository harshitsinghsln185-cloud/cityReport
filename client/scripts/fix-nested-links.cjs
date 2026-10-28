const fs = require('fs');
const path = require('path');

// Extract balanced attribute starting at idx
function extractAttr(str, attrName) {
  const pattern = new RegExp(`\\b${attrName}=`);
  const match = str.match(pattern);
  if (!match) return null;
  const startIdx = match.index + match[0].length;
  const quote = str[startIdx];
  if (quote === '"' || quote === "'") {
    const endIdx = str.indexOf(quote, startIdx + 1);
    if (endIdx === -1) return null;
    return {
      raw: str.slice(match.index, endIdx + 1),
      value: str.slice(startIdx + 1, endIdx),
      isExpr: false
    };
  } else if (quote === '{') {
    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
    if (endIdx === -1) return null;
    return {
      raw: str.slice(match.index, endIdx + 1),
      value: str.slice(startIdx + 1, endIdx),
      isExpr: true
    };
  }
  return null;
}

const targetFiles = [
  'client/src/components/ProtectedRoute.tsx',
  'client/src/components/public/FaqSection.tsx',
  'client/src/components/public/Hero.tsx',
  'client/src/components/public/HowItWorks.tsx',
  'client/src/components/public/Navbar.tsx',
  'client/src/components/ui/ErrorBoundary.tsx',
  'client/src/pages/admin/Dashboard.tsx',
  'client/src/pages/admin/IssueDetails.tsx',
  'client/src/pages/admin/Issues.tsx',
  'client/src/pages/auth/ForgotPassword.tsx',
  'client/src/pages/auth/RegisterUser.tsx',
  'client/src/pages/auth/ResetPassword.tsx',
  'client/src/pages/auth/VerifyEmail.tsx',
  'client/src/pages/public/About.tsx',
  'client/src/pages/public/Home.tsx',
  'client/src/pages/public/Services.tsx',
  'client/src/pages/public/StateDetail.tsx',
  'client/src/pages/public/StatesDirectory.tsx',
  'client/src/pages/public/TrackStatus.tsx',
  'client/src/pages/resolver/Assignments.tsx',
  'client/src/pages/resolver/CompletedHistory.tsx',
  'client/src/pages/resolver/Dashboard.tsx',
  'client/src/pages/resolver/PendingApproval.tsx',
  'client/src/pages/resolver/TaskDetails.tsx',
  'client/src/pages/resolver/Tasks.tsx',
  'client/src/pages/user/Checkout.tsx',
  'client/src/pages/user/IssueDetails.tsx',
  'client/src/pages/user/MyIssues.tsx',
  'client/src/pages/user/Payments.tsx',
  'client/src/pages/user/UserDashboard.tsx',
  'client/src/router/AppRouter.tsx',
];

// First update Button.tsx
const buttonTsxPath = path.resolve('client/src/components/ui/Button.tsx');
let buttonTsxContent = fs.readFileSync(buttonTsxPath, 'utf8');
if (!buttonTsxContent.includes("to?: LinkProps['to']")) {
  console.log('Button.tsx needs polymorphic props');
}

let totalReplacements = 0;

targetFiles.forEach(fileRel => {
  const filePath = path.resolve(fileRel);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let fileMatches = 0;

  // Find all <Link ...> where content immediately contains <Button ...>...</Button></Link>
  // Use regex to locate <Link ...>
  let replaced = '';
  let cursor = 0;

  while (true) {
    const linkStart = content.indexOf('<Link', cursor);
    if (linkStart === -1) {
      replaced += content.slice(cursor);
      break;
    }

    // Find closing > of <Link ...>
    // Be careful with quotes and expressions inside <Link ...>
    let linkTagEnd = -1;
    let depth = 0;
    let inQuote = null;
    for (let i = linkStart + 5; i < content.length; i++) {
      const char = content[i];
      if (inQuote) {
        if (char === inQuote && content[i - 1] !== '\\') inQuote = null;
      } else if (char === '"' || char === "'") {
        inQuote = char;
      } else if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
      } else if (char === '>' && depth === 0) {
        linkTagEnd = i;
        break;
      }
    }

    if (linkTagEnd === -1) {
      replaced += content.slice(cursor);
      break;
    }

    const linkTagHeader = content.slice(linkStart, linkTagEnd + 1);
    
    // Check if what follows is whitespace then <Button
    const afterLink = content.slice(linkTagEnd + 1);
    const buttonMatch = afterLink.match(/^\s*<Button\b/);
    if (!buttonMatch) {
      replaced += content.slice(cursor, linkTagEnd + 1);
      cursor = linkTagEnd + 1;
      continue;
    }

    // Now find closing </Button> and closing </Link>
    const buttonStartInAfter = buttonMatch[0].length - 7; // index of <Button
    const btnTagStart = linkTagEnd + 1 + buttonMatch[0].indexOf('<Button');

    // Find the end of <Button ...>
    let btnTagEnd = -1;
    depth = 0;
    inQuote = null;
    for (let i = btnTagStart + 7; i < content.length; i++) {
      const char = content[i];
      if (inQuote) {
        if (char === inQuote && content[i - 1] !== '\\') inQuote = null;
      } else if (char === '"' || char === "'") {
        inQuote = char;
      } else if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
      } else if (char === '>' && depth === 0) {
        btnTagEnd = i;
        break;
      }
    }

    if (btnTagEnd === -1) {
      replaced += content.slice(cursor, linkTagEnd + 1);
      cursor = linkTagEnd + 1;
      continue;
    }

    // Find </Button>\s*</Link>
    const afterBtnHeader = content.slice(btnTagEnd + 1);
    const endMatch = afterBtnHeader.match(/([\s\S]*?)<\/Button>\s*<\/Link>/);
    if (!endMatch) {
      replaced += content.slice(cursor, linkTagEnd + 1);
      cursor = linkTagEnd + 1;
      continue;
    }

    const buttonChildren = endMatch[1];
    const fullEndIdx = btnTagEnd + 1 + endMatch[0].length;

    // Extract attributes from <Link ...>
    const linkAttrsStr = linkTagHeader.slice(5, -1);
    const toAttr = extractAttr(linkAttrsStr, 'to');
    const onClickAttr = extractAttr(linkAttrsStr, 'onClick');
    const linkClassAttr = extractAttr(linkAttrsStr, 'className');

    // Extract attributes from <Button ...>
    const btnAttrsStr = content.slice(btnTagStart + 7, btnTagEnd);
    const btnClassAttr = extractAttr(btnAttrsStr, 'className');

    let finalBtnAttrs = btnAttrsStr;

    // Merge classNames
    if (linkClassAttr) {
      const linkClassVal = linkClassAttr.value.trim();
      if (btnClassAttr) {
        let merged = '';
        if (btnClassAttr.isExpr) {
          merged = `className={\`${linkClassVal} \${${btnClassAttr.value}}\`}`;
        } else {
          merged = `className="${(linkClassVal + ' ' + btnClassAttr.value).trim()}"`;
        }
        finalBtnAttrs = finalBtnAttrs.replace(btnClassAttr.raw, merged);
      } else {
        finalBtnAttrs = `${finalBtnAttrs.trim()} className="${linkClassVal}"`;
      }
    }

    // Prepare extra attrs from Link
    const extras = [];
    if (toAttr) extras.push(toAttr.raw);
    if (onClickAttr) extras.push(onClickAttr.raw);

    const newBtn = `<Button ${extras.join(' ')} ${finalBtnAttrs.trim()}>${buttonChildren}</Button>`;

    replaced += content.slice(cursor, linkStart) + newBtn;
    cursor = fullEndIdx;
    fileMatches++;
    totalReplacements++;
  }

  if (fileMatches > 0) {
    fs.writeFileSync(filePath, replaced, 'utf8');
    console.log(`Updated ${fileRel}: ${fileMatches} instances replaced.`);
  }
});

console.log(`\nTotal Link > Button replacements across codebase: ${totalReplacements}`);
