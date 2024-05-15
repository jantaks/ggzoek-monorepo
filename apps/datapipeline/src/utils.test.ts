import { randomItems } from './utils.js';
import { expect, test, describe, it } from 'vitest';
import { getBeroep, Beroep, findSynonym } from './beroepen.js';


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
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.Psychiater);
    });
    it('Missende letter', () => {
        const title = 'Vacature voor een verpleegkundig spcialist';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.VerpleegkundigSpecialist);
    });
    it('Taalfoutje', () => {
        const title = 'Vacature voor een klinisc sycholoog in den HAagen omstrreken';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.KlinischPsycholoog);
    })
    it('Taalfoutje 2', () => {
        const title = 'Gezocht een Sociaal sychiatrisch Verpleegkundige';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Taalfoutje 3', () => {
        const title = 'Verpegkundig';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.Verpleegkundige);
    })
    it('Taalfoutje te groot', () => {
        const title = 'Gezocht een hele leuke Verpegkund';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.Onbekend);
    })
    it('Kiest langste beroepenwoord', () => {
        const title = 'wij zoeken geen gewone therapeut maar een Pscyhomotorisch Therapeut';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.PsychomotorischTherapeut);
    })
    it('Ignores special characters', () => {
        const title = 'wij zoeken geen gewone pscyholoog maar een gz   pycholoog';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.GZPsycholoog);
    })
    it('Finds synonyms', () => {
        const title = 'wij zoeken een SPV';
        const beroep = getBeroep(title);
        expect(beroep).toEqual(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Finds synonymsREMOVE', () => {
        const result = findSynonym('spv ');
        expect(result).toEqual(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
})