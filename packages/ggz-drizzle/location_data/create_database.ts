import * as fs from 'fs';
import csv, { type Options } from 'csv-parser';
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import _ from 'lodash';
import { plaatsen } from './schema.js';
import Database from 'better-sqlite3';

interface Plaats {
  Plaats: string;
  PC4: string;
  Gemeente: string;
  Provincie: string;
  GeoPoint?: string;
}

type PC4 = number;
type GeoPoint = string;

interface GeoPointCsv {
  GeoPoint: GeoPoint;
  PC4: PC4;
}

let geoMapping: { [key: PC4]: GeoPoint };

const sqlite = Database('./location_data/locaties2.db');
sqlite.loadExtension('./location_data/spellfix.dylib');
const db: BetterSQLite3Database = drizzle(sqlite);

async function createDatabase() {
  db.run(sql`DROP TABLE IF EXISTS plaatsen;`);
  db.run(sql`DROP TABLE IF EXISTS demo;`);
  db.run(sql`
      CREATE TABLE IF NOT EXISTS plaatsen
      (
          PC4       NUMERIC,
          Plaats    TEXT,
          Gemeente  TEXT,
          Provincie TEXT,
          GeoPoint  TEXT,
          UNIQUE (PC4, Plaats)
      );
  `);
  db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_plaatsen_plaats
          ON plaatsen (Plaats);
  `);
  db.run(sql`
      CREATE INDEX IF NOT EXISTS idx_plaatsen_pc4
          ON plaatsen (PC4);
  `);
  db.run(sql`
      CREATE
      VIRTUAL
      TABLE demo
      USING spellfix1;
  `);
}

function parseCsv<T>(filePath: string, options: Options = { separator: ';' }): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filePath)
      .pipe(csv(options))
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

function fromRow(row: Plaats, pc4: string): Plaats {
  const result = {
    Plaats: row.Plaats,
    PC4: pc4,
    Gemeente: row.Gemeente,
    Provincie: row.Provincie,
    GeoPoint: geoMapping[pc4]
  };
  return result;
}

async function insertPlaatsen(rows: Plaats[]) {
  for (const row of rows) {
    const pc4Range = row.PC4.split('–');
    if (pc4Range.length === 2) {
      const start = parseInt(pc4Range[0], 10);
      const end = parseInt(pc4Range[1], 10);
      for (let pc4 = start; pc4 <= end; pc4++) {
        try {
          const values = fromRow(row, pc4.toString());
          await db.insert(plaatsen).values(values);
          console.log(`Inserted ${row.Plaats} ${pc4}`);
        } catch (err) {
          console.log(`Could not insert ${row.Plaats} ${pc4}`, err.toString());
        }
      }
    } else {
      await db.insert(plaatsen).values(fromRow(row, row.PC4));
    }
  }
}

function populatedVirtualTable() {
  db.run(sql`
      INSERT INTO demo(word)
      select DISTINCT Plaats
      from plaatsen;
  `);
}

async function run(plaatsCsv: string, geoCsv: string) {
  await createDatabase();
  const plaatsnamen = await parseCsv<Plaats>(plaatsCsv, {
    separator: ','
  });
  const geopoints = await parseCsv<GeoPointCsv>(geoCsv);
  geoMapping = _.chain(geopoints).keyBy('PC4').mapValues('GeoPoint').value();
  await insertPlaatsen(plaatsnamen);
  populatedVirtualTable();
  // console.log('Database population completed.');
}

run('./location_data/woonplaatsen_pc4.csv', './location_data/georef-netherlands-postcode-pc4.csv')
  .then(() => {
    console.log('Database population completed.');
  })
  .catch((err) => {
    console.error(err);
  });
