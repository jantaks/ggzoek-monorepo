import { SelectVacature, vacatures as vacatureTable } from '../drizzle/schema.js';
import { client, db } from './client.js';
import { eq, isNotNull, isNull } from 'drizzle-orm';

export async function closeConnection() {
    await client.end()
}

export async function allScreenshotUrls(){
    let result = await db.select({ screenshotUrl: vacatureTable.screenshotUrl }).from(vacatureTable).where(isNotNull(vacatureTable.screenshotUrl)).execute();
    return  result.map((x: { screenshotUrl: string }) => x.screenshotUrl);
}

export async function upsertVacature(vacature: SelectVacature) {
    const columns = Object.keys(vacatureTable);
    const valuesToInsert = columns.reduce((acc, col) => {
        acc[col] = vacature[col];
        return acc;
    }, {} as any);

    const valuesToUpdate = columns.reduce((acc, col) => {
        if (vacature[col] !== undefined) {
            acc[col] = vacature[col];
        }
        return acc;
    }, {} as any);

    try {
        await db.insert(vacatureTable)
            .values(valuesToInsert)
            .onConflictDoUpdate({
                target: vacatureTable.urlHash,
                set: valuesToUpdate
            });
    } catch (e) {
        console.error(`Could not in / upsert vacature ${vacature.url}`, e)
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