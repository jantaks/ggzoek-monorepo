import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from '@ggzoek/logging/src/logger.js';

import { GGZFriesland } from './scrapers/cheerio/ggzfriesland.js';
import { Dimence } from './scrapers/cheerio/dimence.js';
import { Ingeest } from './scrapers/cheerio/ingeest.js';


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
await Ingeest.crawl()