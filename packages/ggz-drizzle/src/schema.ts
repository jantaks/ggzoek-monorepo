import {
  bigint,
  boolean,
  integer,
  json,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const keyStatus = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired']);
export const keyType = pgEnum('key_type', [
  'aead-ietf',
  'aead-det',
  'hmacsha512',
  'hmacsha256',
  'auth',
  'shorthash',
  'generichash',
  'kdf',
  'secretbox',
  'secretstream',
  'stream_xchacha20'
]);
export const factorType = pgEnum('factor_type', ['totp', 'webauthn']);
export const factorStatus = pgEnum('factor_status', ['unverified', 'verified']);
export const aalLevel = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['s256', 'plain']);

export const auth = pgSchema('auth');

export const users = auth.table('users', {
  id: uuid('id').primaryKey().notNull()
});

export const plaatsen = pgTable(
  'plaatsen',
  {
    Plaats: text('Plaats'),
    PC4: integer('PC4'),
    Gemeente: text('Gemeente'),
    Provincie: text('Provincie'),
    GeoPoint: text('GeoPoint')
  },
  (t) => ({
    unq: unique().on(t.PC4, t.Plaats)
  })
);

export type Plaatsen = typeof plaatsen.$inferSelect;

export const likes = pgTable('likes', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  // id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  vacature: text('vacature')
    .notNull()
    .references(() => vacatures.urlHash, { onDelete: 'cascade' })
});

export const scrapeResults = pgTable('scrape_results', {
  scraperName: text('scraper').notNull(),
  vacaturesFound: bigint('vacatures_found', { mode: 'number' }).notNull(),
  vacaturesUpdated: bigint('vacatures_updated', { mode: 'number' }).notNull(),
  newUrls: bigint('new_urls', { mode: 'number' }),
  requestsFinished: bigint('requests_finished', { mode: 'number' }).notNull(),
  requestsFailed: bigint('requests_failed', { mode: 'number' }),
  requestsRetries: bigint('requests_retries', { mode: 'number' }),
  requestsFailedPerMinute: bigint('requests_failed_per_minute', { mode: 'number' }),
  requestsFinishedPerMinute: bigint('requests_finished_per_minute', { mode: 'number' }),
  requestMinDurationMillis: bigint('request_min_duration_millis', { mode: 'number' }),
  requestMaxDurationMillis: bigint('request_max_duration_millis', { mode: 'number' }),
  requestTotalFailedDurationMillis: bigint('request_total_failed_duration_millis', {
    mode: 'number'
  }),
  requestTotalFinishedDurationMillis: bigint('request_total_finished_duration_millis', {
    mode: 'number'
  }),
  crawlerStartedAt: timestamp('crawler_started_at', { mode: 'date', withTimezone: true }),
  crawlerFinishedAt: timestamp('crawler_finished_at', {
    mode: 'date',
    withTimezone: true
  }),
  statsPersistedAt: timestamp('stats_persisted_at', { mode: 'date', withTimezone: true }),
  crawlerRuntimeMillis: bigint('crawler_runtime_millis', { mode: 'number' }),
  requestsWithStatusCode: json('requests_with_status_code'),
  errors: json('errors'),
  retryErrors: json('retry_errors')
});

export type InsertScrapeResult = typeof scrapeResults.$inferInsert;
export type SelectScrapeResult = typeof scrapeResults.$inferSelect;

export const savedSearches = pgTable('saved_searches', {
  id: serial('id').primaryKey(),
  search: text('search').notNull().unique()
});

export const userSearches = pgTable(
  'user_searches',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    searchId: integer('search_id')
      .notNull()
      .references(() => savedSearches.id, { onDelete: 'cascade' }),
    createdDateTime: timestamp('created', { mode: 'date', withTimezone: true }).defaultNow(),
    updatedDateTime: timestamp('updated', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedResultId: integer('updated_result_id').references(() => searchResults.id, {
      onDelete: 'set null'
    })
  },
  (t) => ({
    unq1: unique().on(t.userId, t.searchId),
    unq2: unique().on(t.userId, t.searchId, t.updatedResultId)
  })
);

