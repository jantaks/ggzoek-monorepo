import { Dataset, Dictionary, KeyValueStore, Request } from 'crawlee';
import { cleanTitle, createHash, formatDate } from '../utils.js';
import { MinimumVacature } from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import { Vacature } from '../ai/types.js';


type Data = {
  request: Request<Dictionary>
  body: string,
  title: string,
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
  saveData: store('json_files'),
};
