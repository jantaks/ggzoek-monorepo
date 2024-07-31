import 'dotenv/config';
import { SelectVacature } from 'packages/ggz-drizzle/src/schema.js';
import { getBeroepen } from '../../beroepen.js';
import { BeroepOptions } from '@ggzoek/types/index.js';

export const synonyms: SynonymsDictionary = {
  behandelmethoden_ai: {
    defaultToOverig: true,
    targetField: 'behandelmethoden',
    mappings: {
      'Affect Fobie Therapie (AFT)': ['aft', 'affect fobie therapie'],
      'Cognitieve gedragstherapie': [
        'cgt',
        'cognitievegedragstherapie',
        'cognitieve gedragstherapie',
        'cognitieve gedragstherapie(cgt)'
      ],
      'Cognitive Behavioral Therapy-Enhanced (CBT-E)': [
        'cognitive behavioral therapy-enhanced',
        'cognitive behavioral therapy-enhanced (cbt-e)',
        'cbt-e'
      ],
      'Community Reinforcement Approach': ['cra', 'community reinforcement approach'],
      'Dialectische Gedragstherapie': [
        'dialectische gedragstherapie',
        'dialectische gedragstherapie (DGT)',
        'dialectical behavior therapy',
        'dgt'
      ],
      'Dialectische gedragstherapie': ['dialectische gedragstherapie', 'dgt'],
      EMDR: ['emdr', 'eye movement desensitization and reprocessing'],
      'Electroconvulsieve therapie': ['electroconvulsieve therapie', 'ect'],
      Groepstherapie: [
        'groepstherapie',
        'group therapy',
        'groepsbehandelingen',
        'groepspsychotherapie',
        'groepsbehandeling'
      ],
      'Guideline-Informed Treatment for Personality Disorders (GIT-PD)': [
        'git-pd',
        'GIT-PD (Guideline-Informed Treatment for Personality Disorders)',
        'guideline-informed treatment for personality disorders',
        'GIT-PD behandeling'
      ],
      'Herstel Ondersteunende Zorg (HOZ)': [
        'Herstel Ondersteunende Zorg (HOZ)',
        'Herstelgericht werken',
        'Herstelgerichte behandeling',
        'Herstelgerichte zorg',
        'Herstelondersteunende zorg'
      ],
      'Imaginaire Exposure': ['imaginaire exposure', 'imaginary exposure', 'ie'],
      'Intensive Home Treatment (IHT)': [
        'IHT',
        'Intensive Home Treatment',
        'Intensieve thuis behandeling',
        'Intensief thuis behandelen'
      ],
      'Kortdurende Psychoanalytische Steungevende Psychotherapie (KPSP)': [
        'ksps',
        'kpsp',
        'kortdurende psychoanalytische steungevende psychotherapie'
      ],
      'Mentalization Based Treatment': [
        'mentalization based treatment',
        'mentalization based therapy',
        'mentalization based therapy (mbt)',
        'mentalization based treatment (mbt)',
        'mbt',
        'AMBIT (adaptive mentalization based integrative treatment)',
        'ambit',
        'adaptive mentalization based integrative treatment',
        'adaptive mentalization based integrative therapy',
        'Herstel Ondersteunende Zorg (HOZ)'
      ],
      Overige: [
        'overige',
        'diverse',
        'diversen',
        'diverse behandelmethoden',
        'Affect regulerende vaktherapie',
        'Ambulante zorg',
        'Casemanagement',
        'Crisisinterventie',
        'Exposure',
        'Exposure in Vivo',
        'Geweldloos Verzet'
      ],
      Psychotherapie: ['Psychodynamische psychotherapie', 'Psycho-educatie'],
      'Psychomotorische therapie': ['psychomotorische therapie', 'pmt'],
      Schematherapie: ['schematherapie', 'schematherapy', 'sft'],
      'flexible assertive community treatment (FACT)': [
        'flexible assertive community treatment',
        'flexible assertive community treatment (fact)',
        'fact',
        'fact methode',
        'act'
      ],
      Systeemtherapie: ['systeemgericht werken']
    }
  },
  locaties: {
    defaultToOverig: false,
    mappings: {
      's-Hertogenbosch': ['denbosch', 'shertogenbosch', 'den bosch', "'s hertogenbosch"],
      'Den Haag': ['sgravenhage', 'denhaag'],
      'Sint-Michielsgestel': [
        'st. michielsgestel',
        'sintmichielsgestel',
        'stmichielsgestel',
        'st michielsgestel'
      ]
    }
  },
  stoornissen_ai: {
    targetField: 'stoornissen',
    defaultToOverig: true,
    mappings: {
      'Autisme Spectrum Stoornis': [
        'autisme spectrum stoornis',
        'autismespectrumstoornis',
        'autism spectrum disorder',
        'asa'
      ],
      'Bipolaire Stoornissen': ['bipolaire stoornis', 'bipolaire en gerelateerde stoornissen'],
      'Complexe psychiatrische problematiek': [
        'complexe psychiatrische problemen',
        'comorbiditeit',
        'complexe psychiatrische stoornissen',
        'cpp'
      ],
      'Voedings- en eetstoornissen': ['voedings- en eetstoornissen', 'eetstoornissen'],
      'Dissociatieve Stoornissen': [],
      'Depressieve stoornissen': ['depressieve stoornis', 'depressie'],
      Angststoornissen: ['angststoornis', 'angst'],
      'Obsessieve-compulsieve en gerelateerde stoornissen': [
        'OCD',
        'obsessive-compulsive disorder'
      ],
      Verslavingsstoornissen: ['verslaving', 'verslavingsproblematiek'],
      'Trauma- en stressorgerelateerde stoornissen': [
        'trauma',
        'traumagerelateerde stoornissen',
        'ptss',
        'ptsd'
      ],
      Genderdysforie: ['genderdysphoria', 'Geslachtsidentiteitsstoornis'],
      'Schizofreniespectrum en andere psychotische stoornissen': ['schizofrenie', 'psychose'],
      'Neurocognitieve stoornissen': [],
      Persoonlijkheidsstoornissen: ['persoonlijkheidsstoornis', 'persoonlijkheid']
    }
  }
} as const;

