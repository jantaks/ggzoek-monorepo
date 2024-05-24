import _ from 'lodash';
import { getDb } from './client.js';
import { log } from '@ggzoek/logging/src/logger.js';
import {
  insertSchema,
  MinimumVacature,
  SelectVacature,
  vacatures as vacatureTable
} from '../drizzle/schema.js';
import { and, arrayOverlaps, eq, gt, isNotNull, isNull, lt, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';


function provideDb<T extends any[], R, D extends PostgresJsDatabase>(
  fn: (...args: [...T, D]) => Promise<R> | R
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const { client, db } = getDb();
    const partiallyAppliedFunction = _.partialRight(fn, db);
    try {
      return await partiallyAppliedFunction(...args);
    } catch (e) {
      log.error(e, `Error in ${fn.name}`); // Adjusted for generic logging
    } finally {
      log.debug(`Closing connection: ${client.name}`);
      await client.end();
    }
  };
}

async function allUrlsForOrganisation(organisation: string, db) {
  const result =  await db.select({ url: vacatureTable.url }).from(vacatureTable).where(eq(vacatureTable.instelling, organisation)).execute();
  return result.map((x: { url: string }) => x.url) as string[];
}

async function upsertVacature(vacature: z.infer<typeof insertSchema>, db) {
  const columns = Object.keys(vacatureTable);
  const valuesToInsert = columns.reduce((acc, col) => {
    acc[col] = vacature[col];
    return acc;
  }, {} as MinimumVacature);

  const valuesToUpdate = columns.reduce((acc, col) => {
    if (vacature[col] !== undefined) {
      acc[col] = vacature[col];
    }
    return acc;
  }, {} as MinimumVacature);

   const result =  await db.insert(vacatureTable)
      .values(valuesToInsert)
      .onConflictDoUpdate({
        target: vacatureTable.urlHash,
        set: valuesToUpdate
      });
    log.debug(`UPSERTED ${vacature.url}`)
}

async function allScreenshotUrls(db){
  const result = await db.select({ screenshotUrl: vacatureTable.screenshotUrl }).from(vacatureTable).where(isNotNull(vacatureTable.screenshotUrl)).execute();
  return  result.map((x: { screenshotUrl: string }) => x.screenshotUrl) as string[];
}

 async function getVacature(urlHash: string, db) {
  const result = await db.select().from(vacatureTable).where(eq(vacatureTable.urlHash, urlHash)).limit(1).execute();
  if (result.length === 0) {
    return null;
  }
  return result[0] as SelectVacature
}

async function getVacatureByUrl(url: string, db) {
  const result = await db.select().from(vacatureTable).where(eq(vacatureTable.url, url)).limit(1).execute();
  if (result.length === 0) {
    return undefined;
  }
  return result[0] as SelectVacature
}

async function getUnsyncedVacatures(db) {
  const result = await db.select().from(vacatureTable).where(eq(vacatureTable.synced, false)).execute() as SelectVacature[];
  return result;
}

async function getVacaturesWithoutScreenshot(db) {
  return await db.select().from(vacatureTable).where(isNull(vacatureTable.screenshotUrl)).execute() as SelectVacature[]
}


async function getUpdatedVacatures(vacatures: SelectVacature[], db) {
  const updatedVacatures: SelectVacature[] = []
  for (const vacature of vacatures) {
    const storedVacatures = await db.select().from(vacatureTable).where(eq(vacatureTable.urlHash, vacature.urlHash)).execute();
    if (storedVacatures.length === 0) {
      updatedVacatures.push(vacature)
    } else if (storedVacatures[0].bodyHash !== vacature.bodyHash) {
      updatedVacatures.push(vacature)
    }
  }
  return updatedVacatures
}

async function allUrls(db): Promise<string[]>  {
  const result = await db.select({ url: vacatureTable.url }).from(vacatureTable).execute();
  return result.map((x: { url: string }) => x.url);
}

async function getAllUrlsScrapedWithinHours(period, db): Promise<string[]> {
  const result = await db.select({ url: vacatureTable.url }).from(vacatureTable).where(gt(vacatureTable.lastScraped, new Date(Date.now() - period * 60 * 60 * 1000))).execute();
  return result.map((x: { url: string }) => x.url);
}

/**
 * Retrieves all vacatures from the database.
 */
async function getAll(db){
  return await db.select().from(vacatureTable).execute() as SelectVacature[];
}

/**
 * Retrieves all vacatures that do not have a professie.
 */
async function getAllWithoutProfessie(db){
  return await db.select().from(vacatureTable).where(sql`array_length(${vacatureTable.professie}, 1) IS NULL OR array_length(${vacatureTable.professie}, 1) = 0`).execute() as SelectVacature[];

}

/**
 * Retrieves all vacatures that have at least one of the provided professies.
 * @param professies
 */
 async function getAllWithProfessies(professies: string[], db){
  return await db.select().from(vacatureTable).where(arrayOverlaps(vacatureTable.professie, professies)).execute() as SelectVacature[];
}

/**
 * Retrieves all vacatures need to be summarized, based on professie = "Psychiater".
 * @param db
 */
async function getVacaturesToSummarize(db){
  const professies = ['Psychiater']
  return await db.select()
    .from(vacatureTable)
    .where(
      and(
        arrayOverlaps(vacatureTable.professie, professies),
        or(eq(vacatureTable.summary, ''), isNull(vacatureTable.summary))
      )
    )
    .execute() as SelectVacature[];
}

const repo  = {
  // Retrieves a list of all screenshot urls
  allScreenshotUrls: provideDb(allScreenshotUrls),
  allUrls: provideDb(allUrls),
  allUrlsForOrganisation: provideDb(allUrlsForOrganisation),
  getAll: provideDb(getAll),
  // Retrieves a list of URLs that have been scraped within the given time period (@param timeperiodHours).
  getAllUrlsScrapedWithinHours: provideDb(getAllUrlsScrapedWithinHours),
  getAllWithProfessies: provideDb(getAllWithProfessies),
  getAllWithoutProfessie: provideDb(getAllWithoutProfessie),
  getUnsyncedVacatures: provideDb(getUnsyncedVacatures),
  getUpdatedVacatures: provideDb(getUpdatedVacatures),
  getVacature: provideDb(getVacature),
  getVacatureByUrl: provideDb(getVacatureByUrl),
  getVacaturesToSummarize: provideDb(getVacaturesToSummarize),
  getVacaturesWithoutScreenshot: provideDb(getVacaturesWithoutScreenshot),
  upsert: provideDb(upsertVacature)
}

export default repo;
