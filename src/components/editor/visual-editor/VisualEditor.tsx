// ─── Forge Visual Editor ───────────────────────────────────────────────────
// Rebuilt from scratch: modern light theme, top nav + left icon toolbar +
// canvas + right inspector + bottom AI bar. Reads the selected template /
// generated pages from the app store so "Edit this template" actually works.
// Accessibility-first: font scaling, reduce-motion, live announcements, 44px
// targets, keyboard shortcuts, command palette, and an AI accessibility audit.

import * as React from 'react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { AccessibilityProvider, useAccessibility } from './AccessibilityContext'
import { COLORS, RADIUS, SPACING, SHADOWS } from './design-tokens'
import { TopNav } from './TopNav'
import { IconToolbar } from './IconToolbar'
import { Canvas, type SelectionInfo } from './Canvas'
import { Inspector } from './Inspector'
import { FloatingSelectionBar } from './FloatingSelectionBar'
import { EmptyCanvas } from './EmptyCanvas'
import { AIAssistantBar } from './AIAssistantBar'
import { CommandPalette, ShortcutsHelp } from './Overlays'
import { LiveRegion, announce } from './primitives'
import { matchShortcut } from './keyboard'

// Accessible starter page used by "Start blank".
const STARTER = `
<section style="padding:96px 24px;text-align:center;max-width:1000px;margin:0 auto">
  <h1 style="font-size:48px;line-height:1.1;margin:0 0 16px;color:#111827;font-weight:800">Your new website</h1>
  <p style="font-size:20px;line-height:1.6;color:#4B5563;max-width:640px;margin:0 auto 32px">Start with a blank, accessible page and make it yours. Edit any element by clicking it, or ask the AI to build something for you.</p>
  <a href="#get-started" style="display:inline-block;background:#2563EB;color:#ffffff;font-weight:600;font-size:16px;padding:14px 28px;border-radius:10px;text-decoration:none">Get started</a>
</section>`

/** Find a DOM node by its escaped path fid inside the canvas root. */
function findByFid(root: HTMLElement | null, fid: string): HTMLElement | null {
  if (!root) return null
  const parts = fid.split('-').map(Number)
  let el: Element = root
  for (const idx of parts) {
    const children = Array.from(el.children).filter((c) => c.nodeType === 1)
    if (idx >= children.length) return null
    el = children[idx]
  }
  return el as HTMLElement
}

