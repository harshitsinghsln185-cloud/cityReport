import http from 'http';
import app from '../../server/src/app.js';
import { connectDB, disconnectDB } from '../../server/src/config/db.js';
import { env } from '../../server/src/config/env.js';
import { Category } from '../../server/src/models/Category.js';
import { ChatSession } from '../../server/src/models/ChatSession.js';

async function run() {
  console.log('Connecting to MongoDB...');
  await connectDB(env.MONGODB_URI);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // 1. Check active categories in DB
    const allCategories = await Category.find({});
    const activeCategories = await Category.find({ isActive: true });
    console.log(`Database check: Total categories = ${allCategories.length}, Active categories = ${activeCategories.length}`);
    activeCategories.forEach((c) => console.log(` - [${c._id}] ${c.name} (slug: ${c.slug}, baseFee: ${c.baseFeePaise})`));

    // 2. Fetch CSRF token
    const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
    const csrfData = await csrfRes.json();
    const setCookie = csrfRes.headers.get('set-cookie');
    const csrfToken = csrfData.data.csrfToken;

    // 3. Create a fresh session
    const createRes = await fetch(`${baseUrl}/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: setCookie || '',
      },
    });
    const createData = await createRes.json();
    const sessionId = createData.data._id;
    console.log(`\nCreated session: ${sessionId}, initial state: ${createData.data.state}`);
    console.log('Initial quick replies:', createData.data.messages[0].quickReplies);

    // 4. Test clicking "View categories" exactly as the UI sends it
    // In QuickReplies: option text can be 'View Categories' or 'View categories'
    const testMessages = ['View Categories', 'View categories', 'view categories', 'categories'];

    for (const msg of testMessages) {
      console.log(`\n--- Testing message: "${msg}" ---`);
      const msgRes = await fetch(`${baseUrl}/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          Cookie: setCookie || '',
        },
        body: JSON.stringify({ message: msg }),
      });
      const msgData = await msgRes.json();
      console.log(`Status: ${msgRes.status}`);
      console.log('Response state:', msgData.data?.state);
      console.log('Response reply:\n' + msgData.data?.reply);
      console.log('Response quickReplies:', msgData.data?.quickReplies);
    }

    // 5. What if the user clicks "Report an Issue" FIRST, entering COLLECT state, and THEN clicks or types "View categories"?
    console.log('\n--- Testing "View categories" while in COLLECT state ---');
    const collectRes = await fetch(`${baseUrl}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: setCookie || '',
      },
      body: JSON.stringify({ message: 'Report an Issue' }),
    });
    const collectData = await collectRes.json();
    console.log('Current state after "Report an Issue":', collectData.data?.state);

    const msgInCollectRes = await fetch(`${baseUrl}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: setCookie || '',
      },
      body: JSON.stringify({ message: 'View categories' }),
    });
    const msgInCollectData = await msgInCollectRes.json();
    console.log('Response in COLLECT state:', msgInCollectData.data?.reply);
    console.log('Draft after "View categories" in COLLECT:', msgInCollectData.data?.draft);

  } finally {
    server.close();
    await disconnectDB();
  }
}

run().catch(console.error);

