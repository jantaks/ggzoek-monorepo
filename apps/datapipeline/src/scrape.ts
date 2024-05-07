// For more information, see https://crawlee.dev/
import {
  CheerioCrawler,
  CheerioCrawlingContext,
  Configuration,
  PlaywrightCrawler,
  PlaywrightCrawlingContext,
  RequestQueue,
  RouterHandler
} from 'crawlee';

import dotenv from 'dotenv';
import { arkinRouter } from './scrapers/arkin.js';
import { parnassiaRouter } from './scrapers/parnassia.js';
import { rvaRouter } from './scrapers/reiniervanarkel.js';
import { altrechtRouter } from './scrapers/altrecht.js';
import { localstorage } from './services/localstorage.js';
import { GGZFrieslandrouter } from './scrapers/ggzfriesland.js';

dotenv.config();

async function getConfig(name: string) {
  const requestQueue = await RequestQueue.open(name);
  const config = new Configuration({
    persistStateIntervalMillis: 30_000,
    purgeOnStart: true,
    defaultKeyValueStoreId: name,
    defaultDatasetId: name,
    headless: false
  });
  const options = {
    maxRequestsPerCrawl: 20,
    requestQueue: requestQueue
  };
  return { config, options };
}

async function buildPlaywright(name: string, router: RouterHandler<PlaywrightCrawlingContext>) {
  const { config, options } = await getConfig(name);
  return new PlaywrightCrawler({ ...options, requestHandler: router }, config);
}

async function buildCheerio(name: string, router: RouterHandler<CheerioCrawlingContext>) {
  const { config, options } = await getConfig(name);
  return new CheerioCrawler({ ...options, requestHandler: router }, config);
}

export async function runCrawlers() {
  const parnassiaCrawler = await buildPlaywright('parnassia', parnassiaRouter);
  const arkinCrawler = await buildPlaywright('arkin', arkinRouter);
  const rvaCrawler = await buildPlaywright('rva', rvaRouter);
  const altrechtCrawler = await buildCheerio('altrecht', altrechtRouter);
  const ggzFrieslandCrawler = await buildCheerio('ggzfriesland', GGZFrieslandrouter);

  await Promise.all(
    [
      parnassiaCrawler.run(['https://werkenbijparnassiagroep.nl/home']),
      arkinCrawler.run(['https://werkenbijarkin.nl/vacatures/']),
      rvaCrawler.run(['https://www.reinierwerktenleert.nl/vacatures/']),
      altrechtCrawler.run(['https://www.werkenbijaltrecht.nl/vacatures/']),
      ggzFrieslandCrawler.run(['https://www.werkenbijggzfriesland.nl/vacatures/'])
    ]
  );
}

