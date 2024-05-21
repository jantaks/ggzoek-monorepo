import _ from 'lodash';
import { db, getDb } from './client.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { completionsResultSchema, MinimumVacature, vacatures as vacatureTable } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';


function withDb(fn: (...args: any) => any) {
  const { client: client, db: db } = getDb();
  const operation = _.partialRight(fn, db);
  return async (...args) => {
    try {
      return await operation(...args);
    } catch (e) {
      log.error(e, `Error in ${fn.name}`);
    } finally {
      log.info(`Closing connection`);
      await client.end()
    }
  };
};

async function allUrlsForOrganisation(organisation: string, db?) {
  const result =  await db.select({ url: vacatureTable.url }).from(vacatureTable).where(eq(vacatureTable.instelling, organisation)).execute();
  return result.map((x: { url: string }) => x.url);
}

async function upsertVacature(vacature: z.infer<typeof completionsResultSchema>) {
  log.warn("DEPRECATED! User Repo class instead")
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

    await db.insert(vacatureTable)
      .values(valuesToInsert)
      .onConflictDoUpdate({
        target: vacatureTable.urlHash,
        set: valuesToUpdate
      });
}

export const repo = {
  allUrlsForOrganisation: withDb(allUrlsForOrganisation) as typeof allUrlsForOrganisation,
}