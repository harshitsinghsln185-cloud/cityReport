import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { User } from '../src/models/User.js';
import { generateAuthTokens } from '../src/services/tokenService.js';

describe('M13 Security Hardening: Automated RBAC Permission Matrix Across Roles', () => {
  let server;
  let baseUrl;
  let csrfToken;
  let xsrfCookie;

  let guestHeaders;
  let citizenHeaders;
  let resolverHeaders;
  let adminHeaders;

  let citizenUser;
  let resolverUser;
  let adminUser;

  beforeAll(async () => {
    await connectDB(env.MONGODB_URI);
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://localhost:${port}/api`;

    // Fetch initial CSRF token
    const csrfRes = await fetch(`${baseUrl}/auth/csrf-token`);
    const csrfJson = await csrfRes.json();
    csrfToken = csrfJson.data.csrfToken;
    const cookies = csrfRes.headers.getSetCookie ? csrfRes.headers.getSetCookie() : [csrfRes.headers.get('set-cookie')];
    xsrfCookie = cookies[0]?.split(';')[0] || `XSRF-TOKEN=${csrfToken}`;

    // Create test accounts in MongoDB
    citizenUser = await User.create({
      name: 'RBAC Citizen',
      email: `rbac.citizen.${Date.now()}@example.com`,
      phone: '9876543201',
      password: 'Password@123',
      role: 'User',
      address: { street: '1 Main', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      isEmailVerified: true,
    });

    resolverUser = await User.create({
      name: 'RBAC Resolver',
      email: `rbac.resolver.${Date.now()}@example.com`,
      phone: '9876543202',
      password: 'Password@123',
      role: 'Resolver',
      address: { street: '2 Main', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      isEmailVerified: true,
    });

    adminUser = await User.create({
      name: 'RBAC Admin',
      email: `rbac.admin.${Date.now()}@example.com`,
      phone: '9876543203',
      password: 'Password@123',
      role: 'Admin',
      address: { street: '3 Main', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      isEmailVerified: true,
    });

    // Generate tokens
    const citizenTokens = generateAuthTokens(citizenUser);
    const resolverTokens = generateAuthTokens(resolverUser);
    const adminTokens = generateAuthTokens(adminUser);

    guestHeaders = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      Cookie: xsrfCookie,
    };

    citizenHeaders = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      Cookie: `${xsrfCookie}; accessToken=${citizenTokens.accessToken}`,
    };

    resolverHeaders = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      Cookie: `${xsrfCookie}; accessToken=${resolverTokens.accessToken}`,
    };

    adminHeaders = {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      Cookie: `${xsrfCookie}; accessToken=${adminTokens.accessToken}`,
    };
  });

  afterAll(async () => {
    if (citizenUser) await User.deleteOne({ _id: citizenUser._id });
    if (resolverUser) await User.deleteOne({ _id: resolverUser._id });
    if (adminUser) await User.deleteOne({ _id: adminUser._id });

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();
  });

  describe('1. Unauthenticated Guest Access Boundaries', () => {
    it('Permits public diagnostic and informational endpoints', async () => {
      const publicEndpoints = [
        '/health',
        '/auth/csrf-token',
        '/categories',
      ];

      for (const endpoint of publicEndpoints) {
        const res = await fetch(`${baseUrl}${endpoint}`);
        expect([200, 304]).toContain(res.status);
      }
    });

    it('Rejects unauthenticated guest attempts against protected endpoints with HTTP 401', async () => {
      const protectedEndpoints = [
        '/users/me',
        '/issues',
        '/resolver/tasks',
        '/admin/issues',
        '/admin/resolvers',
        '/admin/users',
        '/admin/finance/overview',
        '/admin/queries',
      ];

      for (const endpoint of protectedEndpoints) {
        const res = await fetch(`${baseUrl}${endpoint}`, { headers: guestHeaders });
        expect(res.status).toBe(401);
      }
    });
  });

  describe('2. Citizen Role (User) Boundaries', () => {
    it('Allows citizen access to citizen endpoints', async () => {
      const res = await fetch(`${baseUrl}/users/me`, { headers: citizenHeaders });
      expect([200, 304]).toContain(res.status);
    });

    it('Blocks citizen access to administrative operations with HTTP 403 Forbidden', async () => {
      const adminEndpoints = [
        '/admin/issues',
        '/admin/resolvers',
        '/admin/users',
        '/admin/finance/overview',
        '/admin/finance/payments',
        '/admin/finance/payouts',
        '/admin/queries',
        '/admin/categories',
        '/admin/fee-settings',
      ];

      for (const endpoint of adminEndpoints) {
        const res = await fetch(`${baseUrl}${endpoint}`, { headers: citizenHeaders });
        expect(res.status).toBe(403);
      }
    });

    it('Blocks citizen access to resolver contractor task endpoints with HTTP 403 Forbidden', async () => {
      const resolverEndpoints = [
        '/resolver/tasks',
        '/resolver/earnings',
      ];

      for (const endpoint of resolverEndpoints) {
        const res = await fetch(`${baseUrl}${endpoint}`, { headers: citizenHeaders });
        expect(res.status).toBe(403);
      }
    });
  });

  describe('3. Resolver Contractor Role Boundaries', () => {
    it('Blocks resolver access to administrative endpoints with HTTP 403 Forbidden', async () => {
      const adminEndpoints = [
        '/admin/issues',
        '/admin/resolvers',
        '/admin/users',
        '/admin/finance/overview',
        '/admin/queries',
        '/admin/fee-settings',
      ];

      for (const endpoint of adminEndpoints) {
        const res = await fetch(`${baseUrl}${endpoint}`, { headers: resolverHeaders });
        expect(res.status).toBe(403);
      }
    });
  });

  describe('4. Administrator Role Boundaries', () => {
    it('Permits full access to all administrative endpoints for Admin role', async () => {
      const adminEndpoints = [
        '/admin/issues',
        '/admin/resolvers',
        '/admin/users',
        '/admin/finance/overview',
        '/admin/queries',
        '/admin/categories',
        '/admin/fee-settings',
      ];

      for (const endpoint of adminEndpoints) {
        const res = await fetch(`${baseUrl}${endpoint}`, { headers: adminHeaders });
        expect([200, 304]).toContain(res.status);
      }
    });
  });
});
