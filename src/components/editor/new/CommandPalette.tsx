'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './theme';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onAction: (id: string) => void;
}

export function CommandPalette({ open, onClose, onAction }: CommandPaletteProps) {
  const tokens = useTheme();
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'save', label: 'Save project', shortcut: ['Ctrl', 'S'], category: 'File' },
    { id: 'undo', label: 'Undo', shortcut: ['Ctrl', 'Z'], category: 'Edit' },
    { id: 'redo', label: 'Redo', shortcut: ['Ctrl', 'Shift', 'Z'], category: 'Edit' },
    { id: 'duplicate', label: 'Duplicate element', shortcut: ['Ctrl', 'D'], category: 'Edit' },
    { id: 'delete', label: 'Delete selected', shortcut: ['Delete'], category: 'Edit' },
    { id: 'group', label: 'Group elements', shortcut: ['Ctrl', 'G'], category: 'Arrange' },
    { id: 'ungroup', label: 'Ungroup elements', shortcut: ['Ctrl', 'Shift', 'G'], category: 'Arrange' },
    { id: 'basic-mode', label: 'Switch to Basic mode', category: 'Editor' },
    { id: 'advanced-mode', label: 'Switch to Advanced mode', category: 'Editor' },
    { id: 'publish', label: 'Publish website', category: 'File' },
    { id: 'preview', label: 'Preview website', category: 'View' },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
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
          width: '560px',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: tokens.spacing[4], borderBottom: `1px solid ${tokens.colors.border}` }}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            aria-label="Search commands"
            style={{
              width: '100%',
              padding: tokens.spacing[3],
              borderRadius: tokens.borderRadius.md,
              border: 'none',
              backgroundColor: tokens.colors.hover,
              color: tokens.colors.textPrimary,
              fontSize: tokens.typography.scale.base,
              outline: 'none',
            }}
          />
        </div>
        <div style={{ overflowY: 'auto', padding: tokens.spacing[2] }}>
          {filtered.length === 0 && (
            <div style={{ padding: tokens.spacing[4], textAlign: 'center', color: tokens.colors.textSecondary, fontSize: tokens.typography.scale.sm }}>
              No results
            </div>
          )}
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => { onAction(cmd.id); onClose(); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${tokens.spacing[3]} ${tokens.spacing[3]}`,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                backgroundColor: 'transparent',
                color: tokens.colors.textPrimary,
                fontSize: tokens.typography.scale.sm,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tokens.colors.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div>
                <div style={{ fontWeight: tokens.typography.weights.medium }}>{cmd.label}</div>
                <div style={{ fontSize: tokens.typography.scale.xs, color: tokens.colors.textSecondary, marginTop: '2px' }}>{cmd.category}</div>
              </div>
              {cmd.shortcut && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  {cmd.shortcut.map((k) => (
                    <kbd
                      key={k}
                      style={{
                        padding: '2px 6px',
                        borderRadius: tokens.borderRadius.sm,
                        border: `1px solid ${tokens.colors.border}`,
                        backgroundColor: tokens.colors.hover,
                        color: tokens.colors.textSecondary,
                        fontSize: tokens.typography.scale.xs,
                        fontFamily: tokens.typography.fontFamilies.sans,
                      }}
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
        <div style={{ padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`, borderTop: `1px solid ${tokens.colors.border}`, display: 'flex', gap: tokens.spacing[3], color: tokens.colors.textMuted, fontSize: tokens.typography.scale.xs }}>
          <span><kbd style={kbdStyle(tokens)}>↑↓</kbd> Navigate</span>
          <span><kbd style={kbdStyle(tokens)}>Enter</kbd> Select</span>
          <span><kbd style={kbdStyle(tokens)}>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}

const kbdStyle = (tokens: ReturnType<typeof useTheme>): React.CSSProperties => ({
  padding: '1px 5px',
  borderRadius: '3px',
  border: `1px solid ${tokens.colors.border}`,
  backgroundColor: tokens.colors.hover,
  color: tokens.colors.textSecondary,
  fontSize: '10px',
  fontFamily: 'inherit',
});




