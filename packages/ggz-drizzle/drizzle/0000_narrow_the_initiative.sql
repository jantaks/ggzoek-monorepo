-- CREATE SCHEMA "auth";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_status" AS ENUM('default', 'valid', 'invalid', 'expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_type" AS ENUM('aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"user_id" uuid NOT NULL,
	"vacature" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plaatsen" (
	"Plaats" text,
	"PC4" integer,
	"Gemeente" text,
	"Provincie" text,
	"GeoPoint" text,
	CONSTRAINT "plaatsen_PC4_Plaats_unique" UNIQUE("PC4","Plaats")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "saved_searches" (
	"id" serial PRIMARY KEY NOT NULL,
	"search" text NOT NULL,
	CONSTRAINT "saved_searches_search_unique" UNIQUE("search")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "scrape_results" (
	"scraper" text NOT NULL,
	"vacatures_found" bigint NOT NULL,
	"vacatures_updated" bigint NOT NULL,
	"new_urls" bigint,
	"requests_finished" bigint NOT NULL,
	"requests_failed" bigint,
	"requests_retries" bigint,
	"requests_failed_per_minute" bigint,
	"requests_finished_per_minute" bigint,
	"request_min_duration_millis" bigint,
	"request_max_duration_millis" bigint,
	"request_total_failed_duration_millis" bigint,
	"request_total_finished_duration_millis" bigint,
	"crawler_started_at" timestamp with time zone,
	"crawler_finished_at" timestamp with time zone,
	"stats_persisted_at" timestamp with time zone,
	"crawler_runtime_millis" bigint,
	"requests_with_status_code" json,
	"errors" json,
	"retry_errors" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"search_id" integer NOT NULL,
	"result" text[] NOT NULL,
	"date_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "search_results_search_id_id_unique" UNIQUE("search_id","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_searches" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"search_id" integer NOT NULL,
	"updated_date_time" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_result_id" integer,
	CONSTRAINT "user_searches_user_id_search_id_unique" UNIQUE("user_id","search_id"),
	CONSTRAINT "user_searches_user_id_search_id_updated_result_id_unique" UNIQUE("user_id","search_id","updated_result_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vacatures" (
	"url_hash" text PRIMARY KEY NOT NULL,
	"organisatie" text NOT NULL,
	"instelling" text,
	"organisatie_onderdeel" text,
	"title" text NOT NULL,
	"ai_title" text,
	"salaris_min" bigint,
	"salaris_max" bigint,
	"contract" text,
	"reiskostenvergoeding" text,
	"werkvorm" text,
	"opleidingsbudget" text,
	"opleidingsbudget_size" numeric,
	"body" text,
	"summary" text,
	"summary_model" text,
	"summary_batch_id" integer,
	"summary_cost" numeric,
	"summary_timestamp" timestamp with time zone,
	"extraction_model" text,
	"extraction_cost" numeric,
	"url" text NOT NULL,
	"body_hash" text,
	"first_scraped" timestamp with time zone DEFAULT now() NOT NULL,
	"last_scraped" timestamp with time zone DEFAULT now() NOT NULL,
	"synced" boolean DEFAULT false,
	"uren_min" bigint,
	"uren_max" bigint,
	"professie" text[] NOT NULL,
	"beroepen" text[] NOT NULL,
	"stoornissen_ai" text[],
	"stoornissen" text[],
	"behandelmethoden_ai" text[],
	"behandelmethoden" text[],
	"locaties" text[],
	"CAO" text,
	"FWG" text,
	"schaal_min" text,
	"schaal_max" text,
	"screenshot_url" text,
	"geo_point" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_vacature_vacatures_url_hash_fk" FOREIGN KEY ("vacature") REFERENCES "vacatures"("url_hash") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "search_results" ADD CONSTRAINT "search_results_search_id_saved_searches_id_fk" FOREIGN KEY ("search_id") REFERENCES "saved_searches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_searches" ADD CONSTRAINT "user_searches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_searches" ADD CONSTRAINT "user_searches_search_id_saved_searches_id_fk" FOREIGN KEY ("search_id") REFERENCES "saved_searches"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_searches" ADD CONSTRAINT "user_searches_updated_result_id_search_results_id_fk" FOREIGN KEY ("updated_result_id") REFERENCES "search_results"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
