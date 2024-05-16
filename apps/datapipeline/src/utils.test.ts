import { randomItems } from './utils.js';
import { expect, test, describe, it } from 'vitest';
import { getBeroep, Beroep, findSynonym, cleanString, tokenize } from './beroepen.js';


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
        expect(beroep).contains(Beroep.Psychiater);
    });
    it('Verwijderd beroep uit de titel bij eerste match', () => {
        const title = 'GZ psycholoog Kliniek';
        const beroep = getBeroep(title);
        expect(beroep).toEqual([Beroep.GZPsycholoog]);
    });
    it('Missende letter', () => {
        const title = 'Vacature voor een verpleegkundig spcialist';
        const beroep = getBeroep(title);
        expect(beroep).contains(Beroep.VerpleegkundigSpecialist);
    });
    it('Taalfoutje', () => {
        const title = 'Vacature voor een klinisc sycholoog in den HAagen omstrreken';
        const beroep = getBeroep(title);
        expect(beroep).contains(Beroep.KlinischPsycholoog);
    })
    it('Taalfoutje 2', () => {
        const title = 'Gezocht een Sociaal sychiatrisch Verpleegkundige';
        const beroep = getBeroep(title);
        expect(beroep).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Taalfoutje 3', () => {
        const title = 'Ingeest zoekt een Verpeegkundig voor de afdeling psychiatrie';
        const beroep = getBeroep(title);
        expect(beroep).contains(Beroep.Verpleegkundige);
    })
    it('Taalfoutje te groot', () => {
        const title = 'Gezocht een hele leuke Verpegkund';
        const beroep = getBeroep(title);
        expect(beroep).empty;
    })
    it('Kiest langste beroepenwoord', () => {
        const title = 'wij zoeken geen gewone therapeut maar een Pscyhomotorisch Therapeut';
        const beroep = getBeroep(title);
        expect(beroep).contains(Beroep.PsychomotorischTherapeut);
    })
    it('Ignores special characters', () => {
        const title = 'wij zoeken geen gewone pscyholoog maar een gz   pycholoog';
        const beroep = getBeroep(title);
        expect(beroep).contains(Beroep.GZPsycholoog);
    })
    it('Finds synonyms', () => {
        const title = 'wij zoeken een spv voor een instelling';
        const beroep = getBeroep(title);
        expect(beroep).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Finds synonyms 2', () => {
        let title = 'wij zoeken een Kinderpsychater voor een instelling';
        let beroep = getBeroep(title);
        expect(beroep).contains(Beroep.KindJeugdPsychiater);
        title = 'wij zoeken een Kind- en Jeugdpsychater voor een instelling';
        beroep = getBeroep(title);
        expect(beroep).contains(Beroep.KindJeugdPsychiater);
    })
    it('Removes /', () => {
        const title = 'ANIOS/Basisarts psychiatrie (ggz) – (Reinier van Arkel) ';
        const result = getBeroep(title);
        expect(result).contains(Beroep.ANIOS);
    })
    it('Ignores certain words, e.g. psychiatrie', () => {
        const title = 'Spv voor in de kind- en jeugd psychiatrie';
        const result = getBeroep(title);
        expect(result).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
    it('Ignores certain words, e.g. psychiatrie (2)', () => {
        const title = 'Sociotherapeut/SPV Deeltijdbehandeling 6-12 jaar Kinder- en Jeugdpsychiatrie (24-32 uur)';
        const result = getBeroep(title);
        expect(result).contains(Beroep.Sociotherapeut);
        expect(result).contains(Beroep.SociaalPsychiatrischVerpleegkundige);
    })
})