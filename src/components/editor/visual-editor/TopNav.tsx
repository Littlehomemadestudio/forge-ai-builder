'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Top Navigation — Production-Grade Studio Toolbar
// Inspired by Figma / Webflow / Linear top bars.
// 48px height, compact icon buttons, inline-edit project name,
// responsive collapse at < 768px, full ARIA + keyboard support.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from 'react'
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Maximize,
  Search,
  Send,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react'
import { LIGHT_COLORS, DARK_COLORS } from './design-tokens'
import { IconButton, SegmentedControl } from './primitives'

// ═══════════════════════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════════════════════

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
  onToggleToolbar: () => void
  darkMode?: boolean
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export function TopNav(props: TopNavProps) {
  const {
    projectName,
    onProjectNameChange,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onBack,
    device,
    onDeviceChange,
    zoom,
    onZoomIn,
    onZoomOut,
    onFit,
    onCommandPalette,
    onShortcuts,
    onPublish,
    onToggleToolbar,
    darkMode = false,
  } = props

  // ── Inline-edit state ────────────────────────────────────────────────────
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [draftName, setDraftName] = React.useState(projectName)
  const nameInputRef = React.useRef<HTMLInputElement>(null)

  // Sync draft when prop changes (and not actively editing)
  React.useEffect(() => {
    if (!isEditingName) setDraftName(projectName)
  }, [projectName, isEditingName])

  // Focus input when entering edit mode
  React.useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [isEditingName])

  const startEditing = React.useCallback(() => {
    setDraftName(projectName)
    setIsEditingName(true)
  }, [projectName])

  const confirmEdit = React.useCallback(() => {
    const trimmed = draftName.trim()
    if (trimmed && trimmed !== projectName) {
      onProjectNameChange(trimmed)
    }
    setIsEditingName(false)
  }, [draftName, projectName, onProjectNameChange])

  const cancelEdit = React.useCallback(() => {
    setDraftName(projectName)
    setIsEditingName(false)
  }, [projectName])

  // ── Mobile menu state ────────────────────────────────────────────────────
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // ── Theme colors ─────────────────────────────────────────────────────────
  const colors = darkMode ? DARK_COLORS : LIGHT_COLORS

  return (
    <header
      role="banner"
      aria-label="Editor top bar"
      className={`
        h-12 flex items-center justify-between
        px-3
        border-b
        ${darkMode
          ? 'bg-[#111827] border-[#334155]'
          : 'bg-[#FAFAFA] border-[#E5E7EB]'
        }
        select-none
        z-[200]
      `}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          GROUP 1 — App: Back · Logo · Project name
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1.5 min-w-0 shrink-0">
        {/* Back button */}
        <IconButton
          label="Back to dashboard"
          onClick={onBack}
          size="sm"
          tooltipSide="bottom"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </IconButton>

        {/* Forge logo icon */}
        <div
          aria-hidden="true"
          className={`
            w-7 h-7 rounded-md flex items-center justify-center
            ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}
            text-white
            transition-colors duration-150
          `}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4L8 1L14 4V12L8 15L2 12V4Z"
              fill="currentColor"
              fillOpacity="0.9"
            />
            <path
              d="M8 1L14 4L8 7L2 4L8 1Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
          </svg>
        </div>

        {/* Project name — inline edit on double-click */}
        {isEditingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); confirmEdit() }
              if (e.key === 'Escape') { e.preventDefault(); cancelEdit() }
            }}
            aria-label="Edit project name"
            className={`
              h-7 max-w-[180px] px-2
              rounded-md
              text-[13px] font-semibold leading-none
              ${darkMode
                ? 'bg-neutral-800 text-neutral-100 border border-neutral-600'
                : 'bg-white text-neutral-900 border border-neutral-300'
              }
              outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
              ${darkMode ? 'focus-visible:ring-offset-neutral-900' : 'focus-visible:ring-offset-white'}
            `}
          />
        ) : (
          <button
            type="button"
            onDoubleClick={startEditing}
            aria-label={`Project name: ${projectName}. Double-click to rename.`}
            className={`
              h-7 max-w-[180px] px-2
              rounded-md
              text-[13px] font-semibold leading-none
              truncate
              border border-transparent
              ${darkMode
                ? 'text-neutral-200 hover:bg-neutral-800 hover:border-neutral-600'
                : 'text-neutral-800 hover:bg-neutral-100 hover:border-neutral-200'
              }
              transition-colors duration-150
              outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
              ${darkMode ? 'focus-visible:ring-offset-neutral-900' : 'focus-visible:ring-offset-white'}
              cursor-default
              text-left
            `}
          >
            {projectName}
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          GROUP 2 — History: Undo · Redo
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center gap-0.5 shrink-0">
        <IconButton
          label="Undo (Ctrl+Z)"
          onClick={onUndo}
          disabled={!canUndo}
          size="sm"
          tooltipSide="bottom"
        >
          <Undo2 size={16} strokeWidth={2} />
        </IconButton>
        <IconButton
          label="Redo (Ctrl+Y)"
          onClick={onRedo}
          disabled={!canRedo}
          size="sm"
          tooltipSide="bottom"
        >
          <Redo2 size={16} strokeWidth={2} />
        </IconButton>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          GROUP 3 — Viewport: Device preview · Zoom
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        {/* Device segmented control — icon-only */}
        <SegmentedControl
          label="Device preview"
          value={device}
          onChange={(v: DeviceType) => onDeviceChange(v)}
          options={[
            { value: 'desktop' as DeviceType, label: 'Desktop', icon: <Monitor size={14} strokeWidth={2} /> },
            { value: 'tablet' as DeviceType, label: 'Tablet', icon: <Tablet size={14} strokeWidth={2} /> },
            { value: 'mobile' as DeviceType, label: 'Mobile', icon: <Smartphone size={14} strokeWidth={2} /> },
          ]}
          className=""
        />

        {/* Divider */}
        <div
          aria-hidden="true"
          className={`w-px h-5 ${darkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}
        />

        {/* Zoom: − 70% + */}
        <div className="flex items-center gap-0.5">
          <IconButton
            label="Zoom out"
            onClick={onZoomOut}
            size="sm"
            tooltipSide="bottom"
          >
            <ZoomOut size={15} strokeWidth={2} />
          </IconButton>

          {/* Zoom percentage display */}
          <span
            aria-label={`Zoom level: ${zoom}%`}
            className={`
              min-w-[40px] text-center
              text-[12px] font-medium tabular-nums
              ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}
              select-none
            `}
          >
            {zoom}%
          </span>

          <IconButton
            label="Zoom in"
            onClick={onZoomIn}
            size="sm"
            tooltipSide="bottom"
          >
            <ZoomIn size={15} strokeWidth={2} />
          </IconButton>

          <IconButton
            label="Fit to screen"
            onClick={onFit}
            size="sm"
            tooltipSide="bottom"
          >
            <Maximize size={14} strokeWidth={2} />
          </IconButton>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          GROUP 4 — Actions: Command palette · Publish
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {/* Command palette */}
        <IconButton
          label="Command palette (Ctrl+Shift+P)"
          onClick={onCommandPalette}
          size="sm"
          tooltipSide="bottom"
        >
          <Search size={15} strokeWidth={2} />
        </IconButton>

        {/* Publish / Export dropdown button */}
        <button
          type="button"
          onClick={onPublish}
          aria-label="Publish"
          className={`
            inline-flex items-center gap-1
            h-7 px-2.5
            rounded-md
            text-[12px] font-semibold leading-none
            transition-colors duration-150
            outline-none
            ${darkMode
              ? 'bg-blue-500 text-white hover:bg-blue-400 active:bg-blue-600'
              : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
            }
            focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1
            ${darkMode ? 'focus-visible:ring-offset-neutral-900' : 'focus-visible:ring-offset-white'}
          `}
        >
          <Send size={12} strokeWidth={2} />
          <span>Publish</span>
          <ChevronDown size={11} strokeWidth={2.5} className="opacity-70" />
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MOBILE — Hamburger + essential icons (< 768px)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex md:hidden items-center gap-0.5 shrink-0">
        <IconButton
          label="Undo"
          onClick={onUndo}
          disabled={!canUndo}
          size="sm"
          tooltipSide="bottom"
        >
          <Undo2 size={15} strokeWidth={2} />
        </IconButton>
        <IconButton
          label="Redo"
          onClick={onRedo}
          disabled={!canRedo}
          size="sm"
          tooltipSide="bottom"
        >
          <Redo2 size={15} strokeWidth={2} />
        </IconButton>
        <IconButton
          label="Command palette"
          onClick={onCommandPalette}
          size="sm"
          tooltipSide="bottom"
        >
          <Search size={15} strokeWidth={2} />
        </IconButton>
        <IconButton
          label="More actions"
          onClick={() => {
            setMobileMenuOpen((prev) => !prev)
            onToggleToolbar()
          }}
          size="sm"
          tooltipSide="bottom"
          active={mobileMenuOpen}
        >
          <MoreHorizontal size={16} strokeWidth={2} />
        </IconButton>
      </div>
    </header>
  )
}
