'use client';

import React from 'react';
import { useTheme } from './theme';

interface AccessibilityAuditProps {
  open: boolean;
  onClose: () => void;
}

export function AccessibilityAudit({ open, onClose }: AccessibilityAuditProps) {
  const tokens = useTheme();

  const issues = [
    { id: 1, severity: 'warning' as const, message: '3 images missing alt text', suggestion: 'Add descriptive alt text to all images' },
    { id: 2, severity: 'error' as const, message: 'Low contrast on hero section', suggestion: 'Increase contrast to at least 4.5:1' },
    { id: 3, severity: 'info' as const, message: 'Heading structure could be improved', suggestion: 'Use one H1 per page, maintain logical order' },
  ];

  if (!open) return null;

  const severityStyles: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    error: {
      bg: tokens.colors.dangerBg,
      color: tokens.colors.danger,
      icon: <><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    },
    warning: {
      bg: tokens.colors.warningBg,
      color: tokens.colors.warning,
      icon: <><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5v4M9 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    },
    info: {
      bg: tokens.colors.selectionBg,
      color: tokens.colors.primary,
      icon: <><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5.5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Accessibility audit"
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
          width: '640px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: tokens.spacing[6],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: tokens.spacing[4] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: tokens.borderRadius.lg,
                backgroundColor: tokens.colors.selectionBg,
                color: tokens.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-hidden="true"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: tokens.typography.scale.xl, fontWeight: tokens.typography.weights.bold, color: tokens.colors.textPrimary, margin: 0 }}>Accessibility Audit</h2>
              <p style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary, margin: `${tokens.spacing[1]} 0 0` }}>3 issues found</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close audit"
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
          {issues.map((issue) => {
            const style = severityStyles[issue.severity];
            return (
              <div
                key={issue.id}
                style={{
                  display: 'flex',
                  gap: tokens.spacing[3],
                  padding: tokens.spacing[4],
                  borderRadius: tokens.borderRadius.lg,
                  backgroundColor: style.bg,
                  border: `1px solid ${tokens.colors.border}`,
                }}
              >
                <div style={{ color: style.color, flexShrink: 0 }} aria-hidden="true">{style.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: tokens.typography.scale.sm, fontWeight: tokens.typography.weights.semibold, color: tokens.colors.textPrimary, marginBottom: tokens.spacing[1] }}>{issue.message}</div>
                  <div style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary }}>{issue.suggestion}</div>
                </div>
                <button
                  aria-label={`Fix: ${issue.message}`}
                  style={{
                    alignSelf: 'flex-start',
                    padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                    borderRadius: tokens.borderRadius.md,
                    border: 'none',
                    backgroundColor: tokens.colors.panel,
                    color: style.color,
                    fontSize: tokens.typography.scale.xs,
                    fontWeight: tokens.typography.weights.semibold,
                    cursor: 'pointer',
                    minHeight: tokens.accessibility.minTouchTarget,
                  }}
                >
                  Fix
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: tokens.spacing[5], paddingTop: tokens.spacing[4], borderTop: `1px solid ${tokens.colors.border}`, display: 'flex', justifyContent: 'flex-end', gap: tokens.spacing[2] }}>
          <button
            onClick={onClose}
            style={{
              padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
              borderRadius: tokens.borderRadius.md,
              border: `1px solid ${tokens.colors.border}`,
              backgroundColor: 'transparent',
              color: tokens.colors.textPrimary,
              fontSize: tokens.typography.scale.sm,
              cursor: 'pointer',
              minHeight: tokens.accessibility.minTouchTarget,
            }}
          >
            Close
          </button>
          <button
            onClick={() => {}}
            style={{
              padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
              borderRadius: tokens.borderRadius.md,
              border: 'none',
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.textInverse,
              fontSize: tokens.typography.scale.sm,
              fontWeight: tokens.typography.weights.semibold,
              cursor: 'pointer',
              minHeight: tokens.accessibility.minTouchTarget,
            }}
          >
            Fix all issues
          </button>
        </div>
      </div>
    </div>
  );
}
