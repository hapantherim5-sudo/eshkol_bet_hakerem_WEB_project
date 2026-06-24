import dns from 'dns';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Windows / some ISPs fail SRV lookup for mongodb+srv:// — use public DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const env = typeof globalThis !== 'undefined' && globalThis.process ? globalThis.process.env : {};
const uri = env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = env.MONGODB_DB || 'eshkol';

let client;
let db;
// Holds the in-flight connect() promise so concurrent callers all await the
// same single attempt instead of each spawning their own MongoClient.
let connectPromise = null;

async function _connect() {
  const maskedUri = uri.replace(/:\/\/([^:]+):([^@]+)@/, '://<user>:<pass>@');
  console.log('[db] connecting  uri=%s  db=%s', maskedUri, dbName);
  const c = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 10,
  });
  await c.connect();
  client = c;
  db = client.db(dbName);
  console.log('[db] connected   db=%s', dbName);
  return db;
}

export async function connectDb() {
  if (db) return db;
  if (!connectPromise) {
    // Reset on failure so the next request can retry.
    connectPromise = _connect().catch(err => {
      connectPromise = null;
      throw err;
    });
  }
  return connectPromise;
}

export function getDb() {
  if (!db) throw new Error('Database not connected. Call connectDb() first.');
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

/** Collection names — match the app’s localStorage keys conceptually */
export const COLLECTIONS = {
  organizations: 'organizations',
  users: 'users',
  opportunities: 'opportunities',
  events: 'events',
  registrations: 'registrations',
  cancellations: 'cancellations',
  views: 'views',
  profiles: 'profiles',
  counters: 'counters',
};
