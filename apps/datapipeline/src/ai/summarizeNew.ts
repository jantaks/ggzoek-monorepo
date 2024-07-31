import { default as OpenAi } from './openAi.js';
import { default as Anthropic } from './anthropic.js';
import { insertSchema, InsertVacature, SelectVacature } from 'packages/ggz-drizzle/src/schema.js';
import vacatures from '../../../../packages/ggz-drizzle/src/vacatures.js';
import { extractDataPrompt, summarizePrompt } from './promptTemplates.js';
import pMap from 'p-map';
import { log } from '@ggzoek/logging/src/logger.js';

export type Sender = (prompt: string) => Promise<CompletionResult>;

export type LLM = {
  provider: 'ANTHROPIC' | 'OPENAI';
  model: OpenAIModels | AnthropicModels;
};

export type CompletionResult = {
  content: string;
  cost: number;
};

export type OpenAIModels = 'gpt-4o' | 'gpt-4o-2024-05-13' | 'gpt-3.5-turbo';
export type AnthropicModels =
  | 'claude-3-opus-20240229' //gold
  | 'claude-3-sonnet-20240229' //silver
  | 'claude-3-haiku-20240307'; // bronze

function getSender(llm: LLM): Sender {
  switch (llm.provider) {
    case 'OPENAI':
      return OpenAi(llm.model);
    case 'ANTHROPIC':
      return Anthropic(llm.model as AnthropicModels);
    default:
      throw new Error(`Provider ${llm} not supported`);
  }
}

const summarizeMapper = (provider: LLM) => async (vacature: SelectVacature) => {
  const sendRequest = getSender(provider);
  const result = await sendRequest(summarizePrompt(vacature));
  if (!result) return;
  log.silly(result);
  vacature.summary = result.content;
  vacature.summaryModel = provider.model;
  vacature.summaryCost = String(result.cost);
  vacature.summaryTimestamp = new Date();
  await vacatures.upsert(vacature as unknown as InsertVacature);
};

const extractDataMapper = (provider: LLM) => async (vacature: SelectVacature) => {
  const sendRequest = getSender(provider);
  const result = await sendRequest(extractDataPrompt(vacature));
  if (!result) return;
  const text = result.content;
  const json = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const maybeVacature = JSON.parse(json) as InsertVacature;
  maybeVacature.url = vacature.url;
  maybeVacature.urlHash = vacature.urlHash;
  maybeVacature.organisatie = vacature.organisatie;
  maybeVacature.professie = vacature.professie;
  maybeVacature.extractionModel = provider.model;
  maybeVacature.extractionCost = String(result.cost);
  maybeVacature.extractionTimestamp = new Date();
  if (!maybeVacature.summary) {
    maybeVacature.summary = '';
  }
  const augmentedVacature = insertSchema.parse(maybeVacature);
  await vacatures.upsert(augmentedVacature as unknown as InsertVacature);
};

export async function extractData(vacatures: SelectVacature[], provider: LLM) {
  const result = await pMap(vacatures, extractDataMapper(provider), { concurrency: 3 });
  console.log(result);
}

export async function summarize(vacatures: SelectVacature[], provider: LLM) {
  const result = await pMap(vacatures, summarizeMapper(provider), { concurrency: 2 });
  console.log(result);
}
