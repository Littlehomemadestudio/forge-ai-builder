'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { ThemeProvider } from '@/components/editor/new/theme';
import { TopNav } from '@/components/editor/new/TopNav';
import { LeftToolbar } from '@/components/editor/new/LeftToolbar';
import { Canvas } from '@/components/editor/new/Canvas';
import { RightInspector } from '@/components/editor/new/RightInspector';
import { FloatingToolbar } from '@/components/editor/new/FloatingToolbar';
import { BottomAI } from '@/components/editor/new/BottomAI';
import { ShortcutsHelp } from '@/components/editor/new/ShortcutsHelp';
import { SettingsModal } from '@/components/editor/new/SettingsModal';
import { CommandPalette } from '@/components/editor/new/CommandPalette';
import { AccessibilityAudit } from '@/components/editor/new/AccessibilityAudit';
import type { EditorMode, SelectionType } from '@/components/editor/new/useEditor';

function getIframeInjectScript(): string {
  return `(function() {
      let selectedId = null;
      function assignIds() {
        const all = document.querySelectorAll('*');
        let counter = 0;
        all.forEach(el => {
          if (!el.getAttribute('data-fid')) {
            el.setAttribute('data-fid', 'f-el-' + counter);
            counter++;
          }
        });
      }
      function createOverlay() {
        let overlay = document.getElementById('forge-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'forge-overlay';
          overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
          document.body.appendChild(overlay);
        }
        return overlay;
      }
      function selectElement(el) {
        selectedId = el.getAttribute('data-fid');
        const overlay = createOverlay();
        const rect = el.getBoundingClientRect();
        overlay.innerHTML = '';
        const box = document.createElement('div');
        box.style.cssText = 'position:absolute;top:' + rect.top + 'px;left:' + rect.left + 'px;width:' + rect.width + 'px;height:' + rect.height + 'px;border:2px solid #3B82F6;background:rgba(59,130,246,0.05);border-radius:4px;';
        overlay.appendChild(box);
        window.parent.postMessage({ type: 'element-selected', id: selectedId, tag: el.tagName.toLowerCase() }, '*');
      }
      document.addEventListener('click', (e) => {
        assignIds();
        const el = e.target.closest('[data-fid]');
        if (el) {
          e.preventDefault();
          e.stopPropagation();
          selectElement(el);
        }
      });
      window.addEventListener('message', (e) => {
        if (e.data?.type === 'apply-style') {
          const el = document.querySelector('[data-fid="' + e.data.id + '"]');
          if (el) el.style[e.data.property] = e.data.value;
        }
        if (e.data?.type === 'apply-content') {
          const el = document.querySelector('[data-fid="' + e.data.id + '"]');
          if (el) el.innerHTML = e.data.content;
        }
        if (e.data?.type === 'remove-element') {
          const el = document.querySelector('[data-fid="' + e.data.id + '"]');
          if (el) el.remove();
        }
        if (e.data?.type === 'duplicate-element') {
          const el = document.querySelector('[data-fid="' + e.data.id + '"]');
          if (el) {
            const clone = el.cloneNode(true);
            clone.setAttribute('data-fid', 'f-el-' + Date.now());
            el.parentNode.insertBefore(clone, el.nextSibling);
          }
        }
      });
      assignIds();
    })()`

}

function getDefaultHTML(): string {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Page</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Inter, system-ui, -apple-system, sans-serif; margin: 0; padding: 0; color: #111827; background: #ffffff; }
      </style>
    </head>
    <body>
      <div style="max-width: 1200px; margin: 0 auto; padding: 80px 24px;">
        <h1 style="font-size: 48px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.02em;">Start building</h1>
        <p style="font-size: 18px; color: #6B7280; max-width: 600px; line-height: 1.6;">
          Select any element to edit it, or use the panels on the left and right to customize.
        </p>
      </div>
    </body>
    </html>`
}

export default function EditorPage() {
  const generatedPages = useAppStore(s => s.generatedPages)
  const currentPreviewPage = useAppStore(s => s.currentPreviewPage)
  const updateGeneratedPage = useAppStore(s => s.updateGeneratedPage)
  const navigate = useAppStore(s => s.navigate)

  const page = generatedPages.find(p => p.id === currentPreviewPage)
  const initialHTML = page?.html || getDefaultHTML()

  const [html, setHtml] = useState(initialHTML)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectionType, setSelectionType] = useState<SelectionType>('none')
  const [selectedStyles, setSelectedStyles] = useState<Record<string, string>>({})
  const [mode, setMode] = useState<EditorMode>('basic')
  const [viewport, setViewport] = useState('desktop')
  const [zoom, setZoom] = useState(100)
  const [leftPanelTab, setLeftPanelTab] = useState<string | null>('components')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const handleLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        const script = doc.createElement('script')
        script.textContent = getIframeInjectScript()
        doc.head.appendChild(script)
      } catch (e) {
        console.error('Bridge injection failed:', e)
      }
    }
    iframe.addEventListener('load', handleLoad)
    if (iframe.srcdoc) handleLoad()
    return () => iframe.removeEventListener('load', handleLoad)
  }, [])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'element-selected') {
        setSelectedId(e.data.id)
        setSelectionType(e.data.tag as SelectionType)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, '*')
    }
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 600))
    if (currentPreviewPage) {
      updateGeneratedPage(currentPreviewPage, { html } as any)
    }
    setIsSaving(false)
  }, [html, currentPreviewPage, updateGeneratedPage])

  const handlePublish = useCallback(() => {
    alert('Publish flow would open here')
  }, [])

  const handleAIAction = useCallback((action: string) => {
    console.log('AI action:', action)
  }, [])

  const closeAllModals = useCallback(() => {
    setShowShortcuts(false)
    setShowSettings(false)
    setShowCommandPalette(false)
    setShowAccessibility(false)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setShowCommandPalette(v => !v)
      }
      if (e.key === 'Escape') closeAllModals()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeAllModals])

  return (
    <ThemeProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#FAFAFA', color: '#111827', overflow: 'hidden' }}>
        <TopNav
          mode={mode}
          onModeChange={setMode}
          onToggleShortcuts={() => setShowShortcuts(true)}
          onToggleSettings={() => setShowSettings(true)}
          onToggleCommandPalette={() => setShowCommandPalette(true)}
          onToggleAccessibility={() => setShowAccessibility(true)}
          onSave={handleSave}
          onPublish={handlePublish}
          isSaving={isSaving}
        />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <LeftToolbar activeTab={leftPanelTab} onTabChange={setLeftPanelTab} />
          <Canvas
            iframeRef={iframeRef}
            viewport={viewport as any}
            zoom={zoom / 100}
            onZoomChange={(z) => setZoom(Math.round(z * 100))}
            htmlContent={html}
            isPanning={false}
          />
          <RightInspector
            mode={mode}
            selectionType={selectionType}
            selectedId={selectedId}
          />
        </div>
        <FloatingToolbar selectionType={selectionType} selectedId={selectedId} />
        <BottomAI onAction={handleAIAction} />
        <ShortcutsHelp open={showShortcuts} onClose={closeAllModals} />
        <SettingsModal open={showSettings} onClose={closeAllModals} />
        <CommandPalette open={showCommandPalette} onClose={closeAllModals} onAction={handleAIAction} />
        <AccessibilityAudit open={showAccessibility} onClose={closeAllModals} />
      </div>
    </ThemeProvider>
  )
}






