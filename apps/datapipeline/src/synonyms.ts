import 'dotenv/config';

import { Vacature } from './ai/types.js';

export const synonyms: SynonymsDictionary = {
  locaties: {
    'Den Bosch': ['denbosch', 'shertogenbosch'],
    'Den Haag': ['sgravenhage', 'denhaag'],
    'St. Michielsgestel': ['sintmichielsgestel', 'stmichielsgestel']
  },
  behandelmethoden: {
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
    ],
    EMDR: ['emdr', 'eye movement desensitization and reprocessing'],
    Schematherapie: ['schematherapie', 'schematherapy', 'sft'],
    'Community Reinforcement Approach': ['cra', 'community reinforcement approach'],
    'Affect Fobie Therapie': ['aft', 'affect fobie therapie'],
    'Dialectische gedragstherapie': ['dialectische gedragstherapie', 'dgt'],
    'flexible assertive community treatment (FACT)': [
      'flexible assertive community treatment',
      'flexible assertive community treatment (fact)',
      'fact',
      'fact methode',
      'act'
    ],
    Groepstherapie: ['groepstherapie', 'group therapy', 'groepsbehandelingen'],
    'Imaginaire Exposure': ['imaginaire exposure', 'imaginary exposure', 'ie'],
    'Mentalization Based Treatment': [
      'mentalization based treatment',
      'mentalization based therapy',
      'mentalization based therapy (mbt)',
      'mentalization based treatment (mbt)',
      'mbt',
      'AMBIT (adaptive mentalization based integrative treatment)',
      'ambit',
      'adaptive mentalization based integrative treatment',
      'adaptive mentalization based integrative therapy'
    ],
    'Dialectische Gedragstherapie': [
      'dialectische gedragstherapie',
      'dialectische gedragstherapie (DGT)',
      'dialectical behavior therapy',
      'dgt'
    ],
    'Psychomotorische therapie': ['psychomotorische therapie', 'pmt'],
    'Electroconvulsieve therapie': ['electroconvulsieve therapie', 'ect'],
    'Kortdurende Psychoanalytische Steungevende Psychotherapie (KPSP)': [
      'ksps',
      'kpsp',
      'kortdurende psychoanalytische steungevende psychotherapie'
    ],
    'Guideline-Informed Treatment for Personality Disorders (GIT-PD)': [
      'git-pd',
      'GIT-PD (Guideline-Informed Treatment for Personality Disorders)',
      'guideline-informed treatment for personality disorders'
    ]
  }
};

type Synonyms = {
  [key: string]: string[];
};

type SynonymsDictionary = {
  [key: string]: Synonyms;
};

export async function correctSpelling() {
  const vacatures = (await vacatures.getUnsyncedVacatures()) as Vacature[];
  for (const vacature of vacatures) {
    for (const field in vacature) {
      let isUpdated = false;
      const fieldSynonyms: Synonyms = getSynonyms(field);
      if (!fieldSynonyms) continue;
      if (Array.isArray(vacature[field])) {
        const updatedField = [];
        for (const value of vacature[field]) {
          const preferred = findSynonyms(value, fieldSynonyms);
          if (preferred) {
            console.log(`Updating ${value} in ${field} to ${preferred}`);
            updatedField.push(preferred);
            isUpdated = true;
          } else {
            updatedField.push(value);
          }
        }
        if (updatedField.length > 0) {
          vacature[field] = updatedField;
        }
      } else {
        const preferred = findSynonyms(vacature[field], fieldSynonyms);
        if (preferred) {
          console.log(`Found synonym for ${vacature[field]} in ${field}: ${preferred}`);
          vacature[field] = preferred;
          isUpdated = true;
        }
      }
      if (isUpdated) {
        console.log(`Updating vacature ${vacature.url}`);
        await vacatures.upsert(vacature);
      }
    }
  }
}

function getSynonyms(fieldName: string) {
  return synonyms[fieldName];
}

function findSynonyms(value: string, synonyms: Synonyms) {
  const preferredSpelling = Object.keys(synonyms);
  for (const name of preferredSpelling) {
    if (value === name) {
      return null;
    }
    const cleanedValue = value
      .normalize('NFD')
      .replace(/[‘’'`\s\u0300-\u036f-]/g, '')
      .toLowerCase();
    const cleanedSynonyms = synonyms[name].map((s) =>
      s
        .normalize('NFD')
        .replace(/[‘’'`\s\u0300-\u036f-]/g, '')
        .toLowerCase()
    );
    if (cleanedSynonyms.includes(cleanedValue)) {
      return name;
    }
  }
  return null;
}

function createMutualAssociations(synonyms: Synonyms): Synonyms {
  const mutualAssociations: Synonyms = {};

  // Step 1: Direct associations
  Object.keys(synonyms).forEach((key) => {
    mutualAssociations[key] = synonyms[key];
  });

  // Step 2: Mutual associations
  Object.entries(synonyms).forEach(([key, values]) => {
    values.forEach((value) => {
      // Initialize the array if it does not exist
      if (!mutualAssociations[value]) {
        mutualAssociations[value] = [];
      }

      // Add the original key and other synonyms, avoiding duplicates
      mutualAssociations[value] = Array.from(
        new Set([...mutualAssociations[value], key, ...values.filter((val) => val !== value)])
      );
    });
  });

  return mutualAssociations;
}
