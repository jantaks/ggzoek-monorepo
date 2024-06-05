import { log } from '@ggzoek/logging/src/logger.js';
import vacatures from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { summarize } from './ai/openAIV2.js';

const summarizeStep = async () => {
  const vacature = await vacatures.getVacature(
    '2286ff5241e5c86c502846ee9efdcfaeb1106333c528f29206ae8ea4c1dbdbfcer'
  );
  if (vacature) {
    const result = await summarize(vacature);
    log.info(result!);
  }
};

await summarizeStep();
