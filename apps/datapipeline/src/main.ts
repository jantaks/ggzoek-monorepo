import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { crawlAltrecht } from './scrapers/cheerio/altrecht.js';
import { crawlParnassia } from './scrapers/playwright/parnassia.js';
import { crawlPluryn } from './scrapers/playwright/pluryn.js';

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
await crawlAltrecht()