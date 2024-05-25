import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from '@ggzoek/logging/src/logger.js';

// import { Lentis } from './scrapers/playwright/lentis.js';
// import { Mediant } from './scrapers/cheerio/mediant.js';
// import { Mondriaan } from './scrapers/cheerio/mondriaan.js';
// import { OostBrabant } from './scrapers/cheerio/oost-brabant.js';
// import { Propersona } from './scrapers/cheerio/propersona.js';
// import { GGZWNB } from './scrapers/playwright/ggzwnb.js';
// import { GGZE } from './scrapers/playwright/ggze.js';
// import { ARKIN } from './scrapers/playwright/arkin.js';
// import { GGZCentraal } from './scrapers/playwright/ggz-centraal.js';
// import { Parnassia } from './scrapers/playwright/parnassia.js';
// import { Pluryn } from './scrapers/playwright/pluryn.js';
// import { RVA } from './scrapers/playwright/reiniervanarkel.js';
// import { Rivierduinen } from './scrapers/playwright/rivierduinen.js';
// import { Yulius } from './scrapers/playwright/yulius.js';
// import { VIGO } from './scrapers/playwright/vigo.js';
// import { IHUB } from './scrapers/cheerio/ihub.js';
// import { GGZFriesland } from './scrapers/cheerio/ggzfriesland.js';
// import { GGZNHN } from './scrapers/cheerio/ggz-nh.js';
// import { GGNet } from './scrapers/cheerio/ggnet.js';
// import { Emergis } from './scrapers/cheerio/emergis.js';
// import { Dimence } from './scrapers/cheerio/dimence.js';
// import { Delfland } from './scrapers/cheerio/delfland.js';
import { Breburg } from './scrapers/playwright/breburg.js';
// import { Altrecht } from './scrapers/cheerio/altrecht.js';


function removeStorageFolder(){
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const storageFolderPath = path.join(__dirname, '../storage');
  if (fs.existsSync(storageFolderPath)) {
    log.info('Removing storage folder')
    fs.rmSync(storageFolderPath, { recursive: true, force: true });
  }
}

removeStorageFolder()

// async function runAll(){
//   await Promise.all(
//   [
//     OostBrabant.crawl(),
//     Propersona.crawl(),
//     Yulius.crawl(),
//     Lentis.crawl(),
//     Mediant.crawl(),
//     Mondriaan.crawl(),
//     GGZWNB.crawl(),
//     ARKIN.crawl(),
//     GGZCentraal.crawl(),
//     Parnassia.crawl(),
//     Pluryn.crawl(),
//     RVA.crawl(),
//     Rivierduinen.crawl(),
//     VIGO.crawl(),
//     GGZE.crawl(),
//     IHUB.crawl(),
//     GGZFriesland.crawl(),
//     GGZNHN.crawl(),
//     GGNet.crawl(),
//     Emergis.crawl(),
//     Dimence.crawl(),
//     Delfland.crawl(),
//     Breburg.crawl(),
//     Altrecht.crawl()
//   ]
// )
// }


await Breburg.crawl()