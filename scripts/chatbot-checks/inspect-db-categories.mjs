import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../server/src/config/db.js';
import { env } from '../../server/src/config/env.js';
import { Category } from '../../server/src/models/Category.js';

async function check() {
  await connectDB(env.MONGODB_URI);
  const categories = await Category.find({});
  console.log('Total categories in DB:', categories.length);
  categories.forEach(c => {
    console.log({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      isActive: c.isActive,
      baseFeePaise: c.baseFeePaise
    });
  });
  await disconnectDB();
}

check().catch(console.error);

