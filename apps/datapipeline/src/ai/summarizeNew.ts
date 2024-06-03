import { default as OpenAi } from './openAi.js';
import { default as Antropic } from './anthropic.js';
import {
  insertSchema,
  InsertVacature,
  SelectVacature
} from '@ggzoek/ggz-drizzle/drizzle/schema.js';
import vacatures from '../../../../packages/ggz-drizzle/src/vacatures.js';
import { extractDataPrompt, summarizePrompt } from './promptTemplates.js';
import pMap from 'p-map';

export type Sender = (prompt: string) => Promise<string | undefined>;

export enum Provider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini'
}

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

type Task = (vacature: SelectVacature, provider: Provider) => Promise<void>;

async function summarizeTask(vacature: SelectVacature, provider: Provider) {
  const sendRequest = getSender(provider);
  const result = await sendRequest(summarizePrompt(vacature));
  if (!result) return;
  vacature.summary = result;
  await vacatures.upsert(vacature as unknown as InsertVacature);
}

async function extractDataTask(vacature: SelectVacature, provider: Provider) {
  const sendRequest = getSender(provider);
  const result = sendRequest(extractDataPrompt(vacature));
  if (!result) return;
  const maybeVacature = JSON.parse(result) as InsertVacature;
  maybeVacature.url = vacature.url;
  maybeVacature.urlHash = vacature.urlHash;
  maybeVacature.organisatie = vacature.organisatie;
  maybeVacature.professie = vacature.professie;
  if (!maybeVacature.summary) {
    maybeVacature.summary = '';
  }
  const augmentedVacature = insertSchema.parse(maybeVacature);
  await vacatures.upsert(augmentedVacature as unknown as InsertVacature);
}

const extractDataMapper = (provider: Provider) => async (vacature: SelectVacature) => {
  const sendRequest = getSender(provider);
  const result = await sendRequest(extractDataPrompt(vacature));
  if (!result) return;
  const maybeVacature = JSON.parse(result) as InsertVacature;
  maybeVacature.url = vacature.url;
  maybeVacature.urlHash = vacature.urlHash;
  maybeVacature.organisatie = vacature.organisatie;
  maybeVacature.professie = vacature.professie;
  if (!maybeVacature.summary) {
    maybeVacature.summary = '';
  }
  const augmentedVacature = insertSchema.parse(maybeVacature);
  await vacatures.upsert(augmentedVacature as unknown as InsertVacature);
};

export async function extractData(vacatures: SelectVacature[], provider: Provider) {
  const result = await pMap(vacatures, extractDataMapper(provider), { concurrency: 3 });
  console.log(result);
}
