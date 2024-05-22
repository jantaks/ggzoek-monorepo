// Define the decorator function that injects the last argument
import { getDb } from './client.js';
import _ from 'lodash';

type DB = ReturnType<typeof getDb>;

function provideDb<T extends any[], D extends DB>(fn: (...args: [...T, D]) => any, db:D) {
  const partiallyAppliedFunction = _.partialRight(fn, db)
  return (...args: T) => {
    return partiallyAppliedFunction(...args)
  };
}

// Example function with multiple arguments
function exampleDbOperation(arg1: string, arg2: number, db:DB): void {
  console.log(`arg1: ${arg1}, arg2: ${arg2}, db: ${db}`);
}
// Use the decorator to create a new function
const newFunction = provideDb(exampleDbOperation, getDb());

// Call the new function with the remaining arguments
newFunction('Hello', 42); // Output: arg1: Hello, arg2: 42, arg3: true, arg4: GeneratedValue
