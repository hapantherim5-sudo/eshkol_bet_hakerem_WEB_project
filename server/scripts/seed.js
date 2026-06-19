/**
 * Fills MongoDB with demo data from src/data (same as the React app).
 * Run: cd server && npm install && npm run seed
 */
import { connectDb, closeDb, COLLECTIONS } from '../src/database/db.js';
import { INITIAL_OPPORTUNITIES, INITIAL_EVENTS, FAKE_USERS } from '../../src/data/fakeData.js';
import { ORGANIZATIONS } from '../../src/data/organizations.js';

async function seed() {
  const db = await connectDb();

  const collections = Object.values(COLLECTIONS);
  for (const name of collections) {
    await db.collection(name).deleteMany({});
  }

  await db.collection(COLLECTIONS.organizations).insertMany(ORGANIZATIONS);
  await db.collection(COLLECTIONS.users).insertMany(FAKE_USERS);

  await db.collection(COLLECTIONS.opportunities).insertMany(INITIAL_OPPORTUNITIES);
  await db.collection(COLLECTIONS.events).insertMany(INITIAL_EVENTS);

  // Empty collections are created on first write; insertMany([]) is invalid in MongoDB

  const maxOpp = INITIAL_OPPORTUNITIES.reduce((m, o) => Math.max(m, o.id), 0);
  const maxEv = INITIAL_EVENTS.reduce((m, e) => Math.max(m, e.id), 0);

  await db.collection(COLLECTIONS.counters).insertOne({
    opportunities: maxOpp,
    events: maxEv,
    registrations: 0,
    cancellations: 0,
  });

  await db.collection(COLLECTIONS.opportunities).createIndex({ id: 1 }, { unique: true });
  await db.collection(COLLECTIONS.events).createIndex({ id: 1 }, { unique: true });
  await db.collection(COLLECTIONS.events).createIndex({ opportunityId: 1 });
  await db.collection(COLLECTIONS.registrations).createIndex(
    { userId: 1, opportunityId: 1 },
    { unique: true }
  );
  await db.collection(COLLECTIONS.users).createIndex({ username: 1 }, { unique: true });
  await db.collection(COLLECTIONS.profiles).createIndex({ userId: 1 }, { unique: true });

  console.log(`✓ Database "${process.env.MONGODB_DB || 'eshkol'}" seeded successfully.`);
  console.log(`  organizations: ${ORGANIZATIONS.length}`);
  console.log(`  users: ${FAKE_USERS.length}`);
  console.log(`  opportunities: ${INITIAL_OPPORTUNITIES.length}`);
  console.log(`  events: ${INITIAL_EVENTS.length}`);
  console.log('\nOpen MongoDB Compass → connect to the same URI → browse collections.');
}

seed()
  .catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
  })
  .finally(() => closeDb());
