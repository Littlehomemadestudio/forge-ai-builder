'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { toast } from '@/hooks/use-toast'
import {
  Undo2, Redo2, Monitor, Smartphone, Tablet, Code2, Save, Download, Rocket,
  ArrowLeft, Eye, EyeOff, Trash2, Copy, Plus, Search, Layers,
  Grid3X3, Palette, Type, Layout, Square, Circle, ChevronDown, ChevronRight,
  Move, Maximize2, Sparkles, Wand2, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, Image, Link, Settings2, FileCode,
  Globe, Hash, MousePointer2, DragHandle, BoxSelect, Edit3, Trash,
  PanelLeft, PanelRight, PanelBottom, Columns2, LayoutDashboard,
  LayoutGrid, LayoutList, Grid2X2, ZoomIn, ZoomOut, PenTool,
  Strikethrough, List, ListOrdered, Lock, Unlock, Group, Ungroup,
  MoveUp, MoveDown, Paintbrush, FontFamily, LetterSpacing,
  LineHeight, RotateCw, Scale, Sliders, Accessibility,
  FileText, Webhook, BarChart3, GitBranch, Megaphone,
  Table, File, FolderOpen, Star, Heart, Bookmark, Share2,
  Crop, Pipette, Eraser, Brush
} from 'lucide-react'

// ─── iframe Bridge Script (injected into the preview iframe) ──────────────
function getIframeInjectScript(): string {
  return `
(function() {
  let selectedId = null;
  let hoveredId = null;
  let isEditing = false;
  let overlayEl = null;
  let selectionBox = null;
  let labelEl = null;
  let resizeHandles = [];
  let gridEl = null;

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
    labelEl.style.cssText = 'position:fixed;z-index:10000;pointer-events:none;font-size:11px;font-family:Inter,system-ui,sans-serif;background:#7c3aed;color:#fff;padding:2px 8px;border-radius:4px;white-space:nowrap;';
    document.body.appendChild(labelEl);

    // Create resize handles
    for (let i = 0; i < 8; i++) {
      const handle = document.createElement('div');
      handle.className = 'forge-resize-handle';
      handle.style.cssText = 'position:fixed;z-index:10001;width:8px;height:8px;background:#7c3aed;border:1px solid #fff;border-radius:2px;cursor:' + ['nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize','w-resize'][i] + ';';
      handle.style.display = 'none';
      document.body.appendChild(handle);
      resizeHandles.push(handle);
    }

    // Grid overlay
    gridEl = document.createElement('div');
    gridEl.id = 'forge-grid';
    gridEl.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;display:none;background-image:linear-gradient(rgba(124,58,237,0.08) 1px, transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.08) 1px, transparent 1px);background-size:20px 20px;';
    document.body.appendChild(gridEl);
  }

  function updateResizeHandles(rect) {
    const positions = [
      { x: rect.left - 4, y: rect.top - 4 },
      { x: rect.left + rect.width/2 - 4, y: rect.top - 4 },
      { x: rect.left + rect.width - 4, y: rect.top - 4 },
      { x: rect.left + rect.width - 4, y: rect.top + rect.height/2 - 4 },
      { x: rect.left + rect.width - 4, y: rect.top + rect.height - 4 },
      { x: rect.left + rect.width/2 - 4, y: rect.top + rect.height - 4 },
      { x: rect.left - 4, y: rect.top + rect.height - 4 },
      { x: rect.left - 4, y: rect.top + rect.height/2 - 4 },
    ];
    positions.forEach((p, i) => {
      resizeHandles[i].style.left = p.x + 'px';
      resizeHandles[i].style.top = p.y + 'px';
      resizeHandles[i].style.display = 'block';
    });
  }

  function showHover(id) {
    const el = document.querySelector('[data-fid="' + id + '"]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    overlayEl.style.top = rect.top + 'px';
    overlayEl.style.left = rect.left + 'px';
    overlayEl.style.width = rect.width + 'px';
    overlayEl.style.height = rect.height + 'px';
    overlayEl.style.background = 'rgba(124,58,237,0.12)';
    overlayEl.style.border = '1px dashed rgba(124,58,237,0.4)';
    overlayEl.style.borderRadius = getComputedStyle(el).borderRadius;
    overlayEl.style.display = 'block';
    hoveredId = id;
  }

  function hideHover() {
    overlayEl.style.display = 'none';
    hoveredId = null;
  }

  function showSelection(id) {
    const el = document.querySelector('[data-fid="' + id + '"]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    selectionBox.style.top = (rect.top - 2) + 'px';
    selectionBox.style.left = (rect.left - 2) + 'px';
    selectionBox.style.width = (rect.width + 4) + 'px';
    selectionBox.style.height = (rect.height + 4) + 'px';
    selectionBox.style.border = '2px solid #7c3aed';
    selectionBox.style.borderRadius = getComputedStyle(el).borderRadius;
    selectionBox.style.display = 'block';
    updateResizeHandles(rect);

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
    resizeHandles.forEach(h => h.style.display = 'none');
    selectedId = null;
  }

  function sendElementInfo(el) {
    const id = el.getAttribute('data-fid');
    const computed = getComputedStyle(el);
    const rect = el.getBoundingClientRect();

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

    const attributes = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      if (attr.name !== 'data-fid' && attr.name !== 'style') {
        attributes[attr.name] = attr.value;
      }
    }

    const parent = el.parentElement;
    const parentId = parent ? parent.getAttribute('data-fid') : null;
    const childIds = [];
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
    if (el === overlayEl || el === selectionBox || el === labelEl || resizeHandles.includes(el) || el === gridEl) return;
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
    if (el === overlayEl || el === selectionBox || el === labelEl || resizeHandles.includes(el) || el === gridEl) return;
    const fid = el.getAttribute('data-fid');
    if (fid) {
      showSelection(fid);
      sendElementInfo(el);
    }
  }, true);

  document.addEventListener('dblclick', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const el = e.target;
    const fid = el.getAttribute('data-fid');
    if (!fid) return;
    if (el.children.length === 0 || (el.children.length === 1 && el.children[0].tagName === 'BR')) {
      isEditing = true;
      el.contentEditable = 'true';
      el.style.cursor = 'text';
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, true);

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

  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && !isEditing) e.preventDefault();
  });
  document.addEventListener('submit', function(e) { e.preventDefault(); });

  window.addEventListener('message', function(e) {
    const msg = e.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'apply-style': {
        const el = document.querySelector('[data-fid="' + msg.data.elementId + '"]');
        if (el) el.style.setProperty(msg.data.property, msg.data.value, 'important');
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
      case 'move-element': {
        const el = document.querySelector('[data-fid="' + msg.data.elementId + '"]');
        if (el && el.parentElement) {
          const dir = msg.data.direction;
          if (dir === 'up' && el.previousElementSibling) {
            el.parentElement.insertBefore(el, el.previousElementSibling);
          } else if (dir === 'down' && el.nextElementSibling) {
            el.parentElement.insertBefore(el.nextElementSibling, el);
          }
          assignIds();
          if (selectedId === msg.data.elementId) {
            showSelection(selectedId);
            sendElementInfo(el);
          }
        }
        break;
      }
      case 'duplicate-element': {
        const el = document.querySelector('[data-fid="' + msg.data.elementId + '"]');
        if (el && el.parentElement) {
          const clone = el.cloneNode(true);
          clone.removeAttribute('data-fid');
          el.parentElement.insertBefore(clone, el.nextElementSibling);
          assignIds();
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
          const temp = document.createElement('div');
          temp.innerHTML = msg.data.html;
          document.body.appendChild(temp.firstElementChild);
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
        if (el) { showSelection(msg.data.elementId); sendElementInfo(el); }
        break;
      }
      case 'highlight-element': { showHover(msg.data.elementId); break; }
      case 'update-html': {
        document.body.innerHTML = msg.data.html;
        assignIds();
        createOverlays();
        hideSelection();
        hideHover();
        break;
      }
      case 'toggle-grid': {
        if (gridEl) gridEl.style.display = msg.data.show ? 'block' : 'none';
        break;
      }
      case 'apply-theme': {
        const root = document.documentElement;
        if (msg.data.colors) {
          Object.entries(msg.data.colors).forEach(([key, val]) => {
            root.style.setProperty('--' + key, val, 'important');
            // Also update all elements with matching colors
          });
        }
        if (msg.data.fontFamily) {
          root.style.setProperty('--font-sans', msg.data.fontFamily, 'important');
          document.querySelectorAll('*').forEach(el => {
            const computed = getComputedStyle(el);
            if (computed.fontFamily.includes('Inter') || computed.fontFamily.includes('system-ui') || computed.fontFamily.includes('sans-serif')) {
              el.style.setProperty('font-family', msg.data.fontFamily, 'important');
            }
          });
        }
        break;
      }
      case 'get-elements-tree': {
        function buildTree(el, depth) {
          const fid = el.getAttribute('data-fid');
          if (!fid) return null;
          const children = [];
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

  assignIds();
  createOverlays();
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
  :root { --bg:#0a0a0a; --surface:#1a1a2e; --text:#ffffff; --muted:#94a3b8; --accent:#7c3aed; --border:#2a2a3e; --font-sans:'Inter',system-ui,sans-serif; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:var(--font-sans); background:var(--bg); color:var(--text); line-height:1.6; }
  a { color:inherit; text-decoration:none; }
  button { cursor:pointer; font-family:inherit; }
  img { max-width:100%; }
</style>
</head>
<body>
<nav style="display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;background:var(--bg);border-bottom:1px solid var(--border);">
  <div style="font-weight:700;font-size:1.2rem;color:var(--accent);">Brand</div>
  <div style="display:flex;gap:1.5rem;align-items:center;">
    <a href="#">Home</a><a href="#">Features</a><a href="#">Pricing</a><a href="#">About</a>
    <button style="background:var(--accent);color:#fff;padding:0.5rem 1.25rem;border:none;border-radius:0.5rem;font-weight:600;">Get Started</button>
  </div>
</nav>
<section style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 2rem;min-height:60vh;background:linear-gradient(135deg,var(--bg),var(--surface));">
  <h1 style="font-size:3.5rem;font-weight:900;margin-bottom:1rem;text-align:center;">Build something amazing</h1>
  <p style="font-size:1.25rem;color:var(--muted);margin-bottom:2.5rem;text-align:center;max-width:600px;">The modern platform for creating beautiful websites. Design, edit, and deploy with ease.</p>
  <div style="display:flex;gap:1rem;"><button style="background:var(--accent);color:#fff;padding:0.75rem 2rem;border:none;border-radius:0.5rem;font-weight:600;font-size:1rem;">Start Building</button><button style="background:transparent;color:#fff;padding:0.75rem 2rem;border:1px solid var(--border);border-radius:0.5rem;font-size:1rem;">Learn More</button></div>
</section>
<section style="padding:4rem 2rem;background:var(--bg);">
  <h2 style="font-size:2rem;font-weight:700;margin-bottom:2.5rem;text-align:center;">Key Features</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:900px;margin:0 auto;">
    <div style="background:var(--surface);border-radius:0.75rem;padding:1.5rem;border:1px solid var(--border);"><div style="width:2.5rem;height:2.5rem;background:var(--accent);border-radius:0.5rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff;">⚡</div><h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">AI Generation</h3><p style="color:var(--muted);font-size:0.9rem;line-height:1.6;">Describe what you want and watch it come to life instantly.</p></div>
    <div style="background:var(--surface);border-radius:0.75rem;padding:1.5rem;border:1px solid var(--border);"><div style="width:2.5rem;height:2.5rem;background:#2dd4bf;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff;">✏️</div><h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">Visual Editor</h3><p style="color:var(--muted);font-size:0.9rem;line-height:1.6;">Click, drag, refine. Every pixel is under your control.</p></div>
    <div style="background:var(--surface);border-radius:0.75rem;padding:1.5rem;border:1px solid var(--border);"><div style="width:2.5rem;height:2.5rem;background:#f472b6;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#fff;">📦</div><h3 style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">Export Freedom</h3><p style="color:var(--muted);font-size:0.9rem;line-height:1.6;">Download clean code. Your website, your rules.</p></div>
  </div>
</section>
<section style="display:flex;flex-direction:column;align-items:center;padding:4rem 2rem;background:linear-gradient(135deg,var(--accent),#2dd4bf);color:#fff;text-align:center;">
  <h2 style="font-size:2.5rem;font-weight:800;margin-bottom:1rem;">Ready to start building?</h2>
  <p style="font-size:1.1rem;color:rgba(255,255,255,0.85);margin-bottom:2rem;max-width:500px;">Join thousands of creators who build with Forge.</p>
  <button style="background:#fff;color:var(--accent);padding:1rem 3rem;border:none;border-radius:0.5rem;font-weight:700;font-size:1.1rem;">Start Free Trial</button>
</section>
<footer style="display:flex;justify-content:space-between;padding:2rem;background:var(--bg);border-top:1px solid var(--border);color:var(--muted);">
  <div style="font-weight:700;color:var(--text);font-size:1.1rem;">Brand</div><div>© 2025 Brand. All rights reserved.</div>
</footer>
</body>
</html>`
}

