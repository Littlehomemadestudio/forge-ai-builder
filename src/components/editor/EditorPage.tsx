'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { CSS_PROPERTY_GROUPS } from '@/lib/editor/css-properties'
import { EDITOR_COMPONENT_CATEGORIES, getComponentById } from '@/lib/editor/components'
import { DEVICE_CONFIGS } from '@/lib/editor/types'
import type { ComputedElementInfo, HistoryEntry } from '@/lib/editor/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'
import {
  Undo2, Redo2, Monitor, Smartphone, Tablet, Code2, Save, Download, Rocket,
  ArrowLeft, Eye, EyeOff, Trash2, Copy, Plus, Search, Layers,
  Grid3X3, Palette, Type, Layout, Square, Circle, ChevronDown, ChevronRight,
  Move, Maximize2, Sparkles, Wand2, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, Image, Link, Settings2, FileCode,
  Globe, Hash, MousePointer2, DragHandle, BoxSelect, Edit3, Trash,
  PanelLeft, PanelRight, PanelBottom, Columns2, LayoutDashboard,
  LayoutGrid, LayoutList, Grid2X2, ZoomIn, ZoomOut, PenTool
} from 'lucide-react'

// ─── iframe Bridge Script (injected into the preview iframe) ──────────────
// This is the MOST CRITICAL piece - makes the iframe interactive
function getIframeInjectScript(): string {
  return `
(function() {
  let selectedId = null;
  let hoveredId = null;
  let isEditing = false;
  let overlayEl = null;
  let selectionBox = null;
  let labelEl = null;

  // Assign unique IDs to every element
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

  // Create overlay elements
  function createOverlays() {
    overlayEl = document.createElement('div');
    overlayEl.id = 'forge-hover-overlay';
    overlayEl.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(overlayEl);

    selectionBox = document.createElement('div');
    selectionBox.id = 'forge-selection-box';
    selectionBox.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;';
    document.body.appendChild(selectionBox);

    labelEl = document.createElement('div');
    labelEl.id = 'forge-label';
    labelEl.style.cssText = 'position:fixed;z-index:10000;pointer-events:none;font-size:11px;font-family:Inter,system-ui,sans-serif;background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;white-space:nowrap;';
    document.body.appendChild(labelEl);
  }

  // Show hover overlay
  function showHover(id) {
    const el = document.querySelector('[data-fid="' + id + '"]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    overlayEl.style.top = rect.top + 'px';
    overlayEl.style.left = rect.left + 'px';
    overlayEl.style.width = rect.width + 'px';
    overlayEl.style.height = rect.height + 'px';
    overlayEl.style.background = 'rgba(59,130,246,0.15)';
    overlayEl.style.border = '1px solid rgba(59,130,246,0.5)';
    overlayEl.style.borderRadius = getComputedStyle(el).borderRadius;
    overlayEl.style.display = 'block';
    hoveredId = id;
  }

  function hideHover() {
    overlayEl.style.display = 'none';
    hoveredId = null;
  }

  // Show selection
  function showSelection(id) {
    const el = document.querySelector('[data-fid="' + id + '"]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    selectionBox.style.top = (rect.top - 2) + 'px';
    selectionBox.style.left = (rect.left - 2) + 'px';
    selectionBox.style.width = (rect.width + 4) + 'px';
    selectionBox.style.height = (rect.height + 4) + 'px';
    selectionBox.style.border = '2px solid #3b82f6';
    selectionBox.style.borderRadius = getComputedStyle(el).borderRadius;
    selectionBox.style.display = 'block';

    // Label
    const tagName = el.tagName.toLowerCase();
    const className = el.className ? '.' + el.className.split(' ').slice(0,2).join('.') : '';
    labelEl.textContent = tagName + className;
    labelEl.style.top = (rect.top - 24) + 'px';
    labelEl.style.left = rect.left + 'px';
    labelEl.style.display = rect.top > 30 ? 'block' : 'none';

    selectedId = id;
  }

  function hideSelection() {
    selectionBox.style.display = 'none';
    labelEl.style.display = 'none';
    selectedId = null;
  }

  // Send element info to parent
  function sendElementInfo(el) {
    const id = el.getAttribute('data-fid');
    const computed = getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // Collect computed styles
    const styles = {};
    const importantProps = [
      'display','position','top','right','bottom','left','z-index',
      'width','height','min-width','min-height','max-width','max-height',
      'margin-top','margin-right','margin-bottom','margin-left',
      'padding-top','padding-right','padding-bottom','padding-left',
      'font-family','font-size','font-weight','font-style','line-height',
      'letter-spacing','word-spacing','text-align','text-decoration','text-transform',
      'color','background-color','background-image','background-size','background-position','background-repeat',
      'border-top-width','border-right-width','border-bottom-width','border-left-width',
      'border-top-style','border-right-style','border-bottom-style','border-left-style',
      'border-top-color','border-right-color','border-bottom-color','border-left-color',
      'border-top-left-radius','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius',
      'outline-width','outline-style','outline-color','outline-offset',
      'box-shadow','text-shadow','opacity','cursor','visibility',
      'overflow','overflow-x','overflow-y','float','clear',
      'flex-direction','flex-wrap','justify-content','align-items','align-self',
      'flex-grow','flex-shrink','flex-basis','gap','row-gap','column-gap',
      'grid-template-columns','grid-template-rows','grid-column','grid-row',
      'order','transform','transform-origin','filter','backdrop-filter',
      'transition','animation','object-fit','object-position',
      'white-space','word-break','direction','writing-mode',
      'list-style-type','list-style-position','table-layout','border-collapse',
      'fill','stroke','stroke-width','mix-blend-mode','background-blend-mode',
      'pointer-events','user-select'
    ];
    importantProps.forEach(prop => {
      styles[prop] = computed.getPropertyValue(prop);
    });

    // Collect attributes
    const attributes = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (attr.name !== 'data-fid' && attr.name !== 'style') {
        attributes[attr.name] = attr.value;
      }
    }

    // Parent and children
    const parent = el.parentElement;
    const parentId = parent ? parent.getAttribute('data-fid') : null;
    const childIds = [];
    // el.children is an HTMLCollection (not an array) — must convert before .forEach
    Array.from(el.children).forEach(child => {
      const cid = child.getAttribute('data-fid');
      if (cid) childIds.push(cid);
    });

    window.parent.postMessage({
      type: 'element-selected',
      data: {
        id: id,
        tag: el.tagName.toLowerCase(),
        className: el.className || '',
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        styles: styles,
        content: el.innerHTML,
        textContent: el.textContent || '',
        attributes: attributes,
        parentId: parentId,
        childIds: childIds
      }
    }, '*');
  }

  // Handle mouse events
  document.addEventListener('mouseover', function(e) {
    if (isEditing) return;
    const el = e.target;
    if (el === overlayEl || el === selectionBox || el === labelEl) return;
    const fid = el.getAttribute('data-fid');
    if (fid) showHover(fid);
  }, true);

  document.addEventListener('mouseout', function(e) {
    if (isEditing) return;
    hideHover();
  }, true);

  document.addEventListener('click', function(e) {
    if (isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    const el = e.target;
    if (el === overlayEl || el === selectionBox || el === labelEl) return;
    const fid = el.getAttribute('data-fid');
    if (fid) {
      showSelection(fid);
      sendElementInfo(el);
    }
  }, true);

  // Double-click for inline text editing
  document.addEventListener('dblclick', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const el = e.target;
    const fid = el.getAttribute('data-fid');
    if (!fid) return;

    // Only allow editing on elements with direct text content
    if (el.children.length === 0 || (el.children.length === 1 && el.children[0].tagName === 'BR')) {
      isEditing = true;
      el.contentEditable = 'true';
      el.style.cursor = 'text';
      el.focus();

      // Select all text
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, true);

  // Handle blur from inline editing
  document.addEventListener('blur', function(e) {
    const el = e.target;
    if (el.contentEditable === 'true') {
      el.contentEditable = 'false';
      el.style.cursor = '';
      isEditing = false;

      window.parent.postMessage({
        type: 'text-edited',
        data: {
          id: el.getAttribute('data-fid'),
          content: el.innerHTML,
          textContent: el.textContent
        }
      }, '*');
    }
  }, true);

  // Prevent link navigation
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && !isEditing) {
      e.preventDefault();
    }
  });

  // Prevent form submission
  document.addEventListener('submit', function(e) {
    e.preventDefault();
  });

  // Listen for parent messages
  window.addEventListener('message', function(e) {
    const msg = e.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'apply-style': {
        const el = document.querySelector('[data-fid="' + msg.data.elementId + '"]');
        if (el) {
          el.style.setProperty(msg.data.property, msg.data.value, 'important');
        }
        break;
      }
      case 'apply-content': {
        const el = document.querySelector('[data-fid="' + msg.data.elementId + '"]');
        if (el) {
          el.innerHTML = msg.data.content;
          assignIds();
          if (selectedId === msg.data.elementId) {
            showSelection(selectedId);
            sendElementInfo(el);
          }
        }
        break;
      }
      case 'add-component': {
        const parent = document.querySelector('[data-fid="' + msg.data.parentId + '"]');
        if (parent) {
          const temp = document.createElement('div');
          temp.innerHTML = msg.data.html;
          const newEl = temp.firstElementChild;
          if (msg.data.position >= 0 && parent.children[msg.data.position]) {
            parent.insertBefore(newEl, parent.children[msg.data.position]);
          } else {
            parent.appendChild(newEl);
          }
          assignIds();
        } else {
          // Add to body
          const temp = document.createElement('div');
          temp.innerHTML = msg.data.html;
          const newEl = temp.firstElementChild;
          document.body.appendChild(newEl);
          assignIds();
        }
        break;
      }
      case 'remove-element': {
        const el = document.querySelector('[data-fid="' + msg.data.elementId + '"]');
        if (el) {
          el.remove();
          if (selectedId === msg.data.elementId) hideSelection();
          assignIds();
        }
        break;
      }
      case 'select-element': {
        const el = document.querySelector('[data-fid="' + msg.data.elementId + '"]');
        if (el) {
          showSelection(msg.data.elementId);
          sendElementInfo(el);
        }
        break;
      }
      case 'highlight-element': {
        showHover(msg.data.elementId);
        break;
      }
      case 'update-html': {
        document.body.innerHTML = msg.data.html;
        assignIds();
        createOverlays();
        hideSelection();
        hideHover();
        break;
      }
      case 'get-elements-tree': {
        function buildTree(el, depth) {
          const fid = el.getAttribute('data-fid');
          if (!fid) return null;
          const children = [];
          // el.children is an HTMLCollection (not an array) — must convert
          // before calling .forEach, otherwise this throws silently and the
          // tree never gets built.
          Array.from(el.children).forEach(child => {
            const c = buildTree(child, depth + 1);
            if (c) children.push(c);
          });
          return {
            id: fid,
            tag: el.tagName.toLowerCase(),
            className: el.className || '',
            textContent: (el.textContent || '').substring(0, 50),
            children: children,
            depth: depth
          };
        }
        const tree = buildTree(document.body, 0);
        window.parent.postMessage({ type: 'elements-tree', data: tree }, '*');
        break;
      }
    }
  });

  // Initialize
  assignIds();
  createOverlays();

  // Notify parent that iframe is ready
  window.parent.postMessage({ type: 'ready', data: null }, '*');
})();
`
}

