// ─── Top Navigation ────────────────────────────────────────────────────────
import * as React from 'react'
import { Code2, Undo2, Redo2, Monitor, Tablet, Smartphone, Minus, Plus, Maximize2,
  Search, Keyboard, ArrowLeft, Menu } from 'lucide-react'
import { COLORS, RADIUS, SPACING, ACCESSIBILITY } from './design-tokens'
import { FontSizeScale, useAccessibility } from './AccessibilityContext'
import { IconButton, SegmentedControl } from './primitives'

export interface TopNavProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onBack: () => void
  device: 'desktop' | 'tablet' | 'mobile'
  onDeviceChange: (d: 'desktop' | 'tablet' | 'mobile') => void
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onCommandPalette: () => void
  onShortcuts: () => void
  onPublish: () => void
  onToggleToolbar?: () => void
}

const FONT_LABELS: Record<FontSizeScale, string> = {
  small: 'Small', medium: 'Medium', large: 'Large', 'extra-large': 'Extra Large',
}

export function TopNav(p: TopNavProps) {
  const { fontSizeScale, setFontSizeScale } = useAccessibility()
  const [mobileMenu, setMobileMenu] = React.useState(false)

  return (
    <header role="banner" aria-label="Editor top bar"
      style={{
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${SPACING.lg}`, background: COLORS.panel, borderBottom: `1px solid ${COLORS.border}`, zIndex: 200,
      }}>
      {/* Left: back, brand, project name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, minWidth: 0 }}>
        <IconButton label="Back to dashboard" onClick={p.onBack}><ArrowLeft size={19} /></IconButton>
        <div style={{ width: 32, height: 32, borderRadius: RADIUS.md, background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
          <Code2 size={18} />
        </div>
        <input
          value={p.projectName} aria-label="Project name"
          onChange={(e) => p.onProjectNameChange(e.target.value)}
          className="ve-topnav-name"
          style={{
            minHeight: ACCESSIBILITY.minTouchTarget, border: '1px solid transparent', background: 'transparent',
            borderRadius: RADIUS.lg, padding: '0 12px', fontSize: 15, fontWeight: 600, color: COLORS.text, width: 200,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = COLORS.border; (e.currentTarget as HTMLElement).style.background = COLORS.hover }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        />
        <span className="ve-topnav-slash" style={{ color: COLORS.textTertiary, fontSize: 13 }}>/</span>
        <span className="ve-topnav-slash" style={{ color: COLORS.textSecondary, fontSize: 13 }}>index.html</span>
      </div>

      {/* Center: undo/redo + device + zoom */}
      <div className="ve-topnav-center" style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton label="Undo (Ctrl+Z)" onClick={p.onUndo} disabled={!p.canUndo}><Undo2 size={18} /></IconButton>
          <IconButton label="Redo (Ctrl+Shift+Z)" onClick={p.onRedo} disabled={!p.canRedo}><Redo2 size={18} /></IconButton>
        </div>

        <SegmentedControl
          label="Device preview"
          value={p.device}
          onChange={p.onDeviceChange}
          options={[
            { value: 'desktop', label: 'Desktop', icon: <Monitor size={15} /> },
            { value: 'tablet', label: 'Tablet', icon: <Tablet size={15} /> },
            { value: 'mobile', label: 'Mobile', icon: <Smartphone size={15} /> },
          ]}
        />

        {/* Zoom controls */}
        <div className="ve-topnav-zoom" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton label="Zoom out" onClick={p.onZoomOut}><Minus size={16} /></IconButton>
          <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.textSecondary, minWidth: 36, textAlign: 'center' }}>{p.zoom}%</span>
          <IconButton label="Zoom in" onClick={p.onZoomIn}><Plus size={16} /></IconButton>
          <IconButton label="Fit to screen" onClick={p.onFit}><Maximize2 size={15} /></IconButton>
        </div>
      </div>

      {/* Right: font scale, commands, shortcuts, publish */}
      <div className="ve-topnav-right" style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
        <label className="ve-topnav-font" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: COLORS.textSecondary }}>Aa</span>
          <select aria-label="Font size scale" value={fontSizeScale}
            onChange={(e) => setFontSizeScale(e.target.value as FontSizeScale)}
            className="ve-icobtn"
            style={{ minHeight: 40, padding: '0 8px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, color: COLORS.text, background: COLORS.panel, cursor: 'pointer' }}>
            {(Object.keys(FONT_LABELS) as FontSizeScale[]).map((k) => <option key={k} value={k}>{FONT_LABELS[k]}</option>)}
          </select>
        </label>

        <IconButton label="Command palette (Ctrl+Shift+P)" onClick={p.onCommandPalette}><Search size={18} /></IconButton>
        <IconButton label="Keyboard shortcuts" onClick={p.onShortcuts}><Keyboard size={18} /></IconButton>

        <button type="button" onClick={p.onPublish} className="ve-icobtn"
          style={{
            minHeight: 44, padding: '0 16px', borderRadius: RADIUS.lg, border: 'none', cursor: 'pointer',
            background: COLORS.primary, color: '#FFFFFF', fontSize: 14, fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = COLORS.primaryHover }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = COLORS.primary }}
        >
          Publish
        </button>

        {/* Mobile hamburger */}
        <IconButton label="Toggle toolbar" className="ve-topnav-hamburger" onClick={() => { setMobileMenu(!mobileMenu); p.onToggleToolbar?.() }}><Menu size={18} /></IconButton>
      </div>
    </header>
  )
}
