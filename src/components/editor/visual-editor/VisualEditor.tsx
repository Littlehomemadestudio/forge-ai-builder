// ─── Forge Visual Editor — Production Studio Orchestrator ──────────────────
// Main orchestrator: manages all state, wires all child components,
// handles keyboard shortcuts, AI, undo/redo, dark mode, and layout.
//
// Layout:
// ┌──────────────────────────────────────────────────┐
// │ TopNav (h-12)                                     │
// ├────┬─────────────────────────────────┬────────────┤
// │    │                                 │            │
// │Icon│     Canvas / EmptyCanvas        │ Inspector  │
// │Tool│                                 │ (w-[280px])│
// │bar │  + FloatingSelectionBar         │            │
// │w-12│                                 │            │
// │    │─────────────────────────────────│            │
// │    │  AIAssistantBar                 │            │
// ├────┴─────────────────────────────────┴────────────┤
// │ ToolPanel (w-[260px], slides over canvas from L)  │
// └──────────────────────────────────────────────────┘
//
// Bugs fixed:
// 1. findByFid imported from Canvas (no duplicate)
// 2. SSE reader res.body null-checked
// 3. window.prompt() → PasteModal dialog
// 4. Dark mode via CSS class (not imperative style.setProperty)
// 5. Hook dependency order: showToast → runAI → stopAI → onInsert

'use client'

import * as React from 'react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { AccessibilityProvider, useAccessibility } from './AccessibilityContext'
import { useEditorTheme, LIGHT_COLORS, DARK_COLORS, ANIMATION, Z_INDEX } from './design-tokens'
import { TopNav } from './TopNav'
import { IconToolbar } from './IconToolbar'
import { ToolPanel } from './ToolPanel'
import { Canvas, findByFid, type SelectionInfo } from './Canvas'
import { Inspector } from './Inspector'
import { FloatingSelectionBar } from './FloatingSelectionBar'
import { EmptyCanvas } from './EmptyCanvas'
import { AIAssistantBar } from './AIAssistantBar'
import { CommandPalette, ShortcutsHelp } from './Overlays'
import { LiveRegion, announce } from './primitives'
import { matchShortcut } from './keyboard'

// ═══════════════════════════════════════════════════════════════════════════
// Paste HTML Modal — replaces window.prompt()
// ═══════════════════════════════════════════════════════════════════════════

function PasteModal({
  open,
  onClose,
  onPaste,
}: {
  open: boolean
  onClose: () => void
  onPaste: (html: string) => void
}) {
  // Use key to force remount on open → value auto-resets to ''
  if (!open) return null

  return <PasteModalInner onClose={onClose} onPaste={onPaste} />
}

function PasteModalInner({
  onClose,
  onPaste,
}: {
  onClose: () => void
  onPaste: (html: string) => void
}) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (trimmed) {
      onPaste(trimmed)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Paste HTML"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-gray-100">
          Paste HTML
        </h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Paste your HTML markup below. It will replace the current canvas content.
        </p>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="<section>...</section>"
          className="mb-4 h-40 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
            if (e.key === 'Escape') onClose()
          }}
        />
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400/20 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Paste
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Accessible starter page used by "Start blank"
// ═══════════════════════════════════════════════════════════════════════════

const STARTER = `
<section style="padding:96px 24px;text-align:center;max-width:1000px;margin:0 auto">
  <h1 style="font-size:48px;line-height:1.1;margin:0 0 16px;color:#111827;font-weight:800">Your new website</h1>
  <p style="font-size:20px;line-height:1.6;color:#4B5563;max-width:640px;margin:0 auto 32px">Start with a blank, accessible page and make it yours. Edit any element by clicking it, or ask the AI to build something for you.</p>
  <a href="#get-started" style="display:inline-block;background:#2563EB;color:#ffffff;font-weight:600;font-size:16px;padding:14px 28px;border-radius:10px;text-decoration:none">Get started</a>
</section>`

