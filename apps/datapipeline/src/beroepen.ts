// @ts-ignore
import levenshtein from 'js-levenshtein'

export enum Beroep {
  KindJeugdPsychiater = 'Kinder- & Jeugd Psychiater',
  Psychiater = 'Psychiater',
  KlinischPsycholoog = 'Klinisch Psycholoog',
  GZPsycholoog = 'GZ-Psycholoog',
  Verpleegkundige = 'Verpleegkundige',
  VerpleegkundigSpecialist = 'Verpleegkundig Specialist',
  SociaalPsychiatrischVerpleegkundige = 'Sociaal Psychiatrisch Verpleegkundige',
  PsychomotorischTherapeut = 'Psychomotorisch Therapeut',
  Basispsycholoog = 'Basispsycholoog',
  ANIOS = 'ANIOS',
  Psychotherapeut = 'Psychotherapeut',
  Verslavingsarts = 'Verslavingsarts',
  Systeemtherapeut = 'Systeemtherapeut',
  Gedragswetenschapper = 'Gedragswetenschapper',
  Sociotherapeut = 'Sociotherapeut',
}

const synonyms: { [key in Beroep]?: string[] } = {
  [Beroep.SociaalPsychiatrischVerpleegkundige]: ['SPV', 'Psychiatrisch Verpleegkundige'],
  [Beroep.KindJeugdPsychiater]: ['Kind en Jeugd Psychiater', 'Kinder en Jeugd Psychiater', 'Kinderpsychiater', 'Jeugdpsychiater', 'Kind- en Jeugd Psychiater'],
  [Beroep.Basispsycholoog]: ['master psycholoog', 'psycholoog'],
};

const ignoredWords = ['psychiatrie', 'psychologie', 'jeugdpsychiatrie'];

const beroepen = Object.values(Beroep);
const allOptions = [...beroepen, ...Object.values(synonyms).flat()];

export function findSynonym(value: string): Beroep | undefined {
  for (const key of Object.keys(synonyms) as Array<keyof typeof synonyms>) {
    const cleanedSynonyms = synonyms[key]?.map(cleanString);
    if (cleanedSynonyms?.includes(cleanString(value))) {
      return key;
    }
  }
  return undefined;
}


const cleanString = (text: string): string =>
  text.normalize('NFD').replace(/[‘’'`\s\u0300-\u036f-]/g, '').toLowerCase();

export const tokenize = (text: string): string[] => {
  return text.split(/[\s/]+/).filter(token => !ignoredWords.includes(cleanString(token)));
};



function getMaxTokens(beroepen: readonly string[]): number {
  return beroepen.reduce((max, beroep) => {
    const tokenCount = beroep.split(' ').length;
    return Math.max(max, tokenCount);
  }, 0);
}

const getClosestMatch = (target: string, options: readonly string[]): { closestMatch?: string, minRelativeDistance: number } => {
  let closestMatch: string | undefined = undefined;
  let minDistance = Infinity;

  options.forEach(option => {
    const absoluteDistance = levenshtein(target, option);
    const maxDistance = Math.max(target.length, option.length);
    const relativeDistance = absoluteDistance / maxDistance;
    if (relativeDistance < minDistance) {
      minDistance = relativeDistance;
      closestMatch = option;
    }
  });

  return { closestMatch, minRelativeDistance: minDistance };
};

export function getBeroep(title: string): Beroep[] {
  const tokens = tokenize(title);
  const result: Beroep[] = []
  const margin = 0.15;
  const maxWindowSize = Math.min(tokens.length, getMaxTokens(beroepen));

  for (let windowSize = maxWindowSize; windowSize > 0; windowSize--) {
    for (let i = 0; i <= tokens.length - windowSize; i++) {
      const tokenWindow = tokens.slice(i, i + windowSize).join('');
      const cleanedTokenWindow = cleanString(tokenWindow);

      const { closestMatch: match, minRelativeDistance: distance } = getClosestMatch(cleanedTokenWindow, allOptions.map(cleanString));

      if (distance < margin) {
        const beroep = beroepen.find(beroep => cleanString(beroep) === match)
          || findSynonym(match as string) as Beroep;
        result.push(beroep);
      }
    }
  }

  return Array.from(new Set(result))
}
