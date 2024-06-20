import { getSummarizedVacatures, upsert } from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { correctSpelling } from './synonyms.js';
import { SelectVacature } from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import { getGeoPointMultiplePlaatsen } from '@ggzoek/ggz-drizzle/location_data/repo.js';
import inquirer from 'inquirer';

let count = 0;
let updated = 0;

const vacatures = await getSummarizedVacatures({
  summaryAfter: new Date('2024-07-06')
});
const answer = await inquirer.prompt({
  type: 'confirm',
  name: 'continue',
  message: `${vacatures.length} vacatures gevonden om te augmenten. Doorgaan?`
});
if (!answer.continue) {
  process.exit(1);
}
for (const vacature of vacatures) {
  console.log(`Count: ${count} of ${vacatures.length}`);
  let doUpsert = false;
  count++;
  const { vacature: updatedVacature, isUpdated } = correctSpelling(vacature);
  doUpsert = isUpdated;
  if (updatedVacature.locaties) {
    if (!updatedVacature.geoPoint) {
      const geoPoint = await getGeoPointMultiplePlaatsen(updatedVacature.locaties as string[]);
      console.log(`Geopoint for ${updatedVacature.locaties} is ${geoPoint}`);
      updatedVacature.geoPoint = geoPoint;
      doUpsert = true;
    }
  }
  if (doUpsert) {
    updated++;
    console.log(`Updated ${updated}`);
    await upsert(updatedVacature as SelectVacature);
  } else {
    console.log(`No updates needed for ${vacature.url}`);
  }
}
console.log(`Updated ${updated} out of ${count} vacatures`);
