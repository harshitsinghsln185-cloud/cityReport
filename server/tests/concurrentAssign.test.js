import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { Issue } from '../src/models/Issue.js';
import { IssueTimeline } from '../src/models/IssueTimeline.js';
import { ResolverProfile } from '../src/models/ResolverProfile.js';
import { User } from '../src/models/User.js';
import { Category } from '../src/models/Category.js';
import { assignResolver } from '../src/services/assignmentService.js';

describe('M13 Concurrency Hardening: Dual-Admin Simultaneous Task Assignment', () => {
  let testCategory;
  let adminA;
  let adminB;
  let resolverA;
  let resolverB;
  let testIssue;

  beforeAll(async () => {
    await connectDB(env.MONGODB_URI);

    // Setup Category
    testCategory = await Category.findOne({ slug: 'road-damage' });
    if (!testCategory) {
      testCategory = await Category.create({
        name: 'Road damage',
        slug: 'road-damage',
        description: 'Potholes, cracks, and structural road remediation',
        baseFeePaise: 60000,
        isActive: true,
        icon: 'Wrench',
      });
    }

    // Setup Admins
    adminA = await User.create({
      name: 'Admin Alpha',
      email: `admin.alpha.${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'Password@123',
      address: { street: 'Main Road', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      role: 'Admin',
      isEmailVerified: true,
    });

    adminB = await User.create({
      name: 'Admin Beta',
      email: `admin.beta.${Date.now()}@example.com`,
      phone: '9876543211',
      password: 'Password@123',
      address: { street: 'North Block', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      role: 'Admin',
      isEmailVerified: true,
    });

    // Setup Resolvers
    const userResA = await User.create({
      name: 'Resolver Contractor 1',
      email: `contractor1.${Date.now()}@example.com`,
      phone: '9876543212',
      password: 'Password@123',
      address: { street: 'Sector 5', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      role: 'Resolver',
      isEmailVerified: true,
    });

    resolverA = await ResolverProfile.create({
      user: userResA._id,
      status: 'Approved',
      approvalStatus: 'Approved',
      skills: [testCategory._id],
      serviceAddress: 'Connaught Place, New Delhi',
      serviceLocation: { type: 'Point', coordinates: [77.2167, 28.6328] },
      serviceRadiusKm: 20,
      isAvailable: true,
      idProof: { url: 'https://example.com/idA.pdf', publicId: 'proof_a', format: 'pdf', bytes: 1024 },
    });

    const userResB = await User.create({
      name: 'Resolver Contractor 2',
      email: `contractor2.${Date.now()}@example.com`,
      phone: '9876543213',
      password: 'Password@123',
      address: { street: 'Sector 8', city: 'Delhi', state: 'Delhi', pincode: '110001' },
      role: 'Resolver',
      isEmailVerified: true,
    });

    resolverB = await ResolverProfile.create({
      user: userResB._id,
      status: 'Approved',
      approvalStatus: 'Approved',
      skills: [testCategory._id],
      serviceAddress: 'Karol Bagh, New Delhi',
      serviceLocation: { type: 'Point', coordinates: [77.1906, 28.6517] },
      serviceRadiusKm: 20,
      isAvailable: true,
      idProof: { url: 'https://example.com/idB.pdf', publicId: 'proof_b', format: 'pdf', bytes: 1024 },
    });
  });

  afterAll(async () => {
    // Cleanup
    if (adminA) await User.deleteOne({ _id: adminA._id });
    if (adminB) await User.deleteOne({ _id: adminB._id });
    if (resolverA) {
      await ResolverProfile.deleteOne({ _id: resolverA._id });
      await User.deleteOne({ _id: resolverA.user });
    }
    if (resolverB) {
      await ResolverProfile.deleteOne({ _id: resolverB._id });
      await User.deleteOne({ _id: resolverB.user });
    }
    if (testIssue) {
      await Issue.deleteOne({ _id: testIssue._id });
      await IssueTimeline.deleteMany({ issue: testIssue._id });
    }
    await disconnectDB();
  });

  beforeEach(async () => {
    // Reset test issue in 'Submitted' status
    if (testIssue) {
      await Issue.deleteOne({ _id: testIssue._id });
      await IssueTimeline.deleteMany({ issue: testIssue._id });
    }

    testIssue = await Issue.create({
      issueCode: `CR-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      reporter: adminA._id,
      category: testCategory._id,
      title: 'Pothole on Main Boulevard',
      description: 'Dangerous pothole needing rapid repair',
      status: 'Submitted',
      location: { type: 'Point', coordinates: [77.209, 28.6139] },
      address: { street: 'Main Blvd', city: 'New Delhi', pincode: '110001' },
      contactNumber: '9876543210',
      fee: {
        categoryBaseFeePaise: 60000,
        severityMultiplier: 1.6,
        distanceKm: 4.0,
        freeKm: 3,
        perKmRatePaise: 1500,
        distanceFeePaise: 1500,
        totalPaise: 98000,
        advancePaise: 49000,
        balancePaise: 49000,
        commissionPercent: 10,
        isManualQuote: false,
      },
    });
  });

  it('Dual-admin simultaneous assignment collision: exactly one succeeds, one gets 409 Conflict', async () => {
    // Simulate simultaneous assignment calls by Admin A (to Resolver A) and Admin B (to Resolver B)
    const [resultA, resultB] = await Promise.allSettled([
      assignResolver(testIssue._id, resolverA._id, adminA._id),
      assignResolver(testIssue._id, resolverB._id, adminB._id),
    ]);

    const successes = [resultA, resultB].filter((r) => r.status === 'fulfilled');
    const failures = [resultA, resultB].filter((r) => r.status === 'rejected');

    // Exactly one winner, exactly one conflict error
    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    const error = failures[0].reason;
    expect(error.statusCode).toBe(409);
    expect(error.message).toContain('Conflict: This issue is currently in status');

    // Verify final MongoDB state
    const updatedIssue = await Issue.findById(testIssue._id);
    expect(updatedIssue.status).toBe('Assigned');

    // Winner's resolver is stored
    const winningResult = successes[0].value;
    expect(updatedIssue.assignedResolver.toString()).toBe(winningResult.assignedResolver.toString());

    // Timeline has exactly one ASSIGNED record
    const timelineEvents = await IssueTimeline.find({
      issue: testIssue._id,
      action: 'ASSIGNED',
    });
    expect(timelineEvents).toHaveLength(1);
  });
});
