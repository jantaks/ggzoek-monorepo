import { Dataset, Dictionary, KeyValueStore, Request } from 'crawlee';
import { createHash } from '../utils.js';
import { Vacature } from '../summarize.js';
import path from 'node:path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import {  MinimumVacature } from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import { getVacature, upsertVacature } from '@ggzoek/ggz-drizzle/src/vacatureRepo.js';
import { getBeroepen } from '../beroepen.js';
import { log } from '@ggzoek/logging/src/logger.js';


export type Data = {
  request: Request<Dictionary>
  body: string,
  title: string,
}

// Sla de gescrapete vacature op of update deze obv de volgende regels:
// 1 Sla de gehele vacature op als deze nog niet bestaat in de database (obv urlHash)
// 2 Als de vacature al bestaat in de database, bewaar de timestamp van de eerste keer dat deze is opgeslagen
// 3 Als de bodyhash is gewijzigd, verander de synced status naar false
export async function saveToDb(organisatie: string, data: Data) {
  const vacature: MinimumVacature = {
    organisatie: organisatie,
    title: data.title,
    body: data.body,
    url: data.request.loadedUrl as string,
    urlHash: createHash(data.request.uniqueKey),
    bodyHash: createHash(data.body),
    timestamp: new Date(),
    lastScraped: new Date(),
    professie: getBeroepen(data.title)
  };

  const stored = await getVacature(vacature.urlHash);
  if (stored) {
    log.info(`Vacature ${vacature.url} already exists, last scraped at ${stored.lastScraped}`);
    vacature.timestamp = stored.timestamp;
  }
  upsertVacature(vacature).then(() => log.info(`Vacature ${vacature.url} saved`));
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
      timestamp: new Date(),
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

async function getCompletedVacatures() {
  const dirPath = path.join(process.cwd(), '/storage/completions');
  const files = await fsPromises.readdir(dirPath);
  const vacatures: Vacature[] = [];
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileContents = await fsPromises.readFile(filePath, 'utf-8');
    const vacature = JSON.parse(fileContents);
    vacatures.push(vacature);
  }
  return vacatures;
}

async function storeCompletions(vacature: Vacature) {
  const vacatureJson = JSON.stringify(vacature, null, 2);
  const dirPath = path.join(process.cwd(), '/storage/completions');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const outputPath = path.join(dirPath, `${vacature.organisatie}_${vacature?.urlHash}.json`);
  await fsPromises.writeFile(outputPath, vacatureJson);
}

async function storeAllCompletions(vacatures: Vacature[]) {
  for (const vacature of vacatures) {
    await storeCompletions(vacature);
  }
}

export const storage = {
  getVacaturesFromKVS,
  getCompletedVacatures,
  storeAllCompletions: storeAllCompletions,
  saveData: store('json_files'),
  saveToDb: saveToDb
};
