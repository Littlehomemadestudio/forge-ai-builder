'use client';

import React from 'react';
import { useTheme } from './theme';
import type { EditorMode } from './useEditor';

interface TopNavProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onToggleShortcuts: () => void;
  onToggleSettings: () => void;
  onToggleCommandPalette: () => void;
  onToggleAccessibility: () => void;
  onSave: () => void;
  onPublish: () => void;
  isSaving: boolean;
}

export function TopNav({
  mode,
  onModeChange,
  onToggleShortcuts,
  onToggleSettings,
  onToggleCommandPalette,
  onToggleAccessibility,
  onSave,
  onPublish,
  isSaving,
}: TopNavProps) {
  const tokens = useTheme();

  return (
    <header
      className="editor-top-nav"
      style={{
        height: '56px',
        backgroundColor: tokens.colors.panel,
        borderBottom: `1px solid ${tokens.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${tokens.spacing[4]}`,
        zIndex: tokens.zIndex.sticky,
        position: 'relative',
      }}
      role="banner"
    >
      {/* Left: Logo + Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: tokens.borderRadius.md,
            backgroundColor: tokens.colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tokens.colors.textInverse,
            fontWeight: tokens.typography.weights.bold,
            fontSize: tokens.typography.scale.lg,
          }}
          aria-label="Forge AI Builder"
        >
          F
        </div>
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
          <span style={{ fontSize: tokens.typography.scale.base, fontWeight: tokens.typography.weights.semibold, color: tokens.colors.textPrimary }}>
            My Website
          </span>
          <span style={{ color: tokens.colors.textMuted }} aria-hidden="true">/</span>
          <span style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary }}>
            Home
          </span>
        </nav>
      </div>

      {/* Center: Mode Toggle */}
      <div role="group" aria-label="Editor mode" style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[1], backgroundColor: tokens.colors.hover, borderRadius: tokens.borderRadius.lg, padding: tokens.spacing[1] }}>
        <button
          onClick={() => onModeChange('basic')}
          aria-pressed={mode === 'basic'}
          aria-label="Basic mode"
          title="Basic mode"
          style={{
            padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border: 'none',
            backgroundColor: mode === 'basic' ? tokens.colors.panel : 'transparent',
            color: mode === 'basic' ? tokens.colors.textPrimary : tokens.colors.textSecondary,
            fontSize: tokens.typography.scale.sm,
            fontWeight: tokens.typography.weights.medium,
            cursor: 'pointer',
            transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
            boxShadow: mode === 'basic' ? tokens.shadows.sm : 'none',
            minHeight: tokens.accessibility.minTouchTarget,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Basic
        </button>
        <button
          onClick={() => onModeChange('advanced')}
          aria-pressed={mode === 'advanced'}
          aria-label="Advanced mode"
          title="Advanced mode"
          style={{
            padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
            borderRadius: tokens.borderRadius.md,
            border: 'none',
            backgroundColor: mode === 'advanced' ? tokens.colors.panel : 'transparent',
            color: mode === 'advanced' ? tokens.colors.textPrimary : tokens.colors.textSecondary,
            fontSize: tokens.typography.scale.sm,
            fontWeight: tokens.typography.weights.medium,
            cursor: 'pointer',
            transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
            boxShadow: mode === 'advanced' ? tokens.shadows.sm : 'none',
            minHeight: tokens.accessibility.minTouchTarget,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[2],
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 2h8M6 2v4M10 2v4M2 6h12M4 10h8M6 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Advanced
        </button>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
        <IconButton onClick={onToggleAccessibility} label="Accessibility" icon="accessibility" tokens={tokens} />
        <IconButton onClick={onToggleShortcuts} label="Keyboard shortcuts" icon="shortcuts" tokens={tokens} />
        <ActionButton onClick={onSave} label={isSaving ? 'Saving...' : 'Save'} icon="save" tokens={tokens} disabled={isSaving} isLoading={isSaving} />
        <PrimaryButton onClick={onPublish} label="Publish" icon="publish" tokens={tokens} />
      </div>
    </header>
  );
}

function IconButton({ onClick, label, icon, tokens }: { onClick: () => void; label: string; icon: string; tokens: ReturnType<typeof useTheme> }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: tokens.borderRadius.md,
        border: `1px solid ${tokens.colors.border}`,
        backgroundColor: hovered ? tokens.colors.hover : 'transparent',
        color: hovered ? tokens.colors.textPrimary : tokens.colors.textSecondary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">{getIconPath(icon)}</svg>
    </button>
  );
}

function ActionButton({ onClick, label, icon, tokens, disabled, isLoading }: { onClick: () => void; label: string; icon: string; tokens: ReturnType<typeof useTheme>; disabled?: boolean; isLoading?: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
        borderRadius: tokens.borderRadius.md,
        border: `1px solid ${tokens.colors.border}`,
        backgroundColor: hovered ? tokens.colors.hover : 'transparent',
        color: tokens.colors.textPrimary,
        fontSize: tokens.typography.scale.sm,
        fontWeight: tokens.typography.weights.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        minHeight: tokens.accessibility.minTouchTarget,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
      }}
    >
      {isLoading ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="spin" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
          <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">{getIconPath(icon)}</svg>
      )}
      {label}
    </button>
  );
}

function PrimaryButton({ onClick, label, icon, tokens }: { onClick: () => void; label: string; icon: string; tokens: ReturnType<typeof useTheme> }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `${tokens.spacing[2]} ${tokens.spacing[5]}`,
        borderRadius: tokens.borderRadius.md,
        border: 'none',
        backgroundColor: hovered ? tokens.colors.primaryHover : tokens.colors.primary,
        color: tokens.colors.textInverse,
        fontSize: tokens.typography.scale.sm,
        fontWeight: tokens.typography.weights.semibold,
        cursor: 'pointer',
        minHeight: tokens.accessibility.minTouchTarget,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[2],
        transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">{getIconPath(icon)}</svg>
      {label}
    </button>
  );
}

function getIconPath(icon: string): React.ReactNode {
  switch (icon) {
    case 'accessibility':
      return <><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>;
    case 'shortcuts':
      return <><rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8h.01M8 8h.01M11 8h.01M6 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>;
    case 'save':
      return <><path d="M12.5 6.5l-5 5-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'publish':
      return <><path d="M4 2l8 6-8 6V2z" fill="currentColor"/><path d="M12 2h2v12h-2V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    default:
      return null;
  }
}
