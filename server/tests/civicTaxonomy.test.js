import { describe, it, expect, vi } from 'vitest';
import { CIVIC_TAXONOMY } from '../src/seed/civicTaxonomy.js';
import { Category } from '../src/models/Category.js';
import { Issue } from '../src/models/Issue.js';
import { createIssueSchema, estimateQuoteSchema } from '../src/validators/issue.validator.js';
import { createCategorySchema } from '../src/validators/category.validator.js';
import * as categoryController from '../src/controllers/category.controller.js';

describe('V1 Civic Taxonomy: Data Model, Validation, and Seed Integrity', () => {
  describe('Taxonomy Source of Truth (civicTaxonomy.js)', () => {
    it('contains exactly 16 main categories', () => {
      expect(CIVIC_TAXONOMY).toHaveLength(16);
    });

    it('contains exactly 208 total sub-issues across all 16 categories', () => {
      const totalSubCategories = CIVIC_TAXONOMY.reduce(
        (sum, cat) => sum + (cat.subCategories ? cat.subCategories.length : 0),
        0
      );
      expect(totalSubCategories).toBe(208);
    });

    it('each category has valid properties and unique sub-issue slugs', () => {
      const categorySlugs = new Set();
      const validPriorities = new Set(['Critical', 'High', 'Medium', 'Low']);

      for (const cat of CIVIC_TAXONOMY) {
        expect(cat.name).toBeTruthy();
        expect(cat.slug).toMatch(/^[a-z0-9-]+$/);
        expect(categorySlugs.has(cat.slug)).toBe(false);
        categorySlugs.add(cat.slug);

        expect(typeof cat.order).toBe('number');
        expect(cat.description).toBeTruthy();
        expect(Array.isArray(cat.subCategories)).toBe(true);

        const subSlugs = new Set();
        for (const sub of cat.subCategories) {
          expect(sub.name).toBeTruthy();
          expect(sub.slug).toMatch(/^[a-z0-9-]+$/);
          expect(subSlugs.has(sub.slug)).toBe(false);
          subSlugs.add(sub.slug);

          expect(typeof sub.order).toBe('number');
          expect(validPriorities.has(sub.defaultPriority)).toBe(true);
        }
      }
    });
  });

  describe('Category Mongoose Model & Sub-Category Uniqueness', () => {
    it('validates a correct Category with subCategories in memory', async () => {
      const validCategory = new Category({
        name: 'Roads & Transportation',
        slug: 'roads-transportation',
        description: 'Road condition, safety, and transit infrastructure.',
        baseFeePaise: 50000,
        freeRadiusKm: 5,
        estimatedResolutionHours: 48,
        order: 1,
        isActive: true,
        subCategories: [
          { name: 'Road potholes', slug: 'road-potholes', order: 1, defaultPriority: 'High', isActive: true },
          { name: 'Illegal speed breakers', slug: 'illegal-speed-breakers', order: 2, defaultPriority: 'Medium', isActive: true },
        ],
      });

      await expect(validCategory.validate()).resolves.toBeUndefined();
    });

    it('rejects duplicate sub-category slugs within the same category', async () => {
      const dupCategory = new Category({
        name: 'Duplicate Test',
        slug: 'duplicate-test',
        description: 'Testing duplicate slug rejection.',
        baseFeePaise: 50000,
        subCategories: [
          { name: 'Duplicate 1', slug: 'dup-slug', order: 1, defaultPriority: 'High', isActive: true },
          { name: 'Duplicate 2', slug: 'dup-slug', order: 2, defaultPriority: 'Medium', isActive: true },
        ],
      });

      await expect(dupCategory.validate()).rejects.toThrow(/Duplicate subcategory slug/i);
    });
  });

  describe('Issue Model Sub-Category Fields', () => {
    it('allows storing subCategory and subCategoryName on an issue', () => {
      const issue = new Issue({
        title: 'Huge pothole on Ring Road',
        description: 'Deep road depression near junction causing accidents.',
        category: '6ae8275c8abb62650d31bfe2',
        subCategory: 'road-potholes',
        subCategoryName: 'Road potholes',
        location: {
          address: 'Ring Road, Delhi',
          coordinates: [77.209, 28.6139],
        },
        reportedBy: '6ae8275c8abb62650d31bfe1',
      });

      expect(issue.subCategory).toBe('road-potholes');
      expect(issue.subCategoryName).toBe('Road potholes');
    });
  });

  describe('Zod Validation for Issue & Category', () => {
    it('accepts category slug and subCategory in createIssueSchema', () => {
      const validPayload = {
        title: 'Deep crater on main avenue',
        description: 'Vehicle damage risk near flyover.',
        category: 'roads-transportation',
        subCategory: 'road-potholes',
        contactNumber: '9876543210',
        lat: 28.6139,
        lng: 77.209,
        address: {
          street: '123 Main St',
          city: 'Central City',
          pincode: '110001',
        },
      };

      const result = createIssueSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category).toBe('roads-transportation');
        expect(result.data.subCategory).toBe('road-potholes');
      }
    });

    it('accepts 24-character ObjectId and subCategory in estimateQuoteSchema', () => {
      const quotePayload = {
        category: '6ae8275c8abb62650d31bfe2',
        subCategory: 'open-manholes',
        lat: 28.61,
        lng: 77.2,
      };

      const result = estimateQuoteSchema.safeParse(quotePayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.subCategory).toBe('open-manholes');
      }
    });

    it('validates subCategories array in createCategorySchema', () => {
      const validCatPayload = {
        name: 'Garbage Management',
        slug: 'garbage-management',
        description: 'Municipal waste, collection, and recycling.',
        baseFeePaise: 40000,
        freeRadiusKm: 5,
        estimatedResolutionHours: 24,
        order: 2,
        subCategories: [
          { name: 'Uncollected garbage', slug: 'uncollected-garbage', order: 1, defaultPriority: 'High', isActive: true },
        ],
      };

      const result = createCategorySchema.safeParse(validCatPayload);
      expect(result.success).toBe(true);
    });
  });

  describe('Category Controller (getCategoryBySlug & getActiveCategories)', () => {
    it('returns active category and filters active subCategories', async () => {
      const mockCategory = {
        name: 'Water & Drainage',
        slug: 'water-drainage',
        isActive: true,
        subCategories: [
          { name: 'Waterlogging', slug: 'waterlogging', order: 1, isActive: true },
          { name: 'Inactive Issue', slug: 'inactive-issue', order: 2, isActive: false },
        ],
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockCategory),
      };
      vi.spyOn(Category, 'findOne').mockReturnValue(mockQuery);

      const req = { params: { slug: 'water-drainage' } };
      let responseBody = null;
      const res = {
        json: (data) => {
          responseBody = data;
          return res;
        },
      };
      const next = vi.fn();

      await categoryController.getCategoryBySlug(req, res, next);

      expect(responseBody).not.toBeNull();
      expect(responseBody.success).toBe(true);
      expect(responseBody.data.slug).toBe('water-drainage');
      expect(responseBody.data.subCategories).toHaveLength(1);
      expect(responseBody.data.subCategories[0].slug).toBe('waterlogging');

      Category.findOne.mockRestore();
    });

    it('calls next with 404 when category slug does not exist', async () => {
      const mockQueryNotFound = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(null),
      };
      vi.spyOn(Category, 'findOne').mockReturnValue(mockQueryNotFound);

      const req = { params: { slug: 'non-existent-category' } };
      const res = {};
      const next = vi.fn();

      await categoryController.getCategoryBySlug(req, res, next);

      expect(next).toHaveBeenCalled();
      const errorArg = next.mock.calls[0][0];
      expect(errorArg.statusCode).toBe(404);

      Category.findOne.mockRestore();
    });

    it('getActiveCategories returns categories sorted by order with filtered active subCategories', async () => {
      const mockCategories = [
        {
          _id: 'cat1',
          name: 'Roads & Transportation',
          slug: 'roads-transportation',
          order: 1,
          subCategories: [
            { name: 'Road potholes', slug: 'road-potholes', order: 1, isActive: true },
            { name: 'Inactive sub', slug: 'inactive-sub', order: 2, isActive: false },
          ],
        },
      ];

      const mockFindQuery = {
        select: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockCategories),
      };
      vi.spyOn(Category, 'find').mockReturnValue(mockFindQuery);

      const req = {};
      let responseBody = null;
      const res = {
        json: (data) => {
          responseBody = data;
          return res;
        },
      };
      const next = vi.fn();

      await categoryController.getActiveCategories(req, res, next);

      expect(responseBody.success).toBe(true);
      expect(responseBody.data).toHaveLength(1);
      expect(responseBody.data[0].subCategories).toHaveLength(1);
      expect(responseBody.data[0].subCategories[0].slug).toBe('road-potholes');

      Category.find.mockRestore();
    });
  });
});
