import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { completionsResultSchema, MinimumVacature, vacatures as vacatureTable } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { getDb } from './client.js';
import { log } from '@ggzoek/logging/src/logger.js';

type DbOperationArguments = {
  [k: PropertyKey]: any
  db: PostgresJsDatabase
}

type DbOperation = (args: DbOperationArguments) => Promise<any>

type DbProvider = (DbOperation) => (args: Omit<DbOperationArguments, 'db'>) => any

const exampleOp: DbOperation = async (args: { db: PostgresJsDatabase, organisation: string }) => {
  const result = await args.db.select({ url: vacatureTable.url }).from(vacatureTable).where(eq(vacatureTable.instelling, args.organisation)).execute();
  return result.map((x: { url: string }) => x.url);
};

const provider: DbProvider = (operation: DbOperation) => {
  return async (args: Omit<DbOperationArguments, 'db'>) => {
    const { db: db, client: client } = getDb();
    try {
      return await operation({ db: db, ...args });
    } catch (e) {
      log.error(e, `Error in ${operation.name}`);
    } finally {
      log.info(`Closing connection`);
      await client.end();
    }
  };
};

const x = provider(exampleOp);
console.log(await x({ organisation: 'Lentis' }));