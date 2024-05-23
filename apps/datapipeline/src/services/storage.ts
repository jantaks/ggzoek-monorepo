import { Dataset, Dictionary, KeyValueStore, Request } from 'crawlee';
import { createHash } from '../utils.js';
import { InsertVacature, MinimumVacature } from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import { getBeroepen } from '../beroepen.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { Vacature } from '../ai/types.js';
import repo from '../../../../packages/ggz-drizzle/src/repo.js';


export type Data = {
  request: Request<Dictionary>
  body: string,
  title: string,
}

//TODO:  3 Als de bodyhash is gewijzigd, verander de synced status naar false
export async function saveToDb(organisatie: string, data: Data) {
  const vacature: InsertVacature = {
    organisatie: organisatie,
    title: data.title,
    body: data.body,
    url: data.request.loadedUrl as string,
    urlHash: createHash(data.request.uniqueKey),
    bodyHash: createHash(data.body),
    firstScraped: new Date(),
    lastScraped: new Date(),
    professie: getBeroepen(data.title),
    summary: null
  };

  const stored = await repo.getVacature(vacature.urlHash);
  if (stored) {
    log.debug(`Vacature ${vacature.url} already exists, last scraped at ${stored.lastScraped}`);
    vacature.firstScraped = stored.firstScraped;
  }
  await repo.upsert(vacature)
}

function store(KVS: string) {
  return async function(label: string, data: Data) {
    const updatedData: MinimumVacature = {
      organisatie: label,
      title: data.title,
      body: data.body,
      url: data.request.loadedUrl as string,
      urlHash: createHash(data.request.uniqueKey),
      bodyHash: createHash(data.body),
      firstScraped: new Date(),
      lastScraped: new Date()
    };
    const dataset = await Dataset.open(label);
    await dataset.pushData(updatedData);
    await dataset.exportToJSON(label, { toKVS: KVS });
  };
}

async function getVacaturesFromKVS(kvsName: string = 'json_files') {
  const store = await KeyValueStore.open(kvsName);
  let vacatures: Vacature[] = [];
  await store.forEachKey(async (key) => {
    const value = await store.getValue(key) as Vacature;
    vacatures = vacatures.concat(value);
  });
  return vacatures;
}

export const storage = {
  getVacaturesFromKVS,
  saveData: store('json_files'),
  saveToDb: saveToDb
};
