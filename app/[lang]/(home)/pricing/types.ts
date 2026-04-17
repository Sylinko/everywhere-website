/**
 * Pricing Types
 *
 * @module pricing/types
 */

export const PLAN_HIERARCHY = ['free', 'starter', 'plus', 'pro'] as const;
export type Plan = (typeof PLAN_HIERARCHY)[number];

const PLAN_LEVEL: Record<Plan, number> = {
  free: 0,
  starter: 1,
  plus: 2,
  pro: 3,
};

export function canAccessPlan(currentPlan: Plan, minimumTier: Plan): boolean {
  return PLAN_LEVEL[currentPlan] >= PLAN_LEVEL[minimumTier];
}

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'deepseek';
export const MODEL_PROVIDERS: ModelProvider[] = [
  'openai',
  'anthropic',
  'google',
  'deepseek',
];

export interface TokenPricing {
  input: number;
  output: number;
  cachedInput?: number;
}

export interface PricingTier {
  threshold: number;
  pricing: TokenPricing;
}

export type ModelPricing = PricingTier[];

export type Modality = 'text' | 'image' | 'video' | 'audio' | 'pdf';

export interface ModelConfig {
  provider: ModelProvider;
  pricing: ModelPricing;
  availablePlan: Plan;

  // Model info with format from https://models.dev/api.json
  info: {
    name: string; // User-friendly model name
    reasoning: boolean; // Whether the model supports reasoning tasks
    toolCall: boolean; // Whether the model supports tool calls
    temperature: boolean; // Whether the model supports temperature setting
    knowledge?: string; // ISO date string of knowledge cutoff
    releaseDate: string; // ISO date string of model release
    lastUpdated: string; // ISO date string of last update
    deprecationDate?: string; // ISO date string of deprecation (if applicable)
    modalities: {
      input: Modality[];
      output: Modality[];
    };
    limit: {
      context: number; // Maximum context length in tokens
      input?: number; // Maximum input length in tokens
      output: number; // Maximum output length in tokens
    };
  };
}

export interface ModelSupportItem {
  model: string;
  pricing: ModelPricing;
  deprecationDate: string;
  inputModalities: Modality[];
  company: string;
  minimumTier: Plan;
}
