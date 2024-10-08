import 'dotenv/config';
import { SelectVacature } from '@ggzoek/ggz-drizzle/dist/schema.js';
import { getBeroepen } from '../../beroepen.js';
import { BeroepOptions } from '@ggzoek/types/index.js';
import { log } from '@ggzoek/logging/src/logger.js';
import { equalArrays } from '../../utils.js';

export const synonyms: SynonymsDictionary = {
  therapievormen_ai: {
    defaultToOverig: true,
    targetField: 'therapievormen',
    mappings: {
      'Acceptance and Commitment Therapy (ACT)': [
        'Acceptatie en Commitment Therapie (ACT)',
        'Acceptatie en Commitment Therapie',
        'Acceptance and Commitment Therapy'
      ],
      'Affect Fobie Therapie (AFT)': ['aft', 'affect fobie therapie'],
      'Cognitieve gedragstherapie': [
        'cgt',
        'cognitievegedragstherapie',
        'cognitieve gedragstherapie',
        'cognitieve gedragstherapie(cgt)',
        'gedragstherapie'
      ],
      'Cognitive Behavioral Therapy-Enhanced (CBT-E)': [
        'cognitive behavioral therapy-enhanced',
        'cognitive behavioral therapy-enhanced (cbt-e)',
        'cbt-e'
      ],
      'Community Reinforcement Approach': ['cra', 'community reinforcement approach'],
      'Deep Brain Stimulation': ['dbs'],
      'Dialectische Gedragstherapie': [
        'dialectische gedragstherapie',
        'dialectische gedragstherapie (DGT)',
        'dialectical behavior therapy',
        'dgt'
      ],
      'Dialectische gedragstherapie': ['dialectische gedragstherapie', 'dgt'],
      EMDR: ['emdr', 'eye movement desensitization and reprocessing'],
      'Electroconvulsieve therapie': ['electroconvulsieve therapie', 'ect'],
      Farmacotherapie: [
        'pharmacotherapie',
        'farmacotherapie',
        'Farmacotherapeutische behandeling',
        'medicamenteuze therapie',
        'medicatiebeleid'
      ],
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
      'High Intensive Care (HIC)': [
        'hic',
        'high intensive care',
        'hoog intensieve zorg',
        'zeer intensieve zorg'
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
      'Psychomotorische therapie': ['psychomotorische therapie', 'pmt'],
      Psychotherapie: ['Psychodynamische psychotherapie', 'Psycho-educatie'],
      Schematherapie: ['schematherapie', 'schematherapy', 'sft'],
      Systeemtherapie: [
        'Multi Dimensionele Familietherapie (MDFT)',
        'Multi Dimensionele Familietherapie',
        'systeemgericht werken',
        'gezinstherapie',
        'multisysteem therapie',
        'Multi Systeem Therapie (MST)',
        'Multi Systeem Therapie',
        'MST',
        'MultiSystemic Therapy',
        'Multi Family Therapy',
        'Multi Family Therapie',
        'Multi Family Therapy (MFT)',
        'multi familie therapie',
        'multi familie therapie (mft)'
      ],
      'flexible assertive community treatment (FACT)': [
        'flexible assertive community treatment',
        'flexible assertive community treatment (fact)',
        'fact',
        'fact methode',
        'act',
        'Assertive Community Treatment (ACT)',
        'Assertive Community Treatment'
      ],
      Traumatherapie: [],
      'Vroege Interventie Psychose Therapie (VIP)': ['Vroege Interventie Psychose Therapie', 'VIP'],
      Vaktherapie: ['vaktherapie', 'creatieve therapie', 'dramatherapie'],
      'repetitieve Transcraniële Magnetische Stimulatie.': [
        'rTMS',
        'TMS',
        'repetitieve Transcraniële Magnetische Stimulatie',
        'repetitieve TMS',
        'rTMS behandeling'
      ]
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
  aandachtsgebieden_ai: {
    targetField: 'aandachtsgebieden',
    defaultToOverig: true,
    mappings: {
      Ouderenpsychiatrie: [
        'ouderenpsychiatrie',
        'ouderenzorg',
        'ouderen',
        'geriatrie',
        'gerontopsychiatrie'
      ],
      'Kinderen en Jeugd': [
        'Jeugd- en Jongvolwassenen',
        'kinderen en jeugd',
        'kinderen',
        'Jeugd- en- jongvolwassenen',
        'Jeugd',
        'jeugd ggz'
      ],
      'Acute Psychiatrie': ['acute psychiatrie', 'acute zorg'],
      Opleiden: ['opleiden', 'opleiding'],
      Ziekenhuispsychiatrie: [
        'ziekenhuis psychiatrie',
        'PAAZ',
        'psychiatrische afdeling algemeen ziekenhuis'
      ],
      'Forensische psychiatrie': ['forensische psychiatrie', 'forensisch'],
      'Zwangerschapsgerelateerde problematiek': [
        'POP',
        'POP-poli',
        'zwangerschapsgerelateerde problemen'
      ],
      Seksuologie: [
        'seksuele stoornis',
        'problematisch seksueel gedrag',
        'Seksueel overschrijdend gedrag'
      ],
      'AD(H)D': ['adhd', 'attention deficit hyperactivity disorder', 'ad(h)d', 'adhd'],
      Angststoornissen: ['angststoornis', 'angst', 'Angstoornissen'],
      'Autisme Spectrum Stoornis (ASS)': [
        'autisme spectrum stoornis',
        'autismespectrumstoornis',
        'autism spectrum disorder',
        'ass',
        'ASS'
      ],
      'Bipolaire Stoornissen': ['bipolaire stoornis', 'bipolaire en gerelateerde stoornissen'],
      'Ernstige Psychiatrische Aandoeningen (EPA)': [
        'Ernstige Psychische Aandoeningen (EPA)',
        'Ernstige psychiatrische aandoeningen',
        'Complexe psychiatrische problematiek',
        'complexe psychiatrische problemen',
        'comorbiditeit',
        'complexe psychiatrische stoornissen',
        'cpp',
        'Ernstige psychische aandoeningen',
        'Ernstige psychiatrische problematiek',
        'Ernstige Psychiatrische Aandoening',
        'Complexe problematiek'
      ],
      'Depressieve stoornissen': [
        'Deppressieve stoornissen',
        'Depressieve Stoornissen',
        'depressieve stoornis',
        'depressie',
        'Stemminsstoornissen',
        'Stemmingsstoornissen',
        'Stemmingsproblemen',
        'Stemming',
        'Stemmingsklachten',
        'Stemmingsproblematiek',
        'Stemmingstoornissen'
      ],
      'Niet Aangeboren Hersenletsel (NAH)': [
        'niet aangeboren hersenletsel',
        'nah',
        'hersenletsel',
        'hersenbeschadiging',
        'hersenletsel problematiek'
      ],
      'Dissociatieve Stoornissen': [],
      'Forensische problematiek': [],
      Genderdysforie: ['genderdysphoria', 'Geslachtsidentiteitsstoornis'],
      'Licht Verstandelijke Beperking': ['lvb', ' Licht verstandelijke beperking'],
      'Neurocognitieve stoornissen': [],
      'Obsessieve-compulsieve en gerelateerde stoornissen': [
        'OCD',
        'obsessive-compulsive disorder'
      ],
      Ontwikkelingsstoornissen: ['Ontwikkelingsproblematiek'],
      Persoonlijkheidsstoornissen: ['persoonlijkheidsstoornis', 'persoonlijkheid'],
      'Schizofreniespectrum en andere psychotische stoornissen': [
        'schizofrenie',
        'Psychosecircuit',
        'psychose',
        'Psychotische stoornissen',
        'Psychotische kwetsbaarheid'
      ],
      'Psychosomatische stoornissen': [
        'psychosomatische stoornis',
        'psychosomatiek',
        'Somatisch-symptoomstoornissen',
        'Somatisch symptoomstoornissen',
        'Somatoforme stoornissen'
      ],
      'Trauma- en stressorgerelateerde stoornissen': [
        'trauma',
        'Trauma en stressorgerelateerde stoornissen',
        'traumagerelateerde stoornissen',
        'ptss',
        'ptsd',
        'Traumatische stoornissen'
      ],

      Verslavingsstoornissen: [
        'verslaving',
        'verslavingsproblematiek',
        'Middelenafhankelijkheid',
        'middelenmisbruik'
      ],
      'Voedings- en eetstoornissen': [
        'voedings- en eetstoornissen',
        'eetstoornissen',
        'eetproblematiek',
        'eetproblemen'
      ]
    }
  }
} as const;

const OVERIG = 'Overig';

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
  const defaultedToOverig = [];
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
          if (betterAlternative === OVERIG) {
            defaultedToOverig.push(`Updated ${value} in ${field} to ${betterAlternative}`);
          }
          console.log(`Updating ${value} in ${field} to ${betterAlternative}`);
          updatedField.add(betterAlternative);
        } else {
          updatedField.add(value);
        }
      }
      if (
        updatedField.size > 0 &&
        !equalArrays(vacature[targetField] as Array<string>, Array.from(updatedField))
      ) {
        isUpdated = true;
        (vacature[targetField] as string[]) = Array.from(updatedField);
      }
    } else {
      const value = vacature[field];
      if (typeof value === 'string') {
        const betterAlternative = findSynonyms(value, fieldSynonyms);
        if (betterAlternative) {
          if (betterAlternative === OVERIG) {
            defaultedToOverig.push(
              `Updated ${vacature[field]} in ${field} to ${betterAlternative}`
            );
          }
          console.log(`Found synonym for ${vacature[field]} in ${field}: ${betterAlternative}`);
          if (vacature[targetField] !== betterAlternative) {
            (vacature[targetField] as string) = betterAlternative;
            isUpdated = true;
          }
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

  return { isUpdated, defaultedToOverig };
}

function getSynonyms(fieldName: string, dictionary: SynonymsDictionary = synonyms) {
  return dictionary[fieldName];
}

function findSynonyms(value: string, synonyms: Synonyms) {
  log.debug(`Finding synonyms for ${value}`);
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
  log.debug(`No synonyms found for ${value}`);
  return synonyms.defaultToOverig && value !== OVERIG ? OVERIG : null;
}
