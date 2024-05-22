// Define the decorator function that injects the last argument
import { getDb } from './client.js';
import _ from 'lodash';
import { vacatures as vacatureTable } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

type DB = ReturnType<typeof getDb>;

function provideDb<T extends any[], D extends DB>(fn: (...args: [...T, D]) => any, db:D) {
  const partiallyAppliedFunction = _.partialRight(fn, db)
  return async (...args: T) => {
    try{
      return await partiallyAppliedFunction(...args)
    }
    catch{
      console.log('Error in function')
    }
    finally {
      console.log('Closing connection');
      await db.client.end();
    }
  };
}

// Example function with multiple arguments
async function exampleDbOperation(organisation: string, db:DB) {
  const result =  await db.db.select({ url: vacatureTable.url }).from(vacatureTable).where(eq(vacatureTable.instelling, organisation)).execute();
  return result.map((x: { url: string }) => x.url);
}
// Use the decorator to create a new function
const newFunction = provideDb(exampleDbOperation, getDb());

// Call the new function with the remaining arguments
console.log(await newFunction('Lentis')); // Output: arg1: Hello, arg2: 42, arg3: true, arg4: GeneratedValue
