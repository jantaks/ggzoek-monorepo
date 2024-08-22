import { DB, getDb, provideDb } from './client.js';
import { log } from '@ggzoek/logging/dist/logger.js';
import { InsertVacature, likes, SelectVacature, vacatures as vacatureTable } from './schema.js';
import {
  and,
  arrayOverlaps,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
  max,
  or,
  sql,
  SQLWrapper
} from 'drizzle-orm';
import { type BeroepOptions } from '@ggzoek/types';

async function allUrlsForOrganisation(organisation: string, db) {
  const result = await db
    .select({ url: vacatureTable.url })
    .from(vacatureTable)
    .where(eq(vacatureTable.instelling, organisation))
    .execute();
  return result.map((x: { url: string }) => x.url) as string[];
}

export async function getVacaturesByIds(ids: string[]) {
  const db = getDb().db;
  return await db.select().from(vacatureTable).where(inArray(vacatureTable.urlHash, ids)).execute();
}

export async function getLikesForUser(user_id: string) {
  const { db: db } = getDb();
  const result = await db
    .select({ urlHash: likes.vacature })
    .from(likes)
    .where(eq(likes.userId, user_id))
    .execute();
  console.log('getLikesForUser result: ', result);
  return result.map((x: { urlHash: string }) => x.urlHash) as string[];
}

export async function getVacaturesForUser(user_id: string) {
  const { db: db } = getDb();
  // join vacatures with likes
  return await db
    .select({ vacature: vacatureTable })
    .from(vacatureTable)
    .leftJoin(likes, eq(vacatureTable.urlHash, likes.vacature))
    .where(eq(likes.userId, user_id))
    .execute();
}

export async function likeVacature(user_id: string, vacature: string) {
  const { db: db } = getDb();
  await db.insert(likes).values({ userId: user_id, vacature: vacature }).execute();
}

export async function unlikeVacature(user_id: string, vacature: string) {
  const { db: db } = getDb();
  await db
    .delete(likes)
    .where(and(eq(likes.userId, user_id), eq(likes.vacature, vacature)))
    .execute();
}

export async function upsert(vacature: Omit<InsertVacature, 'beroepen'>) {
  const { db: db } = getDb();
  const columns = Object.keys(vacatureTable);
  const valuesToInsert = columns.reduce(
    (acc, col) => {
      acc[col] = vacature[col];
      return acc;
    },
    {} as typeof vacatureTable.$inferInsert
  );

  const valuesToUpdate = columns.reduce(
    (acc, col) => {
      if (vacature[col] !== undefined) {
        acc[col] = vacature[col];
      }
      return acc;
    },
    {} as typeof vacatureTable.$inferInsert
  );
  try {
    await db.insert(vacatureTable).values(valuesToInsert).onConflictDoUpdate({
      target: vacatureTable.urlHash,
      set: valuesToUpdate
    });
  } catch (e) {
    log.error(`Error upserting ${vacature.url} (id: ${vacature.urlHash})`);
    log.error(e);
  }
  log.debug(`UPSERTED ${vacature.url}`);
  log.silly({ json: { ...vacature, body: undefined } });
  log.silly(vacature.body);
}

async function allScreenshotUrls(db) {
  const result = await db
    .select({ screenshotUrl: vacatureTable.screenshotUrl })
    .from(vacatureTable)
    .where(isNotNull(vacatureTable.screenshotUrl))
    .execute();
  return result.map((x: { screenshotUrl: string }) => x.screenshotUrl) as string[];
}

export async function getVacature(urlHash: string) {
  const db = getDb().db;
  const result = await db
    .select()
    .from(vacatureTable)
    .where(eq(vacatureTable.urlHash, urlHash))
    .limit(1)
    .execute();
  if (result.length === 0) {
    return null;
  }
  return result[0];
}

async function getVacatureByUrl(url: string, db: DB) {
  const result = await db
    .select()
    .from(vacatureTable)
    .where(eq(vacatureTable.url, url))
    .limit(1)
    .execute();
  if (result.length === 0) {
    return undefined;
  }
  return result[0];
}

