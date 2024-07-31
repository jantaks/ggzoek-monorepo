import { getVacaturesToSync, updateSynced } from '@ggzoek/ggz-drizzle/src/vacatures.js';
import {
  createIndex,
  deleteIndex,
  getTask,
  indexVacatures,
  updateFilters,
  updateSynonyms
} from '../../meilisearch/meilisearch.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { SelectVacature } from 'packages/ggz-drizzle/src/schema.js';
import { EnqueuedTask, Synonyms } from 'meilisearch';
import { createMutualAssociations } from '../../mutualSynonyms.js';
import _ from 'lodash';
import { synonyms } from '../4_augment/synonyms.js';
import { createClient } from '@vercel/kv';

const kv = createClient({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  url: process.env.KV_REST_API_URL!,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  token: process.env.KV_REST_API_TOKEN!
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForTaskCompletion(
  command: () => Promise<EnqueuedTask>,
  taskName: string = 'Task'
) {
  let task = await command();
  const startTime = Date.now();
  const uid = task.taskUid;
  while (task.status !== 'succeeded' && task.status !== 'failed') {
    log.info(`${taskName} still running, waiting 1s`);
    await wait(1000);
    task = (await getTask(uid)) as never as EnqueuedTask;
  }
  if (task.status === 'failed') {
    throw new Error(`${taskName} failed`);
  }
  const endTime = Date.now();
  log.info(`${taskName} completed in ${endTime - startTime}ms`);
}

const mutualSynonyms = _.flatMap(synonyms, (value, key) => {
  log.info(key);
  return createMutualAssociations(value.mappings) as Synonyms;
});

await waitForTaskCompletion(deleteIndex, 'Deleting index');
await waitForTaskCompletion(createIndex, 'Creating index');

mutualSynonyms.forEach(async (mutualSynonyms) => {
  await waitForTaskCompletion(
    () => updateSynonyms(mutualSynonyms as unknown as Synonyms),
    `Updating synonyms: ${mutualSynonyms}`
  );
});

const completed = await getVacaturesToSync({
  limit: 10000,
  organisaties: 'all',
  scrapedAfter: new Date('2024-01-01'),
  minBatchId: 4,
  professies: [
    'Psychiater',
    'Kinder- & Jeugd Psychiater',
    'Klinisch Psycholoog',
    'GZ-Psycholoog',
    'Verpleegkundig Specialist',
    'Verslavingsarts',
    'Sociaal Psychiatrisch Verpleegkundige'
  ]
});
log.info(`Found ${completed.length} vacatures to sync`);
log.info('Adding geopoints (_geo field) to vacatures');
const updated = completed.map(addGeo);
//slice up in chunks of 1000
const chunkSize = 1000;
for (let i = 0; i < updated.length; i += chunkSize) {
  const chunk = updated.slice(i, i + chunkSize);
  await waitForTaskCompletion(
    () => indexVacatures(chunk),
    `Indexing vacatures. Chunk: ${i} - ${i + chunkSize}`
  );
}
await waitForTaskCompletion(updateFilters, 'Updating filters');
log.info('Clearing KV cache');
await kv.flushall(); //TODO: should have a separate KV database for searchResults.
const ids = updated.map((x) => x.urlHash);
log.info('Updating synced');
await updateSynced(ids);
process.exit(1);

type Geo = {
  lat: number;
  lng: number;
};

function addGeo(vacature: SelectVacature): SelectVacature & { _geo?: Geo } {
  function isValidGeopoint(point: string) {
    const parts = point.split(',');
    if (parts.length !== 2) {
      return false;
    }
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (isNaN(lat) || isNaN(lng)) {
      return false;
    }
    if (lat < -90 || lat > 90) {
      return false;
    }
    if (lng < -180 || lng > 180) {
      return false;
    }
    return true;
  }

  if (vacature.geoPoint === null) {
    return vacature;
  }
  if (!isValidGeopoint(vacature.geoPoint)) {
    log.warn(`Invalid geopoint: ${vacature.geoPoint}`);
    return vacature;
  }
  const parts = vacature.geoPoint.split(',');
  const geo: Geo = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) };
  return { ...vacature, _geo: geo };
}
