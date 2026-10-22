import http from 'http';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { env } from './src/config/env.js';
import { User } from './src/models/User.js';

const parseCookies = (setCookieHeaders) => {
  if (!setCookieHeaders) return {};
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  const cookies = {};
  for (const h of headers) {
    const parts = h.split(';');
    const [name, val] = parts[0].split('=');
    cookies[name.trim()] = val ? val.trim() : '';
  }
  return cookies;
};

const formatCookieHeader = (cookies) => {
  return Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
};

const runAcceptanceTests = async () => {
  console.log('--- Starting M3 Acceptance Criteria Verification ---');
  await connectDB(env.MONGODB_URI);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  let passedCount = 0;
  const assert = (condition, name) => {
    if (!condition) {
      console.error(`❌ FAILED: ${name}`);
      throw new Error(`Assertion failed: ${name}`);
    }
    console.log(`✅ PASSED: ${name}`);
    passedCount++;
  };

  try {
    // 1. Fetch CSRF token
    const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
    const csrfData = await csrfRes.json();
    const csrfCookies = parseCookies(
      csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : csrfRes.headers.get('set-cookie')
    );
    const csrfToken = csrfData.data.csrfToken;

    // 2. Setup and authenticate Citizen user
    const testEmail = `citizen_m3_${Date.now()}@example.com`;
    const user = await User.create({
      name: 'Priya Sharma',
      email: testEmail,
      phone: '9876543222',
      password: 'Password@123',
      role: 'User',
      isEmailVerified: true,
      address: {
        street: '42 Sector 14',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
      },
    });

    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(csrfCookies),
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@123',
      }),
    });
    const loginCookies = parseCookies(
      loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [loginRes.headers.get('set-cookie')]
    );
    const authCookies = { ...csrfCookies, ...loginCookies };
    assert(loginRes.status === 200, 'User successfully authenticated with session cookies');

    // 3. Acceptance Criterion 1: Upload a valid JPEG photo
    // Construct valid JPEG buffer (FF D8 FF E0 ...)
    const validJpegBytes = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
      0xff, 0xd9,
    ]);

    const formData1 = new FormData();
    formData1.append('photo', new Blob([validJpegBytes], { type: 'image/jpeg' }), 'avatar.jpg');

    const uploadRes1 = await fetch(`${baseUrl}/users/me/photo`, {
      method: 'PUT',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(authCookies),
      },
      body: formData1,
    });
    const uploadData1 = await uploadRes1.json();
    const userAfterUpload1 = await User.findById(user._id);

    assert(
      uploadRes1.status === 200 &&
        uploadData1.success === true &&
        uploadData1.data?.photo?.publicId.includes(`profiles/${user._id}`) &&
        userAfterUpload1.photo?.url !== null,
      '1. Uploading a valid JPEG stores photo in folder crowd-report/<env>/profiles/<userId>'
    );

    const firstPublicId = userAfterUpload1.photo.publicId;

    // 4. Acceptance Criterion 2: Replacing existing photo updates asset and triggers cleanup
    const validPngBytes = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
      0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
      0x42, 0x60, 0x82,
    ]);

    const formData2 = new FormData();
    formData2.append('photo', new Blob([validPngBytes], { type: 'image/png' }), 'avatar2.png');

    const uploadRes2 = await fetch(`${baseUrl}/users/me/photo`, {
      method: 'PUT',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(authCookies),
      },
      body: formData2,
    });
    const uploadData2 = await uploadRes2.json();
    const userAfterUpload2 = await User.findById(user._id);

    assert(
      uploadRes2.status === 200 &&
        uploadData2.success === true &&
        userAfterUpload2.photo.publicId !== firstPublicId,
      '2. Replacing an existing profile photo updates photo and deletes prior asset'
    );

    // 5. Acceptance Criterion 3: Disguised text / executable file fails with 400 Bad Request
    const disguisedBytes = Buffer.from('echo "Malicious script disguised as image" > script.sh');
    const formData3 = new FormData();
    formData3.append('photo', new Blob([disguisedBytes], { type: 'image/jpeg' }), 'fake.jpg');

    const uploadRes3 = await fetch(`${baseUrl}/users/me/photo`, {
      method: 'PUT',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(authCookies),
      },
      body: formData3,
    });
    const uploadData3 = await uploadRes3.json();

    assert(
      uploadRes3.status === 400 &&
        uploadData3.message.includes('Binary signature did not match'),
      '3. Attempting to upload an invalid/corrupted file disguised as .jpg fails with 400 Bad Request'
    );

    // 6. Acceptance Criterion 4: Image > 5MB is rejected by Multer with 400 Bad Request
    const oversizedBytes = Buffer.alloc(5.5 * 1024 * 1024); // 5.5 MB
    oversizedBytes[0] = 0xff;
    oversizedBytes[1] = 0xd8;
    oversizedBytes[2] = 0xff;
    oversizedBytes[3] = 0xe0;

    const formData4 = new FormData();
    formData4.append('photo', new Blob([oversizedBytes], { type: 'image/jpeg' }), 'huge.jpg');

    const uploadRes4 = await fetch(`${baseUrl}/users/me/photo`, {
      method: 'PUT',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(authCookies),
      },
      body: formData4,
    });
    const uploadData4 = await uploadRes4.json();

    assert(
      uploadRes4.status === 400 &&
        uploadData4.message.includes('5MB'),
      '4. Attempting to upload an image > 5MB is rejected by Multer with 400 Bad Request'
    );

    // 7. Acceptance Criterion 5: Profile text updates persist and getProfile returns photo
    const updateRes = await fetch(`${baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(authCookies),
      },
      body: JSON.stringify({
        name: 'Priya Sharma Updated',
        phone: '9876543223',
        address: {
          street: '100 Cyber City',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122002',
        },
      }),
    });
    const updateData = await updateRes.json();

    const getMeRes = await fetch(`${baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        Cookie: formatCookieHeader(authCookies),
      },
    });
    const getMeData = await getMeRes.json();

    assert(
      updateRes.status === 200 &&
        updateData.data.name === 'Priya Sharma Updated' &&
        getMeRes.status === 200 &&
        getMeData.data.name === 'Priya Sharma Updated' &&
        getMeData.data.address.pincode === '122002' &&
        Boolean(getMeData.data.photo?.url),
      '5. User profile updates persist successfully and return current photo metadata'
    );

    // 8. Delete photo verification
    const deleteRes = await fetch(`${baseUrl}/users/me/photo`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': csrfToken,
        Cookie: formatCookieHeader(authCookies),
      },
    });
    const deleteData = await deleteRes.json();
    const userAfterDelete = await User.findById(user._id);

    assert(
      deleteRes.status === 200 &&
        deleteData.success === true &&
        userAfterDelete.photo === null,
      '6. DELETE /api/users/me/photo removes photo asset and sets user.photo to null'
    );

    // Cleanup
    await User.deleteOne({ _id: user._id });

    console.log(`\n🎉 ALL ${passedCount} ACCEPTANCE TESTS PASSED SUCCESSFULLY!`);
  } finally {
    server.close();
    await disconnectDB();
  }
};

runAcceptanceTests().catch((err) => {
  console.error('\n❌ M3 Acceptance test run encountered error:\n', err);
  process.exit(1);
});
