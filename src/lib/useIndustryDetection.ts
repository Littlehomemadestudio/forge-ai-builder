'use client';

import { useState, useCallback } from 'react';

export interface DetectionResult {
  industry: {
    id: string;
    nameEn: string;
    nameFa: string;
    group: string;
    groupFa: string;
  };
  confidence: number;
  matchedKeywords: string[];
  subIndustry?: string;
}

/**
 * Hook for the V2 industry auto-detection API.
 * Pass the user's prompt and get the detected industry back.
 */
export function useIndustryDetection() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async (prompt: string) => {
    if (!prompt || prompt.trim().length < 5) {
      setResult(null);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/industry-images?detect=${encodeURIComponent(prompt)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Detection failed');
      const det = data.detected;
      const result: DetectionResult = {
        industry: det.industry,
        confidence: det.confidence,
        matchedKeywords: det.matchedKeywords || [],
        subIndustry: det.subIndustry,
      };
      setResult(result);
      return result;
    } catch (err: any) {
      console.error('[useIndustryDetection] error:', err);
      setError(err?.message || 'Detection failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, detect };
}
