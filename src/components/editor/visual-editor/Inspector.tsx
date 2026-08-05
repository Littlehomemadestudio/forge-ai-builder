'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Inspector — Production-Grade Property Panel (Figma-style Right Panel)
// Full Page Inspector when no selection; full Element Inspector when selected.
// Reads real computed styles via window.getComputedStyle().
// All Tailwind, dark mode, 280px wide, collapsible sections, accessible.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react'
import {
  Sparkles,
  Wand2,
  ScanEye,
  Accessibility,
  FileDown,
  Trash2,
  Moon,
  Sun,
  PanelRightClose,
  Copy,
  Maximize2,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  ChevronDown,
  ChevronUp,
  Globe,
  Rocket,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  BoxSelect,
  Layers,
} from 'lucide-react'
import { COLORS, DARK_COLORS } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import {
  ActionButton,
  CollapsibleSection,
  ColorField,
  Field,
  SegmentedControl,
  SelectField,
  SliderField,
  IconButton,
  Badge,
  Divider,
  ToggleField,
} from './primitives'
import type { SelectionInfo } from './Canvas'
import type { FontSizeScale } from './AccessibilityContext'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════
// Props Interface — MUST match existing
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

const FONTS = [
  { value: '', label: 'Inherit' },
  { value: 'Inter, system-ui, sans-serif', label: 'Inter' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Times New Roman, serif', label: 'Times' },
  { value: 'ui-monospace, monospace', label: 'Monospace' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
]

const FONT_WEIGHTS = [
  { value: '', label: 'Inherit' },
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
]

const BORDER_STYLES = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'Double' },
]

const OVERFLOW_OPTIONS = [
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'auto', label: 'Auto' },
]

const FONT_SCALE_OPTIONS = [
  { value: 'small', label: 'Small (14px)' },
  { value: 'medium', label: 'Medium (16px)' },
  { value: 'large', label: 'Large (18px)' },
  { value: 'extra-large', label: 'XL (20px)' },
]

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

/** Parse "16px" → 16; fallback if not parseable */
function px(v?: string, fallback = 0): number {
  if (!v) return fallback
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : fallback
}

/** Try to get the live DOM element for the selection by its data-fid attribute */
function getElementByFid(fid: string): HTMLElement | null {
  if (typeof document === 'undefined') return null
  return document.querySelector(`[data-fid="${fid}"]`) as HTMLElement | null
}

/** Read computed styles from the real DOM element */
function readComputedStyles(fid: string): ComputedStyles | null {
  const el = getElementByFid(fid)
  if (!el) return null
  const cs = window.getComputedStyle(el)
  return {
    fontFamily: cs.fontFamily,
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    color: cs.color,
    textAlign: cs.textAlign,
    lineHeight: cs.lineHeight,
    letterSpacing: cs.letterSpacing,
    backgroundColor: cs.backgroundColor,
    backgroundImage: cs.backgroundImage,
    marginTop: cs.marginTop,
    marginRight: cs.marginRight,
    marginBottom: cs.marginBottom,
    marginLeft: cs.marginLeft,
    paddingTop: cs.paddingTop,
    paddingRight: cs.paddingRight,
    paddingBottom: cs.paddingBottom,
    paddingLeft: cs.paddingLeft,
    width: cs.width,
    height: cs.height,
    minWidth: cs.minWidth,
    maxWidth: cs.maxWidth,
    overflow: cs.overflow,
    borderWidth: cs.borderWidth,
    borderTopWidth: cs.borderTopWidth,
    borderRightWidth: cs.borderRightWidth,
    borderBottomWidth: cs.borderBottomWidth,
    borderLeftWidth: cs.borderLeftWidth,
    borderStyle: cs.borderStyle,
    borderColor: cs.borderColor,
    borderTopLeftRadius: cs.borderTopLeftRadius,
    borderTopRightRadius: cs.borderTopRightRadius,
    borderBottomLeftRadius: cs.borderBottomLeftRadius,
    borderBottomRightRadius: cs.borderBottomRightRadius,
    boxShadow: cs.boxShadow,
    opacity: cs.opacity,
    textDecoration: cs.textDecoration,
    fontStyle: cs.fontStyle,
  }
}

interface ComputedStyles {
  fontFamily: string
  fontSize: string
  fontWeight: string
  color: string
  textAlign: string
  lineHeight: string
  letterSpacing: string
  backgroundColor: string
  backgroundImage: string
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string
  width: string
  height: string
  minWidth: string
  maxWidth: string
  overflow: string
  borderWidth: string
  borderTopWidth: string
  borderRightWidth: string
  borderBottomWidth: string
  borderLeftWidth: string
  borderStyle: string
  borderColor: string
  borderTopLeftRadius: string
  borderTopRightRadius: string
  borderBottomLeftRadius: string
  borderBottomRightRadius: string
  boxShadow: string
  opacity: string
  textDecoration: string
  fontStyle: string
}

