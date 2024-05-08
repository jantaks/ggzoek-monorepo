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
import { ggznhnRouter } from './scrapers/ggz-nh.js';
import { breburgRouter } from './scrapers/breburg.js';
import { dimenceRouter } from './scrapers/dimence.js';
import { lentisRouter } from './scrapers/lentis.js';
import { yuliusRouter } from './scrapers/yulius.js';
import { oostBrabantRouter } from './scrapers/oost-brabant.js';
import { emergisRouter } from './scrapers/emergis.js';
import { propersonaRouter } from './scrapers/propersona.js';

dotenv.config();

async function getConfig(name: string) {
  const requestQueue = await RequestQueue.open(name);
  const config = new Configuration({
    persistStateIntervalMillis: 30_000,
    purgeOnStart: true,
    defaultKeyValueStoreId: name,
    defaultDatasetId: name,
    headless: true
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
  const ggzNhnCrawler = await buildCheerio('ggznhn', ggznhnRouter);
  const breburgCrawler = await buildCheerio('breburg', breburgRouter);
  const dimenceCrawler = await buildCheerio('dimence', dimenceRouter);
  const lentisCrawler = await buildCheerio('lentis', lentisRouter);
  const yuliusCrawler = await buildPlaywright('yulius', yuliusRouter);
  const ooostBrabantCrawler = await buildCheerio('oost-brabant', oostBrabantRouter);
  const emergisCrawler = await buildCheerio('emergis', emergisRouter);
  const propersonaCrawler = await buildCheerio('propersona', propersonaRouter);

  await Promise.all(
    [
      // parnassiaCrawler.run(['https://werkenbijparnassiagroep.nl/home']),
      // arkinCrawler.run(['https://werkenbijarkin.nl/vacatures/']),
      // rvaCrawler.run(['https://www.reinierwerktenleert.nl/vacatures/']),
      // altrechtCrawler.run(['https://www.werkenbijaltrecht.nl/vacatures/']),
      // ggzFrieslandCrawler.run(['https://www.werkenbijggzfriesland.nl/vacatures/'])
      // ggzNhnCrawler.run(['https://www.ggz-nhn.nl/werkenbij']),
      // breburgCrawler.run(['https://www.werkenbijggzbreburg.nl/']),
      // dimenceCrawler.run(['https://www.werkenbijdimence.nl/vacatures?page=0'])
      // lentisCrawler.run(['https://www.werkenbijlentis.nl/vacatures/']),
      // yuliusCrawler.run(['https://www.werkenbijyulius.nl/vacatures/']),
      // ooostBrabantCrawler.run(['https://ggzoostbrabant.recruitee.com']),
      // emergisCrawler.run(['https://werkenbijemergis.nl/vacatures']),
      propersonaCrawler.run(['https://www.werkenbijpropersona.nl/vacature-overzicht/'])
    ]
  );
}

