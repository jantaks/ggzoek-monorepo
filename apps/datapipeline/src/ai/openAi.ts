import OpenAI from 'openai';
import dotenv from 'dotenv';
import 'dotenv/config';
import { log } from '@ggzoek/logging/src/logger.js';
import { ChatCompletion } from 'openai/resources/index';
import { Cost, Model, Pricing } from './types.js';
import { buildPrompt } from './promptTemplates.js';
import { SelectVacature } from '../../../../packages/ggz-drizzle/drizzle/schema.js';

dotenv.config();

const pricingTable: Record<Model, Pricing> = {
  [Model.GPT35TURBO]: {
    input: 0.0005,
    output: 0.0015
  },
  [Model.GPT4]: {
    input: 0.01,
    output: 0.03
  },
  [Model.GPT4o]: {
    input: 0.005,
    output: 0.015
  }
};

function calculateCost(model: Model, completion: OpenAI.Chat.ChatCompletion): Cost | undefined {
  const pricing = pricingTable[model];
  if (completion.usage === undefined) {
    return undefined;
  }
  const input = (pricing.input * completion.usage.prompt_tokens) / 1000;
  const output = (pricing.output * completion.usage.completion_tokens) / 1000;
  return {
    input,
    output,
    total: input + output
  };
}

const MODEL = Model.GPT4o;
const openai = new OpenAI();

export async function summarize(vacature: SelectVacature) {
  const prompt = buildPrompt(vacature);
  log.info(`Requesting completion for ${vacature.url}`);
  let completion: ChatCompletion | undefined = undefined;
  try {
    completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: MODEL,
      response_format: { type: 'json_object' }
    });
  } catch (error) {
    log.error(error, `Error in completion for ${vacature.url}`);
    return undefined;
  }
  const result = completion.choices[0].message.content;
  if (result) {
    const json = result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1);
    log.debug(`Completion result: ${result}`);
    return json;
  }
  return undefined;
}
