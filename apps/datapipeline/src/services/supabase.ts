import {drizzle} from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import {vacatures as vacatureTable} from "../../drizzle/schema.js";
import {eq, isNull} from "drizzle-orm";
import {Vacature} from "../summarize.js";


const connectionString = process.env.DATABASE_URL as string
export const client = postgres(connectionString)
export const db = drizzle(client);

export async function closeConnection() {
    await client.end()
}

export async function upsertVacature(vacature: any) {
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
    return await db.select().from(vacatureTable).where(eq(vacatureTable.synced, false)).execute();
}

export async function getVacaturesWithoutScreenshot() {
    return await db.select().from(vacatureTable).where(isNull(vacatureTable.screenshotUrl)).execute() as Vacature[]
}


export async function getUpdatedVacatures(vacatures: Vacature[]) {
    const updatedVacatures: Vacature[] = []
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