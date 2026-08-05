// ─── Accessible UI Primitives for the Forge Visual Editor ──────────────────
// 44px targets, visible focus rings, tooltips, reduced-motion aware.

import * as React from 'react'
import { useId } from 'react'
import { COLORS, SPACING, RADIUS, SHADOWS, ACCESSIBILITY, ANIMATION, Z_INDEX } from './design-tokens'
import { useAccessibility } from './AccessibilityContext'

// ─── Screen-reader live region ────────────────────────────────────────────
export function LiveRegion() {
  return (
    <div id="ve-live-region" aria-live="polite" aria-atomic="true"
      style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
    </div>
  )
}
export function announce(message: string) {
  if (typeof window === 'undefined') return
  const el = document.getElementById('ve-live-region')
  if (!el) return
  el.textContent = ''
  requestAnimationFrame(() => { el.textContent = message })
}

// ─── Kbd badge ────────────────────────────────────────────────────────────
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{
      display: 'inline-block', minWidth: 20, textAlign: 'center', padding: '2px 6px',
      fontSize: 11, fontWeight: 600, lineHeight: '16px', color: COLORS.textSecondary,
      backgroundColor: COLORS.panel, border: `1px solid ${COLORS.border}`, borderBottomWidth: 2,
      borderRadius: RADIUS.sm, fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    }}>{children}</kbd>
  )
}

// ─── Icon Button ──────────────────────────────────────────────────────────
export function IconButton({
  label, children, onClick, active, disabled, size = 44, danger,
}: {
  label: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  active?: boolean
  disabled?: boolean
  size?: number
  danger?: boolean
}) {
  const { reduceMotion } = useAccessibility()
  const [tip, setTip] = React.useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)}>
      <button type="button" aria-label={label} aria-pressed={active} disabled={disabled} onClick={onClick}
        onFocus={() => setTip(true)} onBlur={() => setTip(false)} className="ve-icobtn"
        style={{
          width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: RADIUS.lg, border: '1px solid transparent', cursor: disabled ? 'default' : 'pointer',
          backgroundColor: active ? COLORS.selectionLight : 'transparent',
          color: danger ? COLORS.danger : active ? COLORS.selection : COLORS.textSecondary,
          transition: reduceMotion ? 'none' : `background-color ${ANIMATION.duration.fast}`,
          opacity: disabled ? 0.4 : 1,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = active ? COLORS.selectionLight : COLORS.hover }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = active ? COLORS.selectionLight : 'transparent' }}
      >{children}</button>
      {tip && !disabled && (
        <span role="tooltip" style={{
          position: 'absolute', zIndex: Z_INDEX.tooltip, left: size + 6, top: '50%', transform: 'translateY(-50%)',
          whiteSpace: 'nowrap', padding: '5px 9px', fontSize: 12, fontWeight: 500, color: COLORS.panel,
          backgroundColor: COLORS.text, borderRadius: RADIUS.md, boxShadow: SHADOWS.md, pointerEvents: 'none',
        }}>{label}</span>
      )}
    </span>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  const autoId = useId()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={autoId} style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{label}</label>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: autoId }) : child)}
      {hint && <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{hint}</span>}
    </div>
  )
}

// ─── Action Button ────────────────────────────────────────────────────────
const ACTIONS = {
  primary: { bg: COLORS.primary, color: '#FFFFFF', hoverBg: COLORS.primaryHover, border: 'transparent' },
  secondary: { bg: COLORS.panel, color: COLORS.text, hoverBg: COLORS.hover, border: `1px solid ${COLORS.border}` },
  ghost: { bg: 'transparent', color: COLORS.textSecondary, hoverBg: COLORS.hover, border: '1px solid transparent' },
  danger: { bg: COLORS.danger, color: '#FFFFFF', hoverBg: '#B91C1C', border: 'transparent' },
} as const