// ═══════════════════════════════════════════════════════════════════════════
// EditorShell — the main orchestrator component
// ═══════════════════════════════════════════════════════════════════════════

function EditorShell() {
  const { reduceMotion, fontSizeScale } = useAccessibility()
  const theme = useEditorTheme()

  // ── Store-backed document sources ──────────────────────────────────────
  const selectedTemplateHtml = useAppStore((s) => s.selectedTemplateHtml)
  const generatedPages = useAppStore((s) => s.generatedPages)
  const currentPreviewPage = useAppStore((s) => s.currentPreviewPage)
  const navigate = useAppStore((s) => s.navigate)

  // ── Local document state ──────────────────────────────────────────────
  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [projectName, setProjectName] = useState('Untitled project')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // ── Editor UI state ───────────────────────────────────────────────────
  const [selection, setSelection] = useState<SelectionInfo | null>(null)
  const [activeTool, setActiveTool] = useState('pages')
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [zoom, setZoom] = useState(70)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiFeedback, setAiFeedback] = useState('')
  const [auditResults, setAuditResults] = useState<string[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toolbarVisible, setToolbarVisible] = useState(true)
  const [panelOpen, setPanelOpen] = useState(true)
  const [aiAbortRef, setAiAbortRef] = useState<AbortController | null>(null)
  const [pasteModalOpen, setPasteModalOpen] = useState(false)

  const contentRootRef = useRef<HTMLElement | null>(null)
  const shellRef = useRef<HTMLDivElement | null>(null)

  // ── Dark mode: toggle CSS class on shell element ──────────────────────
  // Uses Tailwind's `dark` class convention — no imperative style.setProperty
  useEffect(() => {
    const el = shellRef.current
    if (!el) return
    el.classList.toggle('ve-dark', darkMode)
    // Also toggle on <html> for Tailwind dark: variant support
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // ── Responsive: auto-hide inspector on small screens ──────────────────
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setInspectorOpen(!mq.matches)
    const handler = (e: MediaQueryListEvent) => setInspectorOpen(!e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ── Load the document (template / generated page) from the store ──────
  useEffect(() => {
    let initialHtml = ''
    let initialCss = ''
    if (generatedPages.length) {
      const active =
        generatedPages.find((p) => p.id === currentPreviewPage) ||
        generatedPages[0]
      initialHtml = active.html || ''
      initialCss = active.css || ''
      if (active.name) setProjectName(active.name)
    } else if (selectedTemplateHtml) {
      initialHtml = selectedTemplateHtml
    }
    if (initialHtml) {
      setHtml(initialHtml)
      setCss(initialCss)
      setHistory([initialHtml])
      setHistoryIndex(0)
    } else {
      setHtml('')
      setCss('')
      setHistory([])
      setHistoryIndex(-1)
    }
  }, [selectedTemplateHtml, generatedPages, currentPreviewPage])

  // ── Refs mirror state so callbacks/effects can read latest without rebinding
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const selectionRef = useRef<SelectionInfo | null>(null)
  const htmlRef = useRef('')
  useEffect(() => { historyRef.current = history }, [history])
  useEffect(() => { historyIndexRef.current = historyIndex }, [historyIndex])
  useEffect(() => { selectionRef.current = selection }, [selection])
  useEffect(() => { htmlRef.current = html }, [html])

  // ── History commit ────────────────────────────────────────────────────
  const commit = useCallback((nextHtml: string, label: string) => {
    const next = [...historyRef.current.slice(0, historyIndexRef.current + 1), nextHtml]
    historyRef.current = next
    setHistoryIndex(next.length - 1)
    setHtml(nextHtml)
    announce(label || 'Updated')
    setSaving(true)
    window.setTimeout(() => setSaving(false), 1200)
  }, [])

  /** Mutate the selected DOM node, then snapshot + push history. */
  const commitNode = useCallback(
    (mutate: (n: HTMLElement) => void, label: string) => {
      const node = findByFid(
        contentRootRef.current,
        selectionRef.current?.fid || ''
      )
      if (!node || node === contentRootRef.current) {
        announce('Nothing selected')
        return
      }
      mutate(node)
      const root = contentRootRef.current
      if (root) commit(root.innerHTML, label)
    },
    [commit]
  )

  const undo = useCallback(() => {
    const i = historyIndexRef.current
    if (i > 0) {
      const next = i - 1
      setHistoryIndex(next)
      setHtml(historyRef.current[next])
    }
  }, [])

  const redo = useCallback(() => {
    const i = historyIndexRef.current
    if (i < historyRef.current.length - 1) {
      const next = i + 1
      setHistoryIndex(next)
      setHtml(historyRef.current[next])
    }
  }, [])

  // ── Toast helper (must come before onInsert which depends on it) ──────
  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }, [])

  // ── AI ────────────────────────────────────────────────────────────────
  // runAI must be defined before onInsert which depends on it
  const runAI = useCallback(
    async (prompt: string) => {
      const abort = new AbortController()
      setAiAbortRef(abort)
      setAiBusy(true)
      setAiFeedback('')
      announce('AI is thinking\u2026')

      const node = findByFid(
        contentRootRef.current,
        selectionRef.current?.fid || ''
      )
      const elementHtml = node
        ? node.outerHTML.slice(0, 4000)
        : (htmlRef.current || '').slice(0, 4000)

      try {
        const res = await fetch('/api/editor-suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            elementTag: node?.tagName.toLowerCase() || 'body',
            elementHtml,
            computedStyles: {},
            siteContext: prompt || 'professional website',
            language: 'en',
          }),
          signal: abort.signal,
        })

        if (!res.ok) {
          const err = await res
            .json()
            .catch(() => ({ error: `HTTP ${res.status}` }))
          setAiFeedback(err?.error || err?.message || 'AI request failed.')
          announce(err?.error || 'Request failed')
          return
        }

        // ── Bug fix: proper null check on res.body ────────────────────
        if (!res.body) {
          setAiFeedback('AI response stream not available.')
          announce('Stream not available')
          return
        }

        // Server streams SSE: delta (live) → result → done/error
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let suggestion: {
          suggestions?: Array<{ description?: string; newHtml?: string }>
        } | null = null
        let streamingText = ''

        consume: while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          let delim: RegExpMatchArray | null
          while ((delim = buffer.match(/\r?\n\r?\n/)) !== null) {
            const rawEvent = buffer.slice(0, delim.index!)
            buffer = buffer.slice(delim.index! + delim[0].length)

            let ev = 'message'
            const dataLines: string[] = []
            for (const line of rawEvent.split(/\r?\n/)) {
              if (line.startsWith('event:')) ev = line.slice(6).trim()
              else if (line.startsWith('data:'))
                dataLines.push(line.slice(5).trim())
            }
            if (dataLines.length === 0) continue
            const dataStr = dataLines.join('\n')
            let data: unknown
            try {
              data = JSON.parse(dataStr)
            } catch {
              data = dataStr
            }

            switch (ev) {
              case 'delta': {
                const chunk = (data as { chunk?: string })?.chunk || ''
                streamingText += chunk
                setAiFeedback(
                  streamingText.length > 200
                    ? streamingText.slice(0, 200) + '\u2026'
                    : streamingText || 'AI is thinking\u2026'
                )
                break
              }
              case 'result':
                suggestion = data as typeof suggestion
                break consume
              case 'error': {
                const errData = data as { message?: string; error?: string }
                const m = errData?.message || errData?.error || 'AI failed.'
                setAiFeedback(m)
                announce(m)
                return
              }
              case 'done':
                break consume
              default:
                break
            }
          }
        }

        // Apply AI-generated HTML if present
        if (suggestion?.suggestions?.[0]?.newHtml) {
          const newHtml = suggestion.suggestions[0].newHtml
          if (
            node &&
            node.parentElement &&
            node.parentElement !== contentRootRef.current
          ) {
            // Replace selected element
            const temp = document.createElement('div')
            temp.innerHTML = newHtml
            const replacement = temp.firstElementChild as HTMLElement | null
            if (replacement) {
              node.replaceWith(replacement)
              const root = contentRootRef.current
              if (root) commit(root.innerHTML, 'AI: replace element')
            }
          } else {
            // Append to canvas
            const root = contentRootRef.current
            if (root) {
              root.innerHTML += newHtml
              commit(root.innerHTML, 'AI: append content')
            }
          }
        }

        const msg =
          suggestion?.suggestions?.[0]?.description || 'AI responded.'
        setAiFeedback(msg)
        announce(msg)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setAiFeedback('AI request cancelled.')
          announce('AI request cancelled')
        } else {
          setAiFeedback(
            'AI is not configured. Add CEREBRAS_API_KEY to .env to enable AI features.'
          )
          announce('AI not configured')
        }
      } finally {
        setAiBusy(false)
        setAiAbortRef(null)
      }
    },
    [commit]
  )

  const stopAI = useCallback(() => {
    aiAbortRef?.abort()
    setAiBusy(false)
    setAiFeedback('Stopped.')
  }, [aiAbortRef])

  // ── Insert HTML from tool panels ──────────────────────────────────────
  const onInsert = useCallback(
    (insertHtml: string, label: string) => {
      if (!insertHtml) {
        // Trigger AI generate
        runAI('Generate a new section for this page')
        return
      }
      const newHtml = htmlRef.current + insertHtml
      commit(newHtml, `Add ${label}`)
      showToast(`Added ${label}`)
    },
    [commit, runAI, showToast]
  )

  const onSelectText = useCallback(
    (text: string, label: string) => {
      commitNode((n) => { n.textContent = text }, label)
    },
    [commitNode]
  )

  const duplicate = useCallback(() => {
    commitNode(
      (n) => {
        const c = n.cloneNode(true) as HTMLElement
        n.after(c)
      },
      'Duplicate'
    )
  }, [commitNode])

  const remove = useCallback(() => {
    const node = findByFid(
      contentRootRef.current,
      selectionRef.current?.fid || ''
    )
    if (
      node &&
      node.parentElement &&
      node.parentElement !== contentRootRef.current
    ) {
      node.remove()
      setSelection(null)
      const root = contentRootRef.current
      if (root) commit(root.innerHTML, 'Delete')
    } else announce('Nothing to delete')
  }, [commit])

  const bold = useCallback(() => {
    commitNode(
      (n) => {
        n.style.fontWeight = n.style.fontWeight === '700' ? '400' : '700'
      },
      'Toggle bold'
    )
  }, [commitNode])

  const align = useCallback(
    (a: 'left' | 'center' | 'right') => {
      commitNode((n) => { n.style.textAlign = a }, `Align ${a}`)
    },
    [commitNode]
  )

  // ── Accessibility audit ───────────────────────────────────────────────
  const runAudit = useCallback(() => {
    const root = contentRootRef.current
    if (!root || !root.children.length) {
      setAuditResults(['Add content, then re-run the audit.'])
      announce('No content to audit')
      return
    }
    const issues: string[] = []
    root.querySelectorAll('img').forEach((img) => {
      if (!img.getAttribute('alt'))
        issues.push(
          `Image missing alt text: ${(img.getAttribute('src') || 'unknown').slice(0, 28)}`
        )
    })
    const hs = Array.from(
      root.querySelectorAll('h1,h2,h3,h4,h5,h6')
    ).map((h) => Number(h.tagName[1]))
    for (let i = 1; i < hs.length; i++) {
      if (hs[i] - hs[i - 1] > 1) {
        issues.push('Heading order skips a level')
        break
      }
    }
    if (!root.querySelector('h1')) issues.push('Page has no h1 heading')
    root.querySelectorAll('li').forEach((li) => {
      if (
        !li.parentElement ||
        !/^[uo]l$/i.test(li.parentElement.tagName)
      )
        issues.push('List item is not inside <ul>/<ol>')
    })
    const low = root.querySelector('p,h1,h2,h3') as HTMLElement | null
    if (low && parseFloat(getComputedStyle(low).fontSize) < 14)
      issues.push('Text smaller than 14px may be hard to read')
    setAuditResults(
      issues.length
        ? issues
        : ['No obvious accessibility issues found. Great work!']
    )
    announce(
      issues.length
        ? `Found ${issues.length} accessibility issues`
        : 'No accessibility issues found'
    )
  }, [])

  const fixAccessibility = useCallback(() => {
    const root = contentRootRef.current
    if (!root) return
    root
      .querySelectorAll('img')
      .forEach((img) => {
        if (!img.getAttribute('alt')) img.setAttribute('alt', 'Decorative image')
      })
    if (root.children[0] && !root.querySelector('h1')) {
      const first = root.querySelector('h2,h3,p,section') as HTMLElement | null
      if (first) {
        const h = document.createElement('h1')
        h.textContent = 'Page title'
        first.before(h)
      }
    }
    commit(root.innerHTML, 'Fix accessibility issues')
    announce('Accessibility issues fixed')
  }, [commit])

  // ── Keyboard: space = pan ─────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.targetMatches?.('input,textarea,[contenteditable]'))
        setSpaceHeld(true)
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  // ── Keyboard: shortcuts ───────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return

      const id = matchShortcut(e)
      if (!id || id === 'pan') return
      e.preventDefault()
      switch (id) {
        case 'undo':
          undo()
          break
        case 'redo':
          redo()
          break
        case 'duplicate':
          duplicate()
          break
        case 'delete':
          remove()
          break
        case 'command-palette':
        case 'quick-command':
          setCmdOpen((o) => !o)
          break
        case 'zoom-in':
          setZoom((z) => Math.min(200, z + 10))
          break
        case 'zoom-out':
          setZoom((z) => Math.max(20, z - 10))
          break
        case 'group':
        case 'ungroup':
          announce('Grouping requires multi-select')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, duplicate, remove])

  // ── Empty-canvas / start actions ──────────────────────────────────────
  const onEmptyAction = useCallback(
    (action: string) => {
      if (action === 'start-blank') {
        setHtml(STARTER)
        setCss('')
        setHistory([STARTER])
        setHistoryIndex(0)
        announce('Blank accessible page created')
      } else if (action === 'templates') {
        navigate('builder')
      } else if (action === 'ai') {
        announce('Describe your site in the AI bar below')
        setAiFeedback('Tell the AI what to build, then press Go.')
      } else if (action === 'import') {
        announce('Import URL is not wired to a backend yet')
      } else if (action === 'paste') {
        // Opens the PasteModal instead of window.prompt()
        setPasteModalOpen(true)
      }
    },
    [navigate]
  )

  // Handler for PasteModal submission
  const handlePasteHtml = useCallback((pasted: string) => {
    setHtml(pasted)
    setCss('')
    setHistory([pasted])
    setHistoryIndex(0)
    announce('HTML imported')
  }, [])

  const onPublish = useCallback(() => {
    showToast('Publishing is not configured on this host yet.')
    announce('Publishing not configured')
  }, [showToast])

  const onExport = useCallback(() => {
    const full = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${projectName}</title><style>${css}</style></head><body>${html}</body></html>`
    const blob = new Blob([full], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'index.html'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported index.html')
    announce('Exported index.html')
  }, [html, css, projectName, showToast])

  const runCommand = useCallback(
    (id: string) => {
      switch (id) {
        case 'undo':
          undo()
          break
        case 'redo':
          redo()
          break
        case 'duplicate':
          duplicate()
          break
        case 'delete':
          remove()
          break
        case 'add-section':
          commit(
            htmlRef.current + '<section style="padding:64px 24px"></section>',
            'Add section'
          )
          break
        case 'add-text':
          commit(
            htmlRef.current +
              '<h2 style="padding:8px 0;color:#111827">New heading</h2>',
            'Add text'
          )
          break
        case 'add-image':
          commit(
            htmlRef.current +
              '<img src="https://placehold.co/800x400?text=Image" alt="Placeholder image" style="max-width:100%">',
            'Add image'
          )
          break
        case 'ai-generate':
        case 'ai-redesign':
          setCmdOpen(false)
          runAI(
            id === 'ai-generate'
              ? 'Generate a new section'
              : 'Redesign the page'
          )
          break
        case 'accessibility':
          runAudit()
          break
        case 'publish':
          onPublish()
          break
        case 'shortcuts':
          setShortcutsOpen(true)
          break
        case 'toggle-dark':
          setDarkMode((d) => !d)
          break
        case 'toggle-inspector':
          setInspectorOpen((o) => !o)
          break
      }
    },
    [undo, redo, duplicate, remove, commit, runAI, runAudit, onPublish]
  )

  // ── Derived state ─────────────────────────────────────────────────────
  const hasContent = html.trim().length > 0
  const baseFont =
    fontSizeScale === 'small'
      ? 14
      : fontSizeScale === 'large'
        ? 18
        : fontSizeScale === 'extra-large'
          ? 20
          : 16

  // Context-aware AI suggestions
  const aiSuggestions = React.useMemo(() => {
    const base = [{ id: 'improve', label: '\u2728 Improve selected' }]
    if (selection?.isImage)
      base.push({ id: 'alt', label: '\u2728 Add alt text' })
    if (selection?.isText)
      base.push({ id: 'rewrite', label: '\u2728 Rewrite text' })
    base.push({ id: 'contrast', label: '\u2728 Fix contrast' })
    return base
  }, [selection])

  // Canvas background from theme
  const canvasBg = theme.colors.canvas.background

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER — Production Studio Layout
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div
      ref={shellRef}
      className={`ve-shell${darkMode ? ' ve-dark' : ''} flex h-screen w-screen flex-col overflow-hidden`}
      style={{ fontSize: baseFont }}
    >
      <LiveRegion />

      {/* ── Saving indicator ──────────────────────────────────────────── */}
      {saving && (
        <div
          aria-live="polite"
          className="fixed right-4 top-[60px] z-[600] flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white dark:bg-blue-500"
        >
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Saving&hellip;
        </div>
      )}

      {/* ── TopNav (h-12 = 48px) ─────────────────────────────────────── */}
      <TopNav
        projectName={projectName}
        onProjectNameChange={setProjectName}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        onBack={() => navigate('dashboard')}
        device={device}
        onDeviceChange={setDevice}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(200, z + 10))}
        onZoomOut={() => setZoom((z) => Math.max(20, z - 10))}
        onFit={() => setZoom(70)}
        onCommandPalette={() => setCmdOpen(true)}
        onShortcuts={() => setShortcutsOpen(true)}
        onPublish={onPublish}
        onToggleToolbar={() => setToolbarVisible((v) => !v)}
        darkMode={darkMode}
      />

      {/* ── Main body row ────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">
        {/* ── Left: IconToolbar (w-12 = 48px) ──────────────────────── */}
        {toolbarVisible && (
          <IconToolbar
            active={activeTool}
            onSelect={(id) => {
              if (id === activeTool) {
                setPanelOpen((p) => !p)
              } else {
                setActiveTool(id)
                setPanelOpen(true)
              }
              if (id === 'ai')
                announce('AI: describe a request in the assistant bar below')
            }}
            darkMode={darkMode}
          />
        )}

        {/* ── Left: ToolPanel (w-[260px], slides over canvas) ──────── */}
        <div
          className={`relative shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]${toolbarVisible && panelOpen ? ' w-[260px]' : ' w-0'}`}
        >
          <div className="h-full w-[260px]">
            <ToolPanel
              activeTool={activeTool}
              onInsert={onInsert}
              darkMode={darkMode}
              htmlContent={html}
            />
          </div>
        </div>

        {/* ── Center: Canvas + AI bar column ───────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Canvas area */}
          <div className="relative flex min-h-0 flex-1">
            {hasContent ? (
              <Canvas
                html={html}
                css={css}
                device={device}
                zoom={zoom}
                selectedFid={selection?.fid || null}
                spaceHeld={spaceHeld}
                onSelect={setSelection}
                onChangeHtml={commit}
                hasContent={hasContent}
                onContentReady={(el) => {
                  contentRootRef.current = el
                }}
              />
            ) : (
              <div
                className="flex-1 overflow-auto"
                style={{ backgroundColor: canvasBg }}
              >
                <EmptyCanvas onAction={onEmptyAction} />
              </div>
            )}

            {/* Floating selection bar (positioned absolutely inside canvas) */}
            <FloatingSelectionBar
              selection={selection}
              onDuplicate={duplicate}
              onDelete={remove}
              onAI={() => runAI('Improve this element')}
              onBold={bold}
              onAlign={align}
            />
          </div>

          {/* ── AI Assistant Bar ─────────────────────────────────────── */}
          <AIAssistantBar
            onSubmit={(prompt) => runAI(prompt)}
            isBusy={aiBusy}
            onStop={stopAI}
            onRegenerate={() => runAI('Improve this element')}
            lastResponse={aiFeedback}
            suggestions={aiSuggestions}
          />

          {/* ── AI feedback — shown inside the AI bar's collapsible area (handled
               by AIAssistantBar). No separate div. ──────────────────────── */}

          {/* ── Audit results — shown in inspector, not a separate bar ── */}
        </div>

        {/* ── Right: Inspector (w-[280px]) ─────────────────────────── */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]${inspectorOpen ? ' w-[280px]' : ' w-0'}`}
        >
          <div className="h-full w-[280px]">
            <Inspector
              selection={selection}
              onApply={commitNode}
              onSelectText={onSelectText}
              onDeleteSelection={remove}
              onDuplicateSelection={duplicate}
              onRunAccessibilityAudit={runAudit}
              onFixAccessibility={fixAccessibility}
              onExport={onExport}
              onAI={(prompt) => runAI(prompt)}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((d) => !d)}
              onToggleInspector={() => setInspectorOpen(false)}
            />
          </div>
        </div>

        {/* ── Inspector toggle button (visible when inspector closed) ── */}
        {!inspectorOpen && (
          <button
            onClick={() => setInspectorOpen(true)}
            className="absolute right-0 top-1/2 z-[100] -translate-y-1/2 rounded-l-lg border border-r-0 border-gray-300 bg-white px-1.5 py-3 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 md:right-0"
            aria-label="Open inspector panel"
            title="Open Inspector"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M3 1L11 7L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ── Overlays ─────────────────────────────────────────────────── */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onRun={runCommand}
      />
      <ShortcutsHelp
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      {/* ── Paste HTML Modal ─────────────────────────────────────────── */}
      <PasteModal
        open={pasteModalOpen}
        onClose={() => setPasteModalOpen(false)}
        onPaste={handlePasteHtml}
      />

      {/* ── Toast ────────────────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-[800] -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
        >
          {toast}
        </div>
      )}

      {/* ── Audit results inline (temporary, until inspector integration) ── */}
      {auditResults.length > 0 && (
        <div
          role="status"
          className="fixed bottom-32 left-1/2 z-[400] max-w-md -translate-x-1/2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-800 shadow-md dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
        >
          <span className="mr-1.5 font-semibold">A11y audit:</span>
          {auditResults.map((r, i) => (
            <span key={r} className="mr-3">
              {i > 0 && <span className="mr-1">&bull;</span>}
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// VisualEditor — exported main component
// Wraps EditorShell in AccessibilityProvider
// ═══════════════════════════════════════════════════════════════════════════

export function VisualEditor() {
  return (
    <AccessibilityProvider>
      <EditorShell />
    </AccessibilityProvider>
  )
}