type Synonyms = {
  // The field in the vacature object where the mapped value should be stored .
  // If not provided, the field is assumed to be the same as the key.
  targetField?: keyof SelectVacature;
  // If true, values that can not be found in  mappings are replaced with 'Overig'.
  defaultToOverig: boolean;
  mappings: {
    [key: string]: string[];
  };
};

export type SynonymsDictionary = {
  [key: string]: Synonyms;
};

export function correctSpelling(
  vacature: Partial<SelectVacature>,
  dictionary: SynonymsDictionary = synonyms
) {
  function assertField(
    field: string,
    vacature: Partial<SelectVacature>
  ): asserts field is keyof SelectVacature {
    if (!Object.keys(vacature).includes(field)) {
      throw new Error(`Field ${field} is not a valid field`);
    }
  }

  let isUpdated = false;
  for (const field in vacature) {
    assertField(field, vacature);
    const fieldSynonyms: Synonyms = getSynonyms(field, dictionary);
    if (!fieldSynonyms) continue;
    const targetField = fieldSynonyms.targetField || field;
    if (Array.isArray(vacature[field])) {
      const updatedField: Set<string> = new Set();
      for (const value of vacature[field]) {
        const betterAlternative = findSynonyms(value, fieldSynonyms);
        if (betterAlternative) {
          console.log(`Updating ${value} in ${field} to ${betterAlternative}`);
          updatedField.add(betterAlternative);
          isUpdated = true;
        } else {
          updatedField.add(value);
        }
      }
      if (updatedField.size > 0) {
        (vacature[targetField] as string[]) = Array.from(updatedField);
      }
    } else {
      const value = vacature[field];
      if (typeof value === 'string') {
        const betterAlternative = findSynonyms(value, fieldSynonyms);
        if (betterAlternative) {
          console.log(`Found synonym for ${vacature[field]} in ${field}: ${betterAlternative}`);
          (vacature[targetField] as string) = betterAlternative;
          isUpdated = true;
        }
      }
    }
  }
  const beroepen = vacature.beroepen;
  if (beroepen?.length === 0) {
    console.log('No beroepen found, trying to infer from title');
  }
  if (vacature.title) {
    const preferredBeroepen = getBeroepen(vacature.title);
    if (
      !beroepen ||
      !preferredBeroepen.every((beroep) => beroepen.includes(beroep as BeroepOptions))
    ) {
      vacature.beroepen = preferredBeroepen;
      console.log(`Updated beroepen for ${vacature.title}: ${preferredBeroepen}`);
      isUpdated = true;
    }
  }

  return { isUpdated, vacature };
}

function getSynonyms(fieldName: string, dictionary: SynonymsDictionary = synonyms) {
  return dictionary[fieldName];
}

function findSynonyms(value: string, synonyms: Synonyms) {
  for (const preferredSpelling of Object.keys(synonyms.mappings)) {
    if (value === preferredSpelling) {
      return null;
    }
    const cleanedValue = value
      .normalize('NFD')
      .replace(/[‘’'`\s\u0300-\u036f-]/g, '')
      .toLowerCase();
    const cleanedSynonyms = synonyms.mappings[preferredSpelling].map((s) =>
      s
        .normalize('NFD')
        .replace(/[‘’'`\s\u0300-\u036f-]/g, '')
        .toLowerCase()
    );
    if (cleanedSynonyms.includes(cleanedValue)) {
      return preferredSpelling;
    }
  }
  return synonyms.defaultToOverig && value !== 'Overig' ? 'Overig' : null;
}
