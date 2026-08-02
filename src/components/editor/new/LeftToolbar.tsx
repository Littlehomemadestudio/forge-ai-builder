'use client';

import React from 'react';
import { useTheme } from './theme';

const LEFT_ITEMS = [
  { id: 'pages', label: 'Pages', icon: 'pages' },
  { id: 'templates', label: 'Templates', icon: 'templates' },
  { id: 'sections', label: 'Sections', icon: 'sections' },
  { id: 'components', label: 'Components', icon: 'components' },
  { id: 'media', label: 'Media', icon: 'media' },
  { id: 'ai', label: 'AI', icon: 'ai' },
  { id: 'assets', label: 'Assets', icon: 'assets' },
  { id: 'layers', label: 'Layers', icon: 'layers' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'brand', label: 'Brand', icon: 'brand' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
] as const;

interface LeftToolbarProps {
  activeTab: string | null;
  onTabChange: (tab: string | null) => void;
}

export function LeftToolbar({ activeTab, onTabChange }: LeftToolbarProps) {
  const tokens = useTheme();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <nav
      aria-label="Editor tools"
      style={{
        width: '64px',
        backgroundColor: tokens.colors.panel,
        borderRight: `1px solid ${tokens.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${tokens.spacing[3]} 0`,
        gap: tokens.spacing[1],
        zIndex: tokens.zIndex.sticky,
        overflowY: 'auto',
      }}
    >
      {LEFT_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const isHovered = hoveredId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(isActive ? null : item.id)}
            aria-label={item.label}
            aria-pressed={isActive}
            title={item.label}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: tokens.borderRadius.lg,
              border: 'none',
              backgroundColor: isActive ? tokens.colors.selectionBg : isHovered ? tokens.colors.hover : 'transparent',
              color: isActive ? tokens.colors.primary : tokens.colors.textSecondary,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              transition: `all ${tokens.motion.fast} ${tokens.motion.easeOut}`,
              position: 'relative',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {getLeftIcon(item.icon)}
            </svg>
            <span
              style={{
                fontSize: '10px',
                fontWeight: tokens.typography.weights.medium,
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>
            {isActive && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '24px',
                  borderRadius: '0 2px 2px 0',
                  backgroundColor: tokens.colors.primary,
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function getLeftIcon(icon: string): React.ReactNode {
  switch (icon) {
    case 'pages':
      return <><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>;
    case 'templates':
      return <><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9l5-5 4 4 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'sections':
      return <><rect x="2" y="2" width="16" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="10" width="16" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></>;
    case 'components':
      return <><rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></>;
    case 'media':
      return <><rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="8.5" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 14l4-3 3 2 3-2 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'ai':
      return <><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'assets':
      return <><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 4l3-1v9l-3 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'layers':
      return <><path d="M3 7l5 3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12l5 3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17l5 3 5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'history':
      return <><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>;
    case 'brand':
      return <><path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 4v6M4 7h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>;
    case 'settings':
      return <><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3 3l1.5 1.5M15.5 15.5L17 17M3 17l1.5-1.5M15.5 4.5L17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>;
    default:
      return null;
  }
}




