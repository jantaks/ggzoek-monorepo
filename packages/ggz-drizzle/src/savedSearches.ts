import { getDb } from './client.js';
import { savedSearches, userSearches } from './schema.js';
import { and, eq } from 'drizzle-orm';

export async function saveSearch(search: string, userId: string) {
  const { db: db } = getDb();
  let searchId = null;
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
  let id = null;
  try {
    id = await db
      .insert(userSearches)
      .values({ searchId: searchId, userId: userId })
      .returning({ id: userSearches.id });
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      e.message.includes('duplicate key value violates unique constraint')
    ) {
      console.debug(
        `${new Date().toLocaleTimeString()} [savedSearches.ts - 8ecfc86b] : Search already saved by user`
      );
      id = await db
        .select({ id: userSearches.id })
        .from(userSearches)
        .where(and(eq(userSearches.searchId, searchId), eq(userSearches.userId, userId)))
        .limit(1);
    }
  }
  //TODO: this combi could already exist. Catch the error and return the existing id
  return id;
}
