import 'dotenv/config.js';
import { chromium, devices } from 'playwright';
import { upsert } from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { v2 as cloudinary } from 'cloudinary';
import { SelectVacature } from '../../../../../packages/ggz-drizzle/src/schema.js';
import { acceptCookies } from '../../utils.js';

async function createScreenshots(vacatures: SelectVacature[]) {
  const browser = await chromium.launch({ headless: false }); // Or 'firefox' or 'webkit'.
  const context = await browser.newContext(devices['iPhone 11']);

  for (const vacature of vacatures) {
    log.info(`Navigating to ${vacature.url}`);
    const page = await context.newPage();
    if (vacature.url) {
      await page.goto(vacature.url);
      await acceptCookies(page);
      log.info(`Creating screenshot for ${vacature.url}`);
      const file = `./screenshots/img_q50_${vacature.urlHash}.jpg`;
      await page.screenshot({ path: file, type: 'jpeg', quality: 50 });
      const url = await uploadImage(file, vacature.organisatie || 'unknown');
      log.info(`uploaded screenshot to ${url}`);
      if (url) {
        vacature.screenshotUrl = url;
        await upsert(vacature);
      }
    }
  }
  await browser.close();
}

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

// Log the configuration
log.info(cloudinary.config());

const uploadImage = async (imagePath: string, folder: string) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: folder
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    log.debug(`Image ${result.url} uploaded to ${result.folder}`);
    return result.url;
  } catch (error) {
    log.error(error);
    return null;
  }
};
