'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Accessible UI Primitives — Production-Grade Visual Editor Components
// 44px touch targets, visible focus rings, reduced-motion aware,
// proper Tailwind classes, dark mode support, smooth transitions.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react'
import { useId, useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
  ACCESSIBILITY,
  ANIMATION,
  Z_INDEX,
  LIGHT_COLORS,
  DARK_COLORS,
  useEditorTheme,
} from './design-tokens'
import { useAccessibility } from './AccessibilityContext'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════
// 1. LiveRegion + announce()
// ═══════════════════════════════════════════════════════════════════════════

let _announceTimer: ReturnType<typeof setTimeout> | null = null

export function LiveRegion() {
  return (
    <div
      id="ve-live-region"
      aria-live="polite"
      aria-atomic="true"
      className="absolute w-px h-px overflow-hidden whitespace-nowrap"
      style={{ clip: 'rect(0 0 0 0)' }}
    />
  )
}

/**
 * Announce a message to screen readers via the live region.
 * Debounced at 60ms so rapid calls don't flood the SR queue.
 */
export function announce(message: string) {
  if (typeof window === 'undefined') return
  const el = document.getElementById('ve-live-region')
  if (!el) return

  if (_announceTimer) clearTimeout(_announceTimer)
  _announceTimer = setTimeout(() => {
    el.textContent = ''
    requestAnimationFrame(() => {
      el.textContent = message
    })
  }, 60)
}


// ═══════════════════════════════════════════════════════════════════════════
// 2. Kbd — Keyboard shortcut badge
// ═══════════════════════════════════════════════════════════════════════════

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Show a separator (e.g. "⌘+K") */
  separator?: string
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5',
        'text-[11px] font-semibold leading-none',
        'font-mono',
        'bg-white dark:bg-neutral-800',
        'text-neutral-500 dark:text-neutral-400',
        'border border-neutral-300 dark:border-neutral-600',
        'border-b-[2px]',
        'rounded',
        'select-none',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 3. IconButton — Accessible icon button with tooltip
// ═══════════════════════════════════════════════════════════════════════════

export interface IconButtonProps {
  label: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  active?: boolean
  disabled?: boolean
  /** 'sm' = 32px, 'md' = 40px, 'lg' = 44px */
  size?: 'sm' | 'md' | 'lg'
  danger?: boolean
  className?: string
  /** Override tooltip side */
  tooltipSide?: React.ComponentProps<typeof TooltipContent>['side']
}

const ICON_BUTTON_SIZES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-11 h-11',
} as const

