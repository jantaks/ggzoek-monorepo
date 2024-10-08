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
      defaultedToOverig: []
    };
    expect(result).toEqual(expected);
    expect(vacature).toEqual({
      locaties: ['Den Bosch'],
      behandelmethoden_ai: ['cgt', 'cbt-e'],
      behandelmethoden: [
        'Cognitieve gedragstherapie',
        'Cognitive Behavioral Therapy-Enhanced (CBT-E)'
      ]
    });
  });
  it('Should correct beroepen and ignore double values', () => {
    const vacature = {
      title: 'Vacature voor een psychiater en een GZ psycholoog in den Haag en omstreken',
      beroepen: ['GZ-psychologist', 'Pychiater', 'Timmerman', 'GZ-Psycholoog']
    };
    const expected = {
      isUpdated: true,
      defaultedToOverig: []
    };

    const result = correctSpelling(vacature, testDictionary);
    console.log(result);
    expect(result).toEqual(expected);

    expect(vacature).toEqual({
      title: 'Vacature voor een psychiater en een GZ psycholoog in den Haag en omstreken',
      beroepen: ['GZ-Psycholoog', 'Psychiater']
    });
  });
  it('Should classify as overig if specified.', () => {
    const vacature = {
      behandelmethoden_ai: ['Zuiptherapie', 'Brommers kieken'],
      locaties: ['Blericum']
    };
    const expected = {
      isUpdated: true,
      defaultedToOverig: [
        'Updated Zuiptherapie in behandelmethoden_ai to Overig',
        'Updated Brommers kieken in behandelmethoden_ai to Overig'
      ]
    };
    const result = correctSpelling(vacature, testDictionary);
    console.log(result);
    expect(result).toEqual(expected);
    expect(vacature).toEqual({
      behandelmethoden_ai: ['Zuiptherapie', 'Brommers kieken'],
      behandelmethoden: ['Overig'],
      locaties: ['Blericum']
    });
  });
  it('Should not update if targetField is already correct', () => {
    const vacature = {
      locaties: ['Den Bosch'],
      behandelmethoden_ai: ['cgt', 'cbt-e'],
      behandelmethoden: [
        'Cognitieve gedragstherapie',
        'Cognitive Behavioral Therapy-Enhanced (CBT-E)'
      ]
    };
    const result = correctSpelling(vacature, testDictionary);
    console.log(result);
  });
});