export const searchResults = pgTable(
  'search_results',
  {
    id: serial('id').primaryKey(),
    searchId: integer('search_id')
      .notNull()
      .references(() => savedSearches.id, { onDelete: 'cascade' }),
    result: text('result').array().notNull(),
    dateTime: timestamp('date_time', { mode: 'date', withTimezone: true }).notNull().defaultNow()
  },
  (t) => ({ unq: unique().on(t.searchId, t.id) })
);

export const vacatures = pgTable('vacatures', {
  urlHash: text('url_hash').primaryKey().notNull(),
  organisatie: text('organisatie').notNull(),
  instelling: text('instelling'),
  organisatieOnderdeel: text('organisatie_onderdeel'),
  title: text('title').notNull(),
  ai_title: text('ai_title'),
  salarisMin: bigint('salaris_min', { mode: 'number' }),
  salarisMax: bigint('salaris_max', { mode: 'number' }),
  contract: text('contract'),
  reiskostenvergoeding: text('reiskostenvergoeding'),
  werkvorm: text('werkvorm'),
  opleidingsbudget: text('opleidingsbudget'),
  opleidingsbudgetSize: numeric('opleidingsbudget_size'),
  body: text('body'),
  summary: text('summary'),
  summaryModel: text('summary_model'),
  summaryBatchId: integer('summary_batch_id'),
  summaryCost: numeric('summary_cost', { scale: 6 }),
  summaryTimestamp: timestamp('summary_timestamp', { mode: 'date', withTimezone: true }),
  extractionModel: text('extraction_model'),
  extractionCost: numeric('extraction_cost', { scale: 6 }),
  url: text('url').notNull(),
  bodyHash: text('body_hash'),
  firstScraped: timestamp('first_scraped', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  lastScraped: timestamp('last_scraped', { mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow(),
  synced: boolean('synced').default(false),
  urenMin: bigint('uren_min', { mode: 'number' }),
  urenMax: bigint('uren_max', { mode: 'number' }),
  professie: text('professie').array().notNull(),
  beroepen: text('beroepen').array().notNull(),
  //Stores values as determined by AI. These values are further processed / normalised / standardized in the augmentation step and stored in the aandachtsgebieden field.
  aandachtsgebieden_ai: text('aandachtsgebieden_ai').array(),
  aandachtsgebieden: text('aandachtsgebieden').array(),
  // See comment on aandachtsgebieden
  therapievormen_ai: text('therapievormen_ai').array(),
  therapievormen: text('therapievormen').array(),
  locaties: text('locaties').array(),
  cao: text('CAO'),
  fwg: text('FWG'),
  schaalMin: text('schaal_min'),
  schaalMax: text('schaal_max'),
  screenshotUrl: text('screenshot_url'),
  geoPoint: text('geo_point')
});

export const selectSchema = createSelectSchema(vacatures);

export const insertSchema = createInsertSchema(vacatures, {
  url: (schema) => schema.url.url(),
  summary: (schema) => schema.summary,
  title: (schema) => schema.title.min(5),
  professie: (schema) => schema.professie,
  urenMin: (schema) => schema.urenMin,
  urenMax: (schema) => schema.urenMax
})
  .required({
    title: true,
    summary: true,
    urlHash: true
  })
  .omit({ opleidingsbudgetSize: true });

export type InsertVacature = typeof vacatures.$inferInsert;
export type SelectVacature = typeof vacatures.$inferSelect;

export type MinimumVacature = Pick<
  InsertVacature,
  | 'urlHash'
  | 'organisatie'
  | 'title'
  | 'body'
  | 'url'
  | 'bodyHash'
  // | 'firstScraped'
  | 'lastScraped'
  | 'professie'
>;
