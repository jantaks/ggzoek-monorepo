// @ts-ignore
import levenshtein from 'js-levenshtein';

export enum Beroep {
  Onbekend = 'Onbekend',
  Psychiater = 'Psychiater',
  KlinischPsycholoog = 'Klinisch Psycholoog',
  GZPsycholoog = 'GZ-psycholoog',
  Verpleegkundige = 'Verpleegkundige',
  VerpleegkundigSpecialist = 'Verpleegkundig Specialist',
  SociaalPsychiatrischVerpleegkundige = 'Sociaal Psychiatrisch Verpleegkundige',
  PsychomotorischTherapeut = 'Psychomotorisch Therapeut',
  Basispsycholoog = 'Basispsycholoog',
  Therapeut = 'Therapeut',
  ANIOS = 'ANIOS',
}

const synonyms: { [key in Beroep]?: string[] } = {
  [Beroep.SociaalPsychiatrischVerpleegkundige]: ['Psych verpl.', 'SPV', 'Psychiatrisch Verpleegkundige'],
  // Add more synonyms as needed
};

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

const tokenize = (text: string): string[] => text.split(/\s+/);

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

export function getBeroep(title: string): Beroep {
  console.log(allOptions);
  const tokens = tokenize(title);

  const margin = 0.2;
  const maxWindowSize = Math.min(tokens.length, getMaxTokens(beroepen));

  for (let windowSize = maxWindowSize; windowSize > 0; windowSize--) {
    let closestMatch: Beroep | undefined = undefined;
    let minDistance = Infinity;

    for (let i = 0; i <= tokens.length - windowSize; i++) {
      const tokenWindow = tokens.slice(i, i + windowSize).join('');
      const cleanedTokenWindow = cleanString(tokenWindow);

      const { closestMatch: match, minRelativeDistance: distance } = getClosestMatch(cleanedTokenWindow, allOptions.map(cleanString));

      if (distance < minDistance) {
        minDistance = distance;
        closestMatch = beroepen.find(beroep => cleanString(beroep) === match)
          || findSynonym(match as string) as Beroep;
        console.log(closestMatch)
      }
    }

    if (closestMatch) {
      if (minDistance <= margin) {
        return closestMatch as Beroep;
      }
    }
  }

  return Beroep.Onbekend;
}