type SyncOptions = {
  professies: BeroepOptions[] | 'all';
  organisaties: string[] | 'all';
  // If force equals true then all vacatures will be summarized, even if they have been summarized before
  // Only sync vacatures that have been scraped after this date
  scrapedAfter?: Date;
  // Limit the number of vacatures to summarize
  limit?: number;
  minBatchId?: number;
};

/**
 * Retrieves all vacatures that have not been summarized yet.
 * @param options
 */
export async function getVacaturesToSync(options: SyncOptions) {
  const db = getDb().db;
  const clauses: SQLWrapper[] = [];
  if (options.professies && options.professies.length > 0 && options.professies !== 'all') {
    clauses.push(arrayOverlaps(vacatureTable.professie, options.professies));
  }
  if (options.organisaties && options.organisaties.length > 0 && options.organisaties !== 'all') {
    clauses.push(inArray(vacatureTable.organisatie, options.organisaties));
  }
  if (options.minBatchId) {
    clauses.push(gte(vacatureTable.summaryBatchId, options.minBatchId));
  }
  return await db
    .select()
    .from(vacatureTable)
    .where(
      and(
        ...clauses,
        gt(vacatureTable.lastScraped, options.scrapedAfter),
        isNotNull(vacatureTable.summaryBatchId)
      )
    )
    .limit(options.limit)
    .execute();
}

async function getVacaturesWithoutScreenshot(db) {
  return (await db
    .select()
    .from(vacatureTable)
    .where(isNull(vacatureTable.screenshotUrl))
    .execute()) as SelectVacature[];
}

async function getUpdatedVacatures(vacatures: SelectVacature[], db) {
  const updatedVacatures: SelectVacature[] = [];
  for (const vacature of vacatures) {
    const storedVacatures = await db
      .select()
      .from(vacatureTable)
      .where(eq(vacatureTable.urlHash, vacature.urlHash))
      .execute();
    if (storedVacatures.length === 0) {
      updatedVacatures.push(vacature);
    } else if (storedVacatures[0].bodyHash !== vacature.bodyHash) {
      updatedVacatures.push(vacature);
    }
  }
  return updatedVacatures;
}

async function allUrls(db): Promise<string[]> {
  const result = await db.select({ url: vacatureTable.url }).from(vacatureTable).execute();
  return result.map((x: { url: string }) => x.url);
}

async function getAllUrlsScrapedWithinHours(period, db): Promise<string[]> {
  const result = await db
    .select({ url: vacatureTable.url })
    .from(vacatureTable)
    .where(gt(vacatureTable.lastScraped, new Date(Date.now() - period * 60 * 60 * 1000)))
    .execute();
  return result.map((x: { url: string }) => x.url);
}

/**
 * Retrieves all vacatures from the database.
 */
export async function getAll() {
  const { db: db } = getDb();
  return (await db.select().from(vacatureTable).execute()) as SelectVacature[];
}

async function getAllForOrganisation(organisatie: string) {
  const { db: db } = getDb();
  return await db
    .select()
    .from(vacatureTable)
    .where(eq(vacatureTable.organisatie, organisatie))
    .execute();
}

export async function getAllForOrganisationInPeriod(organisatie: string, hours: number, db: DB) {
  return await db
    .select()
    .from(vacatureTable)
    .where(
      and(
        eq(vacatureTable.organisatie, organisatie),
        gt(vacatureTable.lastScraped, new Date(Date.now() - hours * 60 * 60 * 1000))
      )
    )
    .execute();
}

/**
 * Retrieves all vacatures that do not have a professie.
 */
async function getAllWithoutProfessie(db) {
  return (await db
    .select()
    .from(vacatureTable)
    .where(
      sql`array_length
          (${vacatureTable.professie}, 1)
          IS NULL OR array_length(
          ${vacatureTable.professie}
          ,
          1
          )
          =
          0`
    )
    .execute()) as SelectVacature[];
}

/** select all vacatures where summary is not null or empty string ... */
export async function getSummarizedVacatures(
  options: { limit?: number; summaryAfter?: Date } = { limit: 10000 }
) {
  const db = getDb().db;

  const clauses = [];
  if (options.summaryAfter) {
    clauses.push(gt(vacatureTable.summaryTimestamp, options.summaryAfter));
  }

  return await db
    .select()
    .from(vacatureTable)
    .where(and(...clauses, isNotNull(vacatureTable.summary), sql`${vacatureTable.summary} <> ''`))
    .limit(options.limit)
    .execute();
}

