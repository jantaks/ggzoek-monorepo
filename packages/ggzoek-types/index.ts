export enum Beroep {
  'Psychiater',
  'Kinder- & Jeugd Psychiater',
  'Klinisch Psycholoog',
  'GZ-Psycholoog',
  'Verpleegkundig Specialist',
  'Verslavingsarts',
  'Sociaal Psychiatrisch Verpleegkundige',
  'Psychomotorisch Therapeut',
  'Basispsycholoog',
  'ANIOS',
  'Verpleegkundige',
  'AIOS',
  'Psychotherapeut',
  'Systeemtherapeut',
  'Gedragswetenschapper',
  'Sociotherapeut',
  'Agoog',
  'Begeleider',
  'Ervaringsdeskundige',
  'Maatschappelijk Werker',
  'Orthopedagoog'
}

export type BeroepOptions = keyof typeof Beroep;
