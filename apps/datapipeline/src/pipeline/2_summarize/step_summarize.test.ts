import { processResponse } from '../../ai/openAIV2.js';
import fs from 'fs';
import { describe, expect, it } from 'vitest';
import path from 'path';

describe('Process copmpletion result', () => {
  it('should process the response correctly', () => {
    const file = path.join(__dirname, 'exampleResponse.txt');
    const testData = fs.readFileSync(file).toString();
    const { summarySection, vacature } = processResponse(testData);
    expect(Object.keys(vacature).length).toBeGreaterThan(0);
    expect(summarySection).toMatch('IrisZorg');
  });
  it('should process response if ``` is missing', () => {
    const file = path.join(__dirname, 'malformedResponse.txt');
    const testData = fs.readFileSync(file).toString();
    const { summarySection, vacature } = processResponse(testData);
    expect(Object.keys(vacature).length).toBeGreaterThan(0);
    expect(summarySection).toMatch('IrisZorg');
    expect(summarySection).not.toMatch('JSON');
    expect(vacature.salarisMin).toEqual(1001);
  });
  it('should should throw an error if JSON can not be found', () => {
    const file = path.join(__dirname, 'noJson.txt');
    const testData = fs.readFileSync(file).toString();
    expect(() => processResponse(testData)).toThrowError(/Could not parse/);
  });
});
