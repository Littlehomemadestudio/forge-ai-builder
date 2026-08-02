'use client';

import React from 'react';
import { useTheme } from './theme';

interface BottomAIProps {
  onAction: (action: string) => void;
}

export function BottomAI({ onAction }: BottomAIProps) {
  const tokens = useTheme();
  const [input, setInput] = React.useState('');

  const suggestions = [
    { label: 'Improve design', icon: 'improve' },
    { label: 'Fix accessibility', icon: 'a11y' },
    { label: 'Add animations', icon: 'animate' },
    { label: 'Rewrite text', icon: 'text' },
  ];

  return (
    <div
      style={{
        height: '72px',
        backgroundColor: tokens.colors.panel,
        borderTop: `1px solid ${tokens.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${tokens.spacing[4]}`,
        gap: tokens.spacing[3],
        zIndex: tokens.zIndex.sticky,
      }}
      role="region"
      aria-label="AI assistant"
    >
      <div style={{ display: 'flex', gap: tokens.spacing[2] }}>
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onAction(s.label)}
            aria-label={s.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing[2],
              padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
              borderRadius: tokens.borderRadius.full,
              border: `1px solid ${tokens.colors.border}`,
              backgroundColor: tokens.colors.hover,
              color: tokens.colors.textPrimary,
              fontSize: tokens.typography.scale.sm,
              fontWeight: tokens.typography.weights.medium,
              cursor: 'pointer',
              minHeight: tokens.accessibility.minTouchTarget,
              transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">{getAIIcon(s.icon)}</svg>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to edit anything..."
          aria-label="AI prompt"
          style={{
            width: '100%',
            padding: `${tokens.spacing[3]} ${tokens.spacing[4]} ${tokens.spacing[3]} ${tokens.spacing[10]}`,
            borderRadius: tokens.borderRadius.full,
            border: `1px solid ${tokens.colors.border}`,
            backgroundColor: tokens.colors.hover,
            color: tokens.colors.textPrimary,
            fontSize: tokens.typography.scale.base,
            outline: 'none',
            minHeight: tokens.accessibility.minTouchTarget,
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: tokens.spacing[4],
            top: '50%',
            transform: 'translateY(-50%)',
            color: tokens.colors.textMuted,
            pointerEvents: 'none',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 5.5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </div>

      <button
        aria-label="Send prompt"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: tokens.borderRadius.full,
          border: 'none',
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.textInverse,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 3v12M4 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

function getAIIcon(icon: string): React.ReactNode {
  switch (icon) {
    case 'improve':
      return <><path d="M4 12l3-3 2 2 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 3v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'a11y':
      return <><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>;
    case 'animate':
      return <><path d="M3 9h10M9 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="5" cy="5" r="1.5" fill="currentColor"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="13" cy="13" r="1.5" fill="currentColor"/></>;
    case 'text':
      return <><path d="M3 4h10M6 4v7M6 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    default:
      return null;
  }
}
