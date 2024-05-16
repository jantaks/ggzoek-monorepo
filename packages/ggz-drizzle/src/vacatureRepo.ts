import { MinimumVacature, SelectVacature, vacatures as vacatureTable } from '../drizzle/schema.js';
import { client, db } from './client.js';
import { and, arrayContains, arrayOverlaps, eq, gt, gte, isNotNull, isNull, lt, or, sql } from 'drizzle-orm';

export async function closeConnection() {
    await client.end()
}

export async function allScreenshotUrls(){
    let result = await db.select({ screenshotUrl: vacatureTable.screenshotUrl }).from(vacatureTable).where(isNotNull(vacatureTable.screenshotUrl)).execute();
    return  result.map((x: { screenshotUrl: string }) => x.screenshotUrl);
}

export async function getVacature(urlHash: string) {
    const result = await db.select().from(vacatureTable).where(eq(vacatureTable.urlHash, urlHash)).limit(1).execute();
    if (result.length === 0) {
        return null;
    }
    return result[0] as SelectVacature

}

export async function upsertVacature(vacature: MinimumVacature) {
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

    try {
        await db.insert(vacatureTable)
            .values(valuesToInsert)
            .onConflictDoUpdate({
                target: vacatureTable.urlHash,
                set: valuesToUpdate
            });
    } catch (e) {
        console.error(`Could not in-/upsert vacature ${vacature.url}`, e)
    }

}

export async function getUnsyncedVacatures() {
    const result = await db.select().from(vacatureTable).where(eq(vacatureTable.synced, false)).execute();
    return result;
}

export async function getVacaturesWithoutScreenshot() {
    return await db.select().from(vacatureTable).where(isNull(vacatureTable.screenshotUrl)).execute() as SelectVacature[]
}


export async function getUpdatedVacatures(vacatures: SelectVacature[]) {
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

export async function allUrls() {
    const result = await db.select({ url: vacatureTable.url }).from(vacatureTable).execute();
    return result.map((x: { url: string }) => x.url);
}

export async function allUrlsForOrganisation(organisation: string) {
    const result =  await db.select({ url: vacatureTable.url }).from(vacatureTable).where(eq(vacatureTable.instelling, organisation)).execute();
    return result.map((x: { url: string }) => x.url);
}

/**
 * Retrieves all URLs that have been scraped within a certain number of hours.
 *
 * @param {number} hours - The number of hours to look back for scraped URLs. Defaults to 24 hours if no argument is provided.
 * @returns {Promise<string[]>} - A promise that resolves to an array of URLs that have been scraped within the specified number of hours.
 */
export async function getAllUrlsScrapedWithinHours(hours: number = 24): Promise<string[]> {
    const result = await db.select({ url: vacatureTable.url }).from(vacatureTable).where(gt(vacatureTable.lastScraped, new Date(Date.now() - hours * 60 * 60 * 1000))).execute();
    return result.map((x: { url: string }) => x.url);
}

export async function getAll(){
    return await db.select().from(vacatureTable).execute() as SelectVacature[];
}

export async function getAllWithoutProfessie(){
    return await db.select().from(vacatureTable).where(sql`array_length(${vacatureTable.professie}, 1) IS NULL OR array_length(${vacatureTable.professie}, 1) = 0`).execute() as SelectVacature[];

}


/**
 * Retrieves all vacatures that have at least one of the provided professies.
 * @param professies
 */
export async function getAllWithProfessies(professies: string[]){
    return await db.select().from(vacatureTable).where(arrayOverlaps(vacatureTable.professie, professies)).execute() as SelectVacature[];
}

export async function getVacaturesToSummarize(){
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