import type {SearchParams, SearchResponse} from "meilisearch";
import supabase from '@supabase/supabase-js';

export type Vacature = {
    urlHash: string;
    title: string;
    summary: string;
    url: string;
    instelling: string;
    organisatieOnderdeel: string;
    minSalaris: string
    maxSalaris: string
    minSchaal: string
    maxSchaal: string
    minUren: string
    maxUren: string
    stoornissen: string[]
    behandelmethoden: string[]
    locaties: string[]
    beroepen: string[]
    CAO: string
    FWG: string
    contract: string
    reiskostenvergoeding: string
    werkvorm: string
    opleidingsbudget: string
    body?: string
    lastScraped: string
    opleidingsbudgetSize: number
    screenshotUrl: string

};

export type SearchData = {
    response: SearchResponse<Vacature>
    searchCommand: {
        query: string | null
        options: SearchParams
    }
}

export type MyLocals = {
    userId: string | undefined;
    supabase: supabase.SupabaseClient;
    getSession: () => any
    next?: string
};

