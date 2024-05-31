import { getDb } from './client.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { scrapeResults } from '../drizzle/schema.js';
import { desc } from 'drizzle-orm';

export async function insert(result: typeof scrapeResults.$inferInsert) {
  const { db: db } = getDb();
  await db.insert(scrapeResults).values(result).execute();
  log.debug(`Inserted scrape result`);
  log.silly({ json: { ...result } });
}

export async function getLatest() {
  const { db: db } = getDb();
  const result = await db
    .select()
    .from(scrapeResults)
    .orderBy(desc(scrapeResults.crawlerStartedAt))
    .limit(1)
    .execute();
  if (result.length === 0) {
    return null;
  }
  return result[0];
}
