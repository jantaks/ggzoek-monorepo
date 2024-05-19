import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from '@ggzoek/logging/src/logger.js';

import { IHUB } from './scrapers/cheerio/ihub.js';


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
await IHUB.crawl()