function EditorShell() {
  const { reduceMotion, fontSizeScale } = useAccessibility()

  // ── Store-backed document sources (fixes "template never opens") ──────
  const selectedTemplateHtml = useAppStore((s) => s.selectedTemplateHtml)
  const generatedPages = useAppStore((s) => s.generatedPages)
  const currentPreviewPage = useAppStore((s) => s.currentPreviewPage)
  const navigate = useAppStore((s) => s.navigate)
  const projects = useAppStore((s) => s.projects)
  const selectedProjectId = useAppStore((s) => s.selectedProjectId)

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

  const contentRootRef = useRef<HTMLElement | null>(null)

  // ── Load the document (template / generated page) from the store ──────
  useEffect(() => {
    let initialHtml = ''
    let initialCss = ''
    if (generatedPages.length) {
      const active = generatedPages.find((p) => p.id === currentPreviewPage) || generatedPages[0]
      initialHtml = active.html || ''
      initialCss = active.css || ''
      if (active.name) setProjectName(active.name)
    } else if (selectedTemplateHtml) {
      initialHtml = selectedTemplateHtml
    }
    if (initialHtml) {
      setHtml(initialHtml); setCss(initialCss); setHistory([initialHtml]); setHistoryIndex(0)
    } else {
      setHtml(''); setCss(''); setHistory([]); setHistoryIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refs mirror state so callbacks/effects can read latest values without re-binding.
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const selectionRef = useRef<SelectionInfo | null>(null)
  const htmlRef = useRef('')
  useEffect(() => { historyRef.current = history }, [history])
  useEffect(() => { historyIndexRef.current = historyIndex }, [historyIndex])
  useEffect(() => { selectionRef.current = selection }, [selection])
  useEffect(() => { htmlRef.current = html }, [html])

  const commit = useCallback((nextHtml: string, label: string) => {
    const next = [...historyRef.current.slice(0, historyIndexRef.current + 1), nextHtml]
    historyRef.current = next
    setHistoryIndex(next.length - 1)
    setHtml(nextHtml)
    announce(label || 'Updated')
  }, [])

  /** Mutate the selected DOM node, then snapshot + push history. */
  const commitNode = useCallback((mutate: (n: HTMLElement) => void, label: string) => {
    const node = findByFid(contentRootRef.current, selectionRef.current?.fid || '')
    if (!node || node === contentRootRef.current) { announce('Nothing selected'); return }
    mutate(node)
    const root = contentRootRef.current
    if (root) commit(root.innerHTML, label)
  }, [commit])

  const undo = useCallback(() => {
    const i = historyIndexRef.current
    if (i > 0) { const next = i - 1; setHistoryIndex(next); setHtml(historyRef.current[next]) }
  }, [])
  const redo = useCallback(() => {
    const i = historyIndexRef.current
    if (i < historyRef.current.length - 1) { const next = i + 1; setHistoryIndex(next); setHtml(historyRef.current[next]) }
  }, [])

  const onSelectText = useCallback((text: string, label: string) => {
    commitNode((n) => { n.textContent = text }, label)
  }, [commitNode])
  const duplicate = useCallback(() => {
    commitNode((n) => { const c = n.cloneNode(true) as HTMLElement; n.after(c) }, 'Duplicate')
  }, [commitNode])
  const remove = useCallback(() => {
    const node = findByFid(contentRootRef.current, selectionRef.current?.fid || '')
    if (node && node.parentElement && node.parentElement !== contentRootRef.current) {
      node.remove(); setSelection(null)
      const root = contentRootRef.current
      if (root) commit(root.innerHTML, 'Delete')
    } else announce('Nothing to delete')
  }, [commit])
  const bold = useCallback(() => {
    commitNode((n) => { n.style.fontWeight = n.style.fontWeight === '700' ? '400' : '700' }, 'Toggle bold')
  }, [commitNode])
  const align = useCallback((a: 'left' | 'center' | 'right') => {
    commitNode((n) => { n.style.textAlign = a }, `Align ${a}`)
  }, [commitNode])

  // ── AI ────────────────────────────────────────────────────────────────
  const runAI = useCallback(async (prompt: string) => {
    setAiBusy(true)
    setAiFeedback('')
    announce('AI is thinking…')
    const node = findByFid(contentRootRef.current, selectionRef.current?.fid || '')
    const elementHtml = node ? node.outerHTML.slice(0, 4000) : (htmlRef.current || '').slice(0, 4000)
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
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        setAiFeedback(err?.error || err?.message || 'AI request failed.')
        announce(err?.error || 'Request failed')
        return
      }

      // Server streams SSE: delta (live) → result → done/error
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let suggestion: any = null
      let firstMsgShown = false

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
            else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim())
          }
          if (dataLines.length === 0) continue
          const dataStr = dataLines.join('\n')
          let data: any
          try { data = JSON.parse(dataStr) } catch { data = dataStr }

          switch (ev) {
            case 'delta':
              if (!firstMsgShown) {
                setAiFeedback('AI is thinking…')
                firstMsgShown = true
              }
              break
            case 'result':
              suggestion = data
              break consume
            case 'error':
              {
                const m = data?.message || data?.error || 'AI failed.'
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

      const msg = suggestion?.suggestions?.[0]?.description || 'AI responded.'
      setAiFeedback(msg)
      announce(msg)
    } catch {
      setAiFeedback('AI is not configured. Add ZAI_API_KEY to .env to enable AI features.')
      announce('AI not configured')
    } finally {
      setAiBusy(false)
    }
  }, [])

  // ── Accessibility audit ───────────────────────────────────────────────
  const runAudit = useCallback(() => {
    const root = contentRootRef.current
    if (!root || !root.children.length) { setAuditResults(['Add content, then re-run the audit.']); announce('No content to audit'); return }
    const issues: string[] = []
    root.querySelectorAll('img').forEach((img) => {
      if (!img.getAttribute('alt')) issues.push(`Image missing alt text: ${(img.getAttribute('src') || 'unknown').slice(0, 28)}`)
    })
    const hs = Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName[1]))
    for (let i = 1; i < hs.length; i++) { if (hs[i] - hs[i - 1] > 1) { issues.push('Heading order skips a level'); break } }
    if (!root.querySelector('h1')) issues.push('Page has no h1 heading')
    root.querySelectorAll('li').forEach((li) => {
      if (!li.parentElement || !/^[uo]l$/i.test(li.parentElement.tagName)) issues.push('List item is not inside <ul>/<ol>')
    })
    const low = root.querySelector('p,h1,h2,h3') as HTMLElement | null
    if (low && parseFloat(getComputedStyle(low).fontSize) < 14) issues.push('Text smaller than 14px may be hard to read')
    setAuditResults(issues.length ? issues : ['No obvious accessibility issues found. Great work!'])
    announce(issues.length ? `Found ${issues.length} accessibility issues` : 'No accessibility issues found')
  }, [])

  const fixAccessibility = useCallback(() => {
    const root = contentRootRef.current
    if (!root) return
    root.querySelectorAll('img').forEach((img) => { if (!img.getAttribute('alt')) img.setAttribute('alt', 'Decorative image') })
    if (root.children[0] && !root.querySelector('h1')) {
      const first = root.querySelector('h2,h3,p,section') as HTMLElement | null
      if (first) { const h = document.createElement('h1'); h.textContent = 'Page title'; first.before(h) }
    }
    commit(root.innerHTML, 'Fix accessibility issues')
    announce('Accessibility issues fixed')
  }, [commit])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }, [])

  // ── Keyboard: space = pan ─────────────────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.code === 'Space') setSpaceHeld(true) }
    const up = (e: KeyboardEvent) => { if (e.code === 'Space') setSpaceHeld(false) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // ── Keyboard: shortcuts ───────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const id = matchShortcut(e)
      if (!id || id === 'pan') return
      e.preventDefault()
      switch (id) {
        case 'undo': undo(); break
        case 'redo': redo(); break
        case 'duplicate': duplicate(); break
        case 'delete': remove(); break
        case 'command-palette':
        case 'quick-command': setCmdOpen((o) => !o); break
        case 'zoom-in': setZoom((z) => Math.min(200, z + 10)); break
        case 'zoom-out': setZoom((z) => Math.max(20, z - 10)); break
        case 'group': case 'ungroup': announce('Grouping requires multi-select'); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo, duplicate, remove])

  // ── Empty-canvas / start actions ──────────────────────────────────────
  const onEmptyAction = useCallback((action: string) => {
    if (action === 'start-blank') { setHtml(STARTER); setCss(''); setHistory([STARTER]); setHistoryIndex(0); announce('Blank accessible page created') }
    else if (action === 'templates') navigate('builder')
    else if (action === 'ai') { announce('Describe your site in the AI bar below'); setAiFeedback('Tell the AI what to build, then press Go.') }
    else if (action === 'import') { announce('Import URL is not wired to a backend yet') }
    else if (action === 'paste') {
      const pasted = window.prompt('Paste your HTML below:')
      if (pasted && pasted.trim()) { setHtml(pasted.trim()); setCss(''); setHistory([pasted.trim()]); setHistoryIndex(0); announce('HTML imported') }
    }
  }, [navigate])

  const onPublish = useCallback(() => {
    showToast('Publishing is not configured on this host yet.')
    announce('Publishing not configured')
  }, [showToast])

  const onExport = useCallback(() => {
    const full = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${projectName}</title><style>${css}</style></head><body>${html}</body></html>`
    const blob = new Blob([full], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'index.html'; a.click()
    URL.revokeObjectURL(url)
    showToast('Exported index.html')
    announce('Exported index.html')
  }, [html, css, projectName, showToast])

  const runCommand = useCallback((id: string) => {
    switch (id) {
      case 'undo': undo(); break
      case 'redo': redo(); break
      case 'duplicate': duplicate(); break
      case 'delete': remove(); break
      case 'add-section': commit(htmlRef.current + '<section style="padding:64px 24px"></section>', 'Add section'); break
      case 'add-text': commit(htmlRef.current + '<h2 style="padding:8px 0;color:#111827">New heading</h2>', 'Add text'); break
      case 'add-image': commit(htmlRef.current + '<img src="https://placehold.co/800x400?text=Image" alt="Placeholder image" style="max-width:100%">', 'Add image'); break
      case 'ai-generate': case 'ai-redesign': setCmdOpen(false); runAI(id === 'ai-generate' ? 'Generate a new section' : 'Redesign the page'); break
      case 'accessibility': runAudit(); break
      case 'publish': onPublish(); break
      case 'shortcuts': setShortcutsOpen(true); break
    }
  }, [undo, redo, duplicate, remove, commit, runAI, runAudit, onPublish])

  // ── Render ────────────────────────────────────────────────────────────
  const hasContent = html.trim().length > 0
  const baseFont = fontSizeScale === 'small' ? 14 : fontSizeScale === 'large' ? 18 : fontSizeScale === 'extra-large' ? 20 : 16

  return (
    <div className="ve-shell" style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontSize: baseFont }}>
      <LiveRegion />

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
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <IconToolbar
          active={activeTool}
          onSelect={(id) => {
            setActiveTool(id)
            if (id === 'ai') announce('AI: describe a request in the assistant bar below')
          }}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0 }}>
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
                onContentReady={(el) => { contentRootRef.current = el }}
              />
            ) : (
              <div style={{ flex: 1, background: COLORS.background, overflow: 'auto' }}>
                <EmptyCanvas onAction={onEmptyAction} />
              </div>
            )}

            <FloatingSelectionBar
              selection={selection}
              onDuplicate={duplicate}
              onDelete={remove}
              onAI={() => runAI('Improve this element')}
              onBold={bold}
              onAlign={align}
            />
          </div>

          <AIAssistantBar
            onSubmit={(p) => runAI(p)}
            isBusy={aiBusy}
            suggestions={[
              { id: 'improve', label: '✨ Improve selected' },
              { id: 'alt', label: '✨ Add alt text' },
              { id: 'contrast', label: '✨ Fix contrast' },
            ]}
          />
          {aiFeedback && (
            <div role="status" aria-live="polite" style={{ padding: '8px 16px', background: COLORS.primaryLight, color: COLORS.primary, fontSize: 13, borderTop: `1px solid ${COLORS.selectionLight}` }}>
              ✨ {aiFeedback}
            </div>
          )}
          {auditResults.length > 0 && (
            <div role="status" style={{ padding: '8px 16px', background: COLORS.warningLight, color: '#92400E', fontSize: 13, borderTop: `1px solid ${COLORS.warning}` }}>
              <strong style={{ fontWeight: 600 }}>A11y audit:</strong> {auditResults.map((r) => <span key={r} style={{ display: 'inline-block', marginRight: 12 }}>• {r}</span>)}
            </div>
          )}
        </div>

        <Inspector
          selection={selection}
          onApply={commitNode}
          onSelectText={onSelectText}
          onDeleteSelection={remove}
          onDuplicateSelection={duplicate}
          onRunAccessibilityAudit={runAudit}
          onFixAccessibility={fixAccessibility}
          onExport={onExport}
          onAI={(p) => runAI(p)}
        />
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onRun={runCommand} />
      <ShortcutsHelp open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {toast && (
        <div role="status" style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', background: COLORS.text, color: '#FFF', padding: '10px 18px', borderRadius: RADIUS.lg, boxShadow: SHADOWS.lg, zIndex: 500, fontSize: 14, fontWeight: 500 }}>
          {toast}
        </div>
      )}
    </div>
  )
}

export function VisualEditor() {
  return (
    <AccessibilityProvider>
      <EditorShell />
    </AccessibilityProvider>
  )
}


