import { log } from '@ggzoek/logging/src/logger.js';
import vacatures from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { Provider, summarizeVacatures } from './ai/summarize.js';

const step_3 = async () => {
  log.info('Summarizing vacatures');
  const vacaturesToSummarize = (await vacatures.getVacaturesToSummarize()).slice(0, 2);
  log.info(`Found ${vacaturesToSummarize.length} vacatures to summarize`);
  await summarizeVacatures(vacaturesToSummarize, Provider.ANTHROPIC);
};

step_3();
