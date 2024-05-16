import {
    pgTable,
    pgEnum,
    bigint,
    uuid,
    text,
    numeric,
    boolean,
    json,
    pgSchema,
    date,
    timestamp
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])

export const auth = pgSchema("auth")

export const users = auth.table("users", {
    id: uuid("id").primaryKey().notNull(),
})

export const likes = pgTable("likes", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint("id", { mode: "number" }).primaryKey().notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
    vacature: text("vacature").notNull().references(() => vacatures.urlHash, { onDelete: "cascade" } ),
});

export const vacatures = pgTable("vacatures", {
    urlHash: text("url_hash").primaryKey().notNull(),
    organisatie: text("organisatie"),
    instelling: text("instelling"),
    organisatieOnderdeel: text("organisatie_onderdeel"),
    title: text("title"),
    salarisMin: numeric("salaris_min"),
    salarisMax: numeric("salaris_max"),
    cao: text("CAO"),
    contract: text("contract"),
    reiskostenvergoeding: text("reiskostenvergoeding"),
    werkvorm: text("werkvorm"),
    opleidingsbudget: text("opleidingsbudget"),
    opleidingsbudgetSize: numeric("opleidingsbudget_size"),
    body: text("body"),
    summary: text("summary"),
    url: text("url"),
    bodyHash: text("body_hash"),
    timestamp: timestamp('timestamp', { mode: "date",  withTimezone: true }),
    lastScraped: timestamp('last_scraped', { mode: "date", withTimezone: true }),
    synced: boolean("synced").default(false),
    urenMin: numeric("uren_min"),
    urenMax: numeric("uren_max"),
    beroepen: json("beroepen"),
    professie: text("professie").array(),
    stoornissen: json("stoornissen"),
    behandelmethoden: json("behandelmethoden"),
    fwg: text("FWG"),
    locaties: json("locaties"),
    schaalMin: text("schaal_min"),
    schaalMax: text("schaal_max"),
    screenshotUrl: text("screenshot_url"),
});

export type InsertVacature = typeof vacatures.$inferSelect;
export type SelectVacature = typeof vacatures.$inferSelect;

export type MinimumVacature = Pick<InsertVacature, 'urlHash' | 'organisatie' | 'title' | 'body' |  'url' | 'bodyHash' | 'timestamp' | 'lastScraped' | 'professie'>