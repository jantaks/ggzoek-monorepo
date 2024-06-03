import { log } from '@ggzoek/logging/src/logger.js';
import vacatures from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { extractData, Provider } from './ai/summarizeNew.js';

const step_3 = async () => {
  log.info('Summarizing vacatures');
  const vacaturesToSummarize = (
    await vacatures.getVacaturesToSummarize({ organisaties: ['Parnassia'] })
  ).slice(0, 10);
  log.info(`Found ${vacaturesToSummarize.length} vacatures to summarize`);
  await extractData(vacaturesToSummarize, Provider.ANTHROPIC);
};

step_3();
