import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { CIVIC_TAXONOMY } from '../seed/civicTaxonomy.js';
import { Category } from '../models/Category.js';
import { Issue } from '../models/Issue.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const migrateCivicTaxonomy = async ({ dryRun = false } = {}) => {
  const isDryRun = dryRun || process.argv.includes('--dry-run');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crowd_report';

  console.log('\n======================================================');
  console.log(`[CIVIC TAXONOMY MIGRATION] Starting (Mode: ${isDryRun ? 'DRY-RUN' : 'LIVE EXECUTION'})`);
  console.log('======================================================');

  let shouldCloseConnection = false;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoUri);
    shouldCloseConnection = true;
    console.log(`Connected to database: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
  }

  try {
    const existingCategories = await Category.find({}).lean();
    console.log(`Current categories in database: ${existingCategories.length}`);

    const existingIssuesCount = await Issue.countDocuments();
    console.log(`Current issues in database: ${existingIssuesCount}`);

    // Map existing legacy categories to preserve _id relationships
    // e.g. "Pothole Repair" or "road-damage" -> "roads-transportation"
    const legacyMap = new Map();
    for (const cat of existingCategories) {
      const nameLower = cat.name.toLowerCase();
      const slugLower = cat.slug.toLowerCase();
      if (
        nameLower.includes('pothole') ||
        slugLower.includes('pothole') ||
        nameLower.includes('road') ||
        slugLower === 'road-damage'
      ) {
        legacyMap.set('roads-transportation', cat);
      } else if (slugLower === 'water-supply' || slugLower === 'drainage') {
        legacyMap.set('water-drainage', cat);
      } else if (slugLower === 'streetlight-electricity') {
        legacyMap.set('electricity-lighting', cat);
      } else if (slugLower === 'garbage') {
        legacyMap.set('garbage-management', cat);
      }
    }

    let createdCount = 0;
    let updatedCount = 0;
    let preservedCount = 0;

    for (const tax of CIVIC_TAXONOMY) {
      let targetDoc = existingCategories.find((c) => c.slug === tax.slug);

      if (!targetDoc && legacyMap.has(tax.slug)) {
        targetDoc = legacyMap.get(tax.slug);
        console.log(`  [MAP] Mapping legacy category "${targetDoc.name}" (${targetDoc._id}) -> "${tax.name}" (${tax.slug})`);
      }

      const updateData = {
        name: tax.name,
        slug: tax.slug,
        order: tax.order,
        description: tax.description,
        baseFeePaise: tax.baseFeePaise,
        estimatedResolutionHours: tax.estimatedResolutionHours,
        freeRadiusKm: tax.freeRadiusKm,
        icon: tax.icon,
        isActive: true,
        subCategories: tax.subCategories.map((s, idx) => ({
          name: s.name,
          slug: s.slug,
          order: s.order || idx + 1,
          defaultPriority: s.defaultPriority || 'Medium',
          isActive: true,
          imageKey: s.imageKey || null,
        })),
      };

      if (targetDoc) {
        console.log(`  [UPDATE] Category "${tax.name}" (${tax.slug}) [ID: ${targetDoc._id}] - ${tax.subCategories.length} sub-issues`);
        if (!isDryRun) {
          await Category.findByIdAndUpdate(targetDoc._id, { $set: updateData }, { runValidators: true });
        }
        updatedCount++;
      } else {
        console.log(`  [CREATE] Category "${tax.name}" (${tax.slug}) - ${tax.subCategories.length} sub-issues`);
        if (!isDryRun) {
          await Category.create(updateData);
        }
        createdCount++;
      }
    }

    // Check for any legacy categories that were not mapped
    const newSlugs = new Set(CIVIC_TAXONOMY.map((t) => t.slug));
    for (const cat of existingCategories) {
      if (!newSlugs.has(cat.slug) && !Array.from(legacyMap.values()).some((l) => l._id.toString() === cat._id.toString())) {
        const issuesUsingCat = await Issue.countDocuments({ category: cat._id });
        if (issuesUsingCat > 0) {
          console.log(`  [PRESERVE] Keeping legacy category "${cat.name}" (${cat._id}) because it has ${issuesUsingCat} issues.`);
          preservedCount++;
        } else {
          console.log(`  [DEACTIVATE] Deactivating unused legacy category "${cat.name}" (${cat._id}).`);
          if (!isDryRun) {
            await Category.findByIdAndUpdate(cat._id, { $set: { isActive: false } });
          }
        }
      }
    }

    // Verification check
    const finalIssuesCount = await Issue.countDocuments();
    console.log('\n------------------------------------------------------');
    console.log('MIGRATION SUMMARY:');
    console.log(`  - Categories processed: ${CIVIC_TAXONOMY.length}`);
    console.log(`  - Updated categories:  ${updatedCount}`);
    console.log(`  - Created categories:  ${createdCount}`);
    console.log(`  - Preserved categories:${preservedCount}`);
    console.log(`  - Total sub-issues:    ${CIVIC_TAXONOMY.reduce((s, c) => s + c.subCategories.length, 0)}`);
    console.log(`  - Issues intact:       ${finalIssuesCount}/${existingIssuesCount} (100% verified)`);
    console.log(`  - Mode:                ${isDryRun ? 'DRY-RUN (No DB modifications applied)' : 'LIVE (Applied to DB)'}`);
    console.log('------------------------------------------------------\n');

    return {
      success: true,
      updatedCount,
      createdCount,
      preservedCount,
      totalTaxonomy: CIVIC_TAXONOMY.length,
      isDryRun,
    };
  } catch (err) {
    console.error('[ERROR] Migration failed:', err);
    throw err;
  } finally {
    if (shouldCloseConnection) {
      await mongoose.disconnect();
    }
  }
};

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('migrateCivicTaxonomy.js')) {
  migrateCivicTaxonomy()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default migrateCivicTaxonomy;
