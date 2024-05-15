// @ts-ignore
import levenshtein from 'js-levenshtein';

export enum Beroep {
  Onbekend = 'Onbekend',
  Psychiater = 'Psychiater',
  KlinischPsycholoog = 'Klinisch Psycholoog',
  GZPsycholoog = 'GZ-psycholoog',
  Verpleegkundige = 'Verpleegkundige',
  VerpleegkundigSpecialist = 'Verpleegkundig Specialist',
  SociaalPsychiatrischVerpleegkundige = 'Psychiatrisch Verpleegkundige',
  PsychomotorischTherapeut = 'Psychomotorisch Therapeut',
  Basispsycholoog = 'Basispsycholoog',
  Therapeut = 'Therapeut',
  ANIOS = 'ANIOS',
}

const synonyms: { [key: string]: Beroep } = {
  'Psych verpl.': Beroep.SociaalPsychiatrischVerpleegkundige,
  'SPV': Beroep.SociaalPsychiatrischVerpleegkundige,
  'Psychiatrisch Verpleegkundige': Beroep.SociaalPsychiatrischVerpleegkundige,
  // Add more synonyms as needed
};

const beroepen: string[] = Object.values(Beroep);

const cleanString = (text: string): string =>
  text.normalize('NFD').replace(/[‘’'`\s\u0300-\u036f-]/g, '').toLowerCase();

const tokenize = (text: string): string[] => text.split(/\s+/);

function getMaxTokens(beroepen: readonly string[]): number {
  return beroepen.reduce((max, beroep) => {
    const tokenCount = beroep.split(' ').length;
    return Math.max(max, tokenCount);
  }, 0);
}

const getClosestMatch = (target: string, options: readonly string[]): { closestMatch?: string, minDistance: number } => {
  let closestMatch: string | undefined = undefined;
  let minDistance = Infinity;

  options.forEach(option => {
    const distance = levenshtein(target, option);
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = option;
    }
  });

  return { closestMatch, minDistance };
};

export function getBeroep(title: string): Beroep {
  const tokens = tokenize(title);

  const margin = 0.2;
  const maxWindowSize = Math.min(tokens.length, getMaxTokens(beroepen));

  for (let windowSize = maxWindowSize; windowSize > 0; windowSize--) {
    let closestMatch: Beroep | undefined = undefined;
    let minDistance = Infinity;
    let threshold = 0;

    for (let i = 0; i <= tokens.length - windowSize; i++) {
      const tokenWindow = tokens.slice(i, i + windowSize).join('');
      const cleanedTokenWindow = cleanString(tokenWindow);

      const { closestMatch: match, minDistance: distance } = getClosestMatch(cleanedTokenWindow, beroepen.map(cleanString));

      if (distance < minDistance) {
        minDistance = distance;
        closestMatch = beroepen.find(beroep => cleanString(beroep) === match);
      }
    }

    if (closestMatch) {
      threshold = margin * closestMatch.length;
      if (minDistance <= threshold) {
        return closestMatch as Beroep;
      }
    }
  }

  return Beroep.Onbekend;
}
