import { describe, expect, it } from 'vitest';
import {
  findPlaats,
  getAllPC4,
  getGeoPointMultiplePlaatsen,
  getGeoPointPC4,
  getGeoPointPlaats
} from './repo.js';

describe('Locatie repo test', () => {
  it('Gets geopoint based on PC4', async () => {
    const result = getGeoPointPC4(1095);
    console.log(result);
  });
  it('Retrieves Geopoint for next PC4 and same Plaatsnaam if geopoint is null', async () => {
    const result = await getGeoPointPC4(1040);
    console.log(result);
    expect(result).toBe('52.4129956147,4.8432371208');
  });
  it('Retrieves nearest Geopoint for previous PC4 and same Plaatsnaam if geopoint is null', async () => {
    const result = await getGeoPointPC4(1084);
    console.log(result);
    expect(result).toBe('52.3314532985,4.88852781396');
  });
  it('Returns average Geopoint', async () => {
    const result = await getGeoPointPlaats('Amsterdam');
    console.log(result);
    expect(result).toBe('52.3735254197736,4.8825790459775');
  });
  it('Returns average Geopoint also when name misspelled', async () => {
    const result = await getGeoPointPlaats('dehaag');
    console.log(result);
    expect(result).toBe('52.06997066644755,4.300333195993115');
  });
  it('Fuzzy searches plaats', async () => {
    const result = await findPlaats('sheerenberg');
    expect(result).toBe('s-Heerenberg');
  });
  it('Finds st michielsgestel', async () => {
    const result = await findPlaats('sint Michielsgestel');
    console.log(result);
  });
  it('Returns average Geopoint on fuzzy search', async () => {
    const result = await getGeoPointPlaats('berlcum');
    console.log(result);
    expect(result).toBe('51.6795514547,5.41192890272');
  });
  it('Returns correct result on array of 1', async () => {
    const result = await getGeoPointMultiplePlaatsen(['berlcum']);
    console.log(result);
    expect(result).toBe('51.6795514547,5.41192890272');
  });
  it('Returns the middlepoint of multiple plaatsen', async () => {
    const result = await getGeoPointMultiplePlaatsen(['Amsterdam', 'Rotterdam']);
    console.log(result);
    expect(result).toBe('52.14692371392921,4.682061924212235');
  });
  it('should return list of postcodes', async () => {
    const result = await getAllPC4(52);
    const pcs = result.map((r) => r.PC4);
    console.log(pcs);
    expect(pcs.every((pc) => pc >= 5200)).toBe(true);
    expect(pcs.every((pc) => pc <= 5299)).toBe(true);
  });
  it('should return list of postcodes', async () => {
    const result = await getAllPC4(706);
    const pcs = result.map((r) => r.PC4);
    console.log(pcs);
    expect(pcs.length).toBeGreaterThan(0);
    expect(pcs.every((pc) => pc >= 7060)).toBe(true);
    expect(pcs.every((pc) => pc <= 7069)).toBe(true);
  });
  it('Should return an empty array', async () => {
    const result = await getAllPC4(10000);
    expect(result).toEqual([]);
  });
});
