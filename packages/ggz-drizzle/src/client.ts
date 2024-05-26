import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const connectionString = process.env["DATABASE_URL"] as string
export const client = postgres(connectionString)
export const db = drizzle(client);
import { log } from '@ggzoek/logging/src/logger.js';

export function getDb(){
  // log.debug(`Connecting to ${connectionString}`);
  // const client = postgres(connectionString)
  // const db =  drizzle(client)
  return {client, db}
}

