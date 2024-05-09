import { crawlRivierduinen } from './scrapers/playwright/rivierduinen.js';
import { crawlGGZE } from './scrapers/playwright/ggze.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { crawlGGNET } from './scrapers/cheerio/ggnet.js';
import { crawlMondriaan } from './scrapers/cheerio/mondriaan.js';
import { crawlIngeest } from './scrapers/cheerio/ingeest.js';
import { crawlDelfland } from './scrapers/cheerio/delfland.js';

function removeStorageFolder(){
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const storageFolderPath = path.join(__dirname, '../storage');
  if (fs.existsSync(storageFolderPath)) {
    console.log('Removing storage folder')
    fs.rmSync(storageFolderPath, { recursive: true, force: true });
  }
}

removeStorageFolder()
await crawlDelfland()