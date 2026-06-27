// File: server/scripts/addEventDates.js
// Purpose: addEventDates script
// Role: module role description

/**
 * One-time migration: add eventDate, startTime, endTime to every opportunity
 * that does not already have these fields.
 *
 * Dates are assigned deterministically from the opportunity's numeric id so that
 * re-running the script produces identical results (idempotent).
 *
 * Run: cd server && node scripts/addEventDates.js
 */
import { connectDb, closeDb, COLLECTIONS } from '../src/db.js';

/* ── Time slots per category ── */
const TIMES = {
  sport:     [['17:00', '18:30'], ['09:00', '10:30'], ['15:30', '17:00'], ['18:30', '20:00']],
  art:       [['16:00', '17:30'], ['09:30', '11:00'], ['14:30', '16:00'], ['17:00', '18:30']],
  science:   [['15:00', '17:00'], ['09:00', '11:00'], ['16:00', '18:00'], ['17:30', '19:30']],
  workshops: [['09:00', '11:00'], ['15:00', '17:00'], ['17:00', '19:00'], ['10:00', '12:00']],
  community: [['15:00', '16:30'], ['17:00', '18:30'], ['09:00', '10:30'], ['16:30', '18:00']],
  volunteer: [['09:00', '12:00'], ['15:00', '17:00'], ['10:00', '12:00'], ['16:00', '18:00']],
};

// schedule — handles schedule
function schedule(opp) {
  const times = TIMES[opp.category] || TIMES.community;
  const [startTime, endTime] = times[(opp.id - 1) % times.length];

  // Anchor: the next Sunday after today
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const daysToNextSun = base.getDay() === 0 ? 7 : 7 - base.getDay();
  base.setDate(base.getDate() + daysToNextSun);

  // Spread across 10 weeks (Sun–Thu per week, 5 weekdays × 10 weeks = 50 slots).
  // Opportunities cycle through slots; multiple opps can share a slot (realistic).
  const week = Math.floor((opp.id - 1) / 5) % 10;   // 0–9
  const dow  = (opp.id - 1) % 5;                     // 0=Sun … 4=Thu

  const date = new Date(base);
  date.setDate(date.getDate() + week * 7 + dow);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  return { eventDate: `${y}-${m}-${d}`, startTime, endTime };
}

// run — handles run
async function run() {
  const db   = await connectDb();
  const opps = await db.collection(COLLECTIONS.opportunities).find({}).toArray();
  console.log(`Found ${opps.length} opportunities.`);

  let updated = 0;
  let skipped = 0;

  for (const opp of opps) {
    if (opp.eventDate) { skipped++; continue; }
    const { eventDate, startTime, endTime } = schedule(opp);
    await db.collection(COLLECTIONS.opportunities).updateOne(
      { id: opp.id },
      { $set: { eventDate, startTime, endTime } },
    );
    updated++;
    console.log(`  id=${opp.id.toString().padStart(3)} ${opp.title.padEnd(30)} → ${eventDate}  ${startTime}–${endTime}`);
  }

  console.log(`\n✓ Done — updated ${updated}, skipped ${skipped} (already had eventDate).`);
}

run()
  .catch(err => { console.error('Migration failed:', err.message); process.exit(1); })
  .finally(closeDb);
