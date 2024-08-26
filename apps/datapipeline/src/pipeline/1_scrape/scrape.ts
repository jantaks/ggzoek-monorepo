import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from '@ggzoek/logging/src/logger.js';
import 'dotenv/config';
import { Breburg } from '../../scrapers/playwright/breburg.js';
import { Parnassia } from '../../scrapers/playwright/parnassia.js';
import { Pluryn } from '../../scrapers/playwright/pluryn.js';
import { Rivierduinen } from '../../scrapers/playwright/rivierduinen.js';
import { GGZCentraal } from '../../scrapers/playwright/ggz-centraal.js';
import { Lentis } from '../../scrapers/playwright/lentis.js';
import { Altrecht } from '../../scrapers/cheerio/altrecht.js';
import { OostBrabant } from '../../scrapers/cheerio/oost-brabant.js';
import { Propersona } from '../../scrapers/cheerio/propersona.js';
import { Yulius } from '../../scrapers/playwright/yulius.js';
import { Mediant } from '../../scrapers/cheerio/mediant.js';
import { Mondriaan } from '../../scrapers/cheerio/mondriaan.js';
import { GGZWNB } from '../../scrapers/playwright/ggzwnb.js';
import { ARKIN } from '../../scrapers/playwright/arkin.js';
import { RVA } from '../../scrapers/playwright/reiniervanarkel.js';
import { VIGO } from '../../scrapers/playwright/vigo.js';
import { GGZE } from '../../scrapers/playwright/ggze.js';
import { IHUB } from '../../scrapers/cheerio/ihub.js';
import { GGZFriesland } from '../../scrapers/cheerio/ggzfriesland.js';
import { GGZNHN } from '../../scrapers/cheerio/ggz-nh.js';
import { GGNet } from '../../scrapers/cheerio/ggnet.js';
import { Emergis } from '../../scrapers/cheerio/emergis.js';
import { Dimence } from '../../scrapers/cheerio/dimence.js';
import { Delfland } from '../../scrapers/cheerio/delfland.js';
import { Drenthe } from '../../scrapers/cheerio/ggz_drenthe.js';
import { DFZS } from '../../scrapers/playwright/dfzs.js';
import { Tactus } from '../../scrapers/playwright/tactus.js';
import { Karakter } from '../../scrapers/cheerio/karakter.js';
import { METGGZ } from '../../scrapers/playwright/metggz.js';
import { Novadic } from '../../scrapers/cheerio/novadic.js';
import { Accare } from '../../scrapers/cheerio/accare.js';
import { Viersprong } from '../../scrapers/cheerio/viersprong.js';
import { MentalCareGroup } from '../../scrapers/playwright/mentalcarebv.js';
import { Rooysewissel } from '../../scrapers/cheerio/rooysewissel.js';
import { Eleos } from '../../scrapers/cheerio/eleos.js';
import { DeHoop } from '../../scrapers/cheerio/dehoop.js';
import { Iriszorg } from '../../scrapers/playwright/iriszorg.js';
import { Molemann } from '../../scrapers/playwright/molemann.js';
import { checkbox } from '@inquirer/prompts';

function removeStorageFolder() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const storageFolderPath = path.join(__dirname, '../storage');
  if (fs.existsSync(storageFolderPath)) {
    log.info('Removing storage folder');
    fs.rmSync(storageFolderPath, { recursive: true, force: true });
  }
}

const crawlers = [
  OostBrabant,
  Propersona,
  Yulius,
  Lentis,
  Mediant,
  Mondriaan,
  GGZWNB,
  ARKIN,
  GGZCentraal,
  Parnassia,
  Pluryn,
  RVA,
  Rivierduinen,
  VIGO,
  GGZE,
  IHUB,
  GGZFriesland,
  GGZNHN,
  GGNet,
  Emergis,
  Dimence,
  Delfland,
  Breburg,
  Altrecht,
  Drenthe,
  DFZS,
  Tactus,
  Karakter,
  METGGZ,
  Novadic,
  Accare,
  MentalCareGroup,
  Viersprong,
  Rooysewissel,
  Eleos,
  DeHoop,
  Iriszorg,
  Molemann
];

removeStorageFolder();
const choices = crawlers
  .map((crawler) => {
    return {
      value: crawler.name
    };
  })
  .sort((a, b) => a.value.localeCompare(b.value));

const selectedCrawlers = await checkbox({
  message: 'Welke scrapers wil je runnen?',
  choices: choices,
  loop: false,
  pageSize: 20
});

const crawlersToRun = crawlers.filter((crawler) => selectedCrawlers.includes(crawler.name));
for (const crawler of crawlersToRun) {
  log.info(`Running ${crawler.name}`);
  crawler.crawl().then(() => {
    log.info(`Finished ${crawler.name}`);
  });
}
