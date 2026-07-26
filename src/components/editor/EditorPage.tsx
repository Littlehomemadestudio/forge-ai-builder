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
  PanelLeft, PanelRight, PanelBottom, PanelTop, Columns2, LayoutDashboard,
  LayoutGrid, LayoutList, Grid2X2, ZoomIn, ZoomOut, PenTool,
  Strikethrough, List, ListOrdered, Lock, Unlock, Group, Ungroup,
  MoveUp, MoveDown, Paintbrush, FontFamily, LetterSpacing,
  LineHeight, RotateCw, Scale, Sliders, Accessibility,
  FileText, Webhook, BarChart3, GitBranch, Megaphone,
  Table, File, FolderOpen, Star, Heart, Bookmark, Share2,
  Crop, Pipette, Eraser, Brush, Navigation
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useTranslation } from '@/lib/useTranslation'

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
    // Remove any existing forge overlays first (prevent duplicates)
    document.querySelectorAll('#forge-hover-overlay,#forge-selection-box,#forge-label,#forge-grid,.forge-resize-handle').forEach(el => el.remove());

    overlayEl = document.createElement('div');
    overlayEl.id = 'forge-hover-overlay';
    overlayEl.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;display:none;';
    document.body.appendChild(overlayEl);

    selectionBox = document.createElement('div');
    selectionBox.id = 'forge-selection-box';
    selectionBox.style.cssText = 'position:absolute;z-index:9999;pointer-events:none;display:none;';
    document.body.appendChild(selectionBox);

    labelEl = document.createElement('div');
    labelEl.id = 'forge-label';
    labelEl.style.cssText = 'position:absolute;z-index:10000;pointer-events:none;font-size:11px;font-family:Inter,system-ui,sans-serif;background:#7c3aed;color:#fff;padding:2px 8px;border-radius:4px;white-space:nowrap;display:none;';
    document.body.appendChild(labelEl);

    // Create resize handles
    for (let i = 0; i < 8; i++) {
      const handle = document.createElement('div');
      handle.className = 'forge-resize-handle';
      handle.style.cssText = 'position:absolute;z-index:10001;width:8px;height:8px;background:#7c3aed;border:1px solid #fff;border-radius:2px;cursor:' + ['nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize','w-resize'][i] + ';';
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
    // Use document-relative coordinates (rect is viewport-relative, add scroll offset)
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const positions = [
      { x: rect.left + scrollX - 4, y: rect.top + scrollY - 4 },
      { x: rect.left + scrollX + rect.width/2 - 4, y: rect.top + scrollY - 4 },
      { x: rect.left + scrollX + rect.width - 4, y: rect.top + scrollY - 4 },
      { x: rect.left + scrollX + rect.width - 4, y: rect.top + scrollY + rect.height/2 - 4 },
      { x: rect.left + scrollX + rect.width - 4, y: rect.top + scrollY + rect.height - 4 },
      { x: rect.left + scrollX + rect.width/2 - 4, y: rect.top + scrollY + rect.height - 4 },
      { x: rect.left + scrollX - 4, y: rect.top + scrollY + rect.height - 4 },
      { x: rect.left + scrollX - 4, y: rect.top + scrollY + rect.height/2 - 4 },
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
    // Use document-relative coordinates for position:absolute overlays
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    overlayEl.style.top = (rect.top + scrollY) + 'px';
    overlayEl.style.left = (rect.left + scrollX) + 'px';
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

  // Friendly names for the iframe overlay labels
  const FRIENDLY_TAG_NAMES = {
    nav:'Navigation Menu', header:'Header', footer:'Footer', section:'Section',
    main:'Main Content', article:'Article', aside:'Sidebar',
    h1:'Main Heading', h2:'Sub Heading', h3:'Small Heading', h4:'Heading 4', h5:'Heading 5', h6:'Heading 6',
    p:'Paragraph', span:'Text', a:'Link', button:'Button', img:'Image',
    div:'Container', ul:'Bullet List', ol:'Numbered List', li:'List Item',
    input:'Input Field', textarea:'Text Box', form:'Form', label:'Label',
    table:'Table', tr:'Row', td:'Cell', th:'Header Cell',
    video:'Video', iframe:'Embed', svg:'Graphic',
    style:'Styles', meta:'Meta', title:'Page Title', script:'Script',
    html:'Page', head:'Head', body:'Body'
  };

  function getFriendlyName(tag) {
    return FRIENDLY_TAG_NAMES[tag] || tag.toUpperCase();
  }

  function showSelection(id) {
    const el = document.querySelector('[data-fid="' + id + '"]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Use document-relative coordinates for position:absolute overlays
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    selectionBox.style.top = (rect.top + scrollY - 2) + 'px';
    selectionBox.style.left = (rect.left + scrollX - 2) + 'px';
    selectionBox.style.width = (rect.width + 4) + 'px';
    selectionBox.style.height = (rect.height + 4) + 'px';
    selectionBox.style.border = '2px solid #7c3aed';
    selectionBox.style.borderRadius = getComputedStyle(el).borderRadius;
    selectionBox.style.display = 'block';
    updateResizeHandles(rect);

    const tagName = el.tagName.toLowerCase();
    labelEl.textContent = getFriendlyName(tagName);
    labelEl.style.top = (rect.top + scrollY - 24) + 'px';
    labelEl.style.left = (rect.left + scrollX) + 'px';
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
    hideHover();
    hideSelection(); // Always clear previous selection before showing new one
    const fid = el.getAttribute('data-fid');
    if (fid) {
      showSelection(fid);
      sendElementInfo(el);
    } else {
      window.parent.postMessage({ type: 'element-deselected', data: null }, '*');
    }
  }, true);

  // Overlays now use position:absolute with document-relative coordinates,
  // so they scroll naturally with the content. No need to update on scroll.
  // We still handle resize events to reposition overlays.
  function updateOverlayPositionsOnResize() {
    if (selectedId) {
      const el = document.querySelector('[data-fid="' + selectedId + '"]');
      if (el) {
        showSelection(selectedId);
      } else {
        hideSelection();
      }
    }
    if (hoveredId) {
      const el = document.querySelector('[data-fid="' + hoveredId + '"]');
      if (el) {
        showHover(hoveredId);
      } else {
        hideHover();
      }
    }
  }
  window.addEventListener('resize', updateOverlayPositionsOnResize);

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

// ─── Human-readable element names (for non-HTML users) ──────────────────────
const TAG_INFO: Record<string, { name: string; desc: string; icon: string }> = {
  'nav':     { name: 'Navigation Menu', desc: 'The top menu bar with links', icon: 'Navigation' },
  'header':  { name: 'Header',          desc: 'Top section of the page', icon: 'PanelTop' },
  'footer':  { name: 'Footer',          desc: 'Bottom section with links & info', icon: 'PanelBottom' },
  'section': { name: 'Section',         desc: 'A distinct content area', icon: 'Layout' },
  'main':    { name: 'Main Content',    desc: 'The main body of the page', icon: 'LayoutDashboard' },
  'article': { name: 'Article',         desc: 'A self-contained content block', icon: 'FileText' },
  'aside':   { name: 'Sidebar',         desc: 'Side content area', icon: 'PanelLeft' },
  'h1':      { name: 'Main Heading',    desc: 'Biggest title — use only once per page!', icon: 'Type' },
  'h2':      { name: 'Sub Heading',     desc: 'Secondary title', icon: 'Type' },
  'h3':      { name: 'Small Heading',   desc: 'Third-level title', icon: 'Type' },
  'h4':      { name: 'Heading 4',       desc: 'Fourth-level title', icon: 'Type' },
  'h5':      { name: 'Heading 5',       desc: 'Fifth-level title', icon: 'Type' },
  'h6':      { name: 'Heading 6',       desc: 'Smallest heading', icon: 'Type' },
  'p':       { name: 'Paragraph',       desc: 'A block of text', icon: 'FileText' },
  'span':    { name: 'Inline Text',     desc: 'Small text inside other elements', icon: 'Type' },
  'a':       { name: 'Link',            desc: 'Clickable link to another page', icon: 'Link' },
  'button':  { name: 'Button',          desc: 'Clickable action button', icon: 'MousePointer2' },
  'img':     { name: 'Image',           desc: 'A picture or graphic', icon: 'Image' },
  'div':     { name: 'Container',       desc: 'A box that holds other elements', icon: 'Square' },
  'ul':      { name: 'Bullet List',     desc: 'List with bullet points', icon: 'List' },
  'ol':      { name: 'Numbered List',   desc: 'List with numbers (1, 2, 3...)', icon: 'ListOrdered' },
  'li':      { name: 'List Item',       desc: 'One item in a list', icon: 'List' },
  'input':   { name: 'Input Field',     desc: 'Where users can type text', icon: 'Edit3' },
  'textarea':{ name: 'Text Box',       desc: 'Large typing area for messages', icon: 'Edit3' },
  'form':    { name: 'Form',            desc: 'Collects user input', icon: 'Webhook' },
  'label':   { name: 'Label',           desc: 'Text label for an input', icon: 'Tag' },
  'table':   { name: 'Table',           desc: 'Data in rows and columns', icon: 'Table' },
  'tr':      { name: 'Table Row',       desc: 'One row in a table', icon: 'Columns2' },
  'td':      { name: 'Table Cell',      desc: 'One cell in a table', icon: 'Square' },
  'th':      { name: 'Header Cell',     desc: 'A table column title', icon: 'Type' },
  'video':   { name: 'Video',           desc: 'Embedded video player', icon: 'Play' },
  'iframe':  { name: 'Embed',           desc: 'Embedded external content', icon: 'Globe' },
  'svg':     { name: 'Graphic',         desc: 'Vector graphic/illustration', icon: 'Circle' },
  'style':   { name: 'Styles (hidden)', desc: 'CSS styling rules — usually hidden', icon: 'Palette' },
  'meta':    { name: 'Meta (hidden)',   desc: 'Page metadata — usually hidden', icon: 'Settings2' },
  'title':   { name: 'Page Title',      desc: 'The tab title shown in browser', icon: 'Type' },
  'script':  { name: 'Script (hidden)', desc: 'JavaScript code — usually hidden', icon: 'Code2' },
}

function getTagDisplayName(tag: string): string {
  return TAG_INFO[tag]?.name || tag.toUpperCase()
}

function getTagDescription(tag: string): string {
  return TAG_INFO[tag]?.desc || ''
}

function getTagIconName(tag: string): string {
  return TAG_INFO[tag]?.icon || 'Square'
}

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Navigation, PanelTop, PanelBottom, Layout, LayoutDashboard, FileText,
  PanelLeft, Type, Link, MousePointer2, Image, Square, List, ListOrdered,
  Edit3, Webhook, Table, Columns2, Globe, Circle, Palette, Settings2, Code2,
}

// ─── Friendly CSS group labels ────────────────────────────────────────────
const FRIENDLY_GROUP_NAMES: Record<string, { name: string; desc: string }> = {
  'Layout':     { name: 'Arrangement & Sizing', desc: 'How this element is positioned and sized on the page' },
  'Spacing':    { name: 'Inner & Outer Space',  desc: 'Space inside (padding) and outside (margin) this element' },
  'Typography': { name: 'Text Appearance',      desc: 'Font, size, and style of the text' },
  'Colors':     { name: 'Colors',               desc: 'Text color and background color' },
  'Background': { name: 'Background',           desc: 'Background image and effects' },
  'Border':     { name: 'Borders & Corners',    desc: 'Outline around the element and rounded corners' },
  'Effects':    { name: 'Effects & Visibility', desc: 'Shadow, transparency, cursor, and more' },
  'Filters':    { name: 'Visual Filters',       desc: 'Blur, brightness, color effects like Instagram' },
  'Transforms': { name: 'Shape & Position',     desc: 'Rotate, scale, move, and skew this element' },
  'Transition': { name: 'Smooth Transitions',   desc: 'Animate changes smoothly over time' },
  'Animation':  { name: 'Animations',           desc: 'Keyframe animations like bounce, fade, spin' },
  'Table':      { name: 'Table Settings',       desc: 'How table cells are arranged' },
  'List':       { name: 'List Style',           desc: 'How list items are displayed' },
  'SVG':        { name: 'SVG Colors',           desc: 'Fill and stroke colors for vector graphics' },
}

// ─── Friendly CSS property labels ─────────────────────────────────────────
const FRIENDLY_PROP_LABELS: Record<string, string> = {
  'display':          'Arrange As',
  'position':         'Position Mode',
  'top':              'Top Offset',
  'right':            'Right Offset',
  'bottom':           'Bottom Offset',
  'left':             'Left Offset',
  'z-index':          'Layer Order (stacking)',
  'width':            'Width',
  'height':           'Height',
  'min-width':        'Min Width',
  'min-height':       'Min Height',
  'max-width':        'Max Width',
  'max-height':       'Max Height',
  'overflow':         'Overflow Behavior',
  'overflow-x':       'Horizontal Overflow',
  'overflow-y':       'Vertical Overflow',
  'flex-direction':   'Direction (Row/Column)',
  'flex-wrap':        'Wrap Items',
  'justify-content':  'Horizontal Alignment',
  'align-items':      'Vertical Alignment',
  'align-self':       'This Item\'s Alignment',
  'gap':              'Gap Between Items',
  'row-gap':          'Vertical Gap',
  'column-gap':       'Horizontal Gap',
  'order':            'Display Order',
  'margin-top':       'Space Above',
  'margin-right':     'Space Right',
  'margin-bottom':    'Space Below',
  'margin-left':      'Space Left',
  'padding-top':      'Inner Space Above',
  'padding-right':    'Inner Space Right',
  'padding-bottom':   'Inner Space Below',
  'padding-left':     'Inner Space Left',
  'font-family':      'Font Style',
  'font-size':        'Text Size',
  'font-weight':      'Text Thickness',
  'font-style':       'Text Style',
  'line-height':      'Line Spacing',
  'letter-spacing':   'Letter Spacing',
  'word-spacing':     'Word Spacing',
  'text-align':       'Text Alignment',
  'text-decoration':  'Text Decoration',
  'text-transform':   'Text Capitalization',
  'color':            'Text Color',
  'background-color': 'Fill Color',
  'background-image': 'Background Image',
  'background-size':  'Image Fit',
  'background-position': 'Image Position',
  'background-repeat': 'Image Repeat',
  'border-top-width':    'Top Line Width',
  'border-right-width':  'Right Line Width',
  'border-bottom-width': 'Bottom Line Width',
  'border-left-width':   'Left Line Width',
  'border-top-style':    'Top Line Style',
  'border-right-style':  'Right Line Style',
  'border-bottom-style': 'Bottom Line Style',
  'border-left-style':   'Left Line Style',
  'border-top-color':    'Top Line Color',
  'border-right-color':  'Right Line Color',
  'border-bottom-color': 'Bottom Line Color',
  'border-left-color':   'Left Line Color',
  'border-top-left-radius':     'Top Left Corner Roundness',
  'border-top-right-radius':    'Top Right Corner Roundness',
  'border-bottom-right-radius': 'Bottom Right Corner Roundness',
  'border-bottom-left-radius':  'Bottom Left Corner Roundness',
  'border':           'Border',
  'border-radius':    'Rounded Corners',
  'outline':          'Outline',
  'outline-width':    'Outline Width',
  'outline-style':    'Outline Style',
  'outline-color':    'Outline Color',
  'box-shadow':       'Shadow',
  'text-shadow':      'Text Shadow',
  'opacity':          'Transparency',
  'cursor':           'Mouse Cursor',
  'visibility':       'Visibility',
  'float':            'Float Side',
  'clear':            'Clear Float',
  'transform':        'Shape Transform',
  'transform-origin': 'Transform Origin Point',
  'filter':           'Visual Filter',
  'backdrop-filter':  'Background Filter',
  'transition':       'Smooth Change',
  'animation':        'Animation',
  'object-fit':       'Image Fit Mode',
  'object-position':  'Image Position',
  'white-space':      'Whitespace Handling',
  'word-break':       'Word Breaking',
  'pointer-events':   'Click Interaction',
  'user-select':      'Text Selection',
  'mix-blend-mode':   'Color Blend Mode',
  'list-style-type':  'Bullet Style',
  'list-style-position': 'Bullet Position',
  'table-layout':     'Table Sizing',
  'border-collapse':  'Border Merge Mode',
  'fill':             'SVG Fill Color',
  'stroke':           'SVG Stroke Color',
  'stroke-width':     'SVG Stroke Width',
  'flex-grow':        'Grow to Fill Space',
  'flex-shrink':      'Shrink if Needed',
  'flex-basis':       'Starting Size',
  'grid-template-columns': 'Column Layout',
  'grid-template-rows': 'Row Layout',
  'grid-column':      'Column Position',
  'grid-row':         'Row Position',
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
      case 'element-deselected': {
        setSelectedElement(null)
        setSelectedStyles({})
        setEditingContent('')
        setEditingAttributes({})
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

  // ─── Render CSS Property Editor (with friendly labels) ────────────────────
  const renderPropertyEditor = (prop: CSSProperty, styles: Record<string, string>) => {
    const currentValue = styles[prop.name] || prop.default || ''
    const friendlyLabel = FRIENDLY_PROP_LABELS[prop.name] || prop.label

    switch (prop.type) {
      case 'text':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Tooltip>
              <TooltipTrigger asChild><Label className="text-[10px] text-zinc-400 w-24 shrink-0 cursor-help">{friendlyLabel}</Label></TooltipTrigger>
              <TooltipContent side="right" className="text-[11px] max-w-64">CSS property: {prop.name}. {prop.unit ? `Unit: ${prop.unit}` : ''}</TooltipContent>
            </Tooltip>
            <Input value={currentValue} onChange={e => applyStyle(prop.name, e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" placeholder={prop.default} />
            {prop.unit && <span className="text-[10px] text-zinc-500">{prop.unit}</span>}
          </div>
        )
      case 'number':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Tooltip>
              <TooltipTrigger asChild><Label className="text-[10px] text-zinc-400 w-24 shrink-0 cursor-help">{friendlyLabel}</Label></TooltipTrigger>
              <TooltipContent side="right" className="text-[11px] max-w-64">CSS: {prop.name}</TooltipContent>
            </Tooltip>
            <Input type="number" value={parseFloat(currentValue) || 0} onChange={e => applyStyle(prop.name, e.target.value + (prop.unit || 'px'))} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" min={prop.min} max={prop.max} step={prop.step} />
            {prop.unit && <span className="text-[10px] text-zinc-500">{prop.unit}</span>}
          </div>
        )
      case 'select':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Tooltip>
              <TooltipTrigger asChild><Label className="text-[10px] text-zinc-400 w-24 shrink-0 cursor-help">{friendlyLabel}</Label></TooltipTrigger>
              <TooltipContent side="right" className="text-[11px] max-w-64">CSS: {prop.name}</TooltipContent>
            </Tooltip>
            <Select value={currentValue} onValueChange={v => applyStyle(prop.name, v)}>
              <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e] max-h-60">{prop.options?.map(opt => <SelectItem key={opt} value={opt} className="text-[11px] text-white">{opt}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )
      case 'color':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Tooltip>
              <TooltipTrigger asChild><Label className="text-[10px] text-zinc-400 w-24 shrink-0 cursor-help">{friendlyLabel}</Label></TooltipTrigger>
              <TooltipContent side="right" className="text-[11px] max-w-64">CSS: {prop.name}</TooltipContent>
            </Tooltip>
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
              <Tooltip>
                <TooltipTrigger asChild><Label className="text-[10px] text-zinc-400 w-24 shrink-0 cursor-help">{friendlyLabel}</Label></TooltipTrigger>
                <TooltipContent side="right" className="text-[11px] max-w-64">CSS: {prop.name}</TooltipContent>
              </Tooltip>
              <Input value={parseFloat(currentValue) || parseFloat(prop.default || '0')} onChange={e => applyStyle(prop.name, e.target.value + (prop.unit || ''))} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white w-20" />
              {prop.unit && <span className="text-[10px] text-zinc-500">{prop.unit}</span>}
            </div>
            <Slider value={[parseFloat(currentValue) || parseFloat(prop.default || '0')]} onValueChange={v => applyStyle(prop.name, v[0] + (prop.unit || ''))} min={prop.min || 0} max={prop.max || 100} step={prop.step || 1} className="mt-1" />
          </div>
        )
      case 'toggle':
        return (
          <div key={prop.name} className="flex items-center gap-2 mb-1.5">
            <Tooltip>
              <TooltipTrigger asChild><Label className="text-[10px] text-zinc-400 w-24 shrink-0 cursor-help">{friendlyLabel}</Label></TooltipTrigger>
              <TooltipContent side="right" className="text-[11px] max-w-64">CSS: {prop.name}</TooltipContent>
            </Tooltip>
            <Switch checked={currentValue === 'true' || currentValue === 'visible' || currentValue === 'auto'} onCheckedChange={v => applyStyle(prop.name, v ? (prop.options?.[0] || 'true') : (prop.options?.[1] || 'none'))} />
          </div>
        )
      case 'composite':
        return (
          <div key={prop.name} className="mb-2">
            <Label className="text-[10px] text-zinc-300 mb-1 block font-semibold">{FRIENDLY_PROP_LABELS[prop.name] || prop.label}</Label>
            <div className="pl-2 border-l-2 border-[#7c3aed]/30">
              {prop.subProperties?.map(sub => renderPropertyEditor(sub, styles))}
            </div>
          </div>
        )
      default: return null
    }
  }

  // ─── Render Element Tree (user-friendly with human-readable names) ──────────
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedTreeNodes.has(node.id)
    const isSelected = selectedElement?.id === node.id
    const hasChildren = node.children && node.children.length > 0
    const displayName = getTagDisplayName(node.tag)
    const tagDesc = getTagDescription(node.tag)
    const iconName = getTagIconName(node.tag)
    const IconComponent = ICON_MAP[iconName]

    return (
      <div key={node.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1.5 px-1 py-0.5 cursor-pointer rounded text-[11px] transition-colors group ${isSelected ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-zinc-400 hover:bg-[#1a1a2e] hover:text-white'}`}
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
              {IconComponent && <IconComponent size={10} className={isSelected ? 'text-[#7c3aed]' : 'text-zinc-500'} />}
              <span className={`font-medium ${isSelected ? 'text-[#7c3aed]' : 'text-zinc-200'}`}>{displayName}</span>
              {node.textContent && node.children.length === 0 && <span className="text-zinc-600 truncate max-w-24 ml-1 text-[10px]">"{node.textContent.substring(0, 15)}"</span>}
              {isSelected && (
                <div className="flex gap-0.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); moveElement('up') }} className="text-zinc-400 hover:text-white p-0.5"><MoveUp size={10} /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveElement('down') }} className="text-zinc-400 hover:text-white p-0.5"><MoveDown size={10} /></button>
                  <button onClick={(e) => { e.stopPropagation(); duplicateElement() }} className="text-zinc-400 hover:text-white p-0.5"><Copy size={10} /></button>
                  <button onClick={(e) => { e.stopPropagation(); removeElement() }} className="text-red-400 hover:text-red-300 p-0.5"><Trash2 size={10} /></button>
                </div>
              )}
            </div>
          </TooltipTrigger>
          {tagDesc && <TooltipContent side="right" className="text-[11px] max-w-48"><span className="text-zinc-300">{displayName}</span> — <span className="text-zinc-500">{tagDesc}</span></TooltipContent>}
        </Tooltip>
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
          <span className="absolute top-1 left-2 text-[8px] text-orange-400/60">Outer Space</span>
        </div>
        {/* Border - yellow */}
        <div className="absolute bg-yellow-500/15 border border-yellow-500/30 rounded"
          style={{ top: `${Math.max(12, mT/3)}px`, left: `${Math.max(12, mL/3)}px`, right: `${Math.max(12, mR/3)}px`, bottom: `${Math.max(12, mB/3)}px` }}>
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-yellow-400">{bT}</span>
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-yellow-400">{bB}</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-yellow-400">{bL}</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-yellow-400">{bR}</span>
          <span className="absolute top-1 left-2 text-[8px] text-yellow-400/60">Border Line</span>
        </div>
        {/* Padding - green */}
        <div className="absolute bg-emerald-500/15 border border-emerald-500/30 rounded"
          style={{ top: `${Math.max(20, (mT+bT)/3)}px`, left: `${Math.max(20, (mL+bL)/3)}px`, right: `${Math.max(20, (mR+bR)/3)}px`, bottom: `${Math.max(20, (mB+bB)/3)}px` }}>
          <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400">{pT}</span>
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400">{pB}</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-emerald-400">{pL}</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-emerald-400">{pR}</span>
          <span className="absolute top-1 left-2 text-[8px] text-emerald-400/60">Inner Space</span>
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
  const t = useTranslation()
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* ── Top Toolbar ──────────────────────────────────────────────── */}
      <div className="h-11 flex items-center justify-between px-3 border-b border-[#1a1a2e] bg-[#0a0a0f] shrink-0">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('dashboard')} className="text-zinc-500 hover:text-white transition-colors" title={t('common.back')}><ArrowLeft size={16} /></button>
          <span className="font-bold text-[#7c3aed] text-sm">Forge</span>
          <Separator orientation="vertical" className="h-5 bg-[#2a2a3e]" />
          <span className="text-xs text-zinc-400 truncate max-w-28">{generatedSiteName || t('editor.untitled')}</span>
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
          <Button size="sm" onClick={() => toast({ title: t('editor.deploymentStarted') })} className="h-6 text-[11px] bg-[#7c3aed] hover:bg-[#6d28d9]"><Rocket size={12} className="mr-1 rtl:ml-1 rtl:mr-0" />{t('editor.deploy')}</Button>
          <LanguageSwitcher variant="pill" compact />
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Panel ──────────────────────────────────────────────── */}
        <div className="w-[260px] border-r border-[#1a1a2e] bg-[#0a0a0f] flex flex-col shrink-0">
          <Tabs value={leftPanelTab} onValueChange={setLeftPanelTab} className="flex flex-col h-full">
            <TabsList className="w-full justify-start bg-[#1a1a2e] border-b border-[#2a2a3e] rounded-none h-8 p-0">
              <TabsTrigger value="layers" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><Layers size={12} className="mr-0.5" />Structure</TabsTrigger>
              <TabsTrigger value="components" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><Grid3X3 size={12} className="mr-0.5" />Add Elements</TabsTrigger>
              <TabsTrigger value="pages" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><File size={12} className="mr-0.5" />Pages</TabsTrigger>
              <TabsTrigger value="tokens" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-2 py-1.5 rounded-none"><Paintbrush size={12} className="mr-0.5" />Designs</TabsTrigger>
            </TabsList>

            {/* Layers tab */}
            <TabsContent value="layers" className="flex-1 overflow-y-auto mt-0 p-2">
              <div className="text-[10px] text-zinc-300 mb-1 uppercase tracking-wider font-semibold">Page Structure</div>
              <div className="text-[9px] text-zinc-500 mb-2">This shows all the sections and parts that make up your page. Click anything here or in the preview to start editing it.</div>
              {elementTree ? renderTreeNode(elementTree, 0) : (
                <div className="text-[11px] text-zinc-500 text-center py-8">Click elements in preview</div>
              )}
            </TabsContent>

            {/* Components tab */}
            <TabsContent value="components" className="flex-1 overflow-y-auto mt-0 p-2">
              <div className="text-[9px] text-zinc-500 mb-2">Pick a building block below to add it to your page. It will be placed inside the currently selected section.</div>
              <Input placeholder="Search for elements..." value={searchQuery} onChange={e => setSearchQuery(e.target.value.toLowerCase())} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] mb-2" />
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
              <div className="text-[10px] text-zinc-300 mb-1 uppercase tracking-wider font-semibold">Pages</div>
              <div className="text-[9px] text-zinc-500 mb-2">Switch between different pages of your website. Each page has its own layout and content.</div>
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
              <div className="text-[10px] text-zinc-300 mb-1 uppercase tracking-wider font-semibold">Overall Look & Feel</div>
              <div className="text-[9px] text-zinc-500 mb-2">Choose a preset theme or customize colors, fonts, and spacing for your entire site.</div>
              {/* Theme presets */}
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Color Themes (pick one to start)</Label>
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
                <Label className="text-[10px] text-zinc-400 mb-1 block">Custom Colors</Label>
                {[
                  { key:'accent', label:'Main Brand Color' },
                  { key:'bg', label:'Page Background' },
                  { key:'surface', label:'Card/Box Background' },
                  { key:'text', label:'Text Color' },
                  { key:'muted', label:'Subtle Text Color' },
                  { key:'border', label:'Line/Border Color' },
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
                <Label className="text-[10px] text-zinc-400 mb-1 block">Text Font (applies everywhere)</Label>
                <Select value={designTokens.fontFamily} onValueChange={v => setDesignTokens(prev => ({ ...prev, fontFamily: v }))}>
                  <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    {['Inter','Geist','system-ui','Arial','Helvetica','Georgia','Playfair Display','Montserrat','Poppins','Roboto','Lora','Merriweather','Fira Code'].map(f => <SelectItem key={f} value={f} className="text-[11px] text-white">{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Scale sliders */}
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Corner Roundness</Label>
                <Slider value={[designTokens.borderRadius]} onValueChange={v => setDesignTokens(prev => ({ ...prev, borderRadius: v[0] }))} min={0} max={24} step={1} className="mb-1" />
                <span className="text-[10px] text-zinc-500">{designTokens.borderRadius}px</span>
              </div>
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Space Between Items</Label>
                <Slider value={[designTokens.spacingScale * 100]} onValueChange={v => setDesignTokens(prev => ({ ...prev, spacingScale: v[0] / 100 }))} min={50} max={200} step={10} className="mb-1" />
                <span className="text-[10px] text-zinc-500">{Math.round(designTokens.spacingScale * 100)}%</span>
              </div>
              <div className="mb-3">
                <Label className="text-[10px] text-zinc-400 mb-1 block">Shadow Strength</Label>
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
              <Button onClick={applyTheme} className="w-full h-7 text-[11px] bg-[#7c3aed] hover:bg-[#6d28d9]">Apply Theme to All Pages</Button>
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
                <Badge className="bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/30 text-[10px]">{getTagDisplayName(selectedElement.tag)}</Badge>
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
                  <Tooltip><TooltipTrigger asChild><button className="p-1 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white" aria-label="Change image"><Image size={12} /></button></TooltipTrigger><TooltipContent>Change Image</TooltipContent></Tooltip>
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
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mb-3">
                <MousePointer2 size={24} className="text-[#7c3aed]" />
              </div>
              <p className="text-sm text-zinc-300 font-medium mb-1">Pick a section to customize</p>
              <p className="text-[11px] text-zinc-500 mb-4">Click on any text, picture, button, or section in the preview area, and its settings will appear here.</p>
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
                  <MousePointer2 size={14} className="text-[#7c3aed]" />
                  <span className="text-[11px] text-zinc-300">Click anything in the preview to select it</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
                  <Edit3 size={14} className="text-emerald-400" />
                  <span className="text-[11px] text-zinc-300">Double-click text to type new words</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
                  <Palette size={14} className="text-pink-400" />
                  <span className="text-[11px] text-zinc-300">Use this panel to change how it looks</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Element header — friendly name */}
              <div className="px-2 py-1.5 border-b border-[#1a1a2e] bg-[#1a1a2e]/50 shrink-0">
                <div className="flex items-center gap-1.5">
                  {(() => {
                    const iconName = getTagIconName(selectedElement.tag)
                    const IC = ICON_MAP[iconName]
                    return IC ? <IC size={14} className="text-[#7c3aed]" /> : <Square size={14} className="text-[#7c3aed]" />
                  })()}
                  <span className="text-[11px] text-white font-semibold">{getTagDisplayName(selectedElement.tag)}</span>
                  <span className="text-[9px] text-zinc-500">{Math.round(selectedElement.rect.width)}×{Math.round(selectedElement.rect.height)}px</span>
                  <div className="flex gap-0.5 ml-auto">
                    <Tooltip><TooltipTrigger asChild><button onClick={duplicateElement} className="p-0.5 rounded hover:bg-[#1a1a2e] text-zinc-400 hover:text-white"><Copy size={12} /></button></TooltipTrigger><TooltipContent>Copy this section</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><button onClick={removeElement} className="p-0.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400"><Trash2 size={12} /></button></TooltipTrigger><TooltipContent>Delete this section</TooltipContent></Tooltip>
                  </div>
                </div>
                {getTagDescription(selectedElement.tag) && (
                  <div className="text-[9px] text-zinc-500 mt-0.5">{getTagDescription(selectedElement.tag)}</div>
                )}
              </div>

              {/* Inspector tabs — friendlier labels */}
              <Tabs value={inspectorTab} onValueChange={setInspectorTab} className="flex flex-col flex-1 overflow-hidden">
                <TabsList className="w-full bg-[#1a1a2e] border-b border-[#2a2a3e] rounded-none h-7 p-0 shrink-0">
                  <TabsTrigger value="content" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Edit3 size={10} className="mr-0.5" />Text & Images</TabsTrigger>
                  <TabsTrigger value="style" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Palette size={10} className="mr-0.5" />Appearance</TabsTrigger>
                  <TabsTrigger value="layout" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Layout size={10} className="mr-0.5" />Position & Size</TabsTrigger>
                  <TabsTrigger value="animation" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Sparkles size={10} className="mr-0.5" />Motion Effects</TabsTrigger>
                  <TabsTrigger value="seo" className="text-[10px] data-[state=active]:bg-[#7c3aed] data-[state=active]:text-white px-1.5 py-1 rounded-none"><Globe size={10} className="mr-0.5" />Search Settings</TabsTrigger>
                </TabsList>

                {/* Content tab — friendly editing */}
                <TabsContent value="content" className="flex-1 overflow-y-auto mt-0 p-2">
                  {/* Quick tip based on element type */}
                  <div className="mb-3 p-2 rounded-lg bg-[#7c3aed]/5 border border-[#7c3aed]/20">
                    <div className="text-[10px] text-[#7c3aed] font-medium mb-0.5">💡 Tip: {getTagDescription(selectedElement.tag) || 'Change what this part says and how it behaves'}</div>
                  </div>
                  {/* Main content editor */}
                  <div className="mb-2">
                    <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">📝 The text inside this part</Label>
                    <div className="text-[9px] text-zinc-500 mb-0.5">Edit the words or content that appear in this section.</div>
                    <textarea value={editingContent} onChange={e => setEditingContent(e.target.value)} onBlur={() => applyContent(editingContent)} className="w-full h-24 bg-[#0d0d15] border border-[#2a2a3e] rounded text-[11px] text-white p-2 resize-y" placeholder="Type new text here..." />
                  </div>
                  {/* Tag-specific attribute editors with friendly labels */}
                  {selectedElement.tag === 'img' && (
                    <div className="mb-2 p-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
                      <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">🖼️ Image Settings</Label>
                      <Label className="text-[10px] text-zinc-400 mt-1">Where the picture comes from (URL)</Label>
                      <Input value={editingAttributes.src || ''} onChange={e => applyAttribute('src', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" placeholder="https://example.com/photo.jpg" />
                      <Label className="text-[10px] text-zinc-400 mt-1">Description (for screen readers & SEO)</Label>
                      <Input value={editingAttributes.alt || ''} onChange={e => applyAttribute('alt', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" placeholder="A photo of..." />
                    </div>
                  )}
                  {selectedElement.tag === 'a' && (
                    <div className="mb-2 p-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
                      <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">🔗 Link Settings</Label>
                      <Label className="text-[10px] text-zinc-400 mt-1">Where does it go? (URL)</Label>
                      <Input value={editingAttributes.href || ''} onChange={e => applyAttribute('href', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" placeholder="https://example.com" />
                      <Label className="text-[10px] text-zinc-400 mt-1">Opens in</Label>
                      <Select value={editingAttributes.target || '_self'} onValueChange={v => applyAttribute('target', v)}>
                        <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]"><SelectItem value="_self" className="text-[11px]">Same Window</SelectItem><SelectItem value="_blank" className="text-[11px]">New Window</SelectItem></SelectContent>
                      </Select>
                    </div>
                  )}
                  {(selectedElement.tag === 'input' || selectedElement.tag === 'textarea') && (
                    <div className="mb-2 p-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
                      <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">✏️ Input Field Settings</Label>
                      <Label className="text-[10px] text-zinc-400 mt-1">What kind of input?</Label>
                      <Select value={editingAttributes.type || 'text'} onValueChange={v => applyAttribute('type', v)}>
                        <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">{[{ v:'text', l:'Plain Text' },{ v:'email', l:'Email Address' },{ v:'password', l:'Password (hidden)' },{ v:'number', l:'Number' },{ v:'tel', l:'Phone Number' },{ v:'url', l:'Website URL' },{ v:'search', l:'Search Box' },{ v:'date', l:'Date Picker' },{ v:'submit', l:'Submit Button' },{ v:'button', l:'Button' }].map(t => <SelectItem key={t.v} value={t.v} className="text-[11px]">{t.l}</SelectItem>)}</SelectContent>
                      </Select>
                      <Label className="text-[10px] text-zinc-400 mt-1">Placeholder text (hint shown when empty)</Label>
                      <Input value={editingAttributes.placeholder || ''} onChange={e => applyAttribute('placeholder', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" placeholder="Enter your..." />
                    </div>
                  )}
                  {selectedElement.tag === 'button' && (
                    <div className="mb-2 p-2 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]">
                      <Label className="text-[10px] text-zinc-300 font-semibold mb-1 block">🔘 Button Settings</Label>
                      <Label className="text-[10px] text-zinc-400 mt-1">What happens when clicked?</Label>
                      <Select value={editingAttributes.type || 'button'} onValueChange={v => applyAttribute('type', v)}>
                        <SelectTrigger className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]"><SelectItem value="button" className="text-[11px]">Just a button (custom action)</SelectItem><SelectItem value="submit" className="text-[11px]">Submit a form</SelectItem></SelectContent>
                      </Select>
                    </div>
                  )}
                  {/* All attributes — collapsible for advanced users */}
                  {Object.keys(editingAttributes).length > 0 && (
                    <Collapsible className="mb-2">
                      <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-1 w-full hover:text-zinc-300">
                        <ChevronRight size={10} className="transition-transform" />Advanced: All Attributes
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-2 rounded-lg bg-[#0d0d15] border border-[#2a2a3e]">
                          {Object.entries(editingAttributes).map(([key, val]) => (
                            <div key={key} className="flex items-center gap-1 mb-1">
                              <Label className="text-[10px] text-zinc-400 w-16">{key}</Label>
                              <Input value={val} onChange={e => applyAttribute(key, e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" />
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </TabsContent>

                {/* Style tab — with friendly group names */}
                <TabsContent value="style" className="flex-1 overflow-y-auto mt-0">
                  {/* Quick edit section — most common changes */}
                  <div className="p-2 border-b border-[#1a1a2e]">
                    <Label className="text-[10px] text-zinc-300 font-semibold mb-1.5 block">⚡ Quick Changes</Label>
                    <div className="text-[9px] text-zinc-500 mb-1">Change the most common settings in one place. Scroll down for more options.</div>
                    <div className="grid grid-cols-2 gap-1.5 mb-1">
                      <div className="flex items-center gap-1">
                        <Label className="text-[10px] text-zinc-400 w-12">Color</Label>
                        <input type="color" value={selectedStyles['color']?.startsWith('#') ? selectedStyles['color'] : '#ffffff'} onChange={e => applyStyle('color', e.target.value)} className="w-5 h-5 rounded border border-[#2a2a3e] cursor-pointer bg-transparent" />
                        <Input value={selectedStyles['color'] || '#ffffff'} onChange={e => applyStyle('color', e.target.value)} className="h-5 text-[10px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Label className="text-[10px] text-zinc-400 w-12">Fill</Label>
                        <input type="color" value={selectedStyles['background-color']?.startsWith('#') ? selectedStyles['background-color'] : '#000000'} onChange={e => applyStyle('background-color', e.target.value)} className="w-5 h-5 rounded border border-[#2a2a3e] cursor-pointer bg-transparent" />
                        <Input value={selectedStyles['background-color'] || 'transparent'} onChange={e => applyStyle('background-color', e.target.value)} className="h-5 text-[10px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center gap-1">
                        <Label className="text-[10px] text-zinc-400 w-12">Size</Label>
                        <Input type="number" value={parseFloat(selectedStyles['font-size']) || 16} onChange={e => applyStyle('font-size', e.target.value + 'px')} className="h-5 text-[10px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" min={8} max={120} />
                        <span className="text-[9px] text-zinc-500">px</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Label className="text-[10px] text-zinc-400 w-12">Thick</Label>
                        <Select value={selectedStyles['font-weight'] || '400'} onValueChange={v => applyStyle('font-weight', v)}>
                          <SelectTrigger className="h-5 text-[10px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                            {[{ v:'300', l:'Light' },{ v:'400', l:'Normal' },{ v:'500', l:'Medium' },{ v:'600', l:'Semi Bold' },{ v:'700', l:'Bold' },{ v:'800', l:'Extra Bold' },{ v:'900', l:'Black' }].map(w => <SelectItem key={w.v} value={w.v} className="text-[11px]">{w.l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <Label className="text-[10px] text-zinc-400 w-12">Round</Label>
                      <Input type="number" value={parseFloat(selectedStyles['border-top-left-radius']) || 0} onChange={e => { const v = e.target.value + 'px'; applyStyle('border-top-left-radius', v); applyStyle('border-top-right-radius', v); applyStyle('border-bottom-right-radius', v); applyStyle('border-bottom-left-radius', v) }} className="h-5 text-[10px] bg-[#0d0d15] border-[#2a2a3e] text-white flex-1" min={0} max={200} />
                      <span className="text-[9px] text-zinc-500">px</span>
                    </div>
                    {/* Box model diagram */}
                    <BoxModelDiagram />
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {CSS_PROPERTY_GROUPS.filter(g => ['Colors','Typography','Spacing','Background','Border','Effects','Filters','SVG'].includes(g.name)).map(group => {
                        const isCollapsed = collapsedGroups.has(group.name)
                        const friendlyInfo = FRIENDLY_GROUP_NAMES[group.name]
                        return (
                          <Collapsible key={group.name} open={!isCollapsed} onOpenChange={(open) => setCollapsedGroups(prev => { const n = new Set(prev); if (open) n.delete(group.name); else n.add(group.name); return n })}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold uppercase tracking-wider mb-1 w-full hover:text-[#7c3aed]">
                                  <ChevronRight size={10} className={`transition-transform ${!isCollapsed ? 'rotate-90' : ''}`} />
                                  {friendlyInfo?.name || group.name}
                                </CollapsibleTrigger>
                              </TooltipTrigger>
                              {friendlyInfo?.desc && <TooltipContent side="right" className="text-[11px] max-w-64">{friendlyInfo.desc}</TooltipContent>}
                            </Tooltip>
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

                {/* Layout tab — friendly name "Position & Size" */}
                <TabsContent value="layout" className="flex-1 overflow-y-auto mt-0">
                  <div className="p-2">
                    <Label className="text-[10px] text-zinc-300 font-semibold mb-0.5 block">How this part is positioned</Label>
                    <div className="text-[9px] text-zinc-500 mb-2">Control where this section sits on the page and how much space it takes up.</div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {CSS_PROPERTY_GROUPS.filter(g => ['Layout','Table','List'].includes(g.name)).map(group => {
                        const isCollapsed = collapsedGroups.has(group.name)
                        const friendlyInfo = FRIENDLY_GROUP_NAMES[group.name]
                        return (
                          <Collapsible key={group.name} open={!isCollapsed} onOpenChange={(open) => setCollapsedGroups(prev => { const n = new Set(prev); if (open) n.delete(group.name); else n.add(group.name); return n })}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold uppercase tracking-wider mb-1 w-full hover:text-[#7c3aed]">
                                  <ChevronRight size={10} className={`transition-transform ${!isCollapsed ? 'rotate-90' : ''}`} />
                                  {friendlyInfo?.name || group.name}
                                </CollapsibleTrigger>
                              </TooltipTrigger>
                              {friendlyInfo?.desc && <TooltipContent side="right" className="text-[11px] max-w-64">{friendlyInfo.desc}</TooltipContent>}
                            </Tooltip>
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
                        <Label className="text-[10px] text-zinc-300 font-semibold mb-0.5 block">Screen Sizes</Label>
                        <div className="text-[9px] text-zinc-500 mb-1">Preview how this section looks on different screen sizes.</div>
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

                {/* Animation tab — with friendly names */}
                <TabsContent value="animation" className="flex-1 overflow-y-auto mt-0">
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {/* Animation presets grid */}
                      <Label className="text-[10px] text-zinc-300 font-semibold mb-0.5 block">✨ Add a Motion Effect</Label>
                      <div className="text-[9px] text-zinc-500 mb-2">Click a preset to make this part animate — like fading in, bouncing, or floating.</div>
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
                        const friendlyInfo = FRIENDLY_GROUP_NAMES[group.name]
                        return (
                          <Collapsible key={group.name} open={!isCollapsed} onOpenChange={(open) => setCollapsedGroups(prev => { const n = new Set(prev); if (open) n.delete(group.name); else n.add(group.name); return n })}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CollapsibleTrigger className="flex items-center gap-1 text-[10px] text-zinc-300 font-semibold uppercase tracking-wider mb-1 w-full hover:text-[#7c3aed]">
                                  <ChevronRight size={10} className={`transition-transform ${!isCollapsed ? 'rotate-90' : ''}`} />
                                  {friendlyInfo?.name || group.name}
                                </CollapsibleTrigger>
                              </TooltipTrigger>
                              {friendlyInfo?.desc && <TooltipContent side="right" className="text-[11px] max-w-64">{friendlyInfo.desc}</TooltipContent>}
                            </Tooltip>
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

                {/* Info tab (Search Settings & Details) */}
                <TabsContent value="seo" className="flex-1 overflow-y-auto mt-0 p-2">
                  <Label className="text-[10px] text-zinc-300 font-semibold mb-0.5 block">ℹ️ Search & Accessibility Info</Label>
                  <div className="text-[9px] text-zinc-500 mb-2">This helps search engines find your page and makes it accessible to everyone.</div>
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
                      <div className="text-[10px] text-zinc-400 mb-1">This is a heading — important for search engines</div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">H{selectedElement.tag[1]}</Badge>
                        <span className="text-[10px] text-zinc-500">High SEO importance</span>
                      </div>
                    </div>
                  ) : null}
                  {/* Alt text for images */}
                  {selectedElement.tag === 'img' && (
                    <div className="p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15] mb-2">
                      <div className="text-[10px] text-zinc-400 mb-1">Image description (helps search & accessibility)</div>
                      <Label className="text-[10px] text-zinc-400">Description for screen readers & search engines</Label>
                      <Input value={editingAttributes.alt || ''} onChange={e => applyAttribute('alt', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                      <div className="mt-1">
                        <Switch checked={editingAttributes.alt?.length > 0} onCheckedChange={v => { if (!v) applyAttribute('alt', '') }} />
                        <span className="text-[10px] text-zinc-500 ml-1">Has a description</span>
                      </div>
                    </div>
                  )}
                  {/* Link SEO */}
                  {selectedElement.tag === 'a' && (
                    <div className="p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15] mb-2">
                      <div className="text-[10px] text-zinc-400 mb-1">Link destination (search engines use this)</div>
                      <Label className="text-[10px] text-zinc-400">Destination URL</Label>
                      <Input value={editingAttributes.href || ''} onChange={e => applyAttribute('href', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" />
                      <Label className="text-[10px] text-zinc-400 mt-1">Link relationship (for security: "noopener noreferrer")</Label>
                      <Input value={editingAttributes.rel || ''} onChange={e => applyAttribute('rel', e.target.value)} className="h-6 text-[11px] bg-[#0d0d15] border-[#2a2a3e]" placeholder="noopener noreferrer" />
                    </div>
                  )}
                  {/* General SEO info */}
                  <div className="p-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15]">
                    <div className="text-[10px] text-zinc-400 mb-1">About this element</div>
                    <div className="space-y-0.5 text-[10px]">
                      <div className="flex justify-between"><span className="text-zinc-500">Type</span><span className="text-zinc-300">{getTagDisplayName(selectedElement.tag)}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-500">HTML tag</span><span className="text-zinc-300 font-mono">{selectedElement.tag}</span></div>
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