export function IconButton({
  label,
  children,
  onClick,
  active = false,
  disabled = false,
  size = 'md',
  danger = false,
  className,
  tooltipSide = 'right',
}: IconButtonProps) {
  const sizeClasses = ICON_BUTTON_SIZES[size]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={active}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            'inline-flex items-center justify-center',
            'rounded-lg',
            'border border-transparent',
            'transition-all duration-150',
            'outline-none',
            // Focus ring (box-shadow, not outline)
            'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
            'dark:focus-visible:ring-offset-neutral-900',
            // Hover
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            // Active
            'active:scale-95',
            // States
            active && 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
            !active && !danger && 'text-neutral-500 dark:text-neutral-400',
            danger && 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
            disabled && 'opacity-40 pointer-events-none',
            sizeClasses,
            className
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      {!disabled && (
        <TooltipContent side={tooltipSide} sideOffset={6}>
          <span className="text-xs font-medium">{label}</span>
        </TooltipContent>
      )}
    </Tooltip>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 4. Field — Form field wrapper
// ═══════════════════════════════════════════════════════════════════════════

export interface FieldProps {
  label: string
  children: React.ReactNode
  description?: string
  error?: string
  required?: boolean
  className?: string
}

export function Field({
  label,
  children,
  description,
  error,
  required = false,
  className,
}: FieldProps) {
  const autoId = useId()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={autoId}
        className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
        )}
      </label>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: autoId })
          : child
      )}
      {description && !error && (
        <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {error && (
        <p className="text-[12px] text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 5. ActionButton — Proper button variants
// ═══════════════════════════════════════════════════════════════════════════

export type ActionButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ActionButtonVariant
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const ACTION_BUTTON_CLASSES: Record<ActionButtonVariant, string> = {
  primary: cn(
    'bg-blue-600 text-white',
    'hover:bg-blue-700 active:bg-blue-800',
    'dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700',
    'shadow-sm',
  ),
  secondary: cn(
    'bg-white text-neutral-800',
    'border border-neutral-300',
    'hover:bg-neutral-50 active:bg-neutral-100',
    'dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600',
    'dark:hover:bg-neutral-750 dark:active:bg-neutral-700',
    'shadow-sm',
  ),
  ghost: cn(
    'bg-transparent text-neutral-600',
    'hover:bg-neutral-100 active:bg-neutral-200',
    'dark:text-neutral-400 dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
  ),
  danger: cn(
    'bg-red-600 text-white',
    'hover:bg-red-700 active:bg-red-800',
    'dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700',
    'shadow-sm',
  ),
}

const ACTION_BUTTON_SIZES = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'min-h-[44px] px-3.5 text-[14px] gap-2',
  lg: 'min-h-[48px] px-5 text-[15px] gap-2.5',
} as const

export function ActionButton({
  children,
  onClick,
  variant = 'secondary',
  icon,
  disabled = false,
  size = 'md',
  className,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center',
        'font-semibold',
        'rounded-lg',
        'transition-all duration-150',
        'outline-none',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
        'dark:focus-visible:ring-offset-neutral-900',
        'active:scale-[0.98]',
        ACTION_BUTTON_CLASSES[variant],
        ACTION_BUTTON_SIZES[size],
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      {...rest}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </button>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 6. SegmentedControl — Toggle group with active indicator
// ═══════════════════════════════════════════════════════════════════════════

export interface SegmentedControlProps<T extends string> {
  label: string
  options: { value: T; label: string; icon?: React.ReactNode }[]
  value: T
  onChange: (v: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const baseId = useId()
  const activeIndex = options.findIndex((o) => o.value === value)

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'relative inline-flex gap-0.5 p-0.5',
        'bg-neutral-100 dark:bg-neutral-800',
        'rounded-lg',
        'border border-neutral-200 dark:border-neutral-700',
        className
      )}
    >
      {/* Active indicator */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-md bg-white dark:bg-neutral-700 shadow-sm"
        style={{
          left: activeIndex >= 0 ? `calc(${activeIndex} * (100% - 4px) / ${options.length} + 2px)` : 0,
          width: `calc((100% - 4px) / ${options.length})`,
        }}
        animate={{
          x: activeIndex * 100,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        layout
      />
      {options.map((opt, i) => {
        const active = opt.value === value
        const id = `${baseId}-${opt.value}`
        return (
          <React.Fragment key={opt.value}>
            <input
              id={id}
              type="radio"
              name={baseId}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="sr-only"
              tabIndex={-1}
            />
            <label
              htmlFor={id}
              tabIndex={active ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onChange(opt.value)
                }
              }}
              title={opt.label}
              className={cn(
                'relative z-10',
                'min-h-[32px] min-w-[40px] px-2.5',
                'flex items-center justify-center gap-1.5',
                'rounded-md',
                'text-[13px] font-medium',
                'cursor-pointer select-none',
                'transition-colors duration-150',
                active
                  ? 'text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300',
              )}
            >
              {opt.icon && <span className="inline-flex">{opt.icon}</span>}
              {opt.label}
            </label>
          </React.Fragment>
        )
      })}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 7. CollapsibleSection — With AnimatePresence
// ═══════════════════════════════════════════════════════════════════════════

export interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: React.ReactNode
  className?: string
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  badge,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const { reduceMotion } = useAccessibility()

  return (
    <section className={cn('border-b border-neutral-200 dark:border-neutral-700', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={cn(
          'w-full min-h-[44px]',
          'flex items-center justify-between',
          'px-4',
          'bg-transparent border-none',
          'text-[13px] font-semibold uppercase tracking-wider',
          'text-neutral-800 dark:text-neutral-200',
          'cursor-pointer',
          'transition-colors duration-150',
          'hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
          'outline-none',
          'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
        )}
      >
        <span className="flex items-center gap-2">
          {title}
          {badge && (
            <span className="text-neutral-500 dark:text-neutral-400 font-normal normal-case tracking-normal">
              {badge}
            </span>
          )}
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className="text-neutral-400 dark:text-neutral-500"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.25,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 8. SliderField — Range input with value display
// ═══════════════════════════════════════════════════════════════════════════

export interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  suffix?: string
  /** Show min/max labels */
  showLimits?: boolean
  className?: string
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
  showLimits = false,
  className,
}: SliderFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
          {label}
        </span>
        <output className="text-[12px] tabular-nums text-neutral-500 dark:text-neutral-400">
          {value}{suffix}
        </output>
      </div>
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-2 rounded-full appearance-none cursor-pointer',
          'bg-neutral-200 dark:bg-neutral-700',
          'accent-blue-600 dark:accent-blue-400',
          // Track
          '[&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:h-2',
          '[&::-webkit-slider-runnable-track]:bg-neutral-200 dark:[&::-webkit-slider-runnable-track]:bg-neutral-700',
          // Thumb
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
          '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600',
          '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white',
          '[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer',
          'dark:[&::-webkit-slider-thumb]:bg-blue-400',
          // Focus
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
        )}
      />
      {showLimits && (
        <div className="flex justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
          <span>{min}{suffix}</span>
          <span>{max}{suffix}</span>
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 9. ColorField — Color picker with swatch + hex + alpha
// ═══════════════════════════════════════════════════════════════════════════

export interface ColorFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  /** Enable alpha channel */
  alpha?: boolean
  className?: string
}

export function ColorField({
  label,
  value,
  onChange,
  alpha = false,
  className,
}: ColorFieldProps) {
  // Extract hex and alpha from value
  const hexPart = value.startsWith('#') ? value.slice(0, 7) : '#000000'
  const alphaPart = value.length === 9 ? parseInt(value.slice(7, 9), 16) / 255 : 1

  const handleHexChange = useCallback(
    (newHex: string) => {
      if (/^#[0-9a-fA-F]{0,6}$/.test(newHex)) {
        if (newHex.length === 7 && alpha) {
          const aHex = Math.round(alphaPart * 255).toString(16).padStart(2, '0')
          onChange(newHex + aHex)
        } else {
          onChange(newHex)
        }
      }
    },
    [alpha, alphaPart, onChange]
  )

  const handleAlphaChange = useCallback(
    (newAlpha: number) => {
      const aHex = Math.round(newAlpha * 255).toString(16).padStart(2, '0')
      onChange(hexPart + aHex)
    },
    [hexPart, onChange]
  )

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {/* Swatch */}
        <div
          className="relative w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-600 overflow-hidden shrink-0"
          style={{ background: hexPart }}
        >
          {/* Alpha checkerboard */}
          {alpha && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)`,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 4px 4px',
                opacity: 1 - alphaPart,
              }}
            />
          )}
          <input
            type="color"
            aria-label={`${label} color`}
            value={hexPart}
            onChange={(e) => handleHexChange(e.target.value)}
            className="absolute -inset-1 w-12 h-12 border-none cursor-pointer opacity-0"
          />
        </div>
        {/* Hex input */}
        <input
          type="text"
          aria-label={`${label} hex`}
          value={hexPart.toUpperCase()}
          onChange={(e) => handleHexChange(e.target.value)}
          className={cn(
            'flex-1 min-h-[44px] px-2.5',
            'text-[13px] font-mono',
            'text-neutral-800 dark:text-neutral-200',
            'bg-white dark:bg-neutral-800',
            'border border-neutral-300 dark:border-neutral-600',
            'rounded-lg',
            'outline-none',
            'transition-colors duration-150',
            'focus-visible:ring-2 focus-visible:ring-blue-500',
          )}
        />
      </div>
      {/* Alpha slider */}
      {alpha && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 w-8">α</span>
          <input
            type="range"
            aria-label={`${label} alpha`}
            min={0}
            max={1}
            step={0.01}
            value={alphaPart}
            onChange={(e) => handleAlphaChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full accent-blue-600 cursor-pointer"
          />
          <span className="text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400 w-8 text-right">
            {Math.round(alphaPart * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 10. SelectField — Native select
// ═══════════════════════════════════════════════════════════════════════════

export interface SelectFieldProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
  className?: string
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
        {label}
      </span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'min-h-[44px] w-full px-2.5',
          'text-[14px]',
          'text-neutral-800 dark:text-neutral-200',
          'bg-white dark:bg-neutral-800',
          'border border-neutral-300 dark:border-neutral-600',
          'rounded-lg',
          'cursor-pointer',
          'outline-none',
          'transition-colors duration-150',
          'focus-visible:ring-2 focus-visible:ring-blue-500',
          'appearance-none',
          'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:12px] bg-[right_10px_center] bg-no-repeat',
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 11. ToggleField — Switch with animation
// ═══════════════════════════════════════════════════════════════════════════

export interface ToggleFieldProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  description?: string
  className?: string
}

export function ToggleField({
  label,
  checked,
  onChange,
  description,
  className,
}: ToggleFieldProps) {
  return (
    <div className={cn('flex items-center justify-between min-h-[44px] gap-3', className)}>
      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200">
          {label}
        </span>
        {description && (
          <span className="text-[12px] text-neutral-500 dark:text-neutral-400">
            {description}
          </span>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full',
          'border-none cursor-pointer',
          'transition-colors duration-200',
          'outline-none',
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          'dark:focus-visible:ring-offset-neutral-900',
          checked
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-neutral-300 dark:bg-neutral-600',
        )}
      >
        <motion.span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 12. Divider
// ═══════════════════════════════════════════════════════════════════════════

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn(
          'w-px self-stretch',
          'bg-neutral-200 dark:bg-neutral-700',
          className
        )}
      />
    )
  }
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        'h-px w-full',
        'bg-neutral-200 dark:bg-neutral-700',
        className
      )}
    />
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 13. Badge — Status badge
// ═══════════════════════════════════════════════════════════════════════════

export type BadgeVariant = 'default' | 'info' | 'success' | 'warning' | 'error'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  default: cn(
    'bg-neutral-100 text-neutral-700',
    'dark:bg-neutral-800 dark:text-neutral-300',
  ),
  info: cn(
    'bg-blue-50 text-blue-700',
    'dark:bg-blue-900/30 dark:text-blue-300',
  ),
  success: cn(
    'bg-green-50 text-green-700',
    'dark:bg-green-900/30 dark:text-green-300',
  ),
  warning: cn(
    'bg-amber-50 text-amber-700',
    'dark:bg-amber-900/30 dark:text-amber-300',
  ),
  error: cn(
    'bg-red-50 text-red-700',
    'dark:bg-red-900/30 dark:text-red-300',
  ),
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'text-[11px] font-semibold leading-none',
        'rounded-md',
        'select-none',
        BADGE_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}


// ═══════════════════════════════════════════════════════════════════════════
// 14. Tooltip — Simple CSS-only tooltip via data-tooltip
// ═══════════════════════════════════════════════════════════════════════════

export interface SimpleTooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const TOOLTIP_POSITION: Record<string, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
}

export function SimpleTooltip({
  content,
  children,
  side = 'top',
  className,
}: SimpleTooltipProps) {
  return (
    <span className={cn('relative inline-flex group', className)} data-tooltip={content}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'absolute pointer-events-none',
          'px-2.5 py-1',
          'text-[12px] font-medium whitespace-nowrap',
          'text-white dark:text-neutral-100',
          'bg-neutral-900 dark:bg-neutral-700',
          'rounded-md shadow-md',
          'opacity-0 scale-95',
          'group-hover:opacity-100 group-hover:scale-100',
          'group-focus-within:opacity-100 group-focus-within:scale-100',
          'transition-all duration-150',
          'z-[700]',
          TOOLTIP_POSITION[side],
        )}
      >
        {content}
      </span>
    </span>
  )
}
