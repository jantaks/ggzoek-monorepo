import {randomItems} from "./utils.js";


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