export function ActionButton({ children, onClick, variant = 'secondary', icon, disabled, style }: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  variant?: keyof typeof ACTIONS
  icon?: React.ReactNode
  disabled?: boolean
  style?: React.CSSProperties
}) {
  const v = ACTIONS[variant]
  return (
    <button type="button" disabled={disabled} onClick={onClick} className="ve-icobtn"
      style={{
        minHeight: ACCESSIBILITY.minTouchTarget, padding: '0 14px', display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', gap: 8, borderRadius: RADIUS.lg, cursor: disabled ? 'default' : 'pointer',
        fontSize: 14, fontWeight: 600, color: v.color, backgroundColor: v.bg, border: v.border,
        boxShadow: SHADOWS.sm, opacity: disabled ? 0.5 : 1, ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = v.hoverBg }}
      onMouseLeave={(e) => { if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = v.bg }}
    >
      {icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  )
}

// ─── Segmented Control ────────────────────────────────────────────────────
export function SegmentedControl<T extends string>({ label, options, value, onChange }: {
  label: string
  options: { value: T; label: string; icon?: React.ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  const baseId = useId()
  return (
    <div role="radiogroup" aria-label={label}
      style={{ display: 'flex', gap: 2, padding: 3, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}` }}>
      {options.map((opt) => {
        const active = opt.value === value
        const id = `${baseId}-${opt.value}`
        return (
          <React.Fragment key={opt.value}>
            <input id={id} type="radio" name={baseId} value={opt.value} checked={active}
              onChange={() => onChange(opt.value)} style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} tabIndex={-1} />
            <label htmlFor={id} tabIndex={active ? 0 : -1}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(opt.value) } }}
              title={opt.label} className="ve-icobtn"
              style={{
                minHeight: 32, minWidth: 40, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, borderRadius: RADIUS.md, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                color: active ? COLORS.text : COLORS.textSecondary, backgroundColor: active ? COLORS.panel : 'transparent',
                boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}>
              {opt.icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{opt.icon}</span>}
              {opt.label}
            </label>
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Collapsible Section ──────────────────────────────────────────────────
export function CollapsibleSection({ title, children, defaultOpen = true, badge }: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <section style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="ve-icobtn"
        style={{
          width: '100%', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `0 ${SPACING.lg}`, background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: COLORS.text, textTransform: 'uppercase', letterSpacing: '0.4px',
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{title}{badge && <span style={{ color: COLORS.textSecondary, fontWeight: 500 }}>{badge}</span>}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
          style={{ color: COLORS.textSecondary, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: `0 ${SPACING.lg} ${SPACING.lg}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {children}
        </div>
      )}
    </section>
  )
}

// ─── Slider Field ─────────────────────────────────────────────────────────
export function SliderField({ label, value, min, max, step = 1, onChange, suffix = '' }: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{label}</span>
        <output style={{ fontSize: 12, color: COLORS.textSecondary, fontVariantNumeric: 'tabular-nums' }}>{value}{suffix}</output>
      </div>
      <input type="range" aria-label={label} value={value} min={min} max={max} step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: COLORS.primary, minHeight: 28, cursor: 'pointer' }} />
    </div>
  )
}

// ─── Color Field ──────────────────────────────────────────────────────────
export function ColorField({ label, value, onChange }: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <div style={{ position: 'relative', width: 40, height: 40, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, overflow: 'hidden', background: value }}>
          <input type="color" aria-label={`${label} color`} value={value}
            onChange={(e) => onChange(e.target.value)} style={{ position: 'absolute', inset: -4, width: 48, height: 48, border: 'none', cursor: 'pointer' }} />
        </div>
        <input type="text" aria-label={`${label} hex`} value={value} className="ve-icobtn"
          onChange={(e) => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v) }}
          style={{ flex: 1, minHeight: 44, padding: '0 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 13, color: COLORS.text, background: COLORS.panel }} />
      </div>
    </div>
  )
}

// ─── Select Field ─────────────────────────────────────────────────────────
export function SelectField({ label, value, options, onChange }: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{label}</span>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="ve-icobtn"
        style={{ minHeight: 44, padding: '0 10px', border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, fontSize: 14, color: COLORS.text, background: COLORS.panel, cursor: 'pointer' }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ─── Toggle Field ─────────────────────────────────────────────────────────
export function ToggleField({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.text }}>{label}</span>
      <button type="button" role="switch" aria-checked={checked} aria-label={label}
        onClick={() => onChange(!checked)}
        style={{ width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative', backgroundColor: checked ? COLORS.primary : COLORS.border }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: SHADOWS.sm, transition: 'left 150ms' }} />
      </button>
    </div>
  )
}
