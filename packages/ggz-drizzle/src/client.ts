import 'dotenv/config';
import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { log } from '@ggzoek/logging/dist/logger.js';
import _ from 'lodash';

const connectionString = process.env['DATABASE_URL'] as string;
if (connectionString.length === 0) {
  console.error('DATABASE_URL not set');
}

export const client = postgres(connectionString);
export const db = drizzle(client);

export function getDb() {
  if (connectionString.length === 0) {
    console.error('DATABASE_URL not set');
  }
  // const client = postgres(connectionString)
  // const db =  drizzle(client)
  return { client, db };
}

export type DB = PostgresJsDatabase<Record<string, never>>;

export function provideDb<T extends any[], R, D extends DB>(
  fn: (...args: [...T, D]) => Promise<R> | R
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const { db: db } = getDb();
    const partiallyAppliedFunction = _.partialRight(fn, db);
    try {
      return await partiallyAppliedFunction(...args);
    } catch (e) {
      log.error(e, `Error in ${fn.name}`);
    } finally {
      // log.debug(`Closing connection: ${client.name}`);
      // await client.end();
    }
  };
}
