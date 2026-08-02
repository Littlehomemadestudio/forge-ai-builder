'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from './theme';
import type { ViewportMode } from './useEditor';

interface CanvasProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  viewport: ViewportMode;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  htmlContent: string;
  isPanning: boolean;
}

export function Canvas({ iframeRef, viewport, zoom, onZoomChange, htmlContent, isPanning }: CanvasProps) {
  const tokens = useTheme();
  const [showGrid, setShowGrid] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const viewportWidth = viewport === 'desktop' ? '100%' : viewport === 'tablet' ? '768px' : '375px';

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onZoomChange(zoom + delta);
    }
  }, [zoom, onZoomChange]);

  return (
    <main
      ref={containerRef}
      onWheel={handleWheel}
      style={{
        flex: 1,
        backgroundColor: tokens.colors.canvasBg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isPanning ? 'grab' : 'default',
      }}
      role="main"
      aria-label="Canvas"
    >
      {/* Zoom controls */}
      <div
        style={{
          position: 'absolute',
          bottom: tokens.spacing[4],
          right: tokens.spacing[4],
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
          backgroundColor: tokens.colors.panel,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing[2],
          boxShadow: tokens.shadows.md,
          zIndex: tokens.zIndex.popover,
        }}
        role="group"
        aria-label="Zoom controls"
      >
        <button
          onClick={() => onZoomChange(zoom - 0.1)}
          aria-label="Zoom out"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: tokens.borderRadius.md,
            border: 'none',
            backgroundColor: 'transparent',
            color: tokens.colors.textPrimary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <span
          aria-live="polite"
          style={{
            fontSize: tokens.typography.scale.sm,
            fontWeight: tokens.typography.weights.medium,
            color: tokens.colors.textPrimary,
            minWidth: '48px',
            textAlign: 'center',
          }}
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(zoom + 0.1)}
          aria-label="Zoom in"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: tokens.borderRadius.md,
            border: 'none',
            backgroundColor: 'transparent',
            color: tokens.colors.textPrimary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          aria-label={showGrid ? 'Hide grid' : 'Show grid'}
          aria-pressed={showGrid}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: tokens.borderRadius.md,
            border: 'none',
            backgroundColor: showGrid ? tokens.colors.hover : 'transparent',
            color: tokens.colors.textPrimary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 1v14M1 5h14M1 9h14M1 13h14M5 1v14M9 1v14M13 1v14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Viewport toggle */}
      <div
        style={{
          position: 'absolute',
          top: tokens.spacing[4],
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: tokens.spacing[1],
          backgroundColor: tokens.colors.panel,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing[1],
          boxShadow: tokens.shadows.sm,
          zIndex: tokens.zIndex.popover,
        }}
        role="group"
        aria-label="Viewport size"
      >
        {(['desktop', 'tablet', 'mobile'] as ViewportMode[]).map((v) => (
          <button
            key={v}
            onClick={() => {/* viewport state lives in parent; for now this is a placeholder */}}
            aria-pressed={viewport === v}
            aria-label={v}
            title={v}
            style={{
              padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
              borderRadius: tokens.borderRadius.md,
              border: 'none',
              backgroundColor: viewport === v ? tokens.colors.hover : 'transparent',
              color: viewport === v ? tokens.colors.textPrimary : tokens.colors.textSecondary,
              fontSize: tokens.typography.scale.xs,
              fontWeight: tokens.typography.weights.medium,
              cursor: 'pointer',
              minHeight: tokens.accessibility.minTouchTarget,
              transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
              textTransform: 'capitalize',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Canvas frame */}
      <div
        style={{
          width: viewportWidth,
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: tokens.shadows.xl,
          borderRadius: tokens.borderRadius.sm,
          overflow: 'hidden',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
      >
        {showGrid && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #E5E7EB 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.5,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}
        <iframe
          ref={iframeRef}
          title="Website preview"
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            position: 'relative',
            zIndex: 2,
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </main>
  );
}



