// Define the decorator function that injects the last argument
import { getDb } from './client.js';
import _ from 'lodash';
import { vacatures as vacatureTable } from './schema.js';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { log } from '@ggzoek/logging/src/logger.js';

function provideDb<T extends any[], D extends PostgresJsDatabase>(
  fn: (...args: [...T, D]) => any,
  D?
) {
  const { client: client, db: db } = getDb();
  const partiallyAppliedFunction = _.partialRight(fn, db);
  return async (...args: T) => {
    try {
      return await partiallyAppliedFunction(...args);
    } catch {
      log.error(`Error in ${fn.name}`);
    } finally {
      log.info(`Closing connection: ${client.name}`);
      await client.end();
    }
  };
}


// Example function with multiple arguments
async function exampleDbOperation(organisation: string, db?: PostgresJsDatabase) {
	const result = await db.select({ url: vacatureTable.url }).from(vacatureTable).where(eq(vacatureTable.instelling, organisation)).execute();
	return result.map((x: { url: string }) => x.url);
}

// Use the decorator to create a new function
const newFunction = provideDb(exampleDbOperation);

// Call the new function with the remaining arguments
console.log(await newFunction('Lentis')); // Output: arg1: Hello, arg2: 42, arg3: true, arg4: GeneratedValue
