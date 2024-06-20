import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { plaatsen } from './schema.js';
import { and, eq, gte, isNotNull, lte } from 'drizzle-orm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { log } from '@ggzoek/logging/src/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite = new Database(`${__dirname}/locaties2.db`);
sqlite.loadExtension(`${__dirname}/spellfix.dylib`);
console.log('Loaded spellfix extension');
const db: BetterSQLite3Database = drizzle(sqlite);

function getMiddlePoint(result: { GeoPoint: string }[]) {
  const lat =
    result.reduce((acc, curr) => acc + parseFloat(curr.GeoPoint.split(',')[0]), 0) / result.length;
  const lon =
    result.reduce((acc, curr) => acc + parseFloat(curr.GeoPoint.split(',')[1]), 0) / result.length;
  return `${lat},${lon}`;
}

/**
 * Returns all PC4's based on the input. For example:
 * if PC4 = 10 then return all PC4's between 1000 and 1099
 * if PC4 = 101 then return all PC4's between 1010 and 1019
 * if PC4 = 1011 then return all PC4's that are 1011
 */
export function getAllPC4(PC4: number) {
  if (PC4 < 1 || PC4 > 9999) {
    log.warn(`Invalid PC4: ${PC4}`);
    return [];
  }
  const length = PC4.toString().length;
  if (length == 4) {
    return db.select().from(plaatsen).where(eq(plaatsen.PC4, PC4)).execute();
  }
  const multiplier = 1000 / Math.pow(10, length - 1);
  const from = PC4 * multiplier;
  const to = from + multiplier - 1;
  return db
    .select()
    .from(plaatsen)
    .where(and(gte(plaatsen.PC4, from), lte(plaatsen.PC4, to)))
    .execute();
}

export async function getGeoPointMultiplePlaatsen(plaatsen: string[]) {
  const result = await Promise.all(
    plaatsen.map(async (plaats) => {
      return {
        GeoPoint: await getGeoPointPlaats(plaats)
      };
    })
  );
  return getMiddlePoint(result);
}

export async function getGeoPointPlaats(plaatsNaam: string) {
  const plaats = await findPlaats(plaatsNaam);
  const result = await db
    .select()
    .from(plaatsen)
    .where(and(eq(plaatsen.Plaats, plaats), isNotNull(plaatsen.GeoPoint)))
    .execute();

  if (result.length == 1) {
    return result[0].GeoPoint;
  }
  if (result.length > 1) {
    return getMiddlePoint(result);
  }
}

/** Get the geopoint based on the PC4.
 * If the geopoint is null, it will try to find the nearest geopoint based on the same plaatsnaam and PC4*/
export function getGeoPointPC4(pc4: number) {
  log.info(`Getting geopoint for PC4: ${pc4}`);
  const result = db.select().from(plaatsen).where(eq(plaatsen.PC4, pc4)).get();
  const plaatsNaam = result.Plaats;
  if (result && result.GeoPoint) {
    return result.GeoPoint;
  }

  function find(index: number) {
    const nextPostcode = pc4 + index;
    const result = db
      .select()
      .from(plaatsen)
      .where(
        and(
          eq(plaatsen.PC4, nextPostcode),
          isNotNull(plaatsen.GeoPoint),
          eq(plaatsen.Plaats, plaatsNaam)
        )
      )
      .get();
    if (result) {
      return result.GeoPoint;
    }
  }

  if (!result.GeoPoint) {
    for (let i = 1; i < 100; i++) {
      const next = find(i);
      const previous = find(-i);
      if (next) {
        return next;
      }
      if (previous) {
        return previous;
      }
    }
  }
}

// db.run(sql(`SELECT load_extension('spellfix1');"))

export async function findPlaats(plaats: string) {
  try {
    const result = sqlite
      .prepare('SELECT word from demo where word match ? AND TOP=5')
      .all(plaats) as { word: string }[];
    return result[0].word;
  } catch (e) {
    console.error(`Error finding plaats: ${plaats} ${e}`);
    process.exit(1);
  }
}
