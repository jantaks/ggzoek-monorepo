import { log } from '@ggzoek/logging/src/logger.js';
import { default as OpenAi } from './openAi.js';
import { default as Antropic } from './anthropic.js';
import {
  insertSchema,
  InsertVacature,
  SelectVacature
} from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import vacatures from '../../../../packages/ggz-drizzle/src/vacatures.js';
import { extractDataPrompt, summarizePrompt } from './promptTemplates.js';

export type Sender = (vacature: SelectVacature, prompt: string) => Promise<string | undefined>;

function getSender(provider: Provider): Sender {
  switch (provider) {
    case Provider.OPENAI:
      return OpenAi;
    case Provider.ANTHROPIC:
      return Antropic;
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
}

async function summarizeTask(vacature: SelectVacature, provider: Provider) {
  return createCompletionTask(vacature, provider, extractDataPrompt);
}

async function getDataTask(vacature: SelectVacature, provider: Provider) {
  return await createCompletionTask(vacature, provider, summarizePrompt);
}

function createCompletionTask(
  vacature: SelectVacature,
  provider: Provider,
  promptBuilder: typeof summarizePrompt
) {
  const sendRequest = getSender(provider);
  return async () => {
    const json = await sendRequest(vacature, promptBuilder(vacature));
    if (!json) return;
    const maybeVacature = JSON.parse(json) as InsertVacature;
    maybeVacature.url = vacature.url;
    maybeVacature.urlHash = vacature.urlHash;
    maybeVacature.organisatie = vacature.organisatie;
    maybeVacature.professie = vacature.professie;
    if (!maybeVacature.summary) {
      maybeVacature.summary = '';
    }
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

async function createTasks(vacatures: SelectVacature[], provider: Provider) {
  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const tasks = vacatures.map((vacature) => summarizeTask(vacature, provider));
  const results = [];

  while (tasks.length > 0) {
    const currentTasks: Promise<() => Promise<void>>[] = [];
    const batchSize = 2;
    for (let i = 0; i < batchSize && tasks.length > 0; i++) {
      const task = tasks.pop();
      if (task) {
        currentTasks.push(task);
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

export async function summarizeVacatures(vacatures: SelectVacature[], provider: Provider) {
  return await createTasks(vacatures, provider);
}
