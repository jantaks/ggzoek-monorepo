import { getDb } from './client.js';
import { savedSearches, searchResults, userSearches } from './schema.js';
import { and, desc, eq } from 'drizzle-orm';

type UserSearchInsert = Promise<{ action: 'INSERTED' | 'UPDATED'; userSearchId: number }>;

async function insertUserSearch(
  searchId: number,
  userId: string,
  resultId: number
): UserSearchInsert {
  let id = null;
  let action: 'INSERTED' | 'UPDATED' = 'INSERTED';
  const { db: db } = getDb();
  try {
    const result = await db
      .insert(userSearches)
      .values({ searchId: searchId, userId: userId, updatedResultId: resultId })
      .returning({ id: userSearches.id });
    id = result[0].id;
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      e.message.includes('duplicate key value violates unique constraint')
    ) {
      const result = await db
        .update(userSearches)
        .set({ updatedResultId: resultId })
        .where(and(eq(userSearches.searchId, searchId), eq(userSearches.userId, userId)))
        .returning({ id: userSearches.id });
      id = result[0].id;
      action = 'UPDATED';
    } else {
      throw e;
    }
  }
  return { action: action, userSearchId: id };
}

async function getOrCreateSearch(search: string): Promise<number> {
  const { db: db } = getDb();
  let searchId: number;
  const exists = await db
    .select({ id: savedSearches.id })
    .from(savedSearches)
    .where(eq(savedSearches.search, search))
    .limit(1)
    .execute();
  if (exists.length === 0) {
    const rec = await db
      .insert(savedSearches)
      .values({ search })
      .returning({ id: savedSearches.id });
    searchId = rec[0].id;
  } else {
    searchId = exists[0].id;
  }
  return searchId;
}

export async function getSavedSearchesForUser(userId: string) {
  const { db: db } = getDb();
  const searches = await db
    .select({
      searchUrlParams: savedSearches.search,
      latestResult: searchResults.result,
      created: userSearches.createdDateTime
    })
    .from(savedSearches)
    .leftJoin(userSearches, eq(savedSearches.id, userSearches.searchId))
    .leftJoin(searchResults, eq(userSearches.updatedResultId, searchResults.id))
    .where(eq(userSearches.userId, userId))
    .execute();
  return searches;
}

async function insertSearchResult(searchId, foundVacatures: string[]) {
  const { db: db } = getDb();
  const result = await db
    .insert(searchResults)
    .values({ searchId: searchId, result: foundVacatures })
    .returning({ id: searchResults.id });
  return result[0].id;
}

export async function storeNewSearchResults(
  search: string,
  results: string[]
): Promise<{ result: 'success' | 'failed'; id: number | null }> {
  const searchId = await getOrCreateSearch(search);
  const id = await insertSearchResult(searchId, results);
  if (id === null) {
    console.error(`Failed to save search result for search ${search}`);
    return { result: 'failed', id: null };
  }

  return { result: 'success', id: id };
}

type DeleteResponse = Promise<{
  result: 'success' | 'notFound';
}>;

export async function deleteUserSearch(params: { userId: string; search: string }): DeleteResponse {
  const { db: db } = getDb();
  const searchId = await db
    .select({ id: savedSearches.id })
    .from(savedSearches)
    .where(eq(savedSearches.search, params.search))
    .execute();
  if (searchId.length === 0) {
    console.error(`Search ${params.search} not found`);
    return { result: 'notFound' };
  }
  const result = await db
    .delete(userSearches)
    .where(and(eq(userSearches.searchId, searchId[0].id), eq(userSearches.userId, params.userId)))
    .execute();
  return result.count === 1 ? { result: 'success' } : { result: 'notFound' };
}

export async function createSavedSearch(search: string, userId: string, results: string[]) {
  const searchId = await getOrCreateSearch(search);
  const resultId = await insertSearchResult(searchId, results);
  const { userSearchId } = await insertUserSearch(searchId, userId, resultId);
  return { searchId, resultId, userSearchId };
}

/**
 * Deletes a saved search from the database.
 * Related records in the user_searches and search_results table will / should be deleted via cascading delete.
 */
export async function deleteSavedSearch(search: string) {
  const { db: db } = getDb();
  const result = await db.delete(savedSearches).where(eq(savedSearches.search, search)).execute();
  return result.count === 1 ? { result: 'success' } : { result: 'notFound' };
}

/**
 * Returns the latest and previous search results for a user.
 * The previous search result is the last search result that was saved for, and communicated to the user.
 * These results are used to determine if the user should be notified of new search results.
 */
export async function getUserSearchResults(userId: string, search: string) {
  const { db: db } = getDb();
  const lastSearchResult = await db
    .select()
    .from(searchResults)
    .leftJoin(savedSearches, eq(searchResults.searchId, savedSearches.id))
    .where(eq(savedSearches.search, search))
    .orderBy(desc(searchResults.id))
    .limit(1);
  if (lastSearchResult.length === 0) {
    return { latestResult: [], previousResult: [] };
  }
  const searchId = lastSearchResult[0].saved_searches.id;

  const userSearchResultId = db
    .select({ resultId: userSearches.updatedResultId })
    .from(userSearches)
    .where(and(eq(userSearches.userId, userId), eq(userSearches.searchId, searchId)))
    .limit(1)
    .as('userSearchResultId'); // Use as subquery

  const lastUserSearchResult = await db
    .select()
    .from(userSearchResultId)
    .leftJoin(searchResults, eq(userSearchResultId.resultId, searchResults.id))
    .where(eq(userSearchResultId.resultId, searchResults.id))
    .orderBy(desc(searchResults.id))
    .limit(10);
  if (lastUserSearchResult.length === 0) {
    return { latestResult: lastSearchResult[0].search_results.result, previousResult: [] };
  }
  const previousResult = lastUserSearchResult[0].search_results.result;
  const latestResult = lastSearchResult[0].search_results.result;
  return { latestResult, previousResult };
}
