import { describe, it, expect } from 'vitest';
import { CIVIC_TAXONOMY } from '../src/seed/civicTaxonomy.js';

/**
 * Pure helper functions reproducing the logic in ReportIssue.tsx & Login.tsx
 */
export const resolveReportPrefill = ({
  categories,
  prefillCategory,
  prefillSub,
}) => {
  const sortedCategories = [...categories].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  let matchedCategory = null;
  let matchedSub = null;
  let priority = 'Medium';

  if (prefillCategory) {
    matchedCategory = sortedCategories.find(
      (c) =>
        c._id === prefillCategory ||
        c.slug === prefillCategory ||
        c.name.toLowerCase() === prefillCategory.toLowerCase()
    );

    if (matchedCategory) {
      const activeSubs = (matchedCategory.subCategories || [])
        .filter((s) => s.isActive !== false)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

      if (prefillSub) {
        matchedSub = activeSubs.find(
          (s) => s.slug === prefillSub || s.name.toLowerCase() === prefillSub.toLowerCase()
        );
        if (matchedSub && matchedSub.defaultPriority) {
          priority = matchedSub.defaultPriority;
        }
      }
    }
  }

  return {
    category: matchedCategory ? matchedCategory._id || matchedCategory.slug : '',
    subCategory: matchedSub ? matchedSub.slug : '',
    suggestedPriority: priority,
    isCritical: matchedSub?.defaultPriority === 'Critical',
  };
};

export const handleCategorySelectionChange = (currentSubCategory, newCategoryId) => {
  return {
    category: newCategoryId,
    subCategory: '', // Resets subCategory when category changes
  };
};

export const resolveLoginRedirect = (locationState) => {
  const fromState = locationState?.from;
  if (!fromState) return null;
  if (typeof fromState === 'string') return fromState;
  if (fromState.pathname) {
    return `${fromState.pathname}${fromState.search || ''}${fromState.hash || ''}`;
  }
  return null;
};

describe('V2 Report Form: Dependent Dropdowns, Query Params, & Login Redirect', () => {
  describe('Report Form Query Param Pre-filling', () => {
    it('pre-selects category and sub-category from slugs', () => {
      const result = resolveReportPrefill({
        categories: CIVIC_TAXONOMY,
        prefillCategory: 'roads-transportation',
        prefillSub: 'road-potholes',
      });

      expect(result.category).toBe('roads-transportation');
      expect(result.subCategory).toBe('road-potholes');
      expect(result.suggestedPriority).toBe('High');
      expect(result.isCritical).toBe(false);
    });

    it('identifies critical sub-issue and sets isCritical flag', () => {
      // Find a critical issue in Roads & Transportation: e.g., broken-manhole-covers
      const result = resolveReportPrefill({
        categories: CIVIC_TAXONOMY,
        prefillCategory: 'roads-transportation',
        prefillSub: 'broken-manhole-covers',
      });

      expect(result.category).toBe('roads-transportation');
      expect(result.subCategory).toBe('broken-manhole-covers');
      expect(result.suggestedPriority).toBe('Critical');
      expect(result.isCritical).toBe(true);
    });

    it('falls back gracefully when sub-slug is not found in category', () => {
      const result = resolveReportPrefill({
        categories: CIVIC_TAXONOMY,
        prefillCategory: 'roads-transportation',
        prefillSub: 'unknown-sub-issue',
      });

      expect(result.category).toBe('roads-transportation');
      expect(result.subCategory).toBe('');
      expect(result.suggestedPriority).toBe('Medium');
      expect(result.isCritical).toBe(false);
    });

    it('leaves form empty when no query params are present', () => {
      const result = resolveReportPrefill({
        categories: CIVIC_TAXONOMY,
        prefillCategory: null,
        prefillSub: null,
      });

      expect(result.category).toBe('');
      expect(result.subCategory).toBe('');
      expect(result.suggestedPriority).toBe('Medium');
      expect(result.isCritical).toBe(false);
    });

    it('supports backwards-compatible category ID lookup', () => {
      const mockCategories = [
        {
          _id: '6ae8275c8abb62650d31bfe2',
          slug: 'roads-transportation',
          name: 'Roads & Transportation',
          order: 1,
          subCategories: [
            { name: 'Road potholes', slug: 'road-potholes', order: 1, defaultPriority: 'High', isActive: true },
          ],
        },
      ];

      const result = resolveReportPrefill({
        categories: mockCategories,
        prefillCategory: '6ae8275c8abb62650d31bfe2',
        prefillSub: 'road-potholes',
      });

      expect(result.category).toBe('6ae8275c8abb62650d31bfe2');
      expect(result.subCategory).toBe('road-potholes');
      expect(result.suggestedPriority).toBe('High');
    });
  });

  describe('Dependent Dropdown Interaction Logic', () => {
    it('resets sub-category when main category changes', () => {
      const state = handleCategorySelectionChange('road-potholes', 'garbage-management');
      expect(state.category).toBe('garbage-management');
      expect(state.subCategory).toBe('');
    });
  });

  describe('Login Redirect Query String Preservation', () => {
    it('preserves query parameters from location object state', () => {
      const locationState = {
        from: {
          pathname: '/user/report-issue',
          search: '?category=roads-transportation&sub=road-potholes',
          hash: '',
        },
      };

      const redirectUrl = resolveLoginRedirect(locationState);
      expect(redirectUrl).toBe('/user/report-issue?category=roads-transportation&sub=road-potholes');
    });

    it('handles string from state', () => {
      const locationState = {
        from: '/user/report-issue?category=water-drainage&sub=waterlogging',
      };

      const redirectUrl = resolveLoginRedirect(locationState);
      expect(redirectUrl).toBe('/user/report-issue?category=water-drainage&sub=waterlogging');
    });

    it('returns null when from state is missing', () => {
      expect(resolveLoginRedirect({})).toBeNull();
      expect(resolveLoginRedirect(null)).toBeNull();
    });
  });
});
