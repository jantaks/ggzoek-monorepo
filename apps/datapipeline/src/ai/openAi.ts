import OpenAI from 'openai';
import dotenv from 'dotenv';
import 'dotenv/config';
import { log } from '@ggzoek/logging/src/logger.js';
import { ChatCompletion } from 'openai/resources/index';
import { LLM } from './summarizeNew.js';

dotenv.config();

const openai = new OpenAI();

const sender = (model: LLM['model']) => async (prompt: string) => {
  let completion: ChatCompletion | undefined = undefined;
  try {
    completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: model,
      response_format: { type: 'json_object' }
    });
  } catch (error) {
    log.error(error);
    return '';
  }
  return completion.choices[0].message.content;
};

export default sender;
