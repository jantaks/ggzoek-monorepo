import { runCrawlers } from './scrape.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { indexVacatures } from './services/meilisearch.js';
import { correctSpelling } from './synonyms.js';
import { Vacature } from './ai/types.js';
import { Provider, summarizeVacatures } from './ai/summarize.js';
import vacatures from '../../../packages/ggz-drizzle/src/vacatures.js';

async function step_1() {
  log.info('Running crawlers');
  await runCrawlers();
}

const step_3 = async () => {
  log.info('Summarizing vacatures');
  const vacaturesToSummarize = (await vacatures.getVacaturesToSummarize()) as Vacature[];
  log.info(`Found ${vacaturesToSummarize.length} vacatures to summarize`);
  await summarizeVacatures(vacaturesToSummarize, Provider.ANTHROPIC);
};

const step_4 = async () => {
  await correctSpelling();
};

const step_5 = async () => {
  log.info('Adding vacatures to search index');
  const completed = await vacatures.getUnsyncedVacatures();
  //TODO: set synced to true after indexing
  await indexVacatures(completed);
  for (const vacature of completed) {
    log.info(`Marking ${vacature.url} as synced`);
    await vacatures.upsert({ ...vacature, synced: true });
  }
};

// await step_1()
// await step_2()
await step_3();
// await step_4()
// await step_5().then(closeConnection)