function prepareHTMLForIframe(html: string): string {
  const script = getIframeInjectScript()
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

// ─── Animation Presets ─────────────────────────────────────────────────────
const ANIMATION_PRESETS = [
  { id: 'fadeIn', name: 'Fade In', css: 'fadeIn 0.6s ease forwards', keyframes: '@keyframes fadeIn{from{opacity:0}to{opacity:1}}' },
  { id: 'fadeUp', name: 'Fade Up', css: 'fadeUp 0.6s ease forwards', keyframes: '@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}' },
  { id: 'fadeDown', name: 'Fade Down', css: 'fadeDown 0.6s ease forwards', keyframes: '@keyframes fadeDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}' },
  { id: 'fadeLeft', name: 'Fade Left', css: 'fadeLeft 0.6s ease forwards', keyframes: '@keyframes fadeLeft{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}' },
  { id: 'fadeRight', name: 'Fade Right', css: 'fadeRight 0.6s ease forwards', keyframes: '@keyframes fadeRight{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}' },
  { id: 'slideUp', name: 'Slide Up', css: 'slideUp 0.5s ease forwards', keyframes: '@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}' },
  { id: 'bounceIn', name: 'Bounce In', css: 'bounceIn 0.8s ease forwards', keyframes: '@keyframes bounceIn{0%{opacity:0;transform:scale(0.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(0.9)}100%{transform:scale(1)}}' },
  { id: 'scaleIn', name: 'Scale In', css: 'scaleIn 0.5s ease forwards', keyframes: '@keyframes scaleIn{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}' },
  { id: 'rotateIn', name: 'Rotate In', css: 'rotateIn 0.6s ease forwards', keyframes: '@keyframes rotateIn{from{opacity:0;transform:rotate(-180deg)scale(0)}to{opacity:1;transform:rotate(0)scale(1)}}' },
  { id: 'pulse', name: 'Pulse', css: 'pulse 2s ease infinite', keyframes: '@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}' },
  { id: 'shake', name: 'Shake', css: 'shake 0.6s ease', keyframes: '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}' },
  { id: 'float', name: 'Float', css: 'float 3s ease infinite', keyframes: '@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}' },
]

// ─── Theme Presets ──────────────────────────────────────────────────────────
const THEME_PRESETS = [
  { id: 'dark-minimal', name: 'Dark Minimal', colors: { accent:'#7c3aed', bg:'#0a0a0a', surface:'#1a1a2e', text:'#ffffff', muted:'#94a3b8', border:'#2a2a3e' }, font: 'Inter' },
  { id: 'dark-premium', name: 'Dark Premium', colors: { accent:'#a855f7', bg:'#0a0a0f', surface:'#15151f', text:'#f8fafc', muted:'#64748b', border:'#1e293b' }, font: 'Inter' },
  { id: 'light-clean', name: 'Light Clean', colors: { accent:'#6366f1', bg:'#ffffff', surface:'#f8fafc', text:'#0f172a', muted:'#64748b', border:'#e2e8f0' }, font: 'Inter' },
  { id: 'light-bold', name: 'Light Bold', colors: { accent:'#f59e0b', bg:'#fffbeb', surface:'#ffffff', text:'#1f2937', muted:'#6b7280', border:'#fcd34d' }, font: 'Inter' },
  { id: 'glass', name: 'Glassmorphism', colors: { accent:'#a855f7', bg:'#1a1a2e', surface:'rgba(255,255,255,0.1)', text:'#f8fafc', muted:'#94a3b8', border:'rgba(255,255,255,0.2)' }, font: 'Inter' },
  { id: 'gradient', name: 'Gradient', colors: { accent:'#6366f1', bg:'#0f172a', surface:'#1e293b', text:'#f8fafc', muted:'#94a3b8', border:'#334155' }, font: 'Inter' },
]

// ─── Main Editor Component ─────────────────────────────────────────────────
export default function EditorPage() {
  const generatedPages = useAppStore(s => s.generatedPages)
  const currentPreviewPage = useAppStore(s => s.currentPreviewPage)
  const setCurrentPreviewPage = useAppStore(s => s.setCurrentPreviewPage)
  const updateGeneratedPage = useAppStore(s => s.updateGeneratedPage)
  const generatedSiteName = useAppStore(s => s.generatedSiteName)

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
  const [inspectorTab, setInspectorTab] = useState('style')
  const [showCodePanel, setShowCodePanel] = useState(false)
  const [codeContent, setCodeContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [elementTree, setElementTree] = useState<TreeNode | null>(null)
  const [zoom, setZoom] = useState(100)
  const [editingContent, setEditingContent] = useState('')
  const [editingAttributes, setEditingAttributes] = useState<Record<string, string>>({})
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<Set<string>>(new Set(['f-el-0']))
  const [showGrid, setShowGrid] = useState(false)
  const [canvasMode, setCanvasMode] = useState<'select'|'text'|'move'>('select')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState('html')

  // Design tokens state
  const [designTokens, setDesignTokens] = useState({
    accent: '#7c3aed',
    bg: '#0a0a0a',
    surface: '#1a1a2e',
    text: '#ffffff',
    muted: '#94a3b8',
    border: '#2a2a3e',
    fontFamily: 'Inter',
    borderRadius: 8,
    spacingScale: 1,
    shadowScale: 1,
  })

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const historyDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const activePageIdRef = useRef<string>(
    generatedPages.find(p => p.id === currentPreviewPage)?.id || generatedPages[0]?.id || 'default'
  )

  const deviceConfig = DEVICE_CONFIGS.find(d => d.name === device) || DEVICE_CONFIGS[0]

  // ─── Send message to iframe ───────────────────────────────────────────────
  const sendMessage = useCallback((type: string, data: unknown) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, data }, '*')
    }
  }, [])

  const requestTree = useCallback(() => {
    sendMessage('get-elements-tree', {})
  }, [sendMessage])

  // ─── Push to history (debounced) ───────────────────────────────────────────
  const pushHistory = useCallback((label: string) => {
    if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current)
    historyDebounceRef.current = setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentDocument) {
        const currentHTML = iframeRef.current.contentDocument.documentElement.outerHTML
        const newEntry: HistoryEntry = { id: 'h' + Date.now(), html: currentHTML, label, timestamp: Date.now() }
        setHistory(prev => [...prev.slice(0, historyIndex + 1), newEntry])
        setHistoryIndex(prev => prev + 1)
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
      case 'ready': { requestTree(); break }
      case 'elements-tree': { setElementTree(msg.data as TreeNode); break }
    }
  }, [selectedElement, pushHistory, requestTree])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // ─── Switch page ────────────────────────────────────────────────────────
  const switchPage = useCallback((newPageId: string) => {
    if (newPageId === activePageIdRef.current) return
    const target = generatedPages.find(p => p.id === newPageId)
    if (!target) return

    if (historyDebounceRef.current) { clearTimeout(historyDebounceRef.current); historyDebounceRef.current = null }
    if (iframeRef.current?.contentDocument) {
      const currentHTML = iframeRef.current.contentDocument.documentElement.outerHTML
      updateGeneratedPage(activePageIdRef.current, { html: currentHTML })
    }
    activePageIdRef.current = newPageId
    setWebsiteHTML(target.html)
    setHistory([{ id: 'h0', html: target.html, label: target.name, timestamp: Date.now() }])
    setHistoryIndex(0)
    setSelectedElement(null)
    setSelectedStyles({})
    setElementTree(null)
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
    const el = iframeRef.current?.contentDocument?.querySelector(`[data-fid="${selectedElement.id}"]`)
    if (el) {
      if (value) { el.setAttribute(attr, value) } else { el.removeAttribute(attr) }
      pushHistory(`Change ${attr}`)
    }
    setEditingAttributes(prev => ({ ...prev, [attr]: value }))
  }, [selectedElement, pushHistory])

  // ─── Move element ────────────────────────────────────────────────────────
  const moveElement = useCallback((direction: 'up' | 'down') => {
    if (!selectedElement) return
    sendMessage('move-element', { elementId: selectedElement.id, direction })
    pushHistory(`Move ${direction}`)
    requestTree()
  }, [selectedElement, sendMessage, pushHistory, requestTree])

  // ─── Duplicate element ────────────────────────────────────────────────────
  const duplicateElement = useCallback(() => {
    if (!selectedElement) return
    sendMessage('duplicate-element', { elementId: selectedElement.id })
    pushHistory('Duplicate element')
    requestTree()
  }, [selectedElement, sendMessage, pushHistory, requestTree])

  // ─── Add Component ─────────────────────────────────────────────────────────
  const addComponent = useCallback((componentId: string) => {
    const comp = getComponentById(componentId)
    if (!comp) return
    const parentId = selectedElement ? selectedElement.id : 'f-el-0'
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

  // ─── Undo/Redo ─────────────────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    const entry = history[newIndex]
    sendMessage('update-html', { html: entry.html })
    requestTree()
  }, [historyIndex, history, sendMessage, requestTree])

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
    if (iframeRef.current?.contentDocument) {
      const currentHTML = iframeRef.current.contentDocument.documentElement.outerHTML
      setWebsiteHTML(currentHTML)
      const pageId = activePageIdRef.current
      if (pageId && pageId !== 'default') { updateGeneratedPage(pageId, { html: currentHTML }) }
    }
    toast({ title: 'Project saved', description: 'All changes saved' })
  }, [updateGeneratedPage])

  // ─── Export functions ──────────────────────────────────────────────────────
  const exportHTML = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const html = doc.documentElement.outerHTML
    const cleanHTML = html.replace(/<script>[^]*?<\/script>/, '').replace(/data-fid="[^"]*"/g, '')
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
    const reactCode = `import React from 'react'\n\nconst styles = \`\n${styles}\n\`\n\nexport default function HomePage() {\n  return (\n    <main>\n      ${bodyHTML}\n    </main>\n  )\n}`
    const blob = new Blob([reactCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'page.tsx'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported!', description: 'React component downloaded' })
  }, [])

  const exportCSS = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const styles = doc.querySelector('style')?.innerHTML || ''
    const blob = new Blob([styles], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'styles.css'
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: 'Exported!', description: 'CSS file downloaded' })
  }, [])

  const handleExport = useCallback(() => {
    switch (exportFormat) {
      case 'html': exportHTML(); break
      case 'react': exportReact(); break
      case 'css': exportCSS(); break
      default: exportHTML()
    }
    setShowExportDialog(false)
  }, [exportFormat, exportHTML, exportReact, exportCSS])

  // ─── Apply theme globally ──────────────────────────────────────────────────
  const applyTheme = useCallback(() => {
    sendMessage('apply-theme', {
      colors: { accent: designTokens.accent, bg: designTokens.bg, surface: designTokens.surface, text: designTokens.text, muted: designTokens.muted, border: designTokens.border },
      fontFamily: designTokens.fontFamily
    })
    pushHistory('Apply theme')
  }, [sendMessage, pushHistory, designTokens])

  // ─── Apply animation preset ────────────────────────────────────────────────
  const applyAnimationPreset = useCallback((preset: typeof ANIMATION_PRESETS[number]) => {
    if (!selectedElement) return
    // Add keyframes to iframe's style and apply animation
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const styleEl = doc.querySelector('style')
    if (styleEl && !styleEl.textContent?.includes(preset.keyframes)) {
      styleEl.textContent += '\n' + preset.keyframes
    }
    sendMessage('apply-style', { elementId: selectedElement.id, property: 'animation', value: preset.css })
    pushHistory(`Apply ${preset.name}`)
  }, [selectedElement, sendMessage, pushHistory])

  // ─── Toggle grid ────────────────────────────────────────────────────────────
  const toggleGrid = useCallback(() => {
    const newShow = !showGrid
    setShowGrid(newShow)
    sendMessage('toggle-grid', { show: newShow })
  }, [showGrid, sendMessage])

  // ─── Navigate ──────────────────────────────────────────────────────────────
  const navigate = useAppStore(s => s.navigate)

  const iframeSrcDoc = prepareHTMLForIframe(websiteHTML)

  // ─── Code panel sync ───────────────────────────────────────────────────────
  useEffect(() => {
    if (showCodePanel) {
      const doc = iframeRef.current?.contentDocument
      if (doc) { setCodeContent(doc.documentElement.outerHTML) }
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
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Label className="text-[10px] text-zinc-400 w-24 shrink-0">{prop.label}</Label>
            <Input value={currentValue} onChange={e => applyStyle(prop.name, e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" placeholder={prop.default} />
            {prop.unit && <span className="text-[10px] text-zinc-500">{prop.unit}</span>}
          </div>
        )
      case 'number':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Label className="text-[10px] text-zinc-400 w-24 shrink-0">{prop.label}</Label>
            <Input type="number" value={parseFloat(currentValue) || 0} onChange={e => applyStyle(prop.name, e.target.value + (prop.unit || 'px'))} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" min={prop.min} max={prop.max} step={prop.step} />
            {prop.unit && <span className="text-[10px] text-zinc-500">{prop.unit}</span>}
          </div>
        )
      case 'select':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Label className="text-[10px] text-zinc-400 w-24 shrink-0">{prop.label}</Label>
            <Select value={currentValue} onValueChange={v => applyStyle(prop.name, v)}>
              <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e] max-h-60">{prop.options?.map(opt => <SelectItem key={opt} value={opt} className="text-[11px] text-white">{opt}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )
      case 'color':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Label className="text-[10px] text-zinc-400 w-24 shrink-0">{prop.label}</Label>
            <div className="flex items-center gap-1 flex-1">
              <input type="color" value={currentValue.startsWith('#') ? currentValue : '#000000'} onChange={e => applyStyle(prop.name, e.target.value)} className="w-6 h-6 rounded border border-[#2a2a3e] cursor-pointer bg-transparent" />
              <Input value={currentValue} onChange={e => applyStyle(prop.name, e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" />
            </div>
          </div>
        )
      case 'slider':
        return (
          <div key={prop.name} className="mb-2">
            <div className="flex items-center gap-2">
              <Label className="text-[10px] text-zinc-400 w-24 shrink-0">{prop.label}</Label>
              <Input value={parseFloat(currentValue) || parseFloat(prop.default || '0')} onChange={e => applyStyle(prop.name, e.target.value + (prop.unit || ''))} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white w-20" />
              {prop.unit && <span className="text-[10px] text-zinc-500">{prop.unit}</span>}
            </div>
            <Slider value={[parseFloat(currentValue) || parseFloat(prop.default || '0')]} onValueChange={v => applyStyle(prop.name, v[0] + (prop.unit || ''))} min={prop.min || 0} max={prop.max || 100} step={prop.step || 1} className="mt-1" />
          </div>
        )
      case 'toggle':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Label className="text-[10px] text-zinc-400 w-24 shrink-0">{prop.label}</Label>
            <Switch checked={currentValue === 'true' || currentValue === 'visible' || currentValue === 'auto'} onCheckedChange={v => applyStyle(prop.name, v ? (prop.options?.[0] || 'true') : (prop.options?.[1] || 'none'))} />
          </div>
        )
      case 'composite':
        return (
          <div key={prop.name} className="mb-2">
            <Label className="text-[10px] text-zinc-300 mb-1 block font-semibold">{prop.label}</Label>
            <div className="pl-2 border-l-2 border-[#7c3aed]/30">
              {prop.subProperties?.map(sub => renderPropertyEditor(sub, styles))}
            </div>
          </div>
        )
      default: return null
    }
  }

  // ─── Render Element Tree ───────────────────────────────────────────────────
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedTreeNodes.has(node.id)
    const isSelected = selectedElement?.id === node.id
    const hasChildren = node.children && node.children.length > 0

    return (
      <div key={node.id}>
        <div className={`flex items-center gap-1 px-1 py-0.5 cursor-pointer rounded text-[11px] transition-colors group ${isSelected ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-zinc-400 hover:bg-[#1a1a2e] hover:text-white'}`}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
          onClick={() => { sendMessage('select-element', { elementId: node.id }); setExpandedTreeNodes(prev => new Set([...prev, node.id])) }}
          onMouseEnter={() => sendMessage('highlight-element', { elementId: node.id })}
          onMouseLeave={() => sendMessage('highlight-element', { elementId: '' })}
        >
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); setExpandedTreeNodes(prev => { const n = new Set(prev); if (isExpanded) n.delete(node.id); else n.add(node.id); return n }) }}>
              <ChevronRight size={10} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          ) : <span className="w-[10px]" />}
          <span className="text-[#7c3aed] font-mono text-[10px]">{node.tag}</span>
          {node.className && <span className="text-zinc-500 truncate max-w-16 text-[10px]">{node.className.split(' ')[0]}</span>}
          {node.textContent && <span className="text-zinc-600 truncate max-w-24 ml-1 text-[10px]">"{node.textContent.substring(0, 15)}"</span>}
          {isSelected && (
            <div className="flex gap-0.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); moveElement('up') }} className="text-zinc-400 hover:text-white p-0.5"><MoveUp size={10} /></button>
              <button onClick={(e) => { e.stopPropagation(); moveElement('down') }} className="text-zinc-400 hover:text-white p-0.5"><MoveDown size={10} /></button>
              <button onClick={(e) => { e.stopPropagation(); duplicateElement() }} className="text-zinc-400 hover:text-white p-0.5"><Copy size={10} /></button>
              <button onClick={(e) => { e.stopPropagation(); removeElement() }} className="text-red-400 hover:text-red-300 p-0.5"><Trash2 size={10} /></button>
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

  // ─── Component categories ──────────────────────────────────────────────────
  const filteredCategories = EDITOR_COMPONENT_CATEGORIES.filter(cat =>
    !searchQuery || cat.name.toLowerCase().includes(searchQuery) || cat.components.some(c => c.name.toLowerCase().includes(searchQuery) || c.description.toLowerCase().includes(searchQuery))
  )

  const deviceIcons: Record<string, React.ReactNode> = {
    desktop: <Monitor size={14} />,
    laptop: <Monitor size={12} />,
    tablet: <Tablet size={14} />,
    mobile: <Smartphone size={14} />,
    'mobile-landscape': <Smartphone size={12} className="rotate-90" />,
  }

  // ─── Box Model Diagram ────────────────────────────────────────────────────
  const BoxModelDiagram = () => {
    if (!selectedStyles) return null
    const mT = parseInt(selectedStyles['margin-top'] || '0')
    const mR = parseInt(selectedStyles['margin-right'] || '0')
    const mB = parseInt(selectedStyles['margin-bottom'] || '0')
    const mL = parseInt(selectedStyles['margin-left'] || '0')
    const pT = parseInt(selectedStyles['padding-top'] || '0')
    const pR = parseInt(selectedStyles['padding-right'] || '0')
    const pB = parseInt(selectedStyles['padding-bottom'] || '0')
    const pL = parseInt(selectedStyles['padding-left'] || '0')
    const bT = parseInt(selectedStyles['border-top-width'] || '0')
    const bR = parseInt(selectedStyles['border-right-width'] || '0')
    const bB = parseInt(selectedStyles['border-bottom-width'] || '0')
    const bL = parseInt(selectedStyles['border-left-width'] || '0')

    return (
      <div className="relative w-full aspect-square max-w-[180px] mx-auto my-2">
        {/* Margin - orange */}
        <div className="absolute inset-0 bg-orange-500/15 border border-orange-500/30 rounded cursor-pointer"
          onClick={() => setInspectorTab('style')}>
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-orange-400">{mT}</span>
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-orange-400">{mB}</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-orange-400">{mL}</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-orange-400">{mR}</span>
          <span className="absolute top-1 left-2 text-[8px] text-orange-400/60">margin</span>
        </div>
        {/* Border - yellow */}
        <div className="absolute bg-yellow-500/15 border border-yellow-500/30 rounded"
          style={{ top: `${Math.max(12, mT/3)}px`, left: `${Math.max(12, mL/3)}px`, right: `${Math.max(12, mR/3)}px`, bottom: `${Math.max(12, mB/3)}px` }}>
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-yellow-400">{bT}</span>
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-yellow-400">{bB}</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-yellow-400">{bL}</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-yellow-400">{bR}</span>
          <span className="absolute top-1 left-2 text-[8px] text-yellow-400/60">border</span>
        </div>
        {/* Padding - green */}
        <div className="absolute bg-emerald-500/15 border border-emerald-500/30 rounded"
          style={{ top: `${Math.max(20, (mT+bT)/3)}px`, left: `${Math.max(20, (mL+bL)/3)}px`, right: `${Math.max(20, (mR+bR)/3)}px`, bottom: `${Math.max(20, (mB+bB)/3)}px` }}>
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400">{pT}</span>
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400">{pB}</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-emerald-400">{pL}</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-emerald-400">{pR}</span>
          <span className="absolute top-1 left-2 text-[8px] text-emerald-400/60">padding</span>
        </div>
        {/* Content - blue */}
        <div className="absolute bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded flex items-center justify-center"
          style={{ top: `${Math.max(28, (mT+bT+pT)/3)}px`, left: `${Math.max(28, (mL+bL+pL)/3)}px`, right: `${Math.max(28, (mR+bR+pR)/3)}px`, bottom: `${Math.max(28, (mB+bB+pB)/3)}px` }}>
          <span className="text-[9px] text-[#7c3aed]">{Math.round(selectedElement?.rect.width || 0)}×{Math.round(selectedElement?.rect.height || 0)}</span>
        </div>
      </div>
    )
  }

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* ── Top Toolbar ──────────────────────────────────────────────── */}
      <div className="h-11 flex items-center justify-between px-3 border-b border-[#1a1a2e] bg-[#0a0a0f] shrink-0">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('dashboard')} className="text-zinc-500 hover:text-white transition-colors"><ArrowLeft size={16} /></button>
          <span className="font-bold text-[#7c3aed] text-sm">Forge</span>
          <Separator orientation="vertical" className="h-5 bg-[#2a2a3e]" />
          <span className="text-xs text-zinc-400 truncate max-w-28">{generatedSiteName || 'Untitled'}</span>
          {generatedPages.length > 0 && (
            <Select value={activePageIdRef.current} onValueChange={switchPage}>
              <SelectTrigger className="h-6 w-32 text-[11px] border-[#2a2a3e] bg-[#1a1a2e] text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                {generatedPages.map(p => <SelectItem key={p.id} value={p.id} className="text-[11px] text-white">{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Center section - Canvas mode + formatting */}
        <div className="flex items-center gap-1">
          {/* Canvas mode */}
          <div className="flex items-center gap-0.5 bg-[#1a1a2e] rounded-lg p-0.5">
            <Tooltip><TooltipTrigger asChild><button onClick={() => setCanvasMode('select')} className={`p-1 rounded transition-colors ${canvasMode === 'select' ? 'bg-[#7c3aed] text-white' : 'text-zinc-400 hover:text-white'}`}><MousePointer2 size={14} /></button></TooltipTrigger><TooltipContent>Select</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><button onClick={() => setCanvasMode('text')} className={`p-1 rounded transition-colors ${canvasMode === 'text' ? 'bg-[#7c3aed] text-white' : 'text-zinc-400 hover:text-white'}`}><Type size={14} /></button></TooltipTrigger><TooltipContent>Text</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><button onClick={() => setCanvasMode('move')} className={`p-1 rounded transition-colors ${canvasMode === 'move' ? 'bg-[#7c3aed] text-white' : 'text-zinc-400 hover:text-white'}`}><Move size={14} /></button></TooltipTrigger><TooltipContent>Move</TooltipContent></Tooltip>
          </div>
          <Separator orientation="vertical" className="h-5 bg-[#2a2a3e] mx-1" />
          {/* Quick formatting */}
          {selectedElement && (
            <div className="flex items-center gap-0.5">
              <Tooltip><TooltipTrigger asChild><button onClick={() => applyStyle('font-weight', selectedStyles['font-weight'] === '700' ? '400' : '700')} className={`p-1 rounded transition-colors ${selectedStyles['font-weight'] === '700' || selectedStyles['font-weight'] === 'bold' ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white'}`}><Bold size={13} /></button></TooltipTrigger><TooltipContent>Bold</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button onClick={() => applyStyle('font-style', selectedStyles['font-style'] === 'italic' ? 'normal' : 'italic')} className={`p-1 rounded transition-colors ${selectedStyles['font-style'] === 'italic' ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white'}`}><Italic size={13} /></button></TooltipTrigger><TooltipContent>Italic</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button onClick={() => applyStyle('text-decoration', selectedStyles['text-decoration']?.includes('underline') ? 'none' : 'underline')} className={`p-1 rounded transition-colors ${selectedStyles['text-decoration']?.includes('underline') ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white'}`}><Underline size={13} /></button></TooltipTrigger><TooltipContent>Underline</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button onClick={() => applyStyle('text-decoration', selectedStyles['text-decoration']?.includes('line-through') ? 'none' : 'line-through')} className={`p-1 rounded transition-colors ${selectedStyles['text-decoration']?.includes('line-through') ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white'}`}><Strikethrough size={13} /></button></TooltipTrigger><TooltipContent>Strikethrough</TooltipContent></Tooltip>
              <Separator orientation="vertical" className="h-4 bg-[#2a2a3e] mx-0.5" />
              <Tooltip><TooltipTrigger asChild><button onClick={() => applyStyle('text-align', 'left')} className={`p-1 rounded transition-colors ${selectedStyles['text-align'] === 'left' ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white'}`}><AlignLeft size={13} /></button></TooltipTrigger><TooltipContent>Align Left</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button onClick={() => applyStyle('text-align', 'center')} className={`p-1 rounded transition-colors ${selectedStyles['text-align'] === 'center' ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white'}`}><AlignCenter size={13} /></button></TooltipTrigger><TooltipContent>Align Center</TooltipContent></Tooltip>
              <Tooltip><TooltipTrigger asChild><button onClick={() => applyStyle('text-align', 'right')} className={`p-1 rounded transition-colors ${selectedStyles['text-align'] === 'right' ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white'}`}><AlignRight size={13} /></button></TooltipTrigger><TooltipContent>Align Right</TooltipContent></Tooltip>
              <Separator orientation="vertical" className="h-4 bg-[#2a2a3e] mx-0.5" />
              {/* Quick color */}
              <div className="flex items-center gap-0.5">
                {[{ c:'#ffffff', l:'White' },{ c:'#7c3aed', l:'Purple' },{ c:'#2dd4bf', l:'Teal' },{ c:'#f472b6', l:'Pink' },{ c:'#fb923c', l:'Orange' },{ c:'#000000', l:'Black' }].map(({ c, l }) => (
                  <Tooltip key={c}><TooltipTrigger asChild><button onClick={() => applyStyle('color', c)} className="w-4 h-4 rounded border border-[#2a2a3e] hover:border-[#7c3aed] transition-colors" style={{ background: c }} /></TooltipTrigger><TooltipContent>{l}</TooltipContent></Tooltip>
                ))}
                <input type="color" value={selectedStyles['color']?.startsWith('#') ? selectedStyles['color'] : '#ffffff'} onChange={e => applyStyle('color', e.target.value)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-0" title="Custom color" />
              </div>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          <Tooltip><TooltipTrigger asChild><button onClick={undo} disabled={historyIndex <= 0} className="p-1 rounded hover:bg-[#1a1a2e] disabled:opacity-30 transition-colors"><Undo2 size={14} /></button></TooltipTrigger><TooltipContent>Undo</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1 rounded hover:bg-[#1a1a2e] disabled:opacity-30 transition-colors"><Redo2 size={14} /></button></TooltipTrigger><TooltipContent>Redo</TooltipContent></Tooltip>
          <Separator orientation="vertical" className="h-5 bg-[#2a2a3e] mx-0.5" />
          {/* Device selector */}
          <div className="flex items-center gap-0.5 bg-[#1a1a2e] rounded-lg p-0.5">
            {DEVICE_CONFIGS.map(d => (
              <button key={d.name} onClick={() => setDevice(d.name)} className={`p-1 rounded transition-colors ${device === d.name ? 'bg-[#7c3aed] text-white' : 'text-zinc-400 hover:text-white'}`}>{deviceIcons[d.name]}</button>
            ))}
          </div>
          <Separator orientation="vertical" className="h-5 bg-[#2a2a3e] mx-0.5" />
          {/* Zoom */}
          <span className="text-[10px] text-zinc-500 w-7">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-0.5 rounded hover:bg-[#1a1a2e] text-zinc-400"><ZoomIn size={12} /></button>
          <button onClick={() => setZoom(z => Math.max(30, z - 10))} className="p-0.5 rounded hover:bg-[#1a1a2e] text-zinc-400"><ZoomOut size={12} /></button>
          <button onClick={toggleGrid} className={`p-0.5 rounded transition-colors ${showGrid ? 'bg-[#7c3aed]/30 text-[#7c3aed]' : 'text-zinc-400 hover:text-white hover:bg-[#1a1a2e]'}`}><Grid2X2 size={12} /></button>
          <Separator orientation="vertical" className="h-5 bg-[#2a2a3e] mx-0.5" />
          <button onClick={() => setShowCodePanel(!showCodePanel)} className={`p-1 rounded transition-colors ${showCodePanel ? 'bg-[#7c3aed] text-white' : 'hover:bg-[#1a1a2e] text-zinc-400'}`}><Code2 size={14} /></button>
          <button onClick={save} className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400"><Save size={14} /></button>
          <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <DialogTrigger asChild><Button variant="outline" size="sm" className="h-6 text-[11px] border-[#2a2a3e] bg-[#1a1a2e] text-white hover:bg-[#2a2a3e]"><Download size={12} className="mr-1" />Export</Button></DialogTrigger>
            <DialogContent className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <DialogHeader><DialogTitle className="text-white">Export Website</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { id:'html', label:'HTML', desc:'Complete standalone HTML page', icon: File },
                  { id:'react', label:'React / TSX', desc:'React component with styles', icon: Code2 },
                  { id:'nextjs', label:'Next.js', desc:'Next.js page component', icon: Globe },
                  { id:'vue', label:'Vue', desc:'Vue single-file component', icon: FileCode },
                  { id:'css', label:'CSS Only', desc:'Extract all styles', icon: Palette },
                  { id:'zip', label:'ZIP Bundle', desc:'All pages + assets', icon: FolderOpen },
                ].map(f => {
                  const Icon = f.icon
                  return (
                    <button key={f.id} onClick={() => setExportFormat(f.id)} className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${exportFormat === f.id ? 'border-[#7c3aed] bg-[#7c3aed]/10' : 'border-[#2a2a3e] bg-[#0d0d15] hover:border-[#7c3aed]/50'}`}>
                      <Icon size={20} className={exportFormat === f.id ? 'text-[#7c3aed]' : 'text-zinc-400'} />
                      <span className="text-xs font-medium mt-1">{f.label}</span>
                      <span className="text-[10px] text-zinc-500">{f.desc}</span>
                    </button>
                  )
                })}
              </div>
              <Button onClick={handleExport} className="w-full mt-3 bg-[#7c3aed] hover:bg-[#6d28d9]">Download {exportFormat.toUpperCase()}</Button>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={() => toast({ title: 'Deployment started' })} className="h-6 text-[11px] bg-[#7c3aed] hover:bg-[#6d28d9]"><Rocket size={12} className="mr-1" />Deploy</Button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Panel ──────────────────────────────────────────────── */}
        <div className="w-[260px] border-r border-[#1a1a2e] bg-[#0a0a0f] flex flex-col shrink-0">
          <Tabs value={leftPanelTab} onValueChange={setLeftPanelTab} className="flex flex-col h-full">
            <TabsList className="w-full justify-start bg-[#1a1a2e] border-b border-[#2a2a3e] rounded-none h-8 p-0">
              <TabsTrigger value="layers" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><Layers size={12} className="mr-0.5" />Layers</TabsTrigger>
              <TabsTrigger value="components" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><Grid3X3 size={12} className="mr-0.5" />Add</TabsTrigger>
              <TabsTrigger value="pages" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><File size={12} className="mr-0.5" />Pages</TabsTrigger>
              <TabsTrigger value="tokens" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><Paintbrush size={12} className="mr-0.5" />Theme</TabsTrigger>
            </TabsList>

            {/* Layers tab */}
            <TabsContent value="layers" className="flex-1 overflow-y-auto mt-0 p-2">
              <div className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Page Structure</div>
              {elementTree ? renderTreeNode(elementTree, 0) : (
                <div className="text-[11px] text-zinc-500 text-center py-8">Click elements in preview</div>
              )}
            </TabsContent>

            {/* Components tab */}
            <TabsContent value="components" className="flex-1 overflow-y-auto mt-0 p-2">
              <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value.toLowerCase())} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] mb-2" />
              {filteredCategories.map(cat => (
                <div key={cat.id} className="mb-2">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1 w-full hover:text-zinc-300">
                      <ChevronRight size={10} className="transition-transform" />{cat.name}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="grid grid-cols-2 gap-1">
                        {cat.components.map(comp => (
                          <button key={comp.id} onClick={() => addComponent(comp.id)} className="flex flex-col items-start p-1.5 rounded bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#7c3aed] transition-colors text-[10px] group">
                            <span className="text-white font-medium group-hover:text-[#7c3aed]">{comp.name}</span>
                            <span className="text-zinc-500 text-[9px]">{comp.description}</span>
                          </button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
            </TabsContent>

            {/* Pages tab */}
            <TabsContent value="pages" className="flex-1 overflow-y-auto mt-0 p-2">
              <div className="text-[10px] text-zinc-500 mb-1 uppercase tracking-wider font-semibold">Pages</div>
              {generatedPages.length > 0 ? generatedPages.map(p => (
                <button key={p.id} onClick={() => switchPage(p.id)} className={`flex items-center gap-2 w-full p-2 rounded text-[11px] mb-1 transition-colors ${activePageIdRef.current === p.id ? 'bg-[#7c3aed]/10 text-white border border-[#7c3aed]/20' : 'bg-[#1a1a2e] text-zinc-400 hover:text-white border border-[#2a2a3e]'}`}>
                  <File size={12} />
                  <div className="flex-1">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-zinc-500 ml-1">{p.route}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500">{(p.html?.length || 0) / 1024}K</span>
                </button>
              )) : (
                <div className="text-[11px] text-zinc-500 text-center py-6">No pages yet. Generate a site first.</div>
              )}
            </TabsContent>

            {/* Design Tokens tab */}
            <TabsContent value="tokens" className="flex-1 overflow-y-auto mt-0 p-2">
              <div className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Design Tokens</div>
              {/* Theme presets */}
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Theme Presets</Label>
                <div className="grid grid-cols-3 gap-1">
                  {THEME_PRESETS.map(preset => (
                    <button key={preset.id} onClick={() => {
                      setDesignTokens(prev => ({ ...prev, ...preset.colors, fontFamily: preset.font }))
                      setTimeout(() => applyTheme(), 100)
                    }} className="flex flex-col items-center p-1.5 rounded border border-[#2a2a3e] hover:border-[#7c3aed] transition-colors">
                      <div className="flex gap-0.5 mb-0.5">
                        {[preset.colors.accent, preset.colors.bg, preset.colors.text].map(c => (
                          <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                        ))}
                      </div>
                      <span className="text-[9px] text-zinc-400">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Colors */}
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Colors</Label>
                {[
                  { key:'accent', label:'Accent' },
                  { key:'bg', label:'Background' },
                  { key:'surface', label:'Surface' },
                  { key:'text', label:'Text' },
                  { key:'muted', label:'Muted' },
                  { key:'border', label:'Border' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2 mb-1">
                    <Label className="text-[10px] text-zinc-400 w-16">{label}</Label>
                    <input type="color" value={designTokens[key as keyof typeof designTokens] as string} onChange={e => setDesignTokens(prev => ({ ...prev, [key]: e.target.value }))} className="w-5 h-5 rounded border border-[#2a2a3e] cursor-pointer bg-transparent" />
                    <Input value={designTokens[key as keyof typeof designTokens] as string} onChange={e => setDesignTokens(prev => ({ ...prev, [key]: e.target.value }))} className="h-5 text-[10px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" />
                  </div>
                ))}
              </div>
              {/* Font */}
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Font Family</Label>
                <Select value={designTokens.fontFamily} onValueChange={v => setDesignTokens(prev => ({ ...prev, fontFamily: v }))}>
                  <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    {['Inter','Geist','system-ui','Arial','Helvetica','Georgia','Playfair Display','Montserrat','Poppins','Roboto','Lora','Merriweather','Fira Code'].map(f => <SelectItem key={f} value={f} className="text-[11px] text-white">{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Scale sliders */}
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Border Radius Scale</Label>
                <Slider value={[designTokens.borderRadius]} onValueChange={v => setDesignTokens(prev => ({ ...prev, borderRadius: v[0] }))} min={0} max={24} step={1} className="mb-1" />
                <span className="text-[10px] text-zinc-500">{designTokens.borderRadius}px</span>
              </div>
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Spacing Scale</Label>
                <Slider value={[designTokens.spacingScale * 100]} onValueChange={v => setDesignTokens(prev => ({ ...prev, spacingScale: v[0] / 100 }))} min={50} max={200} step={10} className="mb-1" />
                <span className="text-[10px] text-zinc-500">{Math.round(designTokens.spacingScale * 100)}%</span>
              </div>
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Shadow Scale</Label>
                <Slider value={[designTokens.shadowScale * 100]} onValueChange={v => setDesignTokens(prev => ({ ...prev, shadowScale: v[0] / 100 }))} min={0} max={200} step={10} className="mb-1" />
                <span className="text-[10px] text-zinc-500">{Math.round(designTokens.shadowScale * 100)}%</span>
              </div>
              {/* Preview strip */}
              <div className="mb-3 p-2 rounded-lg border border-[#2a2a3e]" style={{ background: designTokens.bg }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded" style={{ background: designTokens.accent }} />
                  <span style={{ color: designTokens.text, fontFamily: designTokens.fontFamily, fontSize: '14px' }}>Preview Text</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded text-[10px]" style={{ background: designTokens.accent, color: '#fff' }}>Button</button>
                  <span style={{ color: designTokens.muted, fontFamily: designTokens.fontFamily, fontSize: '10px' }}>Muted text</span>
                </div>
                <div className="mt-1 p-1 rounded" style={{ background: designTokens.surface, border: `1px solid ${designTokens.border}` }}>
                  <span style={{ color: designTokens.text, fontSize: '9px' }}>Surface</span>
                </div>
              </div>
              <Button onClick={applyTheme} className="w-full h-7 text-[11px] bg-[#7c3aed] hover:bg-[#6d28d9]">Apply Theme Globally</Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Center Preview ──────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col bg-[#0d0d15] overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto" style={{ background: showGrid ? 'repeating-linear-gradient(0deg,rgba(124,58,237,0.04) 0px,rgba(124,58,237,0.04) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,rgba(124,58,237,0.04) 0px,rgba(124,58,237,0.04) 1px,transparent 1px,transparent 20px)' : 'transparent' }}>
            <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
              style={{ width: deviceConfig.width * (zoom / 100), height: deviceConfig.height * (zoom / 100), maxWidth: '100%' }}>
              <iframe ref={iframeRef} srcDoc={iframeSrcDoc} className="w-full h-full border-0" title="Website Preview" sandbox="allow-scripts allow-same-origin" onLoad={() => requestTree()} />
            </div>
          </div>

          {/* Quick action toolbar for selected element */}
          <AnimatePresence>
            {selectedElement && !showCodePanel && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-1 justify-center p-1 border-t border-[#1a1a2e] bg-[#0a0a0f]">
                <Badge className="bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/30 text-[10px]">{selectedElement.tag}</Badge>
                <span className="text-[10px] text-zinc-500">{Math.round(selectedElement.rect.width)}×{Math.round(selectedElement.rect.height)}</span>
                <Separator orientation="vertical" className="h-4 bg-[#2a2a3e]" />
                <Tooltip><TooltipTrigger asChild><button onClick={() => moveElement('up')} className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white transition-colors"><MoveUp size={12} /></button></TooltipTrigger><TooltipContent>Move Up</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><button onClick={() => moveElement('down')} className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white transition-colors"><MoveDown size={12} /></button></TooltipTrigger><TooltipContent>Move Down</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><button onClick={duplicateElement} className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white transition-colors"><Copy size={12} /></button></TooltipTrigger><TooltipContent>Duplicate</TooltipContent></Tooltip>
                <Tooltip><TooltipTrigger asChild><button onClick={removeElement} className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={12} /></button></TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
                {selectedElement.tag === 'a' && (
                  <Separator orientation="vertical" className="h-4 bg-[#2a2a3e]" />
                )}
                {selectedElement.tag === 'a' && (
                  <Tooltip><TooltipTrigger asChild><button onClick={() => { const url = editingAttributes.href || '#'; applyAttribute('href', url === '#' ? 'https://' : url) }} className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white"><Link size={12} /></button></TooltipTrigger><TooltipContent>Edit Link</TooltipContent></Tooltip>
                )}
                {selectedElement.tag === 'img' && (
                  <Separator orientation="vertical" className="h-4 bg-[#2a2a3e]" />
                )}
                {selectedElement.tag === 'img' && (
                  <Tooltip><TooltipTrigger asChild><button className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white"><Image size={12} /></button></TooltipTrigger><TooltipContent>Change Image</TooltipContent></Tooltip>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Code Panel */}
          <AnimatePresence>
            {showCodePanel && (
              <motion.div initial={{ height: 0 }} animate={{ height: 200 }} exit={{ height: 0 }}
                className="border-t border-[#1a1a2e] bg-[#0a0a0f] overflow-hidden shrink-0">
                <div className="flex items-center justify-between px-3 py-1 border-b border-[#1a1a2e]">
                  <span className="text-[10px] text-zinc-400 font-semibold">Source Code</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={applyCodeChanges} className="h-5 text-[10px] border-[#2a2a3e] bg-[#1a1a2e] text-white">Apply</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowCodePanel(false)} className="h-5 text-[10px] border-[#2a2a3e] bg-[#1a1a2e] text-white">Close</Button>
                  </div>
                </div>
                <textarea value={codeContent} onChange={e => setCodeContent(e.target.value)} className="w-full h-[calc(200px-28px)] bg-[#0d0d15] text-zinc-300 p-3 text-[11px] font-mono resize-none outline-none" spellCheck={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Inspector Panel ───────────────────────────────────── */}
        <div className="w-[280px] border-l border-[#1a1a2e] bg-[#0a0a0f] flex flex-col shrink-0">
          {!selectedElement ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <MousePointer2 size={28} className="text-zinc-500 mb-2" />
              <p className="text-xs text-zinc-400 font-medium">Select an element</p>
              <p className="text-[10px] text-zinc-500 mt-1">Click any element to edit properties</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Element header */}
              <div className="px-2 py-1.5 border-b border-[#1a1a2e] bg-[#1a1a2e]/50 shrink-0">
                <div className="flex items-center gap-1">
                  <Badge className="bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/30 text-[10px]">{selectedElement.tag}</Badge>
                  <span className="text-[10px] text-zinc-400 truncate">{selectedElement.className || selectedElement.id}</span>
                  <div className="flex gap-0.5 ml-auto">
                    <button onClick={removeElement} className="p-0.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400"><Trash2 size={12} /></button>
                    <button onClick={duplicateElement} className="p-0.5 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white"><Copy size={12} /></button>
                  </div>
                </div>
                <div className="text-[9px] text-zinc-600 mt-0.5">{Math.round(selectedElement.rect.width)}×{Math.round(selectedElement.rect.height)}px</div>
              </div>

              {/* Inspector tabs */}
              <Tabs value={inspectorTab} onValueChange={setInspectorTab} className="flex flex-col flex-1 overflow-hidden">
                <TabsList className="w-full bg-[#1a1a2e] border-b border-[#2a2a3e] rounded-none h-7 p-0 shrink-0">
                  <TabsTrigger value="content" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Edit3 size={10} className="mr-0.5" />Content</TabsTrigger>
                  <TabsTrigger value="style" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Palette size={10} className="mr-0.5" />Style</TabsTrigger>
                  <TabsTrigger value="layout" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Layout size={10} className="mr-0.5" />Layout</TabsTrigger>
                  <TabsTrigger value="animation" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Sparkles size={10} className="mr-0.5" />Animate</TabsTrigger>
                  <TabsTrigger value="seo" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Globe size={10} className="mr-0.5" />SEO</TabsTrigger>
                </TabsList>

                {/* Content tab */}
                <TabsContent value="content" className="flex-1 overflow-y-auto mt-0 p-2">
                  <div className="mb-2">
                    <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">Text Content</Label>
                    <textarea value={editingContent} onChange={e => setEditingContent(e.target.value)} onBlur={() => applyContent(editingContent)} className="w-full h-24 bg-[#0d0d15] border border-[#2a2a3e] rounded text-[11px] text-white p-2 resize-y font-mono" placeholder="Edit content..." />
                  </div>
                  {/* Tag-specific attribute editors */}
                  {selectedElement.tag === 'img' && (
                    <div className="mb-2">
                      <Label className="text-[10px] text-zinc-400">Image Source</Label>
                      <Input value={editingAttributes.src || ''} onChange={e => applyAttribute('src', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                      <Label className="text-[10px] text-zinc-400 mt-1">Alt Text</Label>
                      <Input value={editingAttributes.alt || ''} onChange={e => applyAttribute('alt', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                    </div>
                  )}
                  {selectedElement.tag === 'a' && (
                    <div className="mb-2">
                      <Label className="text-[10px] text-zinc-400">Link URL</Label>
                      <Input value={editingAttributes.href || ''} onChange={e => applyAttribute('href', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                      <Label className="text-[10px] text-zinc-400 mt-1">Target</Label>
                      <Select value={editingAttributes.target || '_self'} onValueChange={v => applyAttribute('target', v)}>
                        <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]"><SelectItem value="_self" className="text-[11px]">Same Tab</SelectItem><SelectItem value="_blank" className="text-[11px]">New Tab</SelectItem></SelectContent>
                      </Select>
                    </div>
                  )}
                  {(selectedElement.tag === 'input' || selectedElement.tag === 'textarea') && (
                    <div className="mb-2">
                      <Label className="text-[10px] text-zinc-400">Type</Label>
                      <Select value={editingAttributes.type || 'text'} onValueChange={v => applyAttribute('type', v)}>
                        <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">{['text','email','password','number','tel','url','search','date','submit','button'].map(t => <SelectItem key={t} value={t} className="text-[11px]">{t}</SelectItem>)}</SelectContent>
                      </Select>
                      <Label className="text-[10px] text-zinc-400 mt-1">Placeholder</Label>
                      <Input value={editingAttributes.placeholder || ''} onChange={e => applyAttribute('placeholder', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                    </div>
                  )}
                  {selectedElement.tag === 'button' && (
                    <div className="mb-2">
                      <Label className="text-[10px] text-zinc-400">Button Type</Label>
                      <Select value={editingAttributes.type || 'button'} onValueChange={v => applyAttribute('type', v)}>
                        <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]"><SelectItem value="button" className="text-[11px]">Button</SelectItem><SelectItem value="submit" className="text-[11px]">Submit</SelectItem></SelectContent>
                      </Select>
                    </div>
                  )}
                  {/* All attributes */}
                  <div className="mb-2">
                    <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">All Attributes</Label>
                    {Object.entries(editingAttributes).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-1 mb-1">
                        <Label className="text-[10px] text-zinc-400 w-16">{key}</Label>
                        <Input value={val} onChange={e => applyAttribute(key, e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Style tab */}
                <TabsContent value="style" className="flex-1 overflow-y-auto mt-0">
                  {/* Box model diagram */}
                  <div className="p-2 border-b border-[#1a1a2e]">
                    <BoxModelDiagram />
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {CSS_PROPERTY_GROUPS.filter(g => ['Colors','Typography','Spacing','Background','Border','Effects','Filters','SVG'].includes(g.name)).map(group => {
                        const isCollapsed = collapsedGroups.has(group.name)
                        return (
                          <Collapsible key={group.name} open={!isCollapsed} onOpenChange={(open) => setCollapsedGroups(prev => { const n = new Set(prev); if (open) n.delete(group.name); else n.add(group.name); return n })}>
                            <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold uppercase tracking-wider mb-1 w-full hover:text-[#7c3aed]">
                              <ChevronRight size={10} className={`transition-transform ${!isCollapsed ? 'rotate-90' : ''}`} />
                              {group.name}
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="space-y-0.5 pl-1">
                                {group.properties.map(prop => renderPropertyEditor(prop, selectedStyles))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Layout tab */}
                <TabsContent value="layout" className="flex-1 overflow-y-auto mt-0">
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {CSS_PROPERTY_GROUPS.filter(g => ['Layout','Table','List'].includes(g.name)).map(group => {
                        const isCollapsed = collapsedGroups.has(group.name)
                        return (
                          <Collapsible key={group.name} open={!isCollapsed} onOpenChange={(open) => setCollapsedGroups(prev => { const n = new Set(prev); if (open) n.delete(group.name); else n.add(group.name); return n })}>
                            <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold uppercase tracking-wider mb-1 w-full hover:text-[#7c3aed]">
                              <ChevronRight size={10} className={`transition-transform ${!isCollapsed ? 'rotate-90' : ''}`} />
                              {group.name}
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="space-y-0.5 pl-1">
                                {group.properties.map(prop => renderPropertyEditor(prop, selectedStyles))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      })}
                      {/* Responsive section */}
                      <div className="mt-3 p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15]">
                        <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">Responsive Preview</Label>
                        <div className="flex gap-1">
                          {DEVICE_CONFIGS.slice(0, 3).map(d => (
                            <button key={d.name} onClick={() => setDevice(d.name)} className={`flex-1 py-1 rounded text-[10px] transition-colors ${device === d.name ? 'bg-[#7c3aed] text-white' : 'bg-[#1a1a2e] text-zinc-400 hover:text-white'}`}>
                              {d.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Animation tab */}
                <TabsContent value="animation" className="flex-1 overflow-y-auto mt-0">
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {/* Animation presets grid */}
                      <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">Animation Presets</Label>
                      <div className="grid grid-cols-3 gap-1 mb-3">
                        {ANIMATION_PRESETS.map(preset => (
                          <button key={preset.id} onClick={() => applyAnimationPreset(preset)} className="flex flex-col items-center p-1.5 rounded bg-[#0d0d15] border border-[#2a2a3e] hover:border-[#7c3aed] transition-colors text-[10px] group">
                            <Sparkles size={12} className="text-zinc-400 group-hover:text-[#7c3aed] mb-0.5" />
                            <span className="text-zinc-300 group-hover:text-white">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                      {/* Animation CSS properties */}
                      {CSS_PROPERTY_GROUPS.filter(g => ['Transforms','Transition','Animation'].includes(g.name)).map(group => {
                        const isCollapsed = collapsedGroups.has(group.name)
                        return (
                          <Collapsible key={group.name} open={!isCollapsed} onOpenChange={(open) => setCollapsedGroups(prev => { const n = new Set(prev); if (open) n.delete(group.name); else n.add(group.name); return n })}>
                            <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold uppercase tracking-wider mb-1 w-full hover:text-[#7c3aed]">
                              <ChevronRight size={10} className={`transition-transform ${!isCollapsed ? 'rotate-90' : ''}`} />
                              {group.name}
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="space-y-0.5 pl-1">
                                {group.properties.map(prop => renderPropertyEditor(prop, selectedStyles))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* SEO tab */}
                <TabsContent value="seo" className="flex-1 overflow-y-auto mt-0 p-2">
                  <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">SEO & Meta</Label>
                  {/* Show meta tag editing */}
                  {selectedElement.tag === 'title' && (
                    <div className="mb-2">
                      <Label className="text-[10px] text-zinc-400">Page Title</Label>
                      <Input value={selectedElement.textContent || ''} onChange={e => applyContent(e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                    </div>
                  )}
                  {selectedElement.tag === 'meta' && (
                    <div className="mb-2">
                      <Label className="text-[10px] text-zinc-400">Meta Name</Label>
                      <Input value={editingAttributes.name || ''} onChange={e => applyAttribute('name', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                      <Label className="text-[10px] text-zinc-400 mt-1">Meta Content</Label>
                      <Input value={editingAttributes.content || ''} onChange={e => applyAttribute('content', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                    </div>
                  )}
                  {selectedElement.tag === 'h1' || selectedElement.tag === 'h2' || selectedElement.tag === 'h3' ? (
                    <div className="p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15] mb-2">
                      <div className="text-[10px] text-zinc-400 mb-1">Heading SEO Weight</div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">H{selectedElement.tag[1]}</Badge>
                        <span className="text-[10px] text-zinc-500">High SEO importance</span>
                      </div>
                    </div>
                  ) : null}
                  {/* Alt text for images */}
                  {selectedElement.tag === 'img' && (
                    <div className="p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15] mb-2">
                      <div className="text-[10px] text-zinc-400 mb-1">Image SEO</div>
                      <Label className="text-[10px] text-zinc-400">Alt Text (Accessibility)</Label>
                      <Input value={editingAttributes.alt || ''} onChange={e => applyAttribute('alt', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                      <div className="mt-1">
                        <Switch checked={editingAttributes.alt?.length > 0} onCheckedChange={v => { if (!v) applyAttribute('alt', '') }} />
                        <span className="text-[10px] text-zinc-500 ml-1">Has alt text</span>
                      </div>
                    </div>
                  )}
                  {/* Link SEO */}
                  {selectedElement.tag === 'a' && (
                    <div className="p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15] mb-2">
                      <div className="text-[10px] text-zinc-400 mb-1">Link SEO</div>
                      <Label className="text-[10px] text-zinc-400">URL</Label>
                      <Input value={editingAttributes.href || ''} onChange={e => applyAttribute('href', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                      <Label className="text-[10px] text-zinc-400 mt-1">Rel Attribute</Label>
                      <Input value={editingAttributes.rel || ''} onChange={e => applyAttribute('rel', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" placeholder="noopener noreferrer" />
                    </div>
                  )}
                  {/* General SEO info */}
                  <div className="p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15]">
                    <div className="text-[10px] text-zinc-400 mb-1">Element Info</div>
                    <div className="space-y-0.5 text-[10px]">
                      <div className="flex justify-between"><span className="text-zinc-500">Tag</span><span className="text-zinc-300">{selectedElement.tag}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Classes</span><span className="text-zinc-300 truncate max-w-32">{selectedElement.className || 'None'}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Children</span><span className="text-zinc-300">{selectedElement.childIds.length}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Parent</span><span className="text-zinc-300">{selectedElement.parentId || 'body'}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">Size</span><span className="text-zinc-300">{Math.round(selectedElement.rect.width)}×{Math.round(selectedElement.rect.height)}px</span></div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
