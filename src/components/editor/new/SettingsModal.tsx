'use client';

import React, { useState } from 'react';
import { useTheme } from './theme';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const tokens = useTheme();
  const [fontScale, setFontScale] = useState<'small' | 'medium' | 'large' | 'extraLarge'>('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editor settings"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: tokens.zIndex.modalBackdrop,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: tokens.colors.panel,
          borderRadius: tokens.borderRadius.xl,
          boxShadow: tokens.shadows.xl,
          width: '480px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: tokens.spacing[6],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing[5] }}>
          <h2 style={{ fontSize: tokens.typography.scale['2xl'], fontWeight: tokens.typography.weights.bold, color: tokens.colors.textPrimary, margin: 0 }}>Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: tokens.borderRadius.md,
              border: 'none',
              backgroundColor: 'transparent',
              color: tokens.colors.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <Section title="Accessibility" tokens={tokens}>
          <ToggleRow label="Reduce motion" description="Minimize animations" tokens={tokens} checked={reducedMotion} onChange={setReducedMotion} />
          <ToggleRow label="High contrast" description="Increase contrast" tokens={tokens} checked={highContrast} onChange={setHighContrast} />
          <SettingRow label="Font size" tokens={tokens}>
            <div role="group" aria-label="Font size" style={{ display: 'flex', gap: tokens.spacing[1] }}>
              {(['small', 'medium', 'large', 'extraLarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontScale(size)}
                  aria-pressed={fontScale === size}
                  aria-label={`Font size ${size}`}
                  style={{
                    flex: 1,
                    padding: tokens.spacing[2],
                    borderRadius: tokens.borderRadius.md,
                    border: '1px solid ${tokens.colors.border}',
                    backgroundColor: fontScale === size ? tokens.colors.selectionBg : 'transparent',
                    color: fontScale === size ? tokens.colors.primary : tokens.colors.textSecondary,
                    fontSize: tokens.typography.scale.sm,
                    fontWeight: tokens.typography.weights.medium,
                    cursor: 'pointer',
                    minHeight: tokens.accessibility.minTouchTarget,
                  }}
                >
                  {size === 'extraLarge' ? 'XL' : size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </SettingRow>
        </Section>

        <Section title="Canvas" tokens={tokens}>
          <SettingRow label="Default zoom" tokens={tokens}>
            <select style={{ ...inputStyle(tokens) }} defaultValue="100">
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
            </select>
          </SettingRow>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, tokens, children }: { title: string; tokens: ReturnType<typeof useTheme>; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: tokens.spacing[5], borderBottom: `1px solid ${tokens.colors.border}`, paddingBottom: tokens.spacing[4] }}>
      <h3 style={{ fontSize: tokens.typography.scale.base, fontWeight: tokens.typography.weights.semibold, color: tokens.colors.textPrimary, margin: `0 0 ${tokens.spacing[3]} 0` }}>{title}</h3>
      {children}
    </div>
  );
}

function SettingRow({ label, tokens, children }: { label: string; tokens: ReturnType<typeof useTheme>; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: tokens.spacing[3] }}>
      <label style={{ display: 'block', fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary, marginBottom: tokens.spacing[2], fontWeight: tokens.typography.weights.medium }}>{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, tokens, checked, onChange }: { label: string; description: string; tokens: ReturnType<typeof useTheme>; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing[3] }}>
      <div>
        <div style={{ fontSize: tokens.typography.scale.base, color: tokens.colors.textPrimary, fontWeight: tokens.typography.weights.medium }}>{label}</div>
        <div style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary }}>{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: tokens.borderRadius.full,
          border: 'none',
          backgroundColor: checked ? tokens.colors.primary : tokens.colors.border,
          position: 'relative',
          cursor: 'pointer',
          transition: `background-color ${tokens.motion.fast} ${tokens.motion.easeOut}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: tokens.colors.panel,
            boxShadow: tokens.shadows.sm,
            transition: `left ${tokens.motion.fast} ${tokens.motion.easeOut}`,
          }}
        />
      </button>
    </div>
  );
}

const inputStyle = (tokens: ReturnType<typeof useTheme>): React.CSSProperties => ({
  width: '100%',
  padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
  borderRadius: tokens.borderRadius.md,
  border: `1px solid ${tokens.colors.border}`,
  backgroundColor: tokens.colors.panel,
  color: tokens.colors.textPrimary,
  fontSize: tokens.typography.scale.sm,
  minHeight: tokens.accessibility.minTouchTarget,
  outline: 'none',
});
