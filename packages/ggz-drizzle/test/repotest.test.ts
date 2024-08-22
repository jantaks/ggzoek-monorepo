import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { vacatures } from '../src/schema';
import { createInsertSchema } from 'drizzle-zod';
import { getAllProfessies } from '../src/vacatures';
import {
  createSavedSearch,
  deleteSavedSearch,
  deleteUserSearch,
  getSavedSearchesForUser,
  getUserSearchResults,
  storeNewSearchResults
} from '../src/savedSearches';
import { getDb } from '../src/client';
import { sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const insertSchema = createInsertSchema(vacatures, {
  url: (schema) => schema.url.url(),
  summary: (schema) => schema.summary.min(100).nullable(),
  title: (schema) => schema.title.min(5),
  professie: (schema) => schema.professie
})
  .required({
    title: true,
    summary: true,
    urlHash: true
  })
  .omit({ opleidingsbudgetSize: true });

describe('repotest', () => {
  it('should return professies', async () => {
    const result = await getAllProfessies();
    expect(result).toBeDefined();
    console.log(result);
  });
});

describe('Save, update and delete searches', () => {
  const { db: db } = getDb();
  const randomEmail = randomUUID() + '@ggzoek.com';
  const randomPassword = '__Pw' + randomUUID();
  const randomResult = randomUUID();
  let userId;

  beforeAll(async () => {
    const result = await db.execute(
      sql.raw(`select public.create_user('${randomEmail}', '${randomPassword}');`)
    );
    userId = result[0].create_user;
    console.log(`Created user`, { email: randomEmail }, { userId });
  });

  afterAll(async () => {
    await db.execute(sql.raw(`select public.delete_user('${randomEmail}');`));
    console.log(`Deleted user `, { email: randomEmail });
  });

  let firstResult;
  it('Saves a new search', async () => {
    firstResult = await createSavedSearch('testsearch', userId, [randomResult]);
    expect(firstResult.userSearchId).toBeTypeOf('number');
    expect(firstResult.searchId).toBeTypeOf('number');
    expect(firstResult.resultId).toBeTypeOf('number');
  });

  it('Updates existing search if needed', async () => {
    const updated = await createSavedSearch('testsearch', userId, [randomResult]);
    expect(firstResult.userSearchId).toBe(updated.userSearchId);
    expect(firstResult.searchId).toBe(updated.searchId);
    expect(firstResult.resultId !== updated.resultId).toBeTruthy();
  });

  it('Gets a saved search', async () => {
    const result = await getSavedSearchesForUser(userId);
    expect(result).toContain('testsearch');
    console.log(result);
  });

  let newResults = ['new1', 'new2', 'new3'];
  it('Adds results to a saved search', async () => {
    const response = await storeNewSearchResults('testsearch', [...newResults, randomResult]);
    expect(response.result).toBe('success');
    expect(response.id).toBeTypeOf('number');
  });

  it('Gets latest search results and the previous', async () => {
    const result = await getUserSearchResults(userId, 'testsearch');
    expect(result.latestResult).toEqual([...newResults, randomResult]);
    expect(result.previousResult).toEqual([randomResult]);
  });

  it('Deletes a users saved search', async () => {
    let response = await deleteUserSearch({ userId, search: 'testsearch' });
    expect(response.result).toBe('success');
    response = await deleteUserSearch({ userId, search: 'testsearch' });
    expect(response.result).toBe('notFound');
  });

  it('Deletes a saved search', async () => {
    const { result } = await deleteSavedSearch('testsearch');
    expect(result).toBe('success');
  });

  it('Returns empty arrays for old and new results when saved search does not exist', async () => {
    const result = await getUserSearchResults(userId, 'testsearch');
    expect(result.latestResult).toEqual([]);
    expect(result.previousResult).toEqual([]);
  });
});
