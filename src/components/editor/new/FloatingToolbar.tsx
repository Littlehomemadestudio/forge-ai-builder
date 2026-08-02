'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './theme';

interface FloatingToolbarProps {
  selectionType: string | null;
  selectedId: string | null;
}

export function FloatingToolbar({ selectionType, selectedId }: FloatingToolbarProps) {
  const tokens = useTheme();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number | string }>({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId && selectionType !== 'none') {
      // In a real editor, this would query the selected element's bounding rect
      // For now, show it centered above the canvas
      setPosition({ top: 80, left: '50%' });
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [selectedId, selectionType]);

  if (!visible || !selectedId) return null;

  const actions = selectionType ? getActionsForType(selectionType) : [];

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Element actions"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: position.left ? `${position.left}px` : '50%',

        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing[1],
        backgroundColor: tokens.colors.panel,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing[2],
        boxShadow: tokens.shadows.lg,
        zIndex: tokens.zIndex.floatingToolbar,
        opacity: visible ? 1 : 0,
        transform: visible ? (position.left ? 'none' : 'translateX(-50%) translateY(0)') : (position.left ? 'none' : 'translateX(-50%) translateY(-8px)'),
        transition: `all ${tokens.motion.normal} ${tokens.motion.easeOut}`,
      }}
    >
      {actions.map((action, idx) => (
        <React.Fragment key={action.label}>
          {idx > 0 && <div style={{ width: '1px', height: '24px', backgroundColor: tokens.colors.border }} aria-hidden="true" />}
          <button
            onClick={action.onClick}
            aria-label={action.label}
            title={action.label}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: tokens.borderRadius.md,
              border: 'none',
              backgroundColor: 'transparent',
              color: tokens.colors.textPrimary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">{action.icon}</svg>
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

function getActionsForType(type: string) {
  switch (type) {
    case 'text':
      return [
        { label: 'Bold', icon: <><path d="M5 3h6.5a3.5 3.5 0 0 1 0 7H5V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10h6.5a3.5 3.5 0 0 1 0 7H5v-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>, onClick: () => {} },
        { label: 'Italic', icon: <><path d="M7 3h6M4 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
        { label: 'AI Rewrite', icon: <><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5.5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
        { label: 'Duplicate', icon: <><rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4V2.5M4 8H2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
        { label: 'Delete', icon: <><path d="M5 5l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
      ];
    case 'button':
      return [
        { label: 'Edit link', icon: <><path d="M7 10l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 7h6a3 3 0 0 1 0 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11h3a3 3 0 0 1 0 6h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>, onClick: () => {} },
        { label: 'AI Improve', icon: <><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5.5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
        { label: 'Duplicate', icon: <><rect x="4" y="4" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 4V2.5M4 8H2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
        { label: 'Delete', icon: <><path d="M5 5l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
      ];
    case 'image':
      return [
        { label: 'Replace', icon: <><path d="M3 7h12M3 11h12M5 3l-2 4 2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 3l2 4-2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>, onClick: () => {} },
        { label: 'Crop', icon: <><path d="M2 2h12v12H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
        { label: 'AI Replace', icon: <><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M9 5.5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
        { label: 'Delete', icon: <><path d="M5 5l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>, onClick: () => {} },
      ];
    default:
      return [];
  }
}



