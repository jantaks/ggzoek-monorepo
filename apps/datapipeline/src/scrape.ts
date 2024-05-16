// For more information, see https://crawlee.dev/
import {
  CheerioCrawler,
  CheerioCrawlingContext,
  PlaywrightCrawler,
  PlaywrightCrawlingContext,
  RouterHandler
} from 'crawlee';

import dotenv from 'dotenv';
import { arkinRouter } from './scrapers/playwright/arkin.js';
import { rvaRouter } from './scrapers/playwright/reiniervanarkel.js';
import { GGZFrieslandrouter } from './scrapers/cheerio/ggzfriesland.js';
import { ggznhnRouter } from './scrapers/cheerio/ggz-nh.js';
import { breburgRouter } from './scrapers/cheerio/breburg.js';
import { dimenceRouter } from './scrapers/cheerio/dimence.js';
import { lentisRouter } from './scrapers/cheerio/lentis.js';
import { yuliusRouter } from './scrapers/playwright/yulius.js';
import { oostBrabantRouter } from './scrapers/cheerio/oost-brabant.js';
import { emergisRouter } from './scrapers/cheerio/emergis.js';
import { propersonaRouter } from './scrapers/cheerio/propersona.js';
import { ggzCentraalRouter } from './scrapers/playwright/ggz-centraal.js';
import { crawlGGNET } from './scrapers/cheerio/ggnet.js';
import { crawlMondriaan } from './scrapers/cheerio/mondriaan.js';
import { crawlDelfland } from './scrapers/cheerio/delfland.js';
import { crawlIngeest } from './scrapers/cheerio/ingeest.js';
import { Parnassia } from './scrapers/playwright/parnassia.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { Pluryn } from './scrapers/playwright/pluryn.js';
import { Altrecht } from './scrapers/cheerio/altrecht.js';
import { defaultConfig, defaultOptions } from './scrapers/crawlers.js';
import { GGZE } from './scrapers/playwright/ggze.js';

dotenv.config();

export function buildPlaywright(name: string, router: RouterHandler<PlaywrightCrawlingContext>) {
  const config = defaultConfig(name);
  const options = defaultOptions();
  return new PlaywrightCrawler({ ...options, requestHandler: router }, config);
}

export function buildCheerio(name: string, router: RouterHandler<CheerioCrawlingContext>) {
  const config = defaultConfig(name);
  const options = defaultOptions();
  return new CheerioCrawler({ ...options, requestHandler: router }, config);
}

export async function runCrawlers() {
  const arkinCrawler = buildPlaywright('arkin', arkinRouter);
  const rvaCrawler = buildPlaywright('rva', rvaRouter);
  const ggzFrieslandCrawler = buildCheerio('ggzfriesland', GGZFrieslandrouter);
  const ggzNhnCrawler = buildCheerio('ggznhn', ggznhnRouter);
  const breburgCrawler = buildCheerio('breburg', breburgRouter);
  const dimenceCrawler = buildCheerio('dimence', dimenceRouter);
  const lentisCrawler = buildCheerio('lentis', lentisRouter);
  const yuliusCrawler = buildPlaywright('yulius', yuliusRouter);
  const ooostBrabantCrawler = buildCheerio('oost-brabant', oostBrabantRouter);
  const emergisCrawler = buildCheerio('emergis', emergisRouter);
  const propersonaCrawler = buildCheerio('propersona', propersonaRouter);
  const ggzCentraalCrawler = buildPlaywright('ggz-centraal', ggzCentraalRouter);


  await Promise.all(
    [
      arkinCrawler.run(['https://werkenbijarkin.nl/vacatures/']),
      rvaCrawler.run(['https://www.reinierwerktenleert.nl/vacatures/']),
      ggzFrieslandCrawler.run(['https://www.werkenbijggzfriesland.nl/vacatures/']),
      ggzNhnCrawler.run(['https://www.ggz-nhn.nl/werkenbij']),
      breburgCrawler.run(['https://www.werkenbijggzbreburg.nl/']),
      dimenceCrawler.run(['https://www.werkenbijdimence.nl/vacatures?page=0']),
      lentisCrawler.run(['https://www.werkenbijlentis.nl/vacatures/']),
      yuliusCrawler.run(['https://www.werkenbijyulius.nl/vacatures/']),
      ooostBrabantCrawler.run(['https://ggzoostbrabant.recruitee.com']),
      emergisCrawler.run(['https://werkenbijemergis.nl/vacatures']),
      propersonaCrawler.run(['https://www.werkenbijpropersona.nl/vacature-overzicht/']),
      ggzCentraalCrawler.run(['https://www.werkenbijggzcentraal.nl/vacatures']),
      // crawlRivierduinen(),
      crawlGGNET(),
      crawlMondriaan(),
      crawlDelfland(),
      crawlIngeest(),
      Parnassia.crawl(),
      Altrecht.crawl(),
      Pluryn.crawl(),
      GGZE.crawl()
    ]
  );

  log.info('All crawlers have finished');
}

