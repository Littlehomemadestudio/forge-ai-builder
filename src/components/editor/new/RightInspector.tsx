'use client';

import React from 'react';
import { useTheme } from './theme';
import type { SelectionType, EditorMode } from './useEditor';

interface RightInspectorProps {
  mode: EditorMode;
  selectionType: SelectionType;
  selectedId: string | null;
}

export function RightInspector({ mode, selectionType, selectedId }: RightInspectorProps) {
  const tokens = useTheme();

  const renderContent = () => {
    if (!selectedId || selectionType === 'none') {
      return renderNothingSelected();
    }
    switch (selectionType) {
      case 'text':
        return renderTextInspector();
      case 'button':
        return renderButtonInspector();
      case 'image':
        return renderImageInspector();
      case 'section':
        return renderSectionInspector();
      default:
        return renderNothingSelected();
    }
  };

  const renderNothingSelected = () => (
    <div style={{ padding: tokens.spacing[4] }}>
      <SectionGroup title="Site" tokens={tokens} defaultOpen>
        <SettingRow label="Typography" tokens={tokens}>
          <select style={inputStyle(tokens)}>
            <option>Inter</option>
            <option>Georgia</option>
            <option>System</option>
          </select>
        </SettingRow>
        <SettingRow label="Font scale" tokens={tokens}>
          <div role="group" aria-label="Font scale" style={{ display: 'flex', gap: tokens.spacing[1] }}>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                aria-label={`Font size ${size}`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: tokens.borderRadius.md,
                  border: '1px solid ${tokens.colors.border}',
                  backgroundColor: 'transparent',
                  color: tokens.colors.textPrimary,
                  fontSize: tokens.typography.scale.sm,
                  fontWeight: tokens.typography.weights.medium,
                  cursor: 'pointer',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </SettingRow>
      </SectionGroup>

      <SectionGroup title="Colors" tokens={tokens}>
        <SettingRow label="Primary" tokens={tokens}>
          <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: tokens.borderRadius.md, backgroundColor: tokens.colors.primary, border: `1px solid ${tokens.colors.border}` }} aria-hidden="true" />
            <span style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary }}>#2563EB</span>
          </div>
        </SettingRow>
      </SectionGroup>

      <SectionGroup title="SEO" tokens={tokens}>
        <SettingRow label="Meta title" tokens={tokens}>
          <input type="text" defaultValue="My Website" style={inputStyle(tokens)} />
        </SettingRow>
        <SettingRow label="Meta description" tokens={tokens}>
          <textarea defaultValue="A website built with Forge AI" style={{ ...inputStyle(tokens), minHeight: '80px', resize: 'vertical' }} />
        </SettingRow>
      </SectionGroup>

      {mode === 'advanced' && (
        <SectionGroup title="Advanced" tokens={tokens}>
          <SettingRow label="Custom CSS" tokens={tokens}>
            <textarea placeholder="/* Add custom CSS */" style={{ ...inputStyle(tokens), minHeight: '120px', fontFamily: tokens.typography.fontFamilies.mono, fontSize: tokens.typography.scale.xs }} />
          </SettingRow>
        </SectionGroup>
      )}
    </div>
  );

  const renderTextInspector = () => (
    <div style={{ padding: tokens.spacing[4] }}>
      <SectionGroup title="Typography" tokens={tokens} defaultOpen>
        <SettingRow label="Font" tokens={tokens}>
          <select style={inputStyle(tokens)}>
            <option>Inter</option>
            <option>Georgia</option>
          </select>
        </SettingRow>
        <SettingRow label="Size" tokens={tokens}>
          <div role="group" aria-label="Text size" style={{ display: 'flex', gap: tokens.spacing[1] }}>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <button key={size} aria-label={`Size ${size}`} style={chipStyle(tokens)}>{size}</button>
            ))}
          </div>
        </SettingRow>
        <SettingRow label="Weight" tokens={tokens}>
          <div role="group" aria-label="Font weight" style={{ display: 'flex', gap: tokens.spacing[1] }}>
            {['Regular', 'Medium', 'Semibold', 'Bold'].map((w) => (
              <button key={w} aria-label={w} style={chipStyle(tokens)}>{w}</button>
            ))}
          </div>
        </SettingRow>
      </SectionGroup>
      <SectionGroup title="Color" tokens={tokens}>
        <SettingRow label="Text color" tokens={tokens}>
          <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: tokens.borderRadius.md, backgroundColor: tokens.colors.textPrimary, border: `1px solid ${tokens.colors.border}` }} aria-hidden="true" />
            <span style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary }}>#111827</span>
          </div>
        </SettingRow>
      </SectionGroup>
      <SectionGroup title="Alignment" tokens={tokens}>
        <div role="group" aria-label="Text alignment" style={{ display: 'flex', gap: tokens.spacing[1] }}>
          {['left', 'center', 'right', 'justify'].map((align) => (
            <button key={align} aria-label={`Align ${align}`} title={align} style={iconChipStyle(tokens)}>
              <AlignIcon align={align} tokens={tokens} />
            </button>
          ))}
        </div>
      </SectionGroup>
      <SectionGroup title="AI" tokens={tokens}>
        <button
          style={{
            width: '100%',
            padding: tokens.spacing[3],
            borderRadius: tokens.borderRadius.md,
            border: `1px dashed ${tokens.colors.primary}`,
            backgroundColor: tokens.colors.selectionBg,
            color: tokens.colors.primary,
            fontSize: tokens.typography.scale.sm,
            fontWeight: tokens.typography.weights.medium,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: tokens.spacing[2],
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          ✨ Rewrite text
        </button>
      </SectionGroup>
    </div>
  );

  const renderButtonInspector = () => (
    <div style={{ padding: tokens.spacing[4] }}>
      <SectionGroup title="Appearance" tokens={tokens} defaultOpen>
        <SettingRow label="Fill" tokens={tokens}>
          <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: tokens.borderRadius.md, backgroundColor: tokens.colors.primary, border: `1px solid ${tokens.colors.border}` }} aria-hidden="true" />
            <span style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary }}>Solid</span>
          </div>
        </SettingRow>
        <SettingRow label="Radius" tokens={tokens}>
          <input type="range" min="0" max="24" defaultValue="8" style={{ width: '100%' }} aria-label="Border radius" />
        </SettingRow>
        <SettingRow label="Padding" tokens={tokens}>
          <div style={{ display: 'flex', gap: tokens.spacing[1] }}>
            {['V', 'H'].map((dir) => (
              <input key={dir} type="number" defaultValue={dir === 'V' ? 12 : 24} style={{ ...inputStyle(tokens), width: '64px' }} aria-label={`${dir} padding`} />
            ))}
          </div>
        </SettingRow>
      </SectionGroup>
      <SectionGroup title="Link" tokens={tokens}>
        <SettingRow label="URL" tokens={tokens}>
          <input type="url" placeholder="https://" style={inputStyle(tokens)} />
        </SettingRow>
      </SectionGroup>
    </div>
  );

  const renderImageInspector = () => (
    <div style={{ padding: tokens.spacing[4] }}>
      <SectionGroup title="Image" tokens={tokens} defaultOpen>
        <button
          style={{
            width: '100%',
            padding: tokens.spacing[3],
            borderRadius: tokens.borderRadius.md,
            border: `1px dashed ${tokens.colors.border}`,
            backgroundColor: tokens.colors.hover,
            color: tokens.colors.textPrimary,
            fontSize: tokens.typography.scale.sm,
            cursor: 'pointer',
          }}
        >
          Replace image
        </button>
        <SettingRow label="Alt text" tokens={tokens} style={{ marginTop: tokens.spacing[3] }}>
          <input type="text" placeholder="Describe this image" style={inputStyle(tokens)} />
        </SettingRow>
      </SectionGroup>
      <SectionGroup title="Style" tokens={tokens}>
        <SettingRow label="Radius" tokens={tokens}>
          <input type="range" min="0" max="24" defaultValue="0" style={{ width: '100%' }} aria-label="Image border radius" />
        </SettingRow>
        <SettingRow label="Opacity" tokens={tokens}>
          <input type="range" min="0" max="100" defaultValue="100" style={{ width: '100%' }} aria-label="Image opacity" />
        </SettingRow>
      </SectionGroup>
    </div>
  );

  const renderSectionInspector = () => (
    <div style={{ padding: tokens.spacing[4] }}>
      <SectionGroup title="Layout" tokens={tokens} defaultOpen>
        <SettingRow label="Gap" tokens={tokens}>
          <input type="number" defaultValue={24} style={{ ...inputStyle(tokens), width: '80px' }} aria-label="Section gap" />
        </SettingRow>
        <SettingRow label="Padding" tokens={tokens}>
          <div style={{ display: 'flex', gap: tokens.spacing[1] }}>
            {['T', 'R', 'B', 'L'].map((side) => (
              <input key={side} type="number" defaultValue={32} style={{ ...inputStyle(tokens), width: '56px' }} aria-label={`${side} padding`} />
            ))}
          </div>
        </SettingRow>
      </SectionGroup>
      <SectionGroup title="Background" tokens={tokens}>
        <SettingRow label="Color" tokens={tokens}>
          <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: tokens.borderRadius.md, backgroundColor: tokens.colors.panel, border: `1px solid ${tokens.colors.border}` }} aria-hidden="true" />
            <span style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary }}>#FFFFFF</span>
          </div>
        </SettingRow>
      </SectionGroup>
    </div>
  );

  return (
    <aside
      style={{
        width: '320px',
        backgroundColor: tokens.colors.panel,
        borderLeft: `1px solid ${tokens.colors.border}`,
        overflowY: 'auto',
        zIndex: tokens.zIndex.sticky,
      }}
      aria-label="Inspector"
      role="complementary"
    >
      <div style={{ padding: `${tokens.spacing[4]} ${tokens.spacing[4]} ${tokens.spacing[2]}` }}>
        <h2 style={{ fontSize: tokens.typography.scale.lg, fontWeight: tokens.typography.weights.semibold, color: tokens.colors.textPrimary, margin: 0 }}>
          {selectedId ? 'Edit element' : 'Site settings'}
        </h2>
        <p style={{ fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary, margin: `${tokens.spacing[1]} 0 0` }}>
          {selectedId ? `Selected: ${selectionType}` : 'Customize your website'}
        </p>
      </div>
      {renderContent()}
    </aside>
  );
}

