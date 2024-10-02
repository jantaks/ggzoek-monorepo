import {
  getMaxSummaryBatchId,
  getVacaturesToSummarize,
  upsert
} from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { summarize } from '../../ai/openAIV2.js';
import pMap from 'p-map';
import { log } from '@ggzoek/logging/src/logger.js';
import inquirer from 'inquirer';

let cost = 0;
let count = 0;
let todo = 0;
const budget = 20;
const lastSummaryBatchId = await getMaxSummaryBatchId();

async function mapper(vacature: any) {
  const updatedVacature = await summarize(vacature, lastSummaryBatchId!);
  cost = cost + Number(updatedVacature.summaryCost);
  count = count + 1;
  todo = todo - 1;
  //formatting the cost to 2 decimal places
  cost = Math.round(cost * 100) / 100;
  //log cost as dollars
  console.log(
    `Count: ${count}\nRemaining:${todo}\nTotal cost: $${cost}\n Average cost: $${cost / count}`
  );
  //kill proces it total cost exceeds budget
  if (cost > budget) {
    console.log(`Total cost exceeded $${budget}. Killing process`);
    process.exit(1);
  }
  await upsert(updatedVacature);
  return updatedVacature;
}

async function stepfunction() {
  const vacatures = (
    await getVacaturesToSummarize({
      professies: [
        'Psychiater',
        'Kinder- & Jeugd Psychiater',
        'Klinisch Psycholoog',
        'GZ-Psycholoog',
        'Verpleegkundig Specialist',
        'Verslavingsarts',
        'Sociaal Psychiatrisch Verpleegkundige',
        'ANIOS',
        'Gedragswetenschapper',
        'Basispsycholoog',
        'Orthopedagoog',
        'Maatschappelijk Werker'
      ],
      organisaties: 'all',
      force: false,
      lastScrapedAfterDays: 1
      // summaryTimeStampBefore: new Date(Date.now() - 24 * 60 * 60 * 1000)
    })
  ).slice(0, 5000);
  todo = vacatures.length;
  const message = `Aantal vacatures om samen te vatten: ${vacatures.length}. Geschatte kosten: ${vacatures.length * 0.02}`;
  log.info(`Next Summary Batch ID: ${(lastSummaryBatchId || 0) + 1}`);
  const answer = await inquirer.prompt({
    type: 'confirm',
    name: 'continue',
    message: `${message}. Doorgaan?`
  });
  if (!answer.continue) {
    process.exit(1);
  }
  const updatedVacatures = await pMap(vacatures, mapper, { concurrency: 20, stopOnError: true });
  console.log(updatedVacatures);
}

stepfunction()
  .then(() => {
    console.log('Summarizing done');
    process.exit(1);
  })
  .catch(console.error);
