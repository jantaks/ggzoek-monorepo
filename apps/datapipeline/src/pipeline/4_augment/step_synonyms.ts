import { getSummarizedVacatures } from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { correctSpelling } from './synonyms.js';
import { getGeoPointMultiplePlaatsen } from '@ggzoek/ggz-drizzle/dist/location_data/repo.js';
import { confirm } from '@inquirer/prompts';
import { log } from '@ggzoek/logging/src/logger.js';
import { upsert } from '@ggzoek/ggz-drizzle/dist/vacatures.js';
import { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema.js';

let count = 0;
let updated = 0;
const overig: string[] = [];

const vacatures = await getSummarizedVacatures({
  summaryAfter: new Date(Date.now() - 24 * 60 * 60 * 1000)
});
const proceed = await confirm({
  message: `${vacatures.length} vacatures gevonden om te augmenten. Doorgaan?`
});
if (!proceed) {
  process.exit(1);
}

const trialRun = await confirm({
  message: 'Wil je eerst een trial run doen om te kijken of je nieuwe synoniemen moet toevoegen?',
  default: true
});

const geopPoints = await confirm({
  message: 'Wil je ook de geopoints updaten?',
  default: true
});

async function addGeopoint(vacature: Partial<SelectVacature>) {
  let updated = false;
  try {
    if (vacature.locaties) {
      if (!vacature.geoPoint) {
        log.debug(`Getting geopoint ... for ${vacature.locaties}`);
        const geoPoint = await getGeoPointMultiplePlaatsen(vacature.locaties as string[]);
        console.debug(`Geopoint for ${vacature.locaties} is ${geoPoint}`);
        vacature.geoPoint = geoPoint;
        updated = true;
      }
    }
  } catch (e) {
    console.error(`Error in getGeoPointMultiplePlaatsen for ${vacature.url}: ${e}`);
  }
  return { updated };
}

for (const vacature of vacatures) {
  console.log(`Count: ${count} of ${vacatures.length}`);
  count++;
  log.debug(`Processing ${vacature.url}`);
  const { isUpdated, defaultedToOverig } = correctSpelling(vacature);
  overig.push(...defaultedToOverig);
  let geoPointsAdded = false;
  if (geopPoints && !vacature.geoPoint) {
    await addGeopoint(vacature);
    geoPointsAdded = true;
  }

  if (isUpdated || geoPointsAdded) {
    updated++;
    log.info(`Updated ${updated}`);
    if (!trialRun) {
      await upsert(vacature as SelectVacature);
    }
  } else {
    log.debug(`No updates needed for ${vacature.url}`);
  }
}
log.info(`Updated ${updated} out of ${count} vacatures`);
log.info(`${overig.length} items defaulted to overig`);
//sort overig:
overig.sort();
const overigMap: Record<string, number> = {};
for (const item of overig) {
  if (!overigMap[item]) {
    overigMap[item] = 1;
  }
  overigMap[item]++;
}
log.info(overigMap);
