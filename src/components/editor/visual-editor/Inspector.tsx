// ─── Right Context Inspector ───────────────────────────────────────────────
// Enhanced with element info header, better visual grouping, and polish.
import * as React from 'react'
import { Sparkles, Wand2, ScanEye, Accessibility, FileDown, Trash2, Moon, Sun, PanelRightClose, Copy, Move, Maximize2 } from 'lucide-react'
import { COLORS, SPACING, RADIUS, SHADOWS, DARK_COLORS } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import { ActionButton, CollapsibleSection, ColorField, Field, SegmentedControl, SelectField, SliderField, IconButton } from './primitives'
import type { SelectionInfo } from './Canvas'

export interface InspectorProps {
  selection: SelectionInfo | null
  onApply: (mutate: (el: HTMLElement) => void, label: string) => void
  onSelectText: (text: string, label: string) => void
  onDeleteSelection: () => void
  onDuplicateSelection: () => void
  onRunAccessibilityAudit: () => void
  onFixAccessibility: () => void
  onExport: () => void
  onAI: (prompt: string) => void
  darkMode?: boolean
  onToggleDarkMode?: () => void
  onToggleInspector?: () => void
}

const FONTS = [
  { value: '', label: 'Inherit' },
  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'ui-monospace, monospace', label: 'Monospace' },
  { value: 'Arial, sans-serif', label: 'Arial' },
]

const BORDER_STYLES = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
]

const FLEX_JUSTIFY = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
  { value: 'space-between', label: 'Between' },
  { value: 'space-around', label: 'Around' },
  { value: 'space-evenly', label: 'Evenly' },
]

const FLEX_ALIGN = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
  { value: 'stretch', label: 'Stretch' },
]

// ─── Element info header with tag badge and dimensions ────────────────

