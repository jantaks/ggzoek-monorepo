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
import { arkinRouter } from './scrapers/playwright/arkin.js';
import { parnassiaRouter } from './scrapers/playwright/parnassia.js';
import { rvaRouter } from './scrapers/playwright/reiniervanarkel.js';
import { altrechtRouter } from './scrapers/cheerio/altrecht.js';
import { GGZFrieslandrouter } from './scrapers/cheerio/ggzfriesland.js';
import { ggznhnRouter } from './scrapers/cheerio/ggz-nh.js';
import { breburgRouter } from './scrapers/cheerio/breburg.js';
import { dimenceRouter } from './scrapers/cheerio/dimence.js';
import { lentisRouter } from './scrapers/cheerio/lentis.js';
import { yuliusRouter } from './scrapers/playwright/yulius.js';
import { oostBrabantRouter } from './scrapers/cheerio/oost-brabant.js';
import { emergisRouter } from './scrapers/cheerio/emergis.js';
import { propersonaRouter } from './scrapers/cheerio/propersona.js';
import { plurynRouter } from './scrapers/playwright/pluryn.js';
import { ggzCentraalRouter } from './scrapers/playwright/ggz-centraal.js';
import { crawlRivierduinen } from './scrapers/playwright/rivierduinen.js';
import { crawlGGZE } from './scrapers/playwright/ggze.js';
import { crawlGGNET } from './scrapers/cheerio/ggnet.js';

dotenv.config();

export function defaultConfig(name: string) {
  return new Configuration({
    persistStateIntervalMillis: 5_000,
    purgeOnStart: true,
    defaultKeyValueStoreId: name,
    defaultDatasetId: name,
  });
}

export async function defaultOptions(name: string) {
  const requestQueue = await RequestQueue.open(name);
  const options = {
    maxRequestsPerCrawl: 1000,
    maxRequestsPerMinute: 300,
    requestQueue: requestQueue
  };
  return options;
}

export async function buildPlaywright(name: string, router: RouterHandler<PlaywrightCrawlingContext>) {
  const config = await defaultConfig(name);
  const options = await defaultOptions(name);
  return new PlaywrightCrawler({ ...options, requestHandler: router }, config);
}

export async function buildCheerio(name: string, router: RouterHandler<CheerioCrawlingContext>) {
  const config = await defaultConfig(name);
  const options = await defaultOptions(name);
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
  const plurynCrawler = await buildPlaywright('pluryn', plurynRouter);
  const ggzCentraalCrawler = await buildPlaywright('ggz-centraal', ggzCentraalRouter);


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
      // propersonaCrawler.run(['https://www.werkenbijpropersona.nl/vacature-overzicht/']),
      // plurynCrawler.run(['https://www.pluryn.nl/werken-bij/vacature?filter=&address=&distance=10000']),
      // ggzCentraalCrawler.run(['https://www.werkenbijggzcentraal.nl/vacatures']),
      crawlRivierduinen(),
      crawlGGZE(),
      crawlGGNET()
    ]
  );
}