/** Convert rgb() to hex */
function rgbToHex(rgb: string): string {
  if (!rgb) return '#000000'
  if (rgb.startsWith('#')) return rgb.length > 7 ? rgb.slice(0, 7) : rgb
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return '#000000'
  const r = parseInt(match[1]).toString(16).padStart(2, '0')
  const g = parseInt(match[2]).toString(16).padStart(2, '0')
  const b = parseInt(match[3]).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

/** Parse a box-shadow string into its components (best effort) */
function parseBoxShadow(shadow: string): { x: number; y: number; blur: number; spread: number; color: string } {
  const defaults = { x: 0, y: 0, blur: 0, spread: 0, color: '#000000' }
  if (!shadow || shadow === 'none') return defaults
  // Match pattern: offsetX offsetY blurRadius spreadRadius color
  const match = shadow.match(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s+(-?[\d.]+)px\s+(.+)/)
  if (!match) return defaults
  return {
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    blur: parseFloat(match[3]),
    spread: parseFloat(match[4]),
    color: rgbToHex(match[5].trim()),
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Tiny internal input components
// ═══════════════════════════════════════════════════════════════════════════

/** Small number input with label — used inside box model diagrams */
function NumInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <label className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type="number"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full max-w-[52px] h-7 px-1.5',
          'text-[12px] tabular-nums text-center',
          'text-neutral-800 dark:text-neutral-200',
          'bg-white dark:bg-neutral-800',
          'border border-neutral-300 dark:border-neutral-600',
          'rounded-md',
          'outline-none',
          'focus-visible:ring-1 focus-visible:ring-blue-500',
          '[appearance:textfield]',
          '[&::-webkit-inner-spin-button]:appearance-none',
          '[&::-webkit-outer-spin-button]:appearance-none',
        )}
      />
    </div>
  )
}

/** Text input styled for inspector */
function InspectorInput({
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  'aria-label': ariaLabel,
  className: cls,
  defaultValue,
}: {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  'aria-label'?: string
  className?: string
  defaultValue?: string
}) {
  return (
    <input
      type={type}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        'w-full min-h-[36px] px-2.5',
        'text-[13px]',
        'text-neutral-800 dark:text-neutral-200',
        'bg-white dark:bg-neutral-800',
        'border border-neutral-300 dark:border-neutral-600',
        'rounded-lg',
        'outline-none',
        'transition-colors duration-150',
        'focus-visible:ring-2 focus-visible:ring-blue-500',
        cls,
      )}
    />
  )
}

/** Textarea styled for inspector */
function InspectorTextarea({
  value,
  defaultValue,
  onChange,
  onBlur,
  rows = 3,
  'aria-label': ariaLabel,
  placeholder,
}: {
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  rows?: number
  'aria-label'?: string
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      rows={rows}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        'w-full min-h-[72px] px-2.5 py-2',
        'text-[13px] font-inherit',
        'text-neutral-800 dark:text-neutral-200',
        'bg-white dark:bg-neutral-800',
        'border border-neutral-300 dark:border-neutral-600',
        'rounded-lg',
        'outline-none',
        'resize-y',
        'transition-colors duration-150',
        'focus-visible:ring-2 focus-visible:ring-blue-500',
      )}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Text Align Buttons
// ═══════════════════════════════════════════════════════════════════════════

