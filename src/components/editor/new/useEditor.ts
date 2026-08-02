'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export type EditorMode = 'basic' | 'advanced';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type SelectionType = 'none' | 'text' | 'button' | 'image' | 'section' | 'container';

export interface EditorState {
  mode: EditorMode;
  viewport: ViewportMode;
  selectedId: string | null;
  selectionType: SelectionType;
  zoom: number;
  showCommandPalette: boolean;
  showShortcuts: boolean;
  showSettings: boolean;
  showAccessibility: boolean;
  leftPanelTab: string | null;
  isPanning: boolean;
  fontScale: 'small' | 'medium' | 'large' | 'extraLarge';
  reducedMotion: boolean;
}

const initialState: EditorState = {
  mode: 'basic',
  viewport: 'desktop',
  selectedId: null,
  selectionType: 'none',
  zoom: 1,
  showCommandPalette: false,
  showShortcuts: false,
  showSettings: false,
  showAccessibility: false,
  leftPanelTab: 'components',
  isPanning: false,
  fontScale: 'medium',
  reducedMotion: false,
};

export function useEditor() {
  const [state, setState] = useState<EditorState>(initialState);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  }, []);

  const selectElement = useCallback((id: string | null, type: SelectionType = 'none') => {
    setState(prev => ({ ...prev, selectedId: id, selectionType: type }));
  }, []);

  const setMode = useCallback((mode: EditorMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setViewport = useCallback((viewport: ViewportMode) => {
    setState(prev => ({ ...prev, viewport }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.25, Math.min(3, zoom)) }));
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setState(prev => ({ ...prev, showCommandPalette: !prev.showCommandPalette }));
  }, []);

  const toggleShortcuts = useCallback(() => {
    setState(prev => ({ ...prev, showShortcuts: !prev.showShortcuts }));
  }, []);

  const toggleSettings = useCallback(() => {
    setState(prev => ({ ...prev, showSettings: !prev.showSettings }));
  }, []);

  const toggleAccessibility = useCallback(() => {
    setState(prev => ({ ...prev, showAccessibility: !prev.showAccessibility }));
  }, []);

  const setLeftPanelTab = useCallback((tab: string | null) => {
    setState(prev => ({ ...prev, leftPanelTab: tab }));
  }, []);

  const closeAllModals = useCallback(() => {
    setState(prev => ({
      ...prev,
      showCommandPalette: false,
      showShortcuts: false,
      showSettings: false,
      showAccessibility: false,
    }));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: Ctrl+/ or Cmd+/
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Escape closes modals
      if (e.key === 'Escape') {
        closeAllModals();
        return;
      }

      // Space for panning (when not in an input)
      if (e.key === ' ' && document.activeElement === document.body) {
        e.preventDefault();
        setState(prev => ({ ...prev, isPanning: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setState(prev => ({ ...prev, isPanning: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleCommandPalette, closeAllModals]);

  return {
    state,
    iframeRef,
    sendMessage,
    selectElement,
    setMode,
    setViewport,
    setZoom,
    toggleCommandPalette,
    toggleShortcuts,
    toggleSettings,
    toggleAccessibility,
    setLeftPanelTab,
    closeAllModals,
  };
}