/**
 * Retrieves all vacatures that have at least one of the provided professies.
 * @param professies
 */
async function getAllWithProfessies(professies: string[], db) {
  return (await db
    .select()
    .from(vacatureTable)
    .where(arrayOverlaps(vacatureTable.professie, professies))
    .execute()) as SelectVacature[];
}

type SummarizeOptions = {
  professies: BeroepOptions[] | 'all';
  organisaties: string[] | 'all';
  // If force equals true then all vacatures will be summarized, even if they have been summarized before
  force: boolean;
  // Only summarize vacatures that have been scraped after this date
  scrapedAfter?: Date;
  // Only summarize vacatures that have been summarized before this date (only effective if force is false)
  summaryDateBefore?: Date;
  // Limit the number of vacatures to summarize
  limit?: number;
};

/**
 * Retrieves all vacatures that have not been summarized yet.
 * @param options
 */
export async function getVacaturesToSummarize(
  options: SummarizeOptions = {
    professies: ['Psychiater'],
    organisaties: 'all',
    force: false,
    scrapedAfter: new Date(Date.now() - 24 * 60 * 60 * 1000),
    limit: 10000
  }
) {
  const db = getDb().db;
  const clauses: SQLWrapper[] = [];
  if (options.professies && options.professies.length > 0 && options.professies !== 'all') {
    clauses.push(arrayOverlaps(vacatureTable.professie, options.professies));
  }
  if (options.organisaties && options.organisaties.length > 0 && options.organisaties !== 'all') {
    clauses.push(inArray(vacatureTable.organisatie, options.organisaties));
  }
  if (!options.force) {
    clauses.push(or(eq(vacatureTable.summary, ''), isNull(vacatureTable.summary)));
  }
  if (options.summaryDateBefore) {
    clauses.push(lt(vacatureTable.summaryTimestamp, options.summaryDateBefore));
  }
  return await db
    .select()
    .from(vacatureTable)
    .where(and(...clauses, gt(vacatureTable.lastScraped, options.scrapedAfter)))
    .limit(options.limit)
    .execute();
}

export async function updateSynced(urlHashes: string[], flag: boolean = true) {
  const db = getDb().db;
  await db
    .update(vacatureTable)
    .set({ synced: flag })
    .where(inArray(vacatureTable.urlHash, urlHashes))
    .execute();
}

export async function getAllProfessies() {
  const db = getDb().db;
  const result = await db
    .select({ professie: vacatureTable.professie })
    .from(vacatureTable)
    .execute();
  return Array.from(new Set(result.map((x: { professie: string[] }) => x.professie).flat()));
}

export async function getMaxSummaryBatchId() {
  const db = getDb().db;
  const result = await db
    .select({ maxBatchId: max(vacatureTable.summaryBatchId) })
    .from(vacatureTable);
  if (result.length === 0) {
    return 0;
  }
  return result[0].maxBatchId;
}

const vacatures = {
  // Retrieves a list of all screenshot urls
  allScreenshotUrls: provideDb(allScreenshotUrls),
  allUrls: provideDb(allUrls),
  allUrlsForOrganisation: provideDb(allUrlsForOrganisation),
  getAll: provideDb(getAll),
  getAllForOrganisationInPeriod: provideDb(getAllForOrganisationInPeriod),
  getAllUrlsScrapedWithinHours: provideDb(getAllUrlsScrapedWithinHours),
  // Retrieves a list of URLs that have been scraped within the given time period (@param timeperiodHours).
  getAllWithProfessies: provideDb(getAllWithProfessies),
  getAllWithoutProfessie: provideDb(getAllWithoutProfessie),
  getVacaturesToSync,
  getUpdatedVacatures: provideDb(getUpdatedVacatures),
  getVacature,
  getVacatureByUrl: provideDb(getVacatureByUrl),
  getVacaturesToSummarize,
  getVacaturesWithoutScreenshot: provideDb(getVacaturesWithoutScreenshot),
  getAllForOrganisation,
  upsert
};

export default vacatures;