// ─── Default Website HTML ────────────────────────────────────────────────
function getDefaultWebsiteHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Forge Project</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #0a0a0a; color: #ffffff; line-height: 1.6; }
  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; font-family: inherit; }
  img { max-width: 100%; }
</style>
</head>
<body>
<nav style="display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;background:#0a0a0a;border-bottom:1px solid #1a1a2e;">
  <div style="font-weight:700;font-size:1.2rem;color:#7c3aed;">Brand</div>
  <div style="display:flex;gap:1.5rem;align-items:center;">
    <a href="#">Home</a>
    <a href="#">Features</a>
    <a href="#">Pricing</a>
    <a href="#">About</a>
    <button style="background:#7c3aed;color:#fff;padding:0.5rem 1.25rem;border:none;border-radius:0.5rem;font-weight:600;">Get Started</button>
  </div>
</nav>

<section style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;min-height:60vh;background:linear-gradient(135deg,#0a0a0a,#1a1a2e);">
  <h1 style="font-size:3.5rem;font-weight:900;margin-bottom:1rem;text-align:center;">Build something amazing</h1>
  <p style="font-size:1.25rem;color:#888;margin-bottom:2.5rem;text-align:center;max-width:600px;">The modern platform for creating beautiful websites. Design, edit, and deploy with ease.</p>
  <div style="display:flex;gap:1rem;">
    <button style="background:#7c3aed;color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;font-weight:600;font-size:1rem;">Start Building</button>
    <button style="background:transparent;color:#fff;padding:0.75rem 2rem;border:1px solid #2a2a3e;border-radius:0.5rem;font-size:1rem;">Learn More</button>
  </div>
</section>

<section style="padding:4rem 2rem;background:#0a0a0a;">
  <h2 style="font-size:2rem;font-weight:700;margin-bottom:2.5rem;text-align:center;">Key Features</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:900px;margin:0 auto;">
    <div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;">
      <div style="width:2.5rem;height:2.5rem;background:#7c3aed;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff;">⚡</div>
      <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">AI Generation</h3>
      <p style="color:#888;font-size:0.9rem;line-height:1.6;">Describe what you want and watch it come to life instantly.</p>
    </div>
    <div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;">
      <div style="width:2.5rem;height:2.5rem;background:#2dd4bf;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff;">✏️</div>
      <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">Visual Editor</h3>
      <p style="color:#888;font-size:0.9rem;line-height:1.6;">Click, drag, refine. Every pixel is under your control.</p>
    </div>
    <div style="background:#1a1a2e;border-radius:0.75rem;padding:1.5rem;border:1px solid #2a2a3e;">
      <div style="width:2.5rem;height:2.5rem;background:#f472b6;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff;">📦</div>
      <h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">Export Freedom</h3>
      <p style="color:#888;font-size:0.9rem;line-height:1.6;">Download clean code. Your website, your rules.</p>
    </div>
  </div>
</section>

<section style="display:flex;justify-content:center;gap:1.5rem;padding:4rem 2rem;background:#0a0a0a;flex-wrap:wrap;">
  <div style="background:#1a1a2e;border-radius:0.75rem;padding:2rem;border:1px solid #2a2a3e;text-align:center;width:280px;">
    <h3 style="font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;color:#888;">Free</h3>
    <div style="font-size:2.5rem;font-weight:800;margin:1rem 0;">$0</div>
    <p style="color:#888;font-size:0.9rem;margin-bottom:1.5rem;">100 AI credits/month</p>
    <button style="background:#2a2a3e;color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;font-weight:600;width:100%;">Get Started</button>
  </div>
  <div style="background:#1a1a2e;border-radius:0.75rem;padding:2rem;border:2px solid #7c3aed;text-align:center;width:280px;">
    <h3 style="font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;color:#7c3aed;">Pro</h3>
    <div style="font-size:2.5rem;font-weight:800;margin:1rem 0;">$19<span style="font-size:1rem;color:#888;">/mo</span></div>
    <p style="color:#888;font-size:0.9rem;margin-bottom:1.5rem;">500 credits, all features</p>
    <button style="background:#7c3aed;color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;font-weight:600;width:100%;">Start Trial</button>
  </div>
  <div style="background:#1a1a2e;border-radius:0.75rem;padding:2rem;border:1px solid #2a2a3e;text-align:center;width:280px;">
    <h3 style="font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;color:#888;">Enterprise</h3>
    <div style="font-size:2.5rem;font-weight:800;margin:1rem 0;">$49<span style="font-size:1rem;color:#888;">/mo</span></div>
    <p style="color:#888;font-size:0.9rem;margin-bottom:1.5rem;">Unlimited, white-label</p>
    <button style="background:#2a2a3e;color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;font-weight:600;width:100%;">Contact Sales</button>
  </div>
</section>

<section style="display:flex;flex-direction:column;align-items:center;padding:4rem 2rem;background:linear-gradient(135deg,#7c3aed,#2dd4bf);color:#fff;text-align:center;">
  <h2 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem;">Ready to start building?</h2>
  <p style="font-size:1.1rem;color:rgba(255,255,255,0.85);margin-bottom:2rem;max-width:500px;">Join thousands of creators who build with Forge.</p>
  <button style="background:#fff;color:#7c3aed;padding:1rem 3rem;border:none;border-radius:0.5rem;font-weight:700;font-size:1.1rem;">Start Free Trial</button>
</section>

<footer style="display:flex;justify-content:space-between;padding:2rem;background:#0a0a0a;border-top:1px solid #1a1a2e;color:#888;">
  <div style="font-weight:700;color:#fff;font-size:1.1rem;">Brand</div>
  <div>© 2025 Brand. All rights reserved.</div>
</footer>
</body>
</html>`
}

// ─── Prepare HTML for iframe (inject bridge script) ────────────────────────
function prepareHTMLForIframe(html: string): string {
  const script = getIframeInjectScript()
  // Inject before </body> or at end
  if (html.includes('</body>')) {
    return html.replace('</body>', `<script>${script}</script></body>`)
  }
  return html + `<script>${script}</script>`
}

// ─── Element Tree Node ─────────────────────────────────────────────────────
interface TreeNode {
  id: string
  tag: string
  className: string
  textContent: string
  children: TreeNode[]
  depth: number
}

// ─── Main Editor Component ─────────────────────────────────────────────────
export default function EditorPage() {
  // Pull generated content from the global store (set by BuilderPage)
  const generatedPages = useAppStore(s => s.generatedPages)
  const currentPreviewPage = useAppStore(s => s.currentPreviewPage)
  const setCurrentPreviewPage = useAppStore(s => s.setCurrentPreviewPage)
  const updateGeneratedPage = useAppStore(s => s.updateGeneratedPage)
  const generatedSiteName = useAppStore(s => s.generatedSiteName)

  // Resolve the initial HTML: prefer the currently-selected generated page,
  // fall back to the first generated page, otherwise use the default placeholder.
  const initialHTML = (() => {
    const selected = generatedPages.find(p => p.id === currentPreviewPage)
    if (selected?.html) return selected.html
    if (generatedPages[0]?.html) return generatedPages[0].html
    return getDefaultWebsiteHTML()
  })()

  // State
  const [websiteHTML, setWebsiteHTML] = useState(initialHTML)
  const [selectedElement, setSelectedElement] = useState<ComputedElementInfo | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<HistoryEntry[]>([{ id: 'h0', html: initialHTML, label: 'Initial', timestamp: Date.now() }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [device, setDevice] = useState('desktop')
  const [leftPanelTab, setLeftPanelTab] = useState('components')
  const [showCodePanel, setShowCodePanel] = useState(false)
  const [codeContent, setCodeContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [elementTree, setElementTree] = useState<TreeNode | null>(null)
  const [zoom, setZoom] = useState(100)
  const [editingContent, setEditingContent] = useState('')
  const [editingAttributes, setEditingAttributes] = useState<Record<string, string>>({})
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<Set<string>>(new Set(['f-el-0']))

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const historyDebounceRef = useRef<NodeJS.Timeout | null>(null)
  // Track which store page-id the current local websiteHTML belongs to.
  // When the user switches pages in the toolbar, we save any pending changes
  // to the previous page-id, then load the new page's HTML.
  const activePageIdRef = useRef<string>(
    generatedPages.find(p => p.id === currentPreviewPage)?.id || generatedPages[0]?.id || 'default'
  )

  // Get device config
  const deviceConfig = DEVICE_CONFIGS.find(d => d.name === device) || DEVICE_CONFIGS[0]

  // ─── Send message to iframe ───────────────────────────────────────────────
  const sendMessage = useCallback((type: string, data: unknown) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, data }, '*')
    }
  }, [])

  // ─── Request element tree from iframe ──────────────────────────────────────
  const requestTree = useCallback(() => {
    sendMessage('get-elements-tree', {})
  }, [sendMessage])

  // ─── Push to history (debounced) ───────────────────────────────────────────
  const pushHistory = useCallback((label: string) => {
    if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current)
    historyDebounceRef.current = setTimeout(() => {
      // Get current HTML from iframe
      if (iframeRef.current && iframeRef.current.contentDocument) {
        const currentHTML = iframeRef.current.contentDocument.documentElement.outerHTML
        const newEntry: HistoryEntry = { id: 'h' + Date.now(), html: currentHTML, label, timestamp: Date.now() }
        setHistory(prev => [...prev.slice(0, historyIndex + 1), newEntry])
        setHistoryIndex(prev => prev + 1)
        // Also persist the latest HTML back to the global store so the
        // builder preview and other tabs see the user's edits.
        setWebsiteHTML(currentHTML)
        const pageId = activePageIdRef.current
        if (pageId && pageId !== 'default') {
          updateGeneratedPage(pageId, { html: currentHTML })
        }
      }
    }, 500)
  }, [historyIndex, updateGeneratedPage])

  // ─── iframe Message Handler ───────────────────────────────────────────────
  const handleMessage = useCallback((e: MessageEvent) => {
    const msg = e.data
    if (!msg || !msg.type) return

    switch (msg.type) {
      case 'element-selected': {
        const data = msg.data as ComputedElementInfo
        setSelectedElement(data)
        setSelectedStyles(data.styles || {})
        setEditingContent(data.content || '')
        setEditingAttributes(data.attributes || {})
        // Expand tree to show this element
        setExpandedTreeNodes(prev => new Set([...prev, data.id]))
        break
      }
      case 'text-edited': {
        const { id, content } = msg.data
        if (selectedElement && selectedElement.id === id) {
          setSelectedElement(prev => prev ? { ...prev, content, textContent: content } : null)
          setEditingContent(content)
          pushHistory('Edit text')
        }
        break
      }
      case 'ready': {
        // Request tree on iframe ready
        requestTree()
        break
      }
      case 'elements-tree': {
        setElementTree(msg.data as TreeNode)
        break
      }
    }
  }, [selectedElement, pushHistory, requestTree])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // ─── Switch page (called when user picks a different page in the toolbar) ─
  // Saves the current iframe HTML to the store for the previous page, then
  // loads the new page's HTML into the iframe and resets history.
  const switchPage = useCallback((newPageId: string) => {
    if (newPageId === activePageIdRef.current) return
    const target = generatedPages.find(p => p.id === newPageId)
    if (!target) return

    // 1. Flush any pending history debounce so the current page's latest
    //    HTML is captured before we switch.
    if (historyDebounceRef.current) {
      clearTimeout(historyDebounceRef.current)
      historyDebounceRef.current = null
    }
    // 2. Snapshot current iframe HTML and persist it for the outgoing page.
    if (iframeRef.current?.contentDocument) {
      const currentHTML = iframeRef.current.contentDocument.documentElement.outerHTML
      updateGeneratedPage(activePageIdRef.current, { html: currentHTML })
    }
    // 3. Load the new page's HTML into local state and reset history.
    activePageIdRef.current = newPageId
    setWebsiteHTML(target.html)
    setHistory([{ id: 'h0', html: target.html, label: target.name, timestamp: Date.now() }])
    setHistoryIndex(0)
    setSelectedElement(null)
    setSelectedStyles({})
    setElementTree(null)
    // 4. Tell the store which page is now active.
    setCurrentPreviewPage(newPageId)
  }, [generatedPages, updateGeneratedPage, setCurrentPreviewPage])

  // ─── Apply Style Change ────────────────────────────────────────────────────
  const applyStyle = useCallback((property: string, value: string) => {
    if (!selectedElement) return
    sendMessage('apply-style', { elementId: selectedElement.id, property, value })
    setSelectedStyles(prev => ({ ...prev, [property]: value }))
    pushHistory(`Change ${property}`)
  }, [selectedElement, sendMessage, pushHistory])

  // ─── Apply Content Change ──────────────────────────────────────────────────
  const applyContent = useCallback((content: string) => {
    if (!selectedElement) return
    sendMessage('apply-content', { elementId: selectedElement.id, content })
    setEditingContent(content)
    pushHistory('Edit content')
  }, [selectedElement, sendMessage, pushHistory])

  // ─── Apply Attribute Change ────────────────────────────────────────────────
  const applyAttribute = useCallback((attr: string, value: string) => {
    if (!selectedElement) return
    // Send as content modification that includes the attribute change
    // We need to update the element's attribute
    const el = iframeRef.current?.contentDocument?.querySelector(`[data-fid="${selectedElement.id}"]`)
    if (el) {
      if (value) {
        el.setAttribute(attr, value)
      } else {
        el.removeAttribute(attr)
      }
      pushHistory(`Change ${attr}`)
    }
    setEditingAttributes(prev => ({ ...prev, [attr]: value }))
  }, [selectedElement, pushHistory])

  // ─── Add Component ─────────────────────────────────────────────────────────
  const addComponent = useCallback((componentId: string) => {
    const comp = getComponentById(componentId)
    if (!comp) return
    const parentId = selectedElement ? selectedElement.id : 'f-el-0' // body
    sendMessage('add-component', { parentId, position: -1, html: comp.html })
    pushHistory(`Add ${comp.name}`)
    requestTree()
  }, [selectedElement, sendMessage, pushHistory, requestTree])

  // ─── Remove Element ────────────────────────────────────────────────────────
  const removeElement = useCallback(() => {
    if (!selectedElement) return
    sendMessage('remove-element', { elementId: selectedElement.id })
    setSelectedElement(null)
    setSelectedStyles({})
    pushHistory('Remove element')
    requestTree()
  }, [selectedElement, sendMessage, pushHistory, requestTree])

  // ─── Undo ──────────────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    const entry = history[newIndex]
    sendMessage('update-html', { html: entry.html })
    requestTree()
  }, [historyIndex, history, sendMessage, requestTree])

  // ─── Redo ──────────────────────────────────────────────────────────────────
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    const entry = history[newIndex]
    sendMessage('update-html', { html: entry.html })
    requestTree()
  }, [historyIndex, history, sendMessage, requestTree])

  // ─── Save ──────────────────────────────────────────────────────────────────
  const save = useCallback(() => {
    // Persist the current iframe HTML back to the store for the active page
    if (iframeRef.current?.contentDocument) {
      const currentHTML = iframeRef.current.contentDocument.documentElement.outerHTML
      setWebsiteHTML(currentHTML)
      const pageId = activePageIdRef.current
      if (pageId && pageId !== 'default') {
        updateGeneratedPage(pageId, { html: currentHTML })
      }
    }
    toast({ title: 'Project saved', description: 'All changes have been saved to this page' })
  }, [updateGeneratedPage])

  // ─── Export ─────────────────────────────────────────────────────────────────
  const exportHTML = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const html = doc.documentElement.outerHTML
    const cleanHTML = html.replace(/<script>[^]*?<\/script>/, '') // Remove bridge script
    const finalHTML = `<!DOCTYPE html>\n${cleanHTML}`
    const blob = new Blob([finalHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'website.html'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported!', description: 'HTML file downloaded' })
  }, [])

  const exportReact = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const bodyHTML = doc.body.innerHTML.replace(/data-fid="[^"]*"/g, '').replace(/<script>[^]*?<\/script>/, '')
    const styles = doc.querySelector('style')?.innerHTML || ''

    const reactCode = `import React from 'react'

const styles = \`${styles}\`

export default function HomePage() {
  return (
    <main>
      ${bodyHTML}
    </main>
  )
}`
    const blob = new Blob([reactCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'page.tsx'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported!', description: 'React component downloaded' })
  }, [])

  // ─── Navigate ──────────────────────────────────────────────────────────────
  const navigate = useAppStore(s => s.navigate)

  // ─── iframe srcDoc ─────────────────────────────────────────────────────────
  const iframeSrcDoc = prepareHTMLForIframe(websiteHTML)

  // ─── Code panel sync ───────────────────────────────────────────────────────
  useEffect(() => {
    if (showCodePanel) {
      const doc = iframeRef.current?.contentDocument
      if (doc) {
        setCodeContent(doc.documentElement.outerHTML)
      }
    }
  }, [showCodePanel])

  const applyCodeChanges = useCallback(() => {
    sendMessage('update-html', { html: codeContent })
    setWebsiteHTML(codeContent)
    pushHistory('Edit code')
    requestTree()
  }, [codeContent, sendMessage, pushHistory, requestTree])

  // ─── Render CSS Property Editor ────────────────────────────────────────────
  const renderPropertyEditor = (prop: CSSProperty, styles: Record<string, string>) => {
    const currentValue = styles[prop.name] || prop.default || ''

    switch (prop.type) {
      case 'text':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-2">
            <Label className="text-xs text-zinc-400 w-28 shrink-0">{prop.label}</Label>
            <Input
              value={currentValue}
              onChange={e => applyStyle(prop.name, e.target.value)}
              className="h-7 text-xs bg-[#111] border-[#2a2a3e] text-white flex-1"
              placeholder={prop.default}
            />
            {prop.unit && <span className="text-xs text-zinc-500">{prop.unit}</span>}
          </div>
        )

      case 'number':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-2">
            <Label className="text-xs text-zinc-400 w-28 shrink-0">{prop.label}</Label>
            <Input
              type="number"
              value={parseFloat(currentValue) || 0}
              onChange={e => applyStyle(prop.name, e.target.value + (prop.unit || 'px'))}
              className="h-7 text-xs bg-[#111] border-[#2a2a3e] text-white flex-1"
              min={prop.min}
              max={prop.max}
              step={prop.step}
            />
            {prop.unit && <span className="text-xs text-zinc-500">{prop.unit}</span>}
          </div>
        )

      case 'select':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-2">
            <Label className="text-xs text-zinc-400 w-28 shrink-0">{prop.label}</Label>
            <Select value={currentValue} onValueChange={v => applyStyle(prop.name, v)}>
              <SelectTrigger className="h-7 text-xs bg-[#111] border-[#2a2a3e] text-white flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                {prop.options?.map(opt => <SelectItem key={opt} value={opt} className="text-xs text-white">{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )

      case 'color':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-2">
            <Label className="text-xs text-zinc-400 w-28 shrink-0">{prop.label}</Label>
            <div className="flex items-center gap-1 flex-1">
              <input
                type="color"
                value={currentValue.startsWith('#') ? currentValue : '#000000'}
                onChange={e => applyStyle(prop.name, e.target.value)}
                className="w-7 h-7 rounded border border-[#2a2a3e] cursor-pointer"
              />
              <Input
                value={currentValue}
                onChange={e => applyStyle(prop.name, e.target.value)}
                className="h-7 text-xs bg-[#111] border-[#2a2a3e] text-white flex-1"
              />
            </div>
          </div>
        )

      case 'slider':
        return (
          <div key={prop.name} className="mb-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-zinc-400 w-28 shrink-0">{prop.label}</Label>
              <Input
                value={parseFloat(currentValue) || parseFloat(prop.default || '0')}
                onChange={e => applyStyle(prop.name, e.target.value + (prop.unit || ''))}
                className="h-7 text-xs bg-[#111] border-[#2a2a3e] text-white w-20"
              />
              {prop.unit && <span className="text-xs text-zinc-500">{prop.unit}</span>}
            </div>
            <Slider
              value={[parseFloat(currentValue) || parseFloat(prop.default || '0')]}
              onValueChange={v => applyStyle(prop.name, v[0] + (prop.unit || ''))}
              min={prop.min || 0}
              max={prop.max || 100}
              step={prop.step || 1}
              className="mt-1"
            />
          </div>
        )

      case 'toggle':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-2">
            <Label className="text-xs text-zinc-400 w-28 shrink-0">{prop.label}</Label>
            <Switch
              checked={currentValue === 'true' || currentValue === 'visible' || currentValue === 'auto'}
              onCheckedChange={v => applyStyle(prop.name, v ? (prop.options?.[0] || 'true') : (prop.options?.[1] || 'none'))}
            />
          </div>
        )

      case 'composite':
        return (
          <div key={prop.name} className="mb-3">
            <Label className="text-xs text-zinc-300 mb-1 block font-semibold">{prop.label}</Label>
            <div className="pl-2 border-l-2 border-[#2a2a3e]">
              {prop.subProperties?.map(sub => renderPropertyEditor(sub, styles))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ─── Render Element Tree ───────────────────────────────────────────────────
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedTreeNodes.has(node.id)
    const isSelected = selectedElement?.id === node.id
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1 cursor-pointer rounded text-xs transition-colors ${
            isSelected ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-zinc-400 hover:bg-[#1a1a2e] hover:text-white'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            sendMessage('select-element', { elementId: node.id })
            setExpandedTreeNodes(prev => new Set([...prev, node.id]))
          }}
          onMouseEnter={() => sendMessage('highlight-element', { elementId: node.id })}
          onMouseLeave={() => sendMessage('highlight-element', { elementId: '' })}
        >
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); setExpandedTreeNodes(prev => { const n = new Set(prev); if (isExpanded) { n.delete(node.id); } else { n.add(node.id); } return n }) }}>
              <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          ) : <span className="w-3" />}
          <span className="text-[#7c3aed] font-mono">{node.tag}</span>
          {node.className && <span className="text-zinc-500 truncate max-w-20">{node.className.split(' ')[0]}</span>}
          {node.textContent && <span className="text-zinc-600 truncate max-w-30 ml-1">"{node.textContent.substring(0, 20)}"</span>}
          {isSelected && (
            <div className="flex gap-1 ml-auto">
              <button onClick={(e) => { e.stopPropagation(); removeElement() }} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button>
              <button onClick={(e) => { e.stopPropagation(); /* duplicate */ }} className="text-zinc-400 hover:text-white"><Copy size={12} /></button>
            </div>
          )}
        </div>
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {node.children.map(child => renderTreeNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ─── Component categories for left panel ───────────────────────────────────
  const filteredCategories = EDITOR_COMPONENT_CATEGORIES.filter(cat =>
    !searchQuery || cat.name.toLowerCase().includes(searchQuery) || cat.components.some(c => c.name.toLowerCase().includes(searchQuery) || c.description.toLowerCase().includes(searchQuery))
  )

  // ─── Icon map for device buttons ───────────────────────────────────────────
  const deviceIcons: Record<string, React.ReactNode> = {
    desktop: <Monitor size={16} />,
    laptop: <Monitor size={14} />,
    tablet: <Tablet size={16} />,
    mobile: <Smartphone size={16} />,
    'mobile-landscape': <Smartphone size={14} className="rotate-90" />,
  }

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* ── Top Toolbar ──────────────────────────────────────────────── */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#1a1a2e] bg-[#0a0a0f] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('dashboard')} className="text-zinc-500 hover:text-white transition-colors" title="Back to dashboard">
            <ArrowLeft size={18} />
          </button>
          <span className="font-bold text-[#7c3aed]">Forge</span>
          <Separator orientation="vertical" className="h-6 bg-[#2a2a3e]" />
          <span className="text-sm text-zinc-400 truncate max-w-32" title={generatedSiteName || 'Untitled Site'}>
            {generatedSiteName || 'Untitled Site'}
          </span>
          {generatedPages.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-6 bg-[#2a2a3e]" />
              <Select value={activePageIdRef.current} onValueChange={switchPage}>
                <SelectTrigger className="h-7 w-40 text-xs border-[#2a2a3e] bg-[#1a1a2e] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                  {generatedPages.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-xs text-white focus:bg-[#7c3aed]/30">
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-2 text-zinc-500">{p.route}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Tooltip><TooltipTrigger asChild><button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 rounded hover:bg-[#1a1a2e] disabled:opacity-30 transition-colors"><Undo2 size={16} /></button></TooltipTrigger><TooltipContent>Undo</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded hover:bg-[#1a1a2e] disabled:opacity-30 transition-colors"><Redo2 size={16} /></button></TooltipTrigger><TooltipContent>Redo</TooltipContent></Tooltip>
          <Separator orientation="vertical" className="h-6 bg-[#2a2a3e] mx-1" />

          {/* Device selector */}
          <div className="flex items-center gap-1 bg-[#1a1a2e] rounded-lg p-1">
            {DEVICE_CONFIGS.map(d => (
              <button key={d.name} onClick={() => setDevice(d.name)} className={`p-1.5 rounded transition-colors ${device === d.name ? 'bg-[#7c3aed] text-white' : 'text-zinc-400 hover:text-white'}`}>
                {deviceIcons[d.name]}
              </button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-6 bg-[#2a2a3e] mx-1" />
          <span className="text-xs text-zinc-500">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1 rounded hover:bg-[#1a1a2e]"><ZoomIn size={14} /></button>
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-1 rounded hover:bg-[#1a1a2e]"><ZoomOut size={14} /></button>
          <button onClick={() => setZoom(100)} className="text-xs text-zinc-500 hover:text-white px-1">Reset</button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowCodePanel(!showCodePanel)} className={`p-1.5 rounded transition-colors ${showCodePanel ? 'bg-[#7c3aed] text-white' : 'hover:bg-[#1a1a2e] text-zinc-400'}`}>
            <Code2 size={16} />
          </button>
          <button onClick={save} className="p-1.5 rounded hover:bg-[#1a1a2e] text-zinc-400"><Save size={16} /></button>
          <Button variant="outline" size="sm" onClick={exportHTML} className="h-7 text-xs border-[#2a2a3e] bg-[#1a1a2e] text-white hover:bg-[#2a2a3e]">
            <Download size={14} className="mr-1" />Export
          </Button>
          <Button size="sm" onClick={() => toast({ title: 'Deployment started' })} className="h-7 text-xs bg-[#7c3aed] hover:bg-[#6d28d9]">
            <Rocket size={14} className="mr-1" />Deploy
          </Button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Panel ──────────────────────────────────────────────── */}
        <div className="w-[280px] border-r border-[#1a1a2e] bg-[#0a0a0f] flex flex-col shrink-0">
          <Tabs value={leftPanelTab} onValueChange={setLeftPanelTab} className="flex flex-col h-full">
            <TabsList className="w-full justify-start bg-[#1a1a2e] border-b border-[#2a2a3e] rounded-none h-9 p-0">
              <TabsTrigger value="layers" className="text-xs data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-3 py-2 rounded-none"><Layers size={14} className="mr-1" />Layers</TabsTrigger>
              <TabsTrigger value="components" className="text-xs data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-3 py-2 rounded-none"><Grid3X3 size={14} className="mr-1" />Components</TabsTrigger>
              <TabsTrigger value="design" className="text-xs data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-3 py-2 rounded-none"><Palette size={14} className="mr-1" />Design</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="flex-1 overflow-y-auto mt-0 p-2">
              <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Page Structure</div>
              {elementTree ? renderTreeNode(elementTree, 0) : (
                <div className="text-xs text-zinc-500 text-center py-8">Click elements in preview to select</div>
              )}
            </TabsContent>

            <TabsContent value="components" className="flex-1 overflow-y-auto mt-0 p-2">
              <Input placeholder="Search components..." value={searchQuery} onChange={e => setSearchQuery(e.target.value.toLowerCase())} className="h-7 text-xs bg-[#111] border-[#2a2a3e] mb-2" />
              {filteredCategories.map(cat => (
                <div key={cat.id} className="mb-3">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">{cat.name}</div>
                  <div className="grid grid-cols-2 gap-1">
                    {cat.components.map(comp => (
                      <button key={comp.id} onClick={() => addComponent(comp.id)} className="flex flex-col items-start p-2 rounded bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#7c3aed] transition-colors text-xs group">
                        <span className="text-white font-medium group-hover:text-[#7c3aed]">{comp.name}</span>
                        <span className="text-zinc-500 text-[10px]">{comp.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="design" className="flex-1 overflow-y-auto mt-0 p-2">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">Quick Styles</div>
              {/* Color Palettes */}
              <div className="mb-3">
                <Label className="text-xs text-zinc-400 mb-1 block">Color Palette</Label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { bg: '#7c3aed', fg: '#fff' },
                    { bg: '#2dd4bf', fg: '#000' },
                    { bg: '#f472b6', fg: '#fff' },
                    { bg: '#fb923c', fg: '#000' },
                    { bg: '#0a0a0a', fg: '#fff' },
                    { bg: '#1a1a2e', fg: '#fff' },
                    { bg: '#ffffff', fg: '#000' },
                    { bg: '#f5f5f5', fg: '#000' },
                  ].map((p, i) => (
                    <button key={i} onClick={() => { applyStyle('background-color', p.bg); applyStyle('color', p.fg) }} className="w-full h-8 rounded border border-[#2a2a3e] hover:border-[#7c3aed] transition-colors" style={{ background: p.bg, color: p.fg, fontSize: '10px' }}>
                      {p.bg}
                    </button>
                  ))}
                </div>
              </div>
              {/* Typography Presets */}
              <div className="mb-3">
                <Label className="text-xs text-zinc-400 mb-1 block">Typography</Label>
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'Heading XL', font: '2.5rem', weight: '900' },
                    { label: 'Heading L', font: '2rem', weight: '700' },
                    { label: 'Heading M', font: '1.5rem', weight: '600' },
                    { label: 'Body', font: '1rem', weight: '400' },
                    { label: 'Small', font: '0.875rem', weight: '400' },
                    { label: 'Caption', font: '0.75rem', weight: '500' },
                  ].map((p, i) => (
                    <button key={i} onClick={() => { applyStyle('font-size', p.font); applyStyle('font-weight', p.weight) }} className="flex items-center justify-between p-2 rounded bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#7c3aed] transition-colors text-xs">
                      <span style={{ fontSize: p.font, fontWeight: p.weight }} className="text-white">{p.label}</span>
                      <span className="text-zinc-500">{p.font}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Spacing Presets */}
              <div className="mb-3">
                <Label className="text-xs text-zinc-400 mb-1 block">Spacing</Label>
                <div className="flex gap-1">
                  {['0', '0.5rem', '1rem', '1.5rem', '2rem', '3rem', '4rem'].map((p, i) => (
                    <button key={i} onClick={() => { applyStyle('padding', p); applyStyle('margin', p) }} className="flex-1 py-1 rounded bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#7c3aed] text-xs text-zinc-400 hover:text-white transition-colors">{p}</button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Center Preview ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-[#0d0d15] overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div
              className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: deviceConfig.width * (zoom / 100),
                height: deviceConfig.height * (zoom / 100),
                maxWidth: '100%',
              }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={iframeSrcDoc}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
                onLoad={() => { requestTree() }}
              />
            </div>
          </div>

          {/* ── Code Panel ─────────────────────────────────────────── */}
          <AnimatePresence>
            {showCodePanel && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 250 }}
                exit={{ height: 0 }}
                className="border-t border-[#1a1a2e] bg-[#0a0a0f] overflow-hidden shrink-0"
              >
                <div className="flex items-center justify-between px-3 py-1 border-b border-[#1a1a2e]">
                  <span className="text-xs text-zinc-400 font-semibold">Source Code</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={applyCodeChanges} className="h-6 text-xs border-[#2a2a3e] bg-[#1a1a2e] text-white">Apply Changes</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowCodePanel(false)} className="h-6 text-xs border-[#2a2a3e] bg-[#1a1a2e] text-white">Close</Button>
                  </div>
                </div>
                <textarea
                  value={codeContent}
                  onChange={e => setCodeContent(e.target.value)}
                  className="w-full h-[calc(250px-32px)] bg-[#111] text-zinc-300 p-3 text-xs font-mono resize-none outline-none"
                  spellCheck={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Inspector Panel ───────────────────────────────────── */}
        <div className="w-[320px] border-l border-[#1a1a2e] bg-[#0a0a0f] flex flex-col shrink-0 overflow-y-auto">
          {!selectedElement ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <MousePointer2 size={32} className="text-zinc-500 mb-3" />
              <p className="text-sm text-zinc-400 font-medium">Select an element</p>
              <p className="text-xs text-zinc-500 mt-1">Click on any element in the preview to edit its properties</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Element header */}
              <div className="px-3 py-2 border-b border-[#1a1a2e] bg-[#1a1a2e]/50">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/30 text-xs">{selectedElement.tag}</Badge>
                  <span className="text-xs text-zinc-400 truncate">{selectedElement.className || selectedElement.id}</span>
                  <div className="flex gap-1 ml-auto">
                    <button onClick={removeElement} className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    <button onClick={() => { /* duplicate */ }} className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white transition-colors"><Copy size={14} /></button>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-600 mt-1">
                  {Math.round(selectedElement.rect.width)}×{Math.round(selectedElement.rect.height)}px at ({Math.round(selectedElement.rect.left)}, {Math.round(selectedElement.rect.top)})
                </div>
              </div>

              {/* Content editing section */}
              <div className="px-3 py-2 border-b border-[#1a1a2e]">
                <Label className="text-xs text-zinc-300 font-semibold mb-1 block">Content</Label>
                <textarea
                  value={editingContent}
                  onChange={e => setEditingContent(e.target.value)}
                  onBlur={() => applyContent(editingContent)}
                  className="w-full h-20 bg-[#111] border border-[#2a2a3e] rounded text-xs text-white p-2 resize-y font-mono"
                  placeholder="Edit element content..."
                />
                {/* Attribute editors for specific tags */}
                {selectedElement.tag === 'img' && (
                  <div className="mt-1">
                    <Label className="text-xs text-zinc-400">Image Source</Label>
                    <Input value={editingAttributes.src || ''} onChange={e => applyAttribute('src', e.target.value)} className="h-7 text-xs bg-[#111] border-[#2a2a3e]" />
                    <Label className="text-xs text-zinc-400 mt-1">Alt Text</Label>
                    <Input value={editingAttributes.alt || ''} onChange={e => applyAttribute('alt', e.target.value)} className="h-7 text-xs bg-[#111] border-[#2a2a3e]" />
                  </div>
                )}
                {selectedElement.tag === 'a' && (
                  <div className="mt-1">
                    <Label className="text-xs text-zinc-400">Link URL</Label>
                    <Input value={editingAttributes.href || ''} onChange={e => applyAttribute('href', e.target.value)} className="h-7 text-xs bg-[#111] border-[#2a2a3e]" />
                    <Label className="text-xs text-zinc-400 mt-1">Target</Label>
                    <Select value={editingAttributes.target || '_self'} onValueChange={v => applyAttribute('target', v)}>
                      <SelectTrigger className="h-7 text-xs bg-[#111] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]"><SelectItem value="_self" className="text-xs">Same Tab</SelectItem><SelectItem value="_blank" className="text-xs">New Tab</SelectItem></SelectContent>
                    </Select>
                  </div>
                )}
                {(selectedElement.tag === 'input' || selectedElement.tag === 'textarea') && (
                  <div className="mt-1">
                    <Label className="text-xs text-zinc-400">Type</Label>
                    <Select value={editingAttributes.type || 'text'} onValueChange={v => applyAttribute('type', v)}>
                      <SelectTrigger className="h-7 text-xs bg-[#111] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                        {['text','email','password','number','tel','url','search','date','checkbox','radio','file','submit','button'].map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Label className="text-xs text-zinc-400 mt-1">Placeholder</Label>
                    <Input value={editingAttributes.placeholder || ''} onChange={e => applyAttribute('placeholder', e.target.value)} className="h-7 text-xs bg-[#111] border-[#2a2a3e]" />
                  </div>
                )}
                {selectedElement.tag === 'button' && (
                  <div className="mt-1">
                    <Label className="text-xs text-zinc-400">Button Type</Label>
                    <Select value={editingAttributes.type || 'button'} onValueChange={v => applyAttribute('type', v)}>
                      <SelectTrigger className="h-7 text-xs bg-[#111] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]"><SelectItem value="button" className="text-xs">Button</SelectItem><SelectItem value="submit" className="text-xs">Submit</SelectItem></SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* CSS Property Groups */}
              <ScrollArea className="flex-1">
                <div className="p-3">
                  {CSS_PROPERTY_GROUPS.map(group => (
                    <div key={group.name} className="mb-4">
                      <button
                        className="flex items-center gap-2 text-xs text-zinc-300 font-semibold uppercase tracking-wider mb-2 hover:text-[#7c3aed] transition-colors"
                        onClick={() => {/* Could toggle collapse */}}
                      >
                        <span>{group.name}</span>
                        <ChevronDown size={12} className="text-zinc-500" />
                      </button>
                      <div className="space-y-0.5">
                        {group.properties.map(prop => renderPropertyEditor(prop, selectedStyles))}
                      </div>
                      <Separator className="bg-[#2a2a3e]/40 mt-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