function SectionGroup({ title, tokens, children, defaultOpen }: { title: string; tokens: ReturnType<typeof useTheme>; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  return (
    <div style={{ marginBottom: tokens.spacing[4], borderBottom: `1px solid ${tokens.colors.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`section-${title}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${tokens.spacing[3]} 0`,
          border: 'none',
          backgroundColor: 'transparent',
          color: tokens.colors.textPrimary,
          fontSize: tokens.typography.scale.sm,
          fontWeight: tokens.typography.weights.semibold,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {title}
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: `transform ${tokens.motion.fast} ${tokens.motion.easeOut}` }}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div id={`section-${title}`} style={{ padding: `0 0 ${tokens.spacing[3]}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, tokens, children, style }: { label: string; tokens: ReturnType<typeof useTheme>; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: tokens.spacing[3], ...style }}>
      <label style={{ display: 'block', fontSize: tokens.typography.scale.sm, color: tokens.colors.textSecondary, marginBottom: tokens.spacing[2], fontWeight: tokens.typography.weights.medium }}>
        {label}
      </label>
      {children}
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
  transition: `border-color ${tokens.motion.fast} ${tokens.motion.easeOut}`,
});

const chipStyle = (tokens: ReturnType<typeof useTheme>): React.CSSProperties => ({
  padding: `${tokens.spacing[1]} ${tokens.spacing[3]}`,
  borderRadius: tokens.borderRadius.md,
  border: '1px solid ${tokens.colors.border}',
  backgroundColor: 'transparent',
  color: tokens.colors.textPrimary,
  fontSize: tokens.typography.scale.xs,
  fontWeight: tokens.typography.weights.medium,
  cursor: 'pointer',
  minHeight: tokens.accessibility.minTouchTarget,
});

const iconChipStyle = (tokens: ReturnType<typeof useTheme>): React.CSSProperties => ({
  width: '36px',
  height: '36px',
  borderRadius: tokens.borderRadius.md,
  border: '1px solid ${tokens.colors.border}',
  backgroundColor: 'transparent',
  color: tokens.colors.textPrimary,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function AlignIcon({ align, tokens }: { align: string; tokens: ReturnType<typeof useTheme> }) {
  const paths: Record<string, React.ReactNode> = {
    left: <><path d="M3 4h10M3 8h6M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    center: <><path d="M3 4h10M6 8h4M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    right: <><path d="M3 4h10M7 8h6M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
    justify: <><path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>,
  };
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">{paths[align]}</svg>;
}
