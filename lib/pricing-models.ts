import 'server-only';

import { getCloudflareContext } from '@opennextjs/cloudflare';

import type {
  ModelConfig,
  ModelPricing,
  ModelProvider,
  ModelSupportItem,
} from '@/app/[lang]/(home)/pricing/types';

type AIServiceBinding = {
  getModels?: () => Promise<unknown> | unknown;
  fetch?: unknown;
};

function parseModels(raw: unknown): ModelConfig[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw as ModelConfig[];
  }

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return parseModels(parsed);
    } catch {
      return [];
    }
  }

  if (typeof raw === 'object' && raw !== null) {
    const values = Object.values(raw);
    if (
      values.length > 0 &&
      typeof values[0] === 'object' &&
      values[0] !== null &&
      'provider' in values[0]
    ) {
      return values as ModelConfig[];
    }

    const data = raw as { models?: unknown; data?: unknown };
    if (Array.isArray(data.models)) {
      return data.models as ModelConfig[];
    }
    if (Array.isArray(data.data)) {
      return data.data as ModelConfig[];
    }
  }

  return [];
}

const providerToCompany: Record<ModelProvider, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  deepseek: 'DeepSeek',
};

function toSupportItems(models: ModelConfig[]): ModelSupportItem[] {
  const seen = new Set<string>();

  return models
    .map((model) => {
      const displayName = model.info?.name?.trim();
      if (!displayName) return null;

      const key = `${model.provider}:${displayName}`.toLowerCase();
      if (seen.has(key)) return null;

      seen.add(key);

      model.pricing.forEach(item => {
        item.pricing.cachedInput = undefined;
      });

      return {
        model: displayName,
        pricing: model.pricing,
        deprecationDate: model.info.deprecationDate || '',
        inputModalities: model.info.modalities.input,
        company: providerToCompany[model.provider],
        minimumTier: model.availablePlan,
      } satisfies ModelSupportItem;
    })
    .filter((item): item is ModelSupportItem => item !== null)
    .sort((a, b) => {
      if (a.company !== b.company) return a.company.localeCompare(b.company);
      return a.model.localeCompare(b.model);
    });
}

export async function getSupportedModels(): Promise<ModelSupportItem[]> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const gateway = (
      env as CloudflareEnv & {
        EVERYWHERE_AI_GATEWAY?: AIServiceBinding;
      }
    ).EVERYWHERE_AI_GATEWAY;

    if (!gateway?.getModels) {
      return [];
    }

    const result = await gateway.getModels();
    const modelConfigs = parseModels(result);

    if (modelConfigs.length === 0) {
      return [];
    }
    
    const models = toSupportItems(modelConfigs);
    return models;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}
