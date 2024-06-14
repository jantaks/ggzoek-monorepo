import { log } from '@ggzoek/logging/src/logger.js';
import vacatures from '@ggzoek/ggz-drizzle/src/vacatures.js';
import { summarize } from './ai/openAIV2.js';

const summarizeStep = async () => {
  const vacature = await vacatures.getVacature(
    '497cf144928a98078b7e62d8ee654a648c95330b0ffc8e1f4d3d67275b3ba5d4'
  );
  if (vacature) {
    const result = await summarize(vacature);
    log.info(result!);
  }
};

await summarizeStep();
