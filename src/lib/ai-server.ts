/**
 * Cerebras Cloud SDK — AI provider for the app.
 *
 * All AI text features (page generation, editor suggestions) are routed through
 * the Cerebras Inference API (https://api.cerebras.ai/v1), which is
 * OpenAI-compatible. Requests STREAM token-by-token so answers appear
 * incrementally instead of arriving all at once.
 *
 * Configuration:
 *   - CEREBRAS_API_KEY  (required) — your Cerebras API key
 *   - CEREBRAS_BASE_URL (optional) — defaults to https://api.cerebras.ai/v1
 *   - CEREBRAS_MODEL    (optional) — defaults to gpt-oss-120b
 *
 * Cerebras does not provide an image-generation endpoint, so image features use
 * the curated library / SVG placeholder fallback (see industry/image-provider).
 */

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
 * Stream chat-completion tokens from the Cerebras (OpenAI-compatible) API.
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

  const {
    model = cfg.model,
    temperature = 0.7,
    maxTokens = 16000,
    timeoutMs = 180_000,
    signal,
  } = options;

  const url = `${cfg.baseUrl}/chat/completions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cfg.apiKey}`,
  };

  const body = JSON.stringify({
    model,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timer);
    const msg = String(err?.message || err);
    if (msg.includes('aborted') || msg.includes('AbortError')) {
      throw new Error(`Cerebras request timeout after ${timeoutMs}ms`);
    }
    throw err;
  }

  if (!response.ok) {
    clearTimeout(timer);
    const errorText = await response.text().catch(() => '');
    throw new Error(`Cerebras API ${response.status}: ${errorText.slice(0, 300)}`);
  }

  if (!response.body) {
    clearTimeout(timer);
    throw new Error('Cerebras API returned no response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by a blank line (\n\n or \r\n\r\n).
      let match: RegExpMatchArray | null;
      while ((match = buffer.match(/\r?\n\r?\n/)) !== null) {
        const rawEvent = buffer.slice(0, match.index!);
        buffer = buffer.slice(match.index! + match[0].length);

        for (const line of rawEvent.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const json = JSON.parse(data);
            const delta: string | undefined = json?.choices?.[0]?.delta?.content;
            if (delta) yield delta;
          } catch {
            // Partial JSON across chunks — ignore; it completes on the next read.
          }
        }
      }
    }
  } finally {
    clearTimeout(timer);
    try { reader.releaseLock(); } catch { /* already released */ }
  }
}

/** Reset the caches — useful for tests or .env hot-reload. */
export function resetAiCache(): void {
  _cachedConfig = null;
  _cachedCheck = null;
}
  }
  return 'AI features are not configured.';
}
