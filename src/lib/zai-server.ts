/**
 * ZAI SDK optional loader — makes the app independent of z.ai infrastructure.
 *
 * The app works on any host without z-ai-web-dev-sdk installed. AI features
 * (page generation, image generation, editor suggestions) gracefully degrade:
 *   - If `z-ai-web-dev-sdk` is installed AND a ZAI_API_KEY env var (or
 *     .z-ai-config file) is present → AI features work normally.
 *   - Otherwise → AI features return a clear "AI not configured" error, but
 *     the rest of the app (auth, dashboard, project management, templates,
 *     SVG image placeholders, manual editor) keeps working.
 *
 * This lets you deploy the project to your own host by either:
 *   1. Installing z-ai-web-dev-sdk + setting ZAI_API_KEY (full features), OR
 *   2. Just deploying as-is (AI features return friendly errors).
 */

export interface ZaiConfig {
  baseUrl: string;
  apiKey: string;
  chatId?: string;
  userId?: string;
  token?: string;
}

export interface ZaiAvailability {
  available: boolean;
  reason?: 'no-sdk' | 'no-config' | 'unknown';
  config?: ZaiConfig;
}

let _cachedConfig: ZaiConfig | null = null;
let _cachedCheck: ZaiAvailability | null = null;

/** Detect whether z-ai-web-dev-sdk is installed (without actually importing it).
 *  Returns true optimistically when running under Bun (which always has the
 *  SDK available in this dev environment); the actual probe happens in
 *  tryLoadZaiSdk() which catches the import error. */
function isSdkInstalled(): boolean {
  // The actual availability check happens in tryLoadZaiSdk() via a dynamic
  // import. Here we just return true so checkZaiAvailability() will defer to
  // the config check (which is the real gatekeeper).
  return true;
}

/**
 * Load ZAI config from, in order:
 *   1. Environment variables (ZAI_API_KEY, ZAI_BASE_URL)
 *   2. .z-ai-config in process.cwd()
 *   3. ~/.z-ai-config
 *   4. /etc/.z-ai-config
 *
 * Returns null if no config is found.
 */
export async function loadZaiConfig(): Promise<ZaiConfig | null> {
  if (_cachedConfig) return _cachedConfig;

  // 1) Env vars — preferred for portable deployment (no .z-ai-config needed)
  if (process.env.ZAI_API_KEY && process.env.ZAI_BASE_URL) {
    _cachedConfig = {
      baseUrl: process.env.ZAI_BASE_URL,
      apiKey: process.env.ZAI_API_KEY,
      chatId: process.env.ZAI_CHAT_ID,
      userId: process.env.ZAI_USER_ID,
      token: process.env.ZAI_TOKEN,
    };
    return _cachedConfig;
  }
  // Single env var shorthand: just the key, default base URL
  if (process.env.ZAI_API_KEY) {
    _cachedConfig = {
      baseUrl: process.env.ZAI_BASE_URL || 'https://api.z.ai/api/paas/v4',
      apiKey: process.env.ZAI_API_KEY,
      chatId: process.env.ZAI_CHAT_ID,
      userId: process.env.ZAI_USER_ID,
      token: process.env.ZAI_TOKEN,
    };
    return _cachedConfig;
  }

  // 2-4) File-based config
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');
    const candidates = [
      path.join(process.cwd(), '.z-ai-config'),
      path.join(os.homedir(), '.z-ai-config'),
      '/etc/.z-ai-config',
    ];
    for (const p of candidates) {
      try {
        const txt = await fs.readFile(p, 'utf-8');
        const cfg = JSON.parse(txt);
        if (cfg.baseUrl && cfg.apiKey) {
          _cachedConfig = cfg as ZaiConfig;
          return _cachedConfig;
        }
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* fs unavailable */
  }

  return null;
}

/**
 * Check whether AI features are available on this host.
 * Cached after first call.
 */
export async function checkZaiAvailability(): Promise<ZaiAvailability> {
  if (_cachedCheck) return _cachedCheck;

  const sdkInstalled = isSdkInstalled();
  const config = await loadZaiConfig();

  if (!sdkInstalled && !config) {
    _cachedCheck = { available: false, reason: 'no-sdk' };
    return _cachedCheck;
  }
  if (!config) {
    _cachedCheck = { available: false, reason: 'no-config' };
    return _cachedCheck;
  }

  _cachedCheck = { available: true, config };
  return _cachedCheck;
}

/**
 * Return a friendly user-facing message when AI is unavailable.
 * Used by API routes to give actionable error messages.
 */
export function aiUnavailableMessage(reason?: string): string {
  if (reason === 'no-sdk') {
    return 'AI features are not installed on this host. Install z-ai-web-dev-sdk (npm i z-ai-web-dev-sdk) and set ZAI_API_KEY in .env to enable AI generation.';
  }
  if (reason === 'no-config') {
    return 'AI features require ZAI_API_KEY (and optionally ZAI_BASE_URL) in .env, or a .z-ai-config file in the project root.';
  }
  return 'AI features are not configured.';
}

/**
 * Call the ZAI chat completions API directly via fetch.
 * Bypasses the SDK to avoid Bun + large-response crashes.
 *
 * Throws Error if config is missing or the request fails.
 */
export async function callZaiChatDirect(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    timeoutMs?: number;
    onTick?: () => void;
  } = {}
): Promise<string> {
  const cfg = await loadZaiConfig();
  if (!cfg) {
    throw new Error(aiUnavailableMessage('no-config'));
  }

  const {
    model = 'glm-4.5-flash',
    temperature = 0.7,
    maxTokens = 8000,
    timeoutMs = 120000,
    onTick,
  } = options;

  const url = `${cfg.baseUrl}/chat/completions`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cfg.apiKey}`,
    'X-Z-AI-From': 'Z',
  };
  if (cfg.chatId) headers['X-Chat-Id'] = cfg.chatId;
  if (cfg.userId) headers['X-User-Id'] = cfg.userId;
  if (cfg.token) headers['X-Token'] = cfg.token;

  const body = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    thinking: { type: 'disabled' },
    temperature,
    max_tokens: maxTokens,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  onTick?.();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });
    onTick?.();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ZAI API ${response.status}: ${errorText.slice(0, 300)}`);
    }

    const text = await response.text();
    onTick?.();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr: any) {
      throw new Error(`Failed to parse ZAI response as JSON: ${String(parseErr?.message || parseErr).slice(0, 200)}`);
    }

    const content = parsed?.choices?.[0]?.message?.content || '';
    if (!content || content.length < 50) {
      throw new Error(`ZAI returned empty or too-short content (len=${content.length})`);
    }
    return content as string;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Optionally import the SDK for features that use it (image search/generation).
 * Returns null if SDK is not installed.
 */
export async function tryLoadZaiSdk(): Promise<any | null> {
  try {
    const mod = await import('z-ai-web-dev-sdk');
    return mod.default;
  } catch {
    return null;
  }
}

/** Reset the caches — useful for tests or .env hot-reload. */
export function resetZaiCache(): void {
  _cachedConfig = null;
  _cachedCheck = null;
}
