import { describe, expect, it } from 'vitest';
import { randomItems } from '../../utils.js';
import  fs from 'fs';
import { log } from '@ggzoek/logging/src/logger.js';
import { procesRawCompletionResult } from '../anthropic.js';
import Anthropic from '@anthropic-ai/sdk';
import Message = Anthropic.Message;


const response = fs.readFileSync('src/ai/test/ant.json').toString();


describe('creates a valid Vacature object from a completion response', () => {
  it('should do the right thing', () => {

  });
})