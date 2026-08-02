'use client';

import React from 'react';
import { useTheme } from './theme';

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsHelp({ open, onClose }: ShortcutsHelpProps) {
  const tokens = useTheme();

  if (!open) return null;

  const shortcuts = [
    { keys: ['Ctrl', '/'], action: 'Command palette' },
    { keys: ['Ctrl', 'D'], action: 'Duplicate element' },
    { keys: ['Ctrl', 'Z'], action: 'Undo' },
    { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo' },
    { keys: ['Ctrl', 'G'], action: 'Group' },
    { keys: ['Ctrl', 'Shift', 'G'], action: 'Ungroup' },
    { keys: ['Space'], action: 'Pan canvas' },
    { keys: ['Delete'], action: 'Delete selected' },
    { keys: ['Ctrl', 'Mouse Wheel'], action: 'Zoom' },
    { keys: ['Arrow Keys'], action: 'Nudge element' },
    { keys: ['Shift'], action: 'Constrained move' },
    { keys: ['Esc'], action: 'Close panel' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
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
          width: '520px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: tokens.spacing[6],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing[4] }}>
          <h2 style={{ fontSize: tokens.typography.scale['2xl'], fontWeight: tokens.typography.weights.bold, color: tokens.colors.textPrimary, margin: 0 }}>Keyboard shortcuts</h2>
          <button
            onClick={onClose}
            aria-label="Close shortcuts"
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
          {shortcuts.map((s) => (
            <div
              key={s.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${tokens.spacing[3]} 0`,
                borderBottom: `1px solid ${tokens.colors.border}`,
              }}
            >
              <span style={{ fontSize: tokens.typography.scale.base, color: tokens.colors.textPrimary }}>{s.action}</span>
              <div style={{ display: 'flex', gap: tokens.spacing[1] }}>
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    style={{
                      padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                      borderRadius: tokens.borderRadius.sm,
                      border: `1px solid ${tokens.colors.border}`,
                      backgroundColor: tokens.colors.hover,
                      color: tokens.colors.textPrimary,
                      fontSize: tokens.typography.scale.xs,
                      fontWeight: tokens.typography.weights.semibold,
                      fontFamily: tokens.typography.fontFamilies.sans,
                      lineHeight: 1,
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
