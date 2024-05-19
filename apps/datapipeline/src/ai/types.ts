export enum Model {
  GPT4o = 'gpt-4o',
  GPT35TURBO = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4-1106-preview',
}

export type Pricing = {
  input: number,
  output: number,
}
export type Cost = {
  input: number,
  output: number,
  total: number,
}
export type Vacature = {
  organisatie: string;
  bodyHash?: string;
  url?: string;
  urlHash: string;
  title?: string,
  body?: string
  cost?: Cost
  summary?: string
  llmParams?: {
    template: string,
    cost: Cost,
    model: Model
  },
  synced: boolean
  [key: string]: any;

}