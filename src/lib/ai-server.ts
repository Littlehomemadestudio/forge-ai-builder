/**
 * Cerebras Cloud SDK — AI provider for the app.
 *
 * All AI text features (page generation, editor suggestions) are routed through
 * the Cerebras Inference API using the official @cerebras/cerebras_cloud_sdk.
 * Requests STREAM token-by-token so answers appear incrementally.
 *
 * Configuration:
 *   - CEREBRAS_API_KEY  (required) — your Cerebras API key
 *   - CEREBRAS_BASE_URL (optional) — defaults to https://api.cerebras.ai/v1
 *   - CEREBRAS_MODEL    (optional) — defaults to gpt-oss-120b
 *
 * Cerebras does not provide an image-generation endpoint, so image features use
 * the curated library / SVG placeholder fallback (see industry/image-provider).
 */

import Cerebras from '@cerebras/cerebras_cloud_sdk';

export interface AiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface AiAvailability {
  available: boolean;
  reason?: 'no-config' | 'unknown';
  config?: AiConfig;
}

let _cachedConfig: AiConfig | null = null;
let _cachedCheck: AiAvailability | null = null;
let _cachedClient: Cerebras | null = null;

const DEFAULT_BASE_URL = 'https://api.cerebras.ai/v1';
const DEFAULT_MODEL = 'gpt-oss-120b';

/**
 * Load Cerebras config from environment variables.
 *   - CEREBRAS_API_KEY  (required)
 *   - CEREBRAS_BASE_URL (optional, default https://api.cerebras.ai/v1)
 *   - CEREBRAS_MODEL    (optional, default gpt-oss-120b)
 * Returns null if no API key is present.
 */
export async function loadAiConfig(): Promise<AiConfig | null> {
  if (_cachedConfig) return _cachedConfig;

  const apiKey = process.env.CEREBRAS_API_KEY?.trim();
  if (!apiKey) return null;

  _cachedConfig = {
    baseUrl: (process.env.CEREBRAS_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/$/, ''),
    apiKey,
    model: process.env.CEREBRAS_MODEL?.trim() || DEFAULT_MODEL,
  };
  return _cachedConfig;
}

/**
 * Get or create the Cerebras SDK client singleton.
 */
export async function getCerebrasClient(): Promise<Cerebras | null> {
  if (_cachedClient) return _cachedClient;

  const config = await loadAiConfig();
  if (!config) return null;

  _cachedClient = new Cerebras({
    apiKey: config.apiKey,
  });
  return _cachedClient;
}

/**
 * Check whether AI features are available on this host. Cached after first call.
 */
export async function checkAiAvailability(): Promise<AiAvailability> {
  if (_cachedCheck) return _cachedCheck;

  const config = await loadAiConfig();
  if (!config) {
    _cachedCheck = { available: false, reason: 'no-config' };
    return _cachedCheck;
  }

  _cachedCheck = { available: true, config };
  return _cachedCheck;
}

/**
 * Return a friendly user-facing message when AI is unavailable.
 */
export function aiUnavailableMessage(reason?: string): string {
  if (reason === 'no-config') {
    return 'AI features require CEREBRAS_API_KEY in .env to be enabled. Get a key at https://cloud.cerebras.ai/';
  }
  return 'AI features are not configured.';
}

/**
 * Stream chat-completion tokens from the Cerebras API using the official SDK.
 *
 * Yields content delta strings as they arrive (real streaming). Throws Error
 * with "timeout"/"aborted" in the message if the request exceeds timeoutMs.
 */
export async function* streamChatDeltas(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
  } = {}
): AsyncGenerator<string, void, void> {
  const cfg = await loadAiConfig();
  if (!cfg) {
    throw new Error(aiUnavailableMessage('no-config'));
  }

  const client = await getCerebrasClient();
  if (!client) {
    throw new Error(aiUnavailableMessage('no-config'));
  }

  const {
    model = cfg.model,
    temperature = 0.7,
    maxTokens = 16000,
    timeoutMs = 180_000,
    signal,
  } = options;

  // Set up timeout + abort handling
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const stream = await client.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  } catch (err: any) {
    clearTimeout(timer);
    const msg = String(err?.message || err);
    if (msg.includes('aborted') || msg.includes('AbortError')) {
      throw new Error(`Cerebras request timeout after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Non-streaming chat completion using the Cerebras SDK.
 * Returns the full response text in one shot.
 */
export async function chatComplete(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeoutMs?: number;
  } = {}
): Promise<string> {
  const cfg = await loadAiConfig();
  if (!cfg) {
    throw new Error(aiUnavailableMessage('no-config'));
  }

  const client = await getCerebrasClient();
  if (!client) {
    throw new Error(aiUnavailableMessage('no-config'));
  }

  const {
    model = cfg.model,
    temperature = 0.7,
    maxTokens = 16000,
    timeoutMs = 180_000,
  } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await client.chat.completions.create({
      model,
      stream: false,
      messages: [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    });

    const content = response.choices?.[0]?.message?.content || '';
    return content;
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (msg.includes('aborted') || msg.includes('AbortError')) {
      throw new Error(`Cerebras request timeout after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** Reset the caches — useful for tests or .env hot-reload. */
export function resetAiCache(): void {
  _cachedConfig = null;
  _cachedCheck = null;
  _cachedClient = null;
}
