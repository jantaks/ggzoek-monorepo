import 'dotenv/config';
import { MeiliSearch, Synonyms } from 'meilisearch';
import { SelectVacature } from '../../../../packages/ggz-drizzle/src/schema.js';
import { bulkUpsertVacatures } from '@ggzoek/ggz-drizzle/src/vacatures.js';

const url = process.env.MEILISEARCH_URL;
const key = process.env.MEILISEARCH_KEY;

if (!url || !key) {
  throw new Error('Missing MEILISEARCH_URL or MEILISEARCH_KEY');
}

const FACETS = [
  'organisatie',
  'minSalaris',
  'maxSalaris',
  'locaties',
  'contract',
  'minSchaal',
  'maxSchaal',
  'beroepen',
  'aandachtsgebieden',
  'therapievormen',
  'minUren',
  'maxUren'
];

export const client = new MeiliSearch({
  host: url,
  apiKey: key
});

export async function indexVacatures(vacatures: SelectVacature[]) {
  const index = client.index('vacatures');
  await index.updateFilterableAttributes([...FACETS]);
  return await index.addDocuments(vacatures, { primaryKey: 'urlHash' });
}

export async function updateSynonyms(synonyms: Synonyms) {
  return await client.index('vacatures').updateSynonyms(synonyms);
}

export async function getSynonyms() {
  return await client.index('vacatures').getSynonyms();
}

export async function getTask(id: number) {
  return await client.getTask(id);
}

export async function updateFilters() {
  const index = client.index('vacatures');
  const filterableAttributes = [...FACETS, '_geo'];
  return await index.updateFilterableAttributes(filterableAttributes);
}

async function search(query: string, filters?: string) {
  const index = client.index('vacatures');
  return await index.search(query, { facets: FACETS, filter: filters });
}

export async function getVacaturesNearby(lat: number, lon: number, radius: number) {
  const index = client.index('vacatures');
  return await index.search('', {
    filter: `_geoRadius(${lat},${lon},${radius})`
  });
}

export async function deleteIndex() {
  const index = client.index('vacatures');
  return await index.delete();
}

export async function createIndex() {
  return await client.createIndex('vacatures');
}

// console.log(await deleteIndex())
// console.log(await deleteIndex())
// console.log(await search("altrecht", "stoornissen = 'autisme'"))
await updateFilters();

export async function restoreSummaryFromIndex() {
  const index = client.index('vacatures');
  const docs = await index.getDocuments({ fields: ['summary', 'urlHash'], limit: 5000 });
  console.log(docs.results.length);
  let updated = 0;
  while (updated < docs.results.length) {
    const vacatureBatch = [...docs.results.slice(updated, updated + 100)];
    const result = await bulkUpsertVacatures(vacatureBatch);
    console.log(`Updated ${updated + vacatureBatch.length} of ${docs.results.length}`);
    updated += 100;
  }
  process.exit(0);
}
