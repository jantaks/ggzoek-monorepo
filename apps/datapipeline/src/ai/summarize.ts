import { Vacature } from './types.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { summarize as OpenAi } from './openAi.js';
import { summarize as Antropic } from './anthropic.js';
import {
  insertSchema,
  InsertVacature,
  SelectVacature
} from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import vacatures from '../../../../packages/ggz-drizzle/src/vacatures.js';

function getSummaryFunction(provider: Provider) {
  switch (provider) {
    case Provider.OPENAI:
      return OpenAi;
    case Provider.ANTHROPIC:
      return Antropic;
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
}

function createCompletionTask(vacature: SelectVacature, provider: Provider) {
  const summarize = getSummaryFunction(provider);
  return async () => {
    const json = await summarize(vacature);
    if (!json) return;
    const maybeVacature = JSON.parse(json) as Vacature;
    maybeVacature.url = vacature.url;
    maybeVacature.urlHash = vacature.urlHash;
    maybeVacature.organisatie = vacature.organisatie;
    maybeVacature.professie = vacature.professie;
    const completedVacature = insertSchema.parse(maybeVacature);
    log.info(`Upserting vacature ${completedVacature.url}`);
    await vacatures.upsert(completedVacature as unknown as InsertVacature);
  };
}

export enum Provider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini'
}

export async function summarizeVacatures(vacatures: SelectVacature[], provider: Provider) {
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const tasks = vacatures.map((vacature) => createCompletionTask(vacature, provider));
  const results = [];

  while (tasks.length > 0) {
    const currentTasks = [];
    const batchSize = 2;
    for (let i = 0; i < batchSize && tasks.length > 0; i++) {
      const task = tasks.pop();
      if (task) {
        currentTasks.push(task());
      }
    }

    results.push(...(await Promise.all(currentTasks)));

    if (tasks.length > 0) {
      log.info(`Waiting for 10 seconds before continuing...`);
      await delay(10000); // Wait for 1 minute (60000 milliseconds)
    }
  }

  return results;
}