function ElementHeader({ selection, onDelete, onDuplicate, onAI }: {
  selection: SelectionInfo
  onDelete: () => void
  onDuplicate: () => void
  onAI: (prompt: string) => void
}) {
  return (
    <div style={{
      padding: `${SPACING.lg} ${SPACING.lg} ${SPACING.md}`,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {/* Tag badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 8px',
          borderRadius: RADIUS.md,
          background: COLORS.primaryLight,
          color: COLORS.primary,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'ui-monospace, monospace',
        }}>
          &lt;{selection.tag}&gt;
        </div>
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={onDuplicate}
            title="Duplicate"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: RADIUS.md,
              border: 'none',
              background: 'transparent',
              color: COLORS.textSecondary,
              cursor: 'pointer',
            }}
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: RADIUS.md,
              border: 'none',
              background: 'transparent',
              color: COLORS.danger,
              cursor: 'pointer',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {/* Dimensions row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 12,
        color: COLORS.textTertiary,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Maximize2 size={12} />
          {Math.round(selection.rect.width)} × {Math.round(selection.rect.height)}
        </span>
        {selection.fontSize && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {selection.fontSize}
          </span>
        )}
      </div>
      {/* AI quick action */}
      <button
        type="button"
        onClick={() => onAI(`Improve this ${selection.tag} element`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 8,
          padding: '6px 10px',
          borderRadius: RADIUS.lg,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.background,
          color: COLORS.primary,
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 500,
          width: '100%',
        }}
      >
        <Sparkles size={13} />
        Improve with AI
      </button>
    </div>
  )
}

export function Inspector(p: InspectorProps) {
  const { fontSizeScale, setFontSizeScale } = useAccessibility()
  const c = p.darkMode ? DARK_COLORS : COLORS

  return (
    <aside role="complementary" aria-label="Inspector" className="ve-inspector" style={{
      width: 300,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: c.panel,
      borderLeft: `1px solid ${c.border}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        minHeight: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${SPACING.md}`,
        borderBottom: `1px solid ${c.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: c.text, margin: 0 }}>
            {p.selection ? p.selection.tag.toUpperCase() : 'Page'}
          </h2>
          {p.selection && (
            <span style={{
              fontSize: 10,
              color: c.textTertiary,
              background: c.background,
              padding: '1px 5px',
              borderRadius: RADIUS.sm,
            }}>
              {p.selection.fid}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 1 }}>
          {p.onToggleDarkMode && (
            <IconButton label={p.darkMode ? 'Light mode' : 'Dark mode'} onClick={p.onToggleDarkMode} size={32}>
              {p.darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </IconButton>
          )}
          {p.onToggleInspector && (
            <IconButton label="Close inspector" onClick={p.onToggleInspector} size={32}><PanelRightClose size={14} /></IconButton>
          )}
        </div>
      </div>

      {/* Element info header when selected */}
      {p.selection && (
        <ElementHeader
          selection={p.selection}
          onDelete={p.onDeleteSelection}
          onDuplicate={p.onDuplicateSelection}
          onAI={p.onAI}
        />
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {p.selection ? (
          <SelectionInspector selection={p.selection} {...p} />
        ) : (
          <SiteInspector fontSizeScale={fontSizeScale} setFontSizeScale={setFontSizeScale} onAI={p.onAI} onRunAccessibilityAudit={p.onRunAccessibilityAudit} onFixAccessibility={p.onFixAccessibility} onExport={p.onExport} />
        )}
      </div>
    </aside>
  )
}

function SiteInspector({ fontSizeScale, setFontSizeScale, onAI, onRunAccessibilityAudit, onFixAccessibility, onExport }: {
  fontSizeScale: string
  setFontSizeScale: (s: string) => void
  onAI: (p: string) => void
  onRunAccessibilityAudit: () => void
  onFixAccessibility: () => void
  onExport: () => void
}) {
  const [title, setTitle] = React.useState('My Website')
  return (
    <>
      {/* Quick page actions */}
      <div style={{ padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: 8, borderBottom: `1px solid ${COLORS.border}` }}>
        <ActionButton variant="primary" icon={<Sparkles size={15} />} onClick={() => onAI('Redesign the page to a modern, premium, accessible layout. Keep the same content.')} style={{ width: '100%' }}>
          Redesign with AI
        </ActionButton>
        <ActionButton icon={<FileDown size={15} />} onClick={onExport} style={{ width: '100%' }}>
          Export HTML
        </ActionButton>
      </div>
      <CollapsibleSection title="Typography">
        <Field label="Global font scale" hint="Readable by default (16px+).">
          <SelectField label="Global font scale" value={fontSizeScale} onChange={(v) => setFontSizeScale(v)}
            options={[{ value: 'small', label: 'Small (14px)' }, { value: 'medium', label: 'Medium (16px)' }, { value: 'large', label: 'Large (18px)' }, { value: 'extra-large', label: 'Extra large (20px)' }]} />
        </Field>
      </CollapsibleSection>
      <CollapsibleSection title="SEO">
        <Field label="Page title" hint="Shown in search results.">
          <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Page title" className="ve-icobtn" style={{ minHeight: 44, padding: '0 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 14, color: COLORS.text, background: COLORS.panel }} />
        </Field>
      </CollapsibleSection>
      <CollapsibleSection title="Accessibility" defaultOpen>
        <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: 0 }}>Scan this page for WCAG AA issues.</p>
        <ActionButton icon={<ScanEye size={16} />} onClick={onRunAccessibilityAudit}>Run audit</ActionButton>
        <ActionButton icon={<Accessibility size={16} />} onClick={onFixAccessibility}>Fix issues</ActionButton>
      </CollapsibleSection>
    </>
  )
}

function SelectionInspector({ selection, onApply, onSelectText, onAI }: InspectorProps) {
  const apply = (mutate: (el: HTMLElement) => void, label: string) => onApply(mutate, label)
  if (selection.isText) {
    return (
      <>
        <CollapsibleSection title="Content" defaultOpen>
          <Field label="Text">
            <textarea defaultValue={selection.text} aria-label="Text content" onBlur={(e) => onSelectText(e.target.value, 'Update text')} rows={3} className="ve-icobtn" style={{ width: '100%', minHeight: 88, padding: 10, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 14, color: COLORS.text, background: COLORS.panel, resize: 'vertical', fontFamily: 'inherit' }} />
          </Field>
        </CollapsibleSection>
        <CollapsibleSection title="Typography" defaultOpen>
          <SelectField label="Font family" value="" options={FONTS} onChange={(v) => apply((el) => { if (v) el.style.fontFamily = v }, 'Change font')} />
          <SliderField label="Font size" value={px(selection.fontSize)} min={10} max={96} suffix="px" onChange={(v) => apply((el) => { el.style.fontSize = `${v}px` }, 'Change font size')} />
          <SelectField label="Weight" value={selection.fontWeight || ''} options={[{ value: '400', label: 'Regular' }, { value: '500', label: 'Medium' }, { value: '600', label: 'Semibold' }, { value: '700', label: 'Bold' }]} onChange={(v) => apply((el) => { el.style.fontWeight = v }, 'Change weight')} />
          <ColorField label="Text color" value={selection.color || '#111827'} onChange={(v) => apply((el) => { el.style.color = v }, 'Change text color')} />
          <Field label="Alignment">
            <SegmentedControl label="Alignment" value="left" options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]} onChange={(v) => apply((el) => { el.style.textAlign = v }, 'Change alignment')} />
          </Field>
        </CollapsibleSection>
        <MarginSection apply={apply} />
        <BorderSection apply={apply} />
        <BoxShadowSection apply={apply} />
        <CollapsibleSection title="AI">
          <ActionButton variant="primary" icon={<Wand2 size={15} />} onClick={() => onAI(`Rewrite this text in clearer, more readable language, keeping it concise: "${selection.text}"`)} style={{ width: '100%' }}>Rewrite with AI</ActionButton>
        </CollapsibleSection>
      </>
    )
  }
  if (selection.isImage) {
    return (
      <>
        <CollapsibleSection title="Image" defaultOpen>
          <ActionButton variant="primary" icon={<Sparkles size={15} />} onClick={() => onAI('Replace this image with a relevant one')} style={{ width: '100%' }}>Replace with AI</ActionButton>
          <SliderField label="Border radius" value={0} min={0} max={999} suffix="px" onChange={(v) => apply((el) => { el.style.borderRadius = v === 0 ? '' : `${v}px` }, 'Image radius')} />
          <SliderField label="Opacity" value={100} min={10} max={100} suffix="%" onChange={(v) => apply((el) => { el.style.opacity = String(v / 100) }, 'Image opacity')} />
          <SliderField label="Width" value={100} min={10} max={100} suffix="%" onChange={(v) => apply((el) => { el.style.width = `${v}%` }, 'Image width')} />
        </CollapsibleSection>
        <MarginSection apply={apply} />
        <BorderSection apply={apply} />
        <BoxShadowSection apply={apply} />
        <CollapsibleSection title="Alt Text" defaultOpen>
          <Field label="Alt text" hint="Required for screen readers.">
            <input aria-label="Alt text" className="ve-icobtn" onBlur={(e) => apply((el) => { el.setAttribute('alt', e.target.value) }, 'Set alt text')} style={{ minHeight: 44, padding: '0 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 14, color: COLORS.text, background: COLORS.panel, width: '100%' }} />
          </Field>
          <ActionButton icon={<Wand2 size={15} />} onClick={() => onAI('Write concise, descriptive alt text for this image')} style={{ width: '100%' }}>Generate alt text</ActionButton>
        </CollapsibleSection>
      </>
    )
  }
  if (selection.isButton) {
    return (
      <>
        <CollapsibleSection title="Button" defaultOpen>
          <Field label="Label">
            <input aria-label="Button label" defaultValue={selection.text} onBlur={(e) => onSelectText(e.target.value, 'Button label')} className="ve-icobtn" style={{ minHeight: 44, padding: '0 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 14, color: COLORS.text, background: COLORS.panel, width: '100%' }} />
          </Field>
          <Field label="Link (URL)">
            <input aria-label="Button link" placeholder="/" className="ve-icobtn" onBlur={(e) => apply((el) => { el.dataset.link = e.target.value }, 'Set button link')} style={{ minHeight: 44, padding: '0 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 14, color: COLORS.text, background: COLORS.panel, width: '100%' }} />
          </Field>
          <ColorField label="Fill" value="#2563EB" onChange={(v) => apply((el) => { el.style.backgroundColor = v }, 'Button fill')} />
          <ColorField label="Text color" value="#FFFFFF" onChange={(v) => apply((el) => { el.style.color = v }, 'Button text color')} />
          <SliderField label="Radius" value={12} min={0} max={999} suffix="px" onChange={(v) => apply((el) => { el.style.borderRadius = `${v}px` }, 'Button radius')} />
          <SliderField label="Padding" value={16} min={0} max={64} suffix="px" onChange={(v) => apply((el) => { el.style.padding = `${v / 2}px ${v}px` }, 'Button padding')} />
        </CollapsibleSection>
        <MarginSection apply={apply} />
        <BorderSection apply={apply} />
        <BoxShadowSection apply={apply} />
        <CollapsibleSection title="AI">
          <ActionButton variant="primary" icon={<Wand2 size={15} />} onClick={() => onAI('Suggest a clearer, more compelling call-to-action label')} style={{ width: '100%' }}>Better CTA</ActionButton>
        </CollapsibleSection>
      </>
    )
  }
  return (
    <>
      <CollapsibleSection title="Layout" defaultOpen>
        <SelectField label="Direction" value="column" options={[{ value: 'column', label: 'Stack (column)' }, { value: 'row', label: 'Row' }]} onChange={(v) => apply((el) => { el.style.display = 'flex'; el.style.flexDirection = v }, 'Set layout')} />
        <SliderField label="Gap" value={16} min={0} max={96} suffix="px" onChange={(v) => apply((el) => { el.style.display = 'flex'; el.style.gap = `${v}px` }, 'Set gap')} />
        <SelectField label="Justify" value="flex-start" options={FLEX_JUSTIFY} onChange={(v) => apply((el) => { el.style.display = 'flex'; el.style.justifyContent = v }, 'Set justify')} />
        <SelectField label="Align" value="stretch" options={FLEX_ALIGN} onChange={(v) => apply((el) => { el.style.display = 'flex'; el.style.alignItems = v }, 'Set align')} />
      </CollapsibleSection>
      <CollapsibleSection title="Spacing">
        <SliderField label="Padding" value={24} min={0} max={160} suffix="px" onChange={(v) => apply((el) => { el.style.padding = `${v}px` }, 'Set padding')} />
      </CollapsibleSection>
      <MarginSection apply={apply} />
      <BorderSection apply={apply} />
      <BoxShadowSection apply={apply} />
      <CollapsibleSection title="Background">
        <ColorField label="Background" value={selection.bgColor || '#FFFFFF'} onChange={(v) => apply((el) => { el.style.backgroundColor = v }, 'Set background')} />
      </CollapsibleSection>
      <CollapsibleSection title="AI">
        <ActionButton variant="primary" icon={<Wand2 size={15} />} onClick={() => onAI('Improve this section')} style={{ width: '100%' }}>Improve section</ActionButton>
      </CollapsibleSection>
    </>
  )
}

// ── Margin controls (per side) ────────────────────────────────────────────
function MarginSection({ apply }: { apply: (m: (el: HTMLElement) => void, l: string) => void }) {
  const [mt, setMt] = React.useState(0)
  const [mr, setMr] = React.useState(0)
  const [mb, setMb] = React.useState(0)
  const [ml, setMl] = React.useState(0)
  const setAll = (v: number) => {
    setMt(v); setMr(v); setMb(v); setMl(v)
    apply((el) => { el.style.margin = `${v}px` }, 'Set margin')
  }
  return (
    <CollapsibleSection title="Margin">
      <SliderField label="All sides" value={mt} min={0} max={160} suffix="px" onChange={setAll} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <SliderField label="Top" value={mt} min={0} max={160} suffix="px" onChange={(v) => { setMt(v); apply((el) => { el.style.marginTop = `${v}px` }, 'Margin top') }} />
        <SliderField label="Right" value={mr} min={0} max={160} suffix="px" onChange={(v) => { setMr(v); apply((el) => { el.style.marginRight = `${v}px` }, 'Margin right') }} />
        <SliderField label="Bottom" value={mb} min={0} max={160} suffix="px" onChange={(v) => { setMb(v); apply((el) => { el.style.marginBottom = `${v}px` }, 'Margin bottom') }} />
        <SliderField label="Left" value={ml} min={0} max={160} suffix="px" onChange={(v) => { setMl(v); apply((el) => { el.style.marginLeft = `${v}px` }, 'Margin left') }} />
      </div>
    </CollapsibleSection>
  )
}

// ── Border controls ──────────────────────────────────────────────────────
function BorderSection({ apply }: { apply: (m: (el: HTMLElement) => void, l: string) => void }) {
  const [bw, setBw] = React.useState(0)
  const [bs, setBs] = React.useState('solid')
  const [bc, setBc] = React.useState('#000000')
  return (
    <CollapsibleSection title="Border">
      <SliderField label="Width" value={bw} min={0} max={20} suffix="px" onChange={(v) => { setBw(v); apply((el) => { el.style.borderWidth = `${v}px`; el.style.borderStyle = bs; el.style.borderColor = bc }, 'Border width') }} />
      <SelectField label="Style" value={bs} options={BORDER_STYLES} onChange={(v) => { setBs(v); apply((el) => { el.style.borderStyle = v; el.style.borderWidth = `${bw}px`; el.style.borderColor = bc }, 'Border style') }} />
      <ColorField label="Color" value={bc} onChange={(v) => { setBc(v); apply((el) => { el.style.borderColor = v; el.style.borderWidth = `${bw}px`; el.style.borderStyle = bs }, 'Border color') }} />
    </CollapsibleSection>
  )
}

// ── Box-shadow controls ──────────────────────────────────────────────────
function BoxShadowSection({ apply }: { apply: (m: (el: HTMLElement) => void, l: string) => void }) {
  const [ox, setOx] = React.useState(0)
  const [oy, setOy] = React.useState(0)
  const [blur, setBlur] = React.useState(0)
  const [spread, setSpread] = React.useState(0)
  const [sc, setSc] = React.useState('#000000')
  const applyShadow = (nox: number, noy: number, nb: number, ns: number, nc: string) => {
    apply((el) => { el.style.boxShadow = `${nox}px ${noy}px ${nb}px ${ns}px ${nc}` }, 'Box shadow')
  }
  return (
    <CollapsibleSection title="Box Shadow">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <SliderField label="X" value={ox} min={-50} max={50} suffix="px" onChange={(v) => { setOx(v); applyShadow(v, oy, blur, spread, sc) }} />
        <SliderField label="Y" value={oy} min={-50} max={50} suffix="px" onChange={(v) => { setOy(v); applyShadow(ox, v, blur, spread, sc) }} />
        <SliderField label="Blur" value={blur} min={0} max={100} suffix="px" onChange={(v) => { setBlur(v); applyShadow(ox, oy, v, spread, sc) }} />
        <SliderField label="Spread" value={spread} min={-50} max={50} suffix="px" onChange={(v) => { setSpread(v); applyShadow(ox, oy, blur, v, sc) }} />
      </div>
      <ColorField label="Color" value={sc} onChange={(v) => { setSc(v); applyShadow(ox, oy, blur, spread, v) }} />
    </CollapsibleSection>
  )
}

function px(v?: string): number {
  if (!v) return 16
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 16
}
