import { cleanText, cleanTitle, combineUrl, formatDate, randomItems } from './utils.js';
import { expect, describe, it } from 'vitest';
import { getBeroepen, Beroep} from './beroepen.js';
import { log } from '@ggzoek/logging/src/logger.js';

describe('randomItems', () => {
    it('should return the correct number of items', () => {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = randomItems(items, 3);
        expect(result.length).toBe(3);
    });

    it('should return items from the original array', () => {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = randomItems(items, 3);
        result.forEach((item: number) => {
            expect(items.includes(item)).toBe(true);
        });
    });

    it('should not return duplicates', () => {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = randomItems(items, 10);
        const unique = new Set(result);
        expect(unique.size).toBe(result.length);
    });
});

describe('extracts beroepen from title', () => {
    it('Correcte spelling', () => {
        const title = 'Vacature voor een psychiater in den Haag en omstreken';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.Psychiater);
    });
    it('Verwijderd beroep uit de titel bij eerste match', () => {
        const title = 'GZ psycholoog Kliniek';
        const beroep = getBeroepen(title);
        expect(beroep).toEqual([Beroep.GZPsycholoog]);
    });
    it('Missende letter', () => {
        const title = 'Vacature voor een verpleegkundig spcialist';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.VerpleegkundigSpecialist);
    });
    it('Taalfoutje', () => {
        const title = 'Vacature voor een klinisc sycholoog in den HAagen omstrreken';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.KlinischPsycholoog);
    })
    it('Taalfoutje 2', () => {
        const title = 'Gezocht een Sociaal sychiatrisch Verpleegkundige';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Taalfoutje 3', () => {
        const title = 'Ingeest zoekt een Verpeegkundig voor de afdeling psychiatrie';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.Verpleegkundige);
    })
    it('Taalfoutje te groot', () => {
        const title = 'Gezocht een hele leuke Verpegkund';
        const beroep = getBeroepen(title);
        expect(beroep).empty;
    })
    it('Kiest langste beroepenwoord', () => {
        const title = 'wij zoeken geen gewone therapeut maar een Pscyhomotorisch Therapeut';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.PsychomotorischTherapeut);
    })
    it('Ignores special characters', () => {
        const title = 'wij zoeken geen gewone pscyholoog maar een gz   pycholoog';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.GZPsycholoog);
    })
    it('Finds synonyms', () => {
        const title = 'wij zoeken een spv voor een instelling';
        const beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Finds synonyms 2', () => {
        let title = 'wij zoeken een Kinderpsychater voor een instelling';
        let beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.KindJeugdPsychiater);
        title = 'wij zoeken een Kind- en Jeugdpsychater voor een instelling';
        beroep = getBeroepen(title);
        expect(beroep).contains(Beroep.KindJeugdPsychiater);
    })
    it('Removes /', () => {
        const title = 'ANIOS/Basisarts psychiatrie (ggz) – (Reinier van Arkel) ';
        const result = getBeroepen(title);
        expect(result).contains(Beroep.ANIOS);
    })
    it('Ignores certain words, e.g. psychiatrie', () => {
        const title = 'Spv voor in de kind- en jeugd psychiatrie';
        const result = getBeroepen(title);
        expect(result).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Ignores certain words, e.g. psychiatrie (2)', () => {
        const title = 'Sociotherapeut/SPV Deeltijdbehandeling 6-12 jaar Kinder- en Jeugdpsychiatrie (24-32 uur)';
        const result = getBeroepen(title);
        expect(result).contains(Beroep.Sociotherapeut);
        expect(result).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Ignores i.o. tot Klinisch Psycholoog', () => {
        const title = 'GZ-psycholoog i.o. tot Klinisch psycholoog';
        const result = getBeroepen(title);
        expect(result).toEqual([Beroep.GZPsycholoog]);
    })
    it('Ignores i.o. tot GZ Psycholoog', () => {
        const title = 'Opleidingsplaats psycholoog in opleiding tot gz-psycholoog';
        const result = getBeroepen(title);
        expect(result).toEqual([Beroep.Basispsycholoog]);
    })
})

describe('date formatting', () => {
    it('should return the correct date format', () => {
        const dateString = 'Fri May 24 2024 08:46:47 GMT+0200 (Central European Summer Time)'
        const date = new Date(dateString);
        let result = formatDate(date);
        expect(result).toBe('2024-05-24T08:46:47');
        result = formatDate(dateString);
        expect(result).toBe('2024-05-24T08:46:47');
        result = formatDate("bullshit")
        expect(result).toBe(undefined);
    });
})

describe('combines baseUrl and Path', () => {
    it('adds a / if needed', () => {
        const baseUrl = "https://www.werkenbijggze.nl"
        const urlFragment = "portal-werkenbij/psychologen"
        let combined = combineUrl(urlFragment, baseUrl)
        expect(combined).toEqual("https://www.werkenbijggze.nl/portal-werkenbij/psychologen")
    })
    it('does not duplicate the baseUrl', () => {
        const baseUrl = "https://www.werkenbijggze.nl"
        const urlFragment = "portal-werkenbij/psychologen"
        let combined = combineUrl(urlFragment, baseUrl)
        expect(combined).toEqual("https://www.werkenbijggze.nl/portal-werkenbij/psychologen")
    })
    it('does not duplicate the fragment', () => {
        const baseUrl = "https://www.werkenbijggze.nl/portal-werkenbij/psychologen"
        const urlFragment = "portal-werkenbij/psychologen"
        let combined = combineUrl(urlFragment, baseUrl)
        expect(combined).toEqual("https://www.werkenbijggze.nl/portal-werkenbij/psychologen")
    })

})

describe('should clean up text', () => {
    const text = '\n\t\t\t\t\t\t\t  Vacature Psychiater – Jonx ambulant\t\t\t\t\t\t'
    const text2 = 'Werken bij \n\r GGz Breburg\n\r Verpleegkundig Specialist - Angst- en Stemmingsstoornissen'
    it('removes tabs', () => {
        const result = cleanTitle(text)
        expect(result).toEqual('Vacature Psychiater – Jonx ambulant')
    });
    it('removes newlines', () => {
        const result = cleanTitle(text2)
        expect(result).toEqual('Werken bij GGz Breburg Verpleegkundig Specialist - Angst- en Stemmingsstoornissen')
    });
});
