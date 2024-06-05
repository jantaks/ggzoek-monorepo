import { DB, getDb, provideDb } from './client.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { InsertVacature, SelectVacature, vacatures as vacatureTable } from '../drizzle/schema.js';
import {
  and,
  arrayOverlaps,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
  SQLWrapper
} from 'drizzle-orm';

async function allUrlsForOrganisation(organisation: string, db) {
  const result = await db
    .select({ url: vacatureTable.url })
    .from(vacatureTable)
    .where(eq(vacatureTable.instelling, organisation))
    .execute();
  return result.map((x: { url: string }) => x.url) as string[];
}

export async function upsert(vacature: InsertVacature) {
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

  await db.insert(vacatureTable).values(valuesToInsert).onConflictDoUpdate({
    target: vacatureTable.urlHash,
    set: valuesToUpdate
  });
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

async function getUnsyncedVacatures(db) {
  const result = (await db
    .select()
    .from(vacatureTable)
    .where(eq(vacatureTable.synced, false))
    .execute()) as SelectVacature[];
  return result;
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
async function getAll(db) {
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
  professies: string[] | 'all';
  organisaties: string[] | 'all';
};

/**
 * Retrieves all vacatures that need to be summarized / have no summary. Can be filtered on Professies and Organisations.
 * Default is all Psychiater vacatures.
 * @param options
 */
export async function getVacaturesToSummarize(
  options: SummarizeOptions = { professies: ['Psychiater'], organisaties: [] }
) {
  const db = getDb().db;
  if (options.professies.length === 0 && options.professies !== 'all') {
    options.professies = ['Psychiater'];
  }
  const clauses: SQLWrapper[] = [];
  if (options.professies && options.professies.length > 0 && options.professies !== 'all') {
    clauses.push(arrayOverlaps(vacatureTable.professie, options.professies));
  }
  if (options.organisaties && options.organisaties.length > 0 && options.organisaties !== 'all') {
    clauses.push(inArray(vacatureTable.organisatie, options.organisaties));
  }
  return await db
    .select()
    .from(vacatureTable)
    .where(and(...clauses, or(eq(vacatureTable.summary, ''), isNull(vacatureTable.summary))))
    .execute();
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
  getUnsyncedVacatures: provideDb(getUnsyncedVacatures),
  getUpdatedVacatures: provideDb(getUpdatedVacatures),
  getVacature,
  getVacatureByUrl: provideDb(getVacatureByUrl),
  getVacaturesToSummarize,
  getVacaturesWithoutScreenshot: provideDb(getVacaturesWithoutScreenshot),
  getAllForOrganisation,
  upsert
};

export default vacatures;
