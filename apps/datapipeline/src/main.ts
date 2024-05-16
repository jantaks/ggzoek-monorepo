import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GGZE } from './scrapers/playwright/ggze.js';
import { log } from '@ggzoek/logging/src/logger.js';
import {getVacaturesToSummarize} from '@ggzoek/ggz-drizzle/src/vacatureRepo.js';


function removeStorageFolder(){
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const storageFolderPath = path.join(__dirname, '../storage');
  if (fs.existsSync(storageFolderPath)) {
    log.info('Removing storage folder')
    fs.rmSync(storageFolderPath, { recursive: true, force: true });
  }
}

// await removeStorageFolder()
// await GGZE.crawl()
// log.info("Crawling completed.")

const vacs = await getVacaturesToSummarize()

log.info(vacs.length)