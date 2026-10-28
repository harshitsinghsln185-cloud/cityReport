const fs = require('fs');
const path = require('path');

const unusedFiles = [
  'client/src/components/ProtectedRoute.tsx',
  'client/src/components/public/FaqSection.tsx',
  'client/src/components/public/Hero.tsx',
  'client/src/components/public/HowItWorks.tsx',
  'client/src/components/ui/ErrorBoundary.tsx',
  'client/src/pages/admin/Issues.tsx',
  'client/src/pages/auth/VerifyEmail.tsx',
  'client/src/pages/public/Home.tsx',
  'client/src/pages/public/TrackStatus.tsx',
  'client/src/pages/resolver/Assignments.tsx',
  'client/src/pages/resolver/CompletedHistory.tsx',
  'client/src/pages/resolver/PendingApproval.tsx',
  'client/src/pages/resolver/Tasks.tsx',
  'client/src/pages/user/MyIssues.tsx',
  'client/src/router/AppRouter.tsx',
];

unusedFiles.forEach(fileRel => {
  const filePath = path.resolve(fileRel);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // If file does NOT use <Link anymore, remove Link from react-router-dom import
  if (!/<Link\b/.test(content)) {
    // Check if Link is the only import from react-router-dom
    content = content.replace(/import\s*{\s*Link\s*}\s*from\s*['"]react-router-dom['"];?\r?\n?/, '');
    // Or if it's in a list: import { ..., Link, ... }
    content = content.replace(/(\bimport\s*{[^}]*?)\bLink,\s*([^}]*?}\s*from\s*['"]react-router-dom['"])/, '$1$2');
    content = content.replace(/(\bimport\s*{[^}]*?),\s*\bLink([^}]*?}\s*from\s*['"]react-router-dom['"])/, '$1$2');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned Link import from ${fileRel}`);
  }
});
