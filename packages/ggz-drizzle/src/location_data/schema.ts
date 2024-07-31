import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const plaatsen = sqliteTable('plaatsen', {
  Plaats: text('Plaats'),
  PC4: integer('PC4'),
  Gemeente: text('Gemeente'),
  Provincie: text('Provincie'),
  GeoPoint: text('GeoPoint')
});

export type Plaatsen = typeof plaatsen.$inferSelect;
