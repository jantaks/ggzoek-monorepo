import { describe, expect, it } from 'vitest';
import { correctSpelling, SynonymsDictionary } from './synonyms.js';

const testDictionary: SynonymsDictionary = {
  locaties: {
    defaultToOverig: false,
    mappings: {
      'Den Bosch': ['denbosch', 'shertogenbosch'],
      'Den Haag': ['sgravenhage', 'denhaag'],
      'St. Michielsgestel': ['sintmichielsgestel', 'stmichielsgestel']
    }
  },
  behandelmethoden_ai: {
    targetField: 'behandelmethoden',
    defaultToOverig: true,
    mappings: {
      'Cognitive Behavioral Therapy-Enhanced (CBT-E)': [
        'cognitive behavioral therapy-enhanced',
        'cognitive behavioral therapy-enhanced (cbt-e)',
        'cbt-e'
      ],
      'Cognitieve gedragstherapie': [
        'cgt',
        'cognitievegedragstherapie',
        'cognitieve gedragstherapie',
        'cognitieve gedragstherapie(cgt)'
      ]
    }
  }
};

describe('Replace values with preferred spelling', () => {
  it('should correct spelling', () => {
    const vacature = {
      locaties: ['denbosch'],
      behandelmethoden_ai: ['cgt', 'cbt-e']
    };
    const result = correctSpelling(vacature, testDictionary);
    console.log(result);
    const expected = {
      isUpdated: true,
      vacature: {
        locaties: ['Den Bosch'],
        behandelmethoden: [
          'Cognitieve gedragstherapie',
          'Cognitive Behavioral Therapy-Enhanced (CBT-E)'
        ]
      }
    };
    expect(result).toEqual(expected);
  });
  it('Should correct beroepen and ignore double values', () => {
    const vacature = {
      title: 'Vacature voor een psychiater en een GZ psycholoog in den Haag en omstreken',
      beroepen: ['GZ-psychologist', 'Pychiater', 'Timmerman', 'GZ-Psycholoog']
    };
    const expected = {
      isUpdated: true,
      vacature: {
        title: 'Vacature voor een psychiater en een GZ psycholoog in den Haag en omstreken',
        beroepen: ['GZ-Psycholoog', 'Psychiater']
      }
    };

    const result = correctSpelling(vacature, testDictionary);
    console.log(result);
    expect(result).toEqual(expected);
  });
  it('Should classify as overig if specified.', () => {
    const vacature = {
      behandelmethoden_ai: ['Zuiptherapie', 'Brommers kieken'],
      locaties: ['Blericum']
    };
    const expected = {
      isUpdated: true,
      vacature: {
        behandelmethoden_ai: ['Zuiptherapie', 'Brommers kieken'],
        behandelmethoden: ['Overig'],
        locaties: ['Blericum']
      }
    };
    const result = correctSpelling(vacature, testDictionary);
    console.log(result);
    expect(result).toEqual(expected);
  });
});