function TextAlignButtons({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const options = [
    { value: 'left', icon: <AlignLeft size={14} />, label: 'Left' },
    { value: 'center', icon: <AlignCenter size={14} />, label: 'Center' },
    { value: 'right', icon: <AlignRight size={14} />, label: 'Right' },
    { value: 'justify', icon: <AlignJustify size={14} />, label: 'Justify' },
  ]
  return (
    <div
      role="radiogroup"
      aria-label="Text alignment"
      className="inline-flex gap-0.5 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          aria-label={opt.label}
          onClick={() => onChange(opt.value)}
          className={cn(
            'inline-flex items-center justify-center',
            'w-8 h-8 rounded-md',
            'transition-all duration-150',
            'outline-none',
            'focus-visible:ring-1 focus-visible:ring-blue-500',
            value === opt.value
              ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300',
          )}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Box Model Diagram — Visual margin/padding display
// ═══════════════════════════════════════════════════════════════════════════

function BoxModelDiagram({
  margin,
  padding,
  onMarginChange,
  onPaddingChange,
}: {
  margin: { top: number; right: number; bottom: number; left: number }
  padding: { top: number; right: number; bottom: number; left: number }
  onMarginChange: (side: 'top' | 'right' | 'bottom' | 'left', v: number) => void
  onPaddingChange: (side: 'top' | 'right' | 'bottom' | 'left', v: number) => void
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Margin layer */}
      <div
        className="relative w-full border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-md p-1"
        style={{ background: 'rgba(59, 130, 246, 0.04)' }}
      >
        <span className="absolute top-0.5 left-1.5 text-[9px] font-semibold text-blue-400 dark:text-blue-500 uppercase">
          Margin
        </span>
        <div className="flex justify-center mt-3">
          <NumInput label="T" value={margin.top} onChange={(v) => onMarginChange('top', v)} min={0} max={200} />
        </div>
        <div className="flex justify-between items-center mt-1">
          <NumInput label="L" value={margin.left} onChange={(v) => onMarginChange('left', v)} min={0} max={200} />
          {/* Padding layer */}
          <div
            className="border-2 border-dashed border-neutral-400 dark:border-neutral-500 rounded-md p-1"
            style={{ background: 'rgba(34, 197, 94, 0.04)' }}
          >
            <span className="absolute text-[9px] font-semibold text-green-400 dark:text-green-500 uppercase mt-0.5 ml-0.5">
              Padding
            </span>
            <div className="flex justify-center mt-3">
              <NumInput label="T" value={padding.top} onChange={(v) => onPaddingChange('top', v)} min={0} max={200} />
            </div>
            <div className="flex justify-between items-center mt-1">
              <NumInput label="L" value={padding.left} onChange={(v) => onPaddingChange('left', v)} min={0} max={200} />
              {/* Content box */}
              <div className="w-12 h-10 border border-neutral-300 dark:border-neutral-600 rounded bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-[9px] text-neutral-400 uppercase">Content</span>
              </div>
              <NumInput label="R" value={padding.right} onChange={(v) => onPaddingChange('right', v)} min={0} max={200} />
            </div>
            <div className="flex justify-center mt-1">
              <NumInput label="B" value={padding.bottom} onChange={(v) => onPaddingChange('bottom', v)} min={0} max={200} />
            </div>
          </div>
          <NumInput label="R" value={margin.right} onChange={(v) => onMarginChange('right', v)} min={0} max={200} />
        </div>
        <div className="flex justify-center mt-1 mb-0.5">
          <NumInput label="B" value={margin.bottom} onChange={(v) => onMarginChange('bottom', v)} min={0} max={200} />
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Inspector(p: InspectorProps) {
  const { fontSizeScale, setFontSizeScale } = useAccessibility()
  const c = p.darkMode ? DARK_COLORS : COLORS

  return (
    <aside
      role="complementary"
      aria-label="Inspector"
      className={cn(
        'w-[280px] h-full flex flex-col',
        'bg-neutral-50 dark:bg-neutral-900',
        'border-l border-neutral-200 dark:border-neutral-700',
        'overflow-hidden',
      )}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'min-h-[44px] flex items-center justify-between px-3',
          'border-b border-neutral-200 dark:border-neutral-700',
          'bg-white dark:bg-neutral-900',
        )}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 m-0">
            {p.selection ? p.selection.tag.toUpperCase() : 'Page'}
          </h2>
          {p.selection && (
            <Badge variant="info">{p.selection.fid}</Badge>
          )}
        </div>
        <div className="flex gap-0.5">
          {p.onToggleDarkMode && (
            <IconButton
              label={p.darkMode ? 'Light mode' : 'Dark mode'}
              onClick={p.onToggleDarkMode}
              size="sm"
            >
              {p.darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </IconButton>
          )}
          {p.onToggleInspector && (
            <IconButton label="Close inspector" onClick={p.onToggleInspector} size="sm">
              <PanelRightClose size={14} />
            </IconButton>
          )}
        </div>
      </div>

      {/* ── Element header when selected ───────────────────────────────── */}
      {p.selection && (
        <ElementHeader
          selection={p.selection}
          onDeleteSelection={p.onDeleteSelection}
          onDuplicateSelection={p.onDuplicateSelection}
          onAI={p.onAI}
        />
      )}

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden ve-inspector-scroll">
        {p.selection ? (
          <ElementInspector
            selection={p.selection}
            onApply={p.onApply}
            onSelectText={p.onSelectText}
            onDeleteSelection={p.onDeleteSelection}
            onDuplicateSelection={p.onDuplicateSelection}
            onRunAccessibilityAudit={p.onRunAccessibilityAudit}
            onFixAccessibility={p.onFixAccessibility}
            onExport={p.onExport}
            onAI={p.onAI}
            darkMode={!!p.darkMode}
            onToggleDarkMode={p.onToggleDarkMode}
            onToggleInspector={p.onToggleInspector}
          />
        ) : (
          <PageInspector
            fontSizeScale={fontSizeScale}
            setFontSizeScale={setFontSizeScale}
            onAI={p.onAI}
            onRunAccessibilityAudit={p.onRunAccessibilityAudit}
            onFixAccessibility={p.onFixAccessibility}
            onExport={p.onExport}
          />
        )}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Element Header — Tag badge, dimensions, position
// ═══════════════════════════════════════════════════════════════════════════

function ElementHeader({
  selection,
  onDeleteSelection,
  onDuplicateSelection,
  onAI,
}: {
  selection: SelectionInfo
  onDeleteSelection: () => void
  onDuplicateSelection: () => void
  onAI: (prompt: string) => void
}) {
  return (
    <div className="px-3 pt-2 pb-2 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <div className="flex items-center gap-1.5 mb-1.5">
        {/* Tag badge */}
        <Badge variant="info">
          <span className="font-mono">&lt;{selection.tag}&gt;</span>
        </Badge>
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 ml-auto">
          {selection.isText && 'TEXT'}
          {selection.isImage && 'IMG'}
          {selection.isButton && 'BTN'}
          {selection.isLink && 'LINK'}
        </span>
      </div>
      {/* Dimensions */}
      <div className="flex items-center gap-3 text-[12px] text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1">
          <Maximize2 size={11} className="text-neutral-400" />
          {Math.round(selection.rect.width)} × {Math.round(selection.rect.height)}
        </span>
        <span className="flex items-center gap-1">
          <BoxSelect size={11} className="text-neutral-400" />
          {Math.round(selection.rect.left)}, {Math.round(selection.rect.top)}
        </span>
      </div>
      {/* Quick actions */}
      <div className="flex gap-1 mt-2">
        <IconButton label="Duplicate" onClick={onDuplicateSelection} size="sm">
          <Copy size={13} />
        </IconButton>
        <IconButton label="Delete" onClick={onDeleteSelection} size="sm" danger>
          <Trash2 size={13} />
        </IconButton>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => onAI(`Improve this ${selection.tag} element`)}
          className={cn(
            'inline-flex items-center gap-1 px-2.5 h-8',
            'text-[12px] font-medium',
            'text-blue-600 dark:text-blue-400',
            'bg-blue-50 dark:bg-blue-900/20',
            'border border-blue-200 dark:border-blue-800',
            'rounded-lg',
            'hover:bg-blue-100 dark:hover:bg-blue-900/30',
            'transition-colors duration-150',
            'outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
        >
          <Sparkles size={12} />
          Improve
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE INSPECTOR — When no element is selected
// ═══════════════════════════════════════════════════════════════════════════

function PageInspector({
  fontSizeScale,
  setFontSizeScale,
  onAI,
  onRunAccessibilityAudit,
  onFixAccessibility,
  onExport,
}: {
  fontSizeScale: string
  setFontSizeScale: (s: FontSizeScale) => void
  onAI: (prompt: string) => void
  onRunAccessibilityAudit: () => void
  onFixAccessibility: () => void
  onExport: () => void
}) {
  const [projectName, setProjectName] = React.useState('My Website')
  const [seoTitle, setSeoTitle] = React.useState('')
  const [seoDescription, setSeoDescription] = React.useState('')
  const [auditResults, setAuditResults] = React.useState<string[]>([])
  const [auditRunning, setAuditRunning] = React.useState(false)

  const handleRunAudit = () => {
    setAuditRunning(true)
    onRunAccessibilityAudit()
    // Simulate audit completion after a brief delay
    setTimeout(() => {
      setAuditResults([
        '2 images missing alt text',
        '1 button without label',
        'Contrast ratio low on footer text',
      ])
      setAuditRunning(false)
    }, 1500)
  }

  return (
    <>
      {/* ── Page section ─────────────────────────────────────── */}
      <CollapsibleSection title="Page" defaultOpen>
        <Field label="Project name">
          <InspectorInput
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            aria-label="Project name"
          />
        </Field>
        <div className="flex items-center gap-2 text-[12px] text-neutral-500 dark:text-neutral-400">
          <Maximize2 size={12} />
          <span>1440 × 900 (desktop)</span>
        </div>
      </CollapsibleSection>

      {/* ── Typography section ───────────────────────────────── */}
      <CollapsibleSection title="Typography">
        <Field label="Font scale" description="Base font size for the page.">
          <SelectField
            label="Font scale"
            value={fontSizeScale}
            onChange={(v) => setFontSizeScale(v as FontSizeScale)}
            options={FONT_SCALE_OPTIONS}
          />
        </Field>
      </CollapsibleSection>

      {/* ── SEO section ──────────────────────────────────────── */}
      <CollapsibleSection title="SEO">
        <Field label="Title" description="Shown in search results.">
          <InspectorInput
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Page title"
            aria-label="SEO title"
          />
        </Field>
        <Field label="Description" description="Brief page summary for search engines.">
          <InspectorTextarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Page description..."
            aria-label="SEO description"
            rows={2}
          />
        </Field>
      </CollapsibleSection>

      {/* ── Accessibility section ────────────────────────────── */}
      <CollapsibleSection title="Accessibility" defaultOpen>
        <p className="text-[12px] text-neutral-500 dark:text-neutral-400 m-0">
          Scan this page for WCAG AA issues.
        </p>
        <div className="flex gap-2">
          <ActionButton
            icon={<ScanEye size={14} />}
            onClick={handleRunAudit}
            size="sm"
            disabled={auditRunning}
            className="flex-1"
          >
            {auditRunning ? 'Scanning…' : 'Run Audit'}
          </ActionButton>
          <ActionButton
            icon={<Accessibility size={14} />}
            onClick={onFixAccessibility}
            variant="ghost"
            size="sm"
          >
            Fix Issues
          </ActionButton>
        </div>
        {auditResults.length > 0 && (
          <ul className="flex flex-col gap-1 list-none p-0 m-0">
            {auditResults.map((result, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[12px] text-neutral-600 dark:text-neutral-400"
              >
                <span className="text-amber-500 mt-0.5">•</span>
                {result}
              </li>
            ))}
          </ul>
        )}
      </CollapsibleSection>

      {/* ── Export section ───────────────────────────────────── */}
      <CollapsibleSection title="Export">
        <div className="flex flex-col gap-2">
          <ActionButton
            icon={<FileDown size={14} />}
            onClick={onExport}
            size="sm"
            className="w-full"
          >
            Export HTML
          </ActionButton>
          <ActionButton
            icon={<Rocket size={14} />}
            onClick={onExport}
            variant="primary"
            size="sm"
            className="w-full"
          >
            Publish
          </ActionButton>
        </div>
      </CollapsibleSection>

      {/* ── AI section ──────────────────────────────────────── */}
      <CollapsibleSection title="AI">
        <ActionButton
          variant="primary"
          icon={<Sparkles size={14} />}
          onClick={() => onAI('Redesign the page to a modern, premium, accessible layout. Keep the same content.')}
          size="sm"
          className="w-full"
        >
          Redesign with AI
        </ActionButton>
      </CollapsibleSection>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT INSPECTOR — When an element is selected
// ═══════════════════════════════════════════════════════════════════════════

function ElementInspector({ selection, onApply, onSelectText, onAI }: InspectorProps) {
  const apply = (mutate: (el: HTMLElement) => void, label: string) => onApply(mutate, label)

  // ── Read computed styles from the real DOM ──────────────────────────
  const [computed, setComputed] = React.useState<ComputedStyles | null>(null)

  React.useEffect(() => {
    const styles = readComputedStyles(selection!.fid)
    setComputed(styles)
  }, [selection!.fid, selection!.rect])

  // ── Local state for sections that need it ───────────────────────────
  // Content
  const [textContent, setTextContent] = React.useState(selection!.text || '')
  const [linkHref, setLinkHref] = React.useState('')

  // Typography
  const fontFamily = computed?.fontFamily || ''
  const fontSize = computed ? px(computed.fontSize, 16) : px(selection!.fontSize, 16)
  const fontWeight = computed?.fontWeight || selection!.fontWeight || '400'
  const textColor = computed ? rgbToHex(computed.color) : (selection!.color || '#111827')
  const textAlign = computed?.textAlign || 'left'
  const lineHeight = computed ? parseFloat(computed.lineHeight) : 1.5
  const letterSpacing = computed ? parseFloat(computed.letterSpacing) : 0

  // Spacing
  const [marginLinked, setMarginLinked] = React.useState(true)
  const [paddingLinked, setPaddingLinked] = React.useState(true)
  const [margin, setMargin] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 })
  const [padding, setPadding] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 })

  React.useEffect(() => {
    if (computed) {
      setMargin({
        top: px(computed.marginTop),
        right: px(computed.marginRight),
        bottom: px(computed.marginBottom),
        left: px(computed.marginLeft),
      })
      setPadding({
        top: px(computed.paddingTop),
        right: px(computed.paddingRight),
        bottom: px(computed.paddingBottom),
        left: px(computed.paddingLeft),
      })
    }
  }, [computed])

  // Size
  const elWidth = computed ? px(computed.width, 0) : Math.round(selection!.rect.width)
  const elHeight = computed ? px(computed.height, 0) : Math.round(selection!.rect.height)
  const [minW, setMinW] = React.useState(0)
  const [maxW, setMaxW] = React.useState(0)
  const [overflow, setOverflow] = React.useState('visible')

  // Background
  const bgColor = computed ? rgbToHex(computed.backgroundColor) : (selection!.bgColor || '#FFFFFF')
  const [bgImage, setBgImage] = React.useState('')

  // Border
  const [borderWidth, setBorderWidth] = React.useState(0)
  const [borderStyle, setBorderStyle] = React.useState('solid')
  const [borderColor, setBorderColor] = React.useState('#000000')
  const [borderRadius, setBorderRadius] = React.useState(0)
  const [radiusLinked, setRadiusLinked] = React.useState(true)

  React.useEffect(() => {
    if (computed) {
      setBorderWidth(px(computed.borderWidth || computed.borderTopWidth))
      setBorderStyle(computed.borderStyle === 'none' ? 'solid' : computed.borderStyle)
      setBorderColor(rgbToHex(computed.borderColor))
      setBorderRadius(px(computed.borderTopLeftRadius))
    }
  }, [computed])

  // Effects
  const shadowParsed = computed ? parseBoxShadow(computed.boxShadow) : { x: 0, y: 0, blur: 0, spread: 0, color: '#000000' }
  const [shadow, setShadow] = React.useState(shadowParsed)
  const [opacity, setOpacity] = React.useState(computed ? parseFloat(computed.opacity) * 100 : 100)

  React.useEffect(() => {
    setShadow(shadowParsed)
    if (computed) setOpacity(parseFloat(computed.opacity) * 100)
  }, [computed])

  const applyShadow = (s: typeof shadow) => {
    setShadow(s)
    apply(
      (el) => {
        el.style.boxShadow = s.x === 0 && s.y === 0 && s.blur === 0 && s.spread === 0
          ? 'none'
          : `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
      },
      'Box shadow',
    )
  }

  // ── Margin/Padding change handlers ─────────────────────────────────
  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', v: number) => {
    if (marginLinked) {
      setMargin({ top: v, right: v, bottom: v, left: v })
      apply((el) => { el.style.margin = `${v}px` }, 'Margin')
    } else {
      const next = { ...margin, [side]: v }
      setMargin(next)
      apply((el) => {
        el.style.marginTop = `${next.top}px`
        el.style.marginRight = `${next.right}px`
        el.style.marginBottom = `${next.bottom}px`
        el.style.marginLeft = `${next.left}px`
      }, `Margin ${side}`)
    }
  }

  const handlePaddingChange = (side: 'top' | 'right' | 'bottom' | 'left', v: number) => {
    if (paddingLinked) {
      setPadding({ top: v, right: v, bottom: v, left: v })
      apply((el) => { el.style.padding = `${v}px` }, 'Padding')
    } else {
      const next = { ...padding, [side]: v }
      setPadding(next)
      apply((el) => {
        el.style.paddingTop = `${next.top}px`
        el.style.paddingRight = `${next.right}px`
        el.style.paddingBottom = `${next.bottom}px`
        el.style.paddingLeft = `${next.left}px`
      }, `Padding ${side}`)
    }
  }

  // ── Per-corner border radius ──────────────────────────────────────
  const [radiusCorners, setRadiusCorners] = React.useState({ tl: 0, tr: 0, bl: 0, br: 0 })
  React.useEffect(() => {
    if (computed) {
      const tl = px(computed.borderTopLeftRadius)
      setRadiusCorners({
        tl,
        tr: px(computed.borderTopRightRadius),
        bl: px(computed.borderBottomLeftRadius),
        br: px(computed.borderBottomRightRadius),
      })
    }
  }, [computed])

  const handleRadiusChange = (corner: 'tl' | 'tr' | 'bl' | 'br', v: number) => {
    if (radiusLinked) {
      setRadiusCorners({ tl: v, tr: v, bl: v, br: v })
      setBorderRadius(v)
      apply((el) => { el.style.borderRadius = `${v}px` }, 'Border radius')
    } else {
      const next = { ...radiusCorners, [corner]: v }
      setRadiusCorners(next)
      apply((el) => {
        el.style.borderTopLeftRadius = `${next.tl}px`
        el.style.borderTopRightRadius = `${next.tr}px`
        el.style.borderBottomLeftRadius = `${next.bl}px`
        el.style.borderBottomRightRadius = `${next.br}px`
      }, `Radius ${corner}`)
    }
  }

  return (
    <>
      {/* ═══ 1. Content ═══════════════════════════════════════════════ */}
      <CollapsibleSection title="Content" defaultOpen>
        {(selection!.isText || selection!.isButton) && (
          <Field label="Text content">
            <InspectorTextarea
              defaultValue={selection!.text}
              aria-label="Text content"
              onBlur={(e) => onSelectText(e.target.value, 'Update text')}
              rows={3}
            />
          </Field>
        )}
        {(selection!.isLink || selection!.isButton) && (
          <Field label="Link href" description="URL for this link or button.">
            <InspectorInput
              value={linkHref}
              onChange={(e) => setLinkHref(e.target.value)}
              onBlur={() => apply((el) => { el.dataset.link = linkHref }, 'Set link href')}
              placeholder="https://..."
              aria-label="Link URL"
            />
          </Field>
        )}
        {selection!.isImage && (
          <Field label="Alt text" description="Required for screen readers.">
            <InspectorInput
              aria-label="Alt text"
              onBlur={(e) => apply((el) => { el.setAttribute('alt', e.target.value) }, 'Set alt text')}
              placeholder="Describe this image..."
            />
          </Field>
        )}
      </CollapsibleSection>

      {/* ═══ 2. Typography ════════════════════════════════════════════ */}
      {(selection!.isText || selection!.isButton || selection!.isLink) && (
        <CollapsibleSection title="Typography" defaultOpen>
          <SelectField
            label="Font family"
            value={fontFamily}
            options={FONTS}
            onChange={(v) => apply((el) => { if (v) el.style.fontFamily = v }, 'Change font')}
          />
          <SliderField
            label="Font size"
            value={fontSize}
            min={10}
            max={96}
            suffix="px"
            onChange={(v) => apply((el) => { el.style.fontSize = `${v}px` }, 'Change font size')}
          />
          <SelectField
            label="Font weight"
            value={fontWeight}
            options={FONT_WEIGHTS}
            onChange={(v) => apply((el) => { el.style.fontWeight = v }, 'Change weight')}
          />
          <ColorField
            label="Text color"
            value={textColor}
            onChange={(v) => apply((el) => { el.style.color = v }, 'Change text color')}
          />
          <Field label="Text align">
            <TextAlignButtons
              value={textAlign}
              onChange={(v) => apply((el) => { el.style.textAlign = v }, 'Change alignment')}
            />
          </Field>
          <SliderField
            label="Line height"
            value={isNaN(lineHeight) ? 1.5 : lineHeight}
            min={1}
            max={3}
            step={0.1}
            suffix=""
            onChange={(v) => apply((el) => { el.style.lineHeight = String(v) }, 'Line height')}
          />
          <SliderField
            label="Letter spacing"
            value={isNaN(letterSpacing) ? 0 : letterSpacing * 100}
            min={-50}
            max={100}
            step={1}
            suffix="/100em"
            onChange={(v) => apply((el) => { el.style.letterSpacing = `${v / 100}em` }, 'Letter spacing')}
          />
        </CollapsibleSection>
      )}

      {/* ═══ 3. Spacing ═══════════════════════════════════════════════ */}
      <CollapsibleSection title="Spacing">
        {/* Linked toggles */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Link sides
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMarginLinked(!marginLinked)}
              className={cn(
                'inline-flex items-center gap-1 px-2 h-7',
                'text-[11px] font-medium',
                'rounded-md border',
                'transition-colors duration-150',
                marginLinked
                  ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400',
              )}
            >
              {marginLinked ? <Lock size={11} /> : <Unlock size={11} />}
              M
            </button>
            <button
              type="button"
              onClick={() => setPaddingLinked(!paddingLinked)}
              className={cn(
                'inline-flex items-center gap-1 px-2 h-7',
                'text-[11px] font-medium',
                'rounded-md border',
                'transition-colors duration-150',
                paddingLinked
                  ? 'border-green-400 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400',
              )}
            >
              {paddingLinked ? <Lock size={11} /> : <Unlock size={11} />}
              P
            </button>
          </div>
        </div>
        {/* Box model visual diagram */}
        <BoxModelDiagram
          margin={margin}
          padding={padding}
          onMarginChange={handleMarginChange}
          onPaddingChange={handlePaddingChange}
        />
        {/* Quick single-value sliders when linked */}
        {marginLinked && (
          <SliderField
            label="Margin"
            value={margin.top}
            min={0}
            max={160}
            suffix="px"
            onChange={(v) => handleMarginChange('top', v)}
          />
        )}
        {paddingLinked && (
          <SliderField
            label="Padding"
            value={padding.top}
            min={0}
            max={160}
            suffix="px"
            onChange={(v) => handlePaddingChange('top', v)}
          />
        )}
      </CollapsibleSection>

      {/* ═══ 4. Size ══════════════════════════════════════════════════ */}
      <CollapsibleSection title="Size">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Width">
            <InspectorInput
              value={String(Math.round(elWidth))}
              aria-label="Width"
              onBlur={(e) => apply((el) => { el.style.width = e.target.value + 'px' }, 'Set width')}
            />
          </Field>
          <Field label="Height">
            <InspectorInput
              value={String(Math.round(elHeight))}
              aria-label="Height"
              onBlur={(e) => apply((el) => { el.style.height = e.target.value + 'px' }, 'Set height')}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Min W">
            <InspectorInput
              value={String(minW)}
              aria-label="Min width"
              onBlur={(e) => apply((el) => { el.style.minWidth = e.target.value + 'px' }, 'Min width')}
            />
          </Field>
          <Field label="Max W">
            <InspectorInput
              value={String(maxW)}
              aria-label="Max width"
              onBlur={(e) => apply((el) => { el.style.maxWidth = e.target.value + 'px' }, 'Max width')}
            />
          </Field>
        </div>
        <SelectField
          label="Overflow"
          value={overflow}
          options={OVERFLOW_OPTIONS}
          onChange={(v) => { setOverflow(v); apply((el) => { el.style.overflow = v }, 'Overflow') }}
        />
      </CollapsibleSection>

      {/* ═══ 5. Background ═════════════════════════════════════════════ */}
      <CollapsibleSection title="Background">
        <ColorField
          label="Background color"
          value={bgColor === 'rgba(0, 0, 0, 0)' ? '#FFFFFF' : bgColor}
          onChange={(v) => apply((el) => { el.style.backgroundColor = v }, 'Background color')}
        />
        <Field label="Background image" description="Image URL or gradient.">
          <InspectorInput
            value={bgImage}
            onChange={(e) => setBgImage(e.target.value)}
            onBlur={() => {
              if (bgImage) apply((el) => { el.style.backgroundImage = `url(${bgImage})` }, 'Background image')
            }}
            placeholder="url(...) or gradient"
            aria-label="Background image URL"
          />
        </Field>
      </CollapsibleSection>

      {/* ═══ 6. Border ════════════════════════════════════════════════ */}
      <CollapsibleSection title="Border">
        <SliderField
          label="Width"
          value={borderWidth}
          min={0}
          max={20}
          suffix="px"
          onChange={(v) => {
            setBorderWidth(v)
            apply((el) => {
              el.style.borderWidth = `${v}px`
              el.style.borderStyle = borderStyle
              el.style.borderColor = borderColor
            }, 'Border width')
          }}
        />
        <SelectField
          label="Style"
          value={borderStyle}
          options={BORDER_STYLES}
          onChange={(v) => {
            setBorderStyle(v)
            apply((el) => {
              el.style.borderStyle = v
              el.style.borderWidth = `${borderWidth}px`
              el.style.borderColor = borderColor
            }, 'Border style')
          }}
        />
        <ColorField
          label="Color"
          value={borderColor}
          onChange={(v) => {
            setBorderColor(v)
            apply((el) => {
              el.style.borderColor = v
              el.style.borderWidth = `${borderWidth}px`
              el.style.borderStyle = borderStyle
            }, 'Border color')
          }}
        />
        {/* Radius with linked toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">Radius</span>
          <button
            type="button"
            onClick={() => setRadiusLinked(!radiusLinked)}
            className={cn(
              'inline-flex items-center gap-1 px-2 h-6',
              'text-[11px] font-medium',
              'rounded-md border',
              'transition-colors duration-150',
              radiusLinked
                ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400',
            )}
          >
            {radiusLinked ? <Lock size={10} /> : <Unlock size={10} />}
            {radiusLinked ? 'All' : 'Each'}
          </button>
        </div>
        {radiusLinked ? (
          <SliderField
            label="Radius"
            value={borderRadius}
            min={0}
            max={100}
            suffix="px"
            onChange={(v) => {
              setBorderRadius(v)
              apply((el) => { el.style.borderRadius = `${v}px` }, 'Border radius')
            }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <SliderField
              label="TL"
              value={radiusCorners.tl}
              min={0}
              max={100}
              suffix="px"
              onChange={(v) => handleRadiusChange('tl', v)}
            />
            <SliderField
              label="TR"
              value={radiusCorners.tr}
              min={0}
              max={100}
              suffix="px"
              onChange={(v) => handleRadiusChange('tr', v)}
            />
            <SliderField
              label="BL"
              value={radiusCorners.bl}
              min={0}
              max={100}
              suffix="px"
              onChange={(v) => handleRadiusChange('bl', v)}
            />
            <SliderField
              label="BR"
              value={radiusCorners.br}
              min={0}
              max={100}
              suffix="px"
              onChange={(v) => handleRadiusChange('br', v)}
            />
          </div>
        )}
      </CollapsibleSection>

      {/* ═══ 7. Effects ═══════════════════════════════════════════════ */}
      <CollapsibleSection title="Effects">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">Box Shadow</span>
          <div className="grid grid-cols-2 gap-2">
            <SliderField
              label="X"
              value={shadow.x}
              min={-50}
              max={50}
              suffix="px"
              onChange={(v) => applyShadow({ ...shadow, x: v })}
            />
            <SliderField
              label="Y"
              value={shadow.y}
              min={-50}
              max={50}
              suffix="px"
              onChange={(v) => applyShadow({ ...shadow, y: v })}
            />
            <SliderField
              label="Blur"
              value={shadow.blur}
              min={0}
              max={100}
              suffix="px"
              onChange={(v) => applyShadow({ ...shadow, blur: v })}
            />
            <SliderField
              label="Spread"
              value={shadow.spread}
              min={-50}
              max={50}
              suffix="px"
              onChange={(v) => applyShadow({ ...shadow, spread: v })}
            />
          </div>
          <ColorField
            label="Shadow color"
            value={shadow.color}
            onChange={(v) => applyShadow({ ...shadow, color: v })}
          />
        </div>
        <SliderField
          label="Opacity"
          value={Math.round(opacity)}
          min={0}
          max={100}
          suffix="%"
          onChange={(v) => {
            setOpacity(v)
            apply((el) => { el.style.opacity = String(v / 100) }, 'Opacity')
          }}
        />
      </CollapsibleSection>

      {/* ═══ 8. Actions ═══════════════════════════════════════════════ */}
      <CollapsibleSection title="Actions">
        <div className="flex flex-col gap-2">
          <ActionButton
            icon={<Copy size={14} />}
            onClick={() => onApply((el) => {
              const clone = el.cloneNode(true) as HTMLElement
              el.parentNode?.insertBefore(clone, el.nextSibling)
            }, 'Duplicate')}
            size="sm"
            className="w-full"
          >
            Duplicate
          </ActionButton>
          <ActionButton
            icon={<Trash2 size={14} />}
            variant="danger"
            onClick={() => onApply((el) => { el.remove() }, 'Delete')}
            size="sm"
            className="w-full"
          >
            Delete
          </ActionButton>
          <ActionButton
            icon={<Sparkles size={14} />}
            variant="primary"
            onClick={() => onAI(`Improve this ${selection!.tag} element: make it more polished and visually appealing`)}
            size="sm"
            className="w-full"
          >
            AI Improve
          </ActionButton>
        </div>
      </CollapsibleSection>

      {/* ═══ Element-type-specific extras ══════════════════════════════ */}

      {/* Image-specific */}
      {selection!.isImage && (
        <CollapsibleSection title="Image">
          <ActionButton
            variant="primary"
            icon={<Sparkles size={14} />}
            onClick={() => onAI('Replace this image with a relevant one')}
            size="sm"
            className="w-full"
          >
            Replace with AI
          </ActionButton>
          <ActionButton
            icon={<Wand2 size={14} />}
            onClick={() => onAI('Write concise, descriptive alt text for this image')}
            size="sm"
            className="w-full"
          >
            Generate Alt Text
          </ActionButton>
        </CollapsibleSection>
      )}

      {/* Button-specific */}
      {selection!.isButton && (
        <CollapsibleSection title="Button Style">
          <ColorField
            label="Fill"
            value={bgColor === 'rgba(0, 0, 0, 0)' ? '#2563EB' : bgColor}
            onChange={(v) => apply((el) => { el.style.backgroundColor = v }, 'Button fill')}
          />
          <ColorField
            label="Text color"
            value={textColor}
            onChange={(v) => apply((el) => { el.style.color = v }, 'Button text color')}
          />
        </CollapsibleSection>
      )}

      {/* Text-specific AI */}
      {selection!.isText && (
        <CollapsibleSection title="AI">
          <ActionButton
            variant="primary"
            icon={<Wand2 size={14} />}
            onClick={() => onAI(`Rewrite this text in clearer, more readable language, keeping it concise: "${selection!.text}"`)}
            size="sm"
            className="w-full"
          >
            Rewrite with AI
          </ActionButton>
        </CollapsibleSection>
      )}
    </>
  )
}
