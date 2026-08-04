'use client'

import * as React from 'react'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  AccessibilityProvider, 
  useAccessibility,
  VisualEditorLayout,
  LeftToolbar,
  TOOLBAR_ITEMS,
  type ToolbarItem,
  AIPanel,
  AIFloatingButton,
  FloatingToolbar,
  TEXT_ACTIONS,
  BUTTON_ACTIONS,
  IMAGE_ACTIONS,
  SECTION_ACTIONS,
  DEFAULT_ACTIONS,
  AccessibilityPanel,
  SAMPLE_ACCESSIBILITY_ISSUES,
  EditorPanel,
  EditorButton,
  COLORS,
  RADIUS,
  SPACING,
} from './index'
import {
  Monitor, Smartphone, Tablet, Undo2, Redo2, Save, Download, 
  Rocket, Eye, Code2, Sparkles, Layers, Type, Image as ImageIcon,
  Palette, Settings2, FileCode, Globe, Hash, Plus, Search,
  ChevronDown, ZoomIn, ZoomOut, Maximize2
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'

// Internal component for the editor content with accessibility context
function VisualEditorContent() {
  const { reduceMotion, fontSizeScale, setFontSizeScale } = useAccessibility()
  
  // State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [selectedElementType, setSelectedElementType] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<string>('pages')
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [zoom, setZoom] = useState(100)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false)
  const [accessibilityIssues, setAccessibilityIssues] = useState(SAMPLE_ACCESSIBILITY_ISSUES)
  const [isScanning, setIsScanning] = useState(false)
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState<{ x: number; y: number } | null>(null)
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Get toolbar items with icons
  const getToolbarItems = (): ToolbarItem[] => {
    const iconMap: Record<string, React.ReactNode> = {
      pages: <Layers size={24} />,
      templates: <FileCode size={24} />,
      sections: <LayoutIcon size={24} />,
      components: <GridIcon size={24} />,
      media: <ImageIcon size={24} />,
      ai: <Sparkles size={24} />,
      assets: <Palette size={24} />,
      layers: <Layers size={24} />,
      history: <Undo2 size={24} />,
      brand: <Globe size={24} />,
      settings: <Settings2 size={24} />,
    }

    return Object.values(TOOLBAR_ITEMS).map(item => ({
      ...item,
      icon: iconMap[item.id] || <Settings2 size={24} />,
      isActive: activeTool === item.id,
      onClick: () => setActiveTool(item.id),
    }))
  }

  // Get floating toolbar actions based on selected element type
  const getFloatingToolbarActions = () => {
    if (!selectedElementType) return DEFAULT_ACTIONS
    
    switch (selectedElementType) {
      case 'text':
      case 'heading':
      case 'paragraph':
        return TEXT_ACTIONS
      case 'button':
        return BUTTON_ACTIONS
      case 'image':
        return IMAGE_ACTIONS
      case 'section':
      case 'div':
        return SECTION_ACTIONS
      default:
        return DEFAULT_ACTIONS
    }
  }

  // Handle fix all accessibility issues
  const handleFixAllAccessibility = async () => {
    setIsScanning(true)
    // Simulate AI fixing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAccessibilityIssues([])
    setIsScanning(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        // Handle undo
      }
      
      // Ctrl/Cmd + Shift + Z - Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        // Handle redo
      }
      
      // Ctrl/Cmd + D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        // Handle duplicate
      }
      
      // Delete - Delete selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Handle delete (if not in input)
      }
      
      // Arrow keys - Nudge
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Handle nudge
      }
      
      // Space - Pan mode
      if (e.key === ' ') {
        // Handle pan mode
      }
      
      // Ctrl/Cmd + / - Command palette
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        // Open command palette
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <VisualEditorLayout
      topNav={
        <TopNavigation
          devicePreview={devicePreview}
          setDevicePreview={setDevicePreview}
          zoom={zoom}
          setZoom={setZoom}
          onUndo={() => {}}
          onRedo={() => {}}
          onSave={() => {}}
          onPublish={() => {}}
        />
      }
      leftToolbar={
        <LeftToolbar
          items={getToolbarItems()}
          activeItemId={activeTool}
          onItemClick={(item) => {
            setActiveTool(item.id)
            item.onClick?.()
          }}
        />
      }
      rightInspector={
        <InspectorPanel
          selectedElementId={selectedElementId}
          selectedElementType={selectedElementType}
          isAccessibilityOpen={isAccessibilityOpen}
          onToggleAccessibility={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
        />
      }
      bottomPanel={
        <BottomStatusBar
          fontSizeScale={fontSizeScale}
          setFontSizeScale={setFontSizeScale}
          accessibilityIssueCount={accessibilityIssues.length}
          onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        />
      }
    >
      {/* Canvas */}
      <Canvas
        htmlContent={htmlContent}
        selectedElementId={selectedElementId}
        devicePreview={devicePreview}
        zoom={zoom}
        onSelectElement={(id, type) => {
          setSelectedElementId(id)
          setSelectedElementType(type)
          setFloatingToolbarPosition({ x: window.innerWidth / 2 - 200, y: 200 })
          setShowFloatingToolbar(true)
        }}
        onDeselect={() => {
          setSelectedElementId(null)
          setSelectedElementType(null)
          setShowFloatingToolbar(false)
        }}
      />

      {/* Floating Toolbar */}
      <FloatingToolbar
        position={floatingToolbarPosition}
        actions={getFloatingToolbarActions()}
        visible={showFloatingToolbar}
        onClose={() => setShowFloatingToolbar(false)}
      />

      {/* AI Panel */}
      <AIPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        contextElementId={selectedElementId}
        onQuerySubmit={async (query) => {
          console.log('AI Query:', query)
          // Handle AI query
        }}
      />

      {/* AI Floating Button */}
      <AIFloatingButton onClick={() => setIsAIOpen(true)} />

      {/* Accessibility Panel */}
      <div
        style={{
          position: 'fixed',
          right: isAccessibilityOpen ? 0 : '-400px',
          top: 0,
          width: '400px',
          height: '100vh',
          transition: reduceMotion ? 'none' : `right ${ANIMATION.duration.slower} ${ANIMATION.easing.ease}`,
          zIndex: 350,
        }}
      >
        <AccessibilityPanel
          isOpen={isAccessibilityOpen}
          onClose={() => setIsAccessibilityOpen(false)}
          issues={accessibilityIssues}
          onFixAll={handleFixAllAccessibility}
          isScanning={isScanning}
        />
      </div>
    </VisualEditorLayout>
  )
}

// Top Navigation Component
function TopNavigation({
  devicePreview,
  setDevicePreview,
  zoom,
  setZoom,
  onUndo,
  onRedo,
  onSave,
  onPublish,
}: {
  devicePreview: 'desktop' | 'tablet' | 'mobile'
  setDevicePreview: (device: 'desktop' | 'tablet' | 'mobile') => void
  zoom: number
  setZoom: (zoom: number) => void
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onPublish: () => void
}) {
  const { reduceMotion } = useAccessibility()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: `0 ${SPACING.xl}`,
      }}
    >
      {/* Left Section - Logo & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.lg }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.sm,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: RADIUS.md,
              backgroundColor: COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Code2 size={20} />
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: COLORS.text,
            }}
          >
            Forge Editor
          </span>
        </div>

        <div
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: COLORS.border,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onUndo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: RADIUS.md,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: COLORS.textSecondary,
                }}
                aria-label="Undo"
              >
                <Undo2 size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRedo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: RADIUS.md,
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: COLORS.textSecondary,
                }}
                aria-label="Redo"
              >
                <Redo2 size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Center Section - Device Preview & Zoom */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.xs,
            padding: '4px',
            backgroundColor: COLORS.background,
            borderRadius: RADIUS.lg,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <DeviceButton
            icon={<Monitor size={18} />}
            label="Desktop"
            isActive={devicePreview === 'desktop'}
            onClick={() => setDevicePreview('desktop')}
          />
          <DeviceButton
            icon={<Tablet size={18} />}
            label="Tablet"
            isActive={devicePreview === 'tablet'}
            onClick={() => setDevicePreview('tablet')}
          />
          <DeviceButton
            icon={<Smartphone size={18} />}
            label="Mobile"
            isActive={devicePreview === 'mobile'}
            onClick={() => setDevicePreview('mobile')}
          />
        </div>

        <div
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: COLORS.border,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
          <button
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: RADIUS.md,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: COLORS.textSecondary,
            }}
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: COLORS.text,
              minWidth: '50px',
              textAlign: 'center',
            }}
          >
            {zoom}%
          </span>
          
          <button
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: RADIUS.md,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: COLORS.textSecondary,
            }}
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        <EditorButton
          variant="ghost"
          size="sm"
          icon={<Eye size={18} />}
        >
          Preview
        </EditorButton>
        
        <EditorButton
          variant="secondary"
          size="sm"
          icon={<Save size={18} />}
          onClick={onSave}
        >
          Save
        </EditorButton>
        
        <EditorButton
          variant="primary"
          size="sm"
          icon={<Rocket size={18} />}
          onClick={onPublish}
        >
          Publish
        </EditorButton>
      </div>
    </div>
  )
}

function DeviceButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const { reduceMotion } = useAccessibility()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={onClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 10px',
            borderRadius: RADIUS.md,
            border: 'none',
            backgroundColor: isActive ? COLORS.panel : 'transparent',
            cursor: 'pointer',
            color: isActive ? COLORS.text : COLORS.textSecondary,
            boxShadow: isActive ? SHADOWS.sm : 'none',
          }}
          whileHover={!reduceMotion ? { scale: 1.05 } : undefined}
          whileTap={!reduceMotion ? { scale: 0.95 } : undefined}
          aria-label={label}
          aria-pressed={isActive}
        >
          {icon}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

// Inspector Panel Component
function InspectorPanel({
  selectedElementId,
  selectedElementType,
  isAccessibilityOpen,
  onToggleAccessibility,
}: {
  selectedElementId: string | null
  selectedElementType: string | null
  isAccessibilityOpen: boolean
  onToggleAccessibility: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${SPACING.lg} ${SPACING.lg}`,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <h2
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: COLORS.text,
          }}
        >
          {selectedElementId ? `Edit ${selectedElementType || 'Element'}` : 'No Selection'}
        </h2>
        <button
          onClick={onToggleAccessibility}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: RADIUS.md,
            border: 'none',
            backgroundColor: isAccessibilityOpen ? COLORS.primaryLight : 'transparent',
            cursor: 'pointer',
            color: isAccessibilityOpen ? COLORS.primary : COLORS.textSecondary,
          }}
          aria-label="Toggle Accessibility Panel"
          aria-pressed={isAccessibilityOpen}
        >
          <Sparkles size={18} />
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {selectedElementId ? (
          <>
            <EditorPanel title="Typography" collapsible defaultOpen>
              <TypographyControls />
            </EditorPanel>
            
            <EditorPanel title="Layout" collapsible defaultOpen>
              <LayoutControls />
            </EditorPanel>
            
            <EditorPanel title="Appearance" collapsible>
              <AppearanceControls />
            </EditorPanel>
            
            <EditorPanel title="Spacing" collapsible>
              <SpacingControls />
            </EditorPanel>
            
            <EditorPanel title="Advanced" collapsible>
              <AdvancedControls />
            </EditorPanel>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

// Bottom Status Bar
function BottomStatusBar({
  fontSizeScale,
  setFontSizeScale,
  accessibilityIssueCount,
  onOpenAccessibility,
}: {
  fontSizeScale: string
  setFontSizeScale: (scale: any) => void
  accessibilityIssueCount: number
  onOpenAccessibility: () => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${SPACING.sm} ${SPACING.lg}`,
        height: '40px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.lg }}>
        <span
          style={{
            fontSize: '13px',
            color: COLORS.textSecondary,
          }}
        >
          Ready
        </span>
        
        <button
          onClick={onOpenAccessibility}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.xs,
            padding: `${SPACING.xs} ${SPACING.sm}`,
            borderRadius: RADIUS.md,
            border: 'none',
            backgroundColor: accessibilityIssueCount > 0 ? COLORS.dangerLight : 'transparent',
            cursor: 'pointer',
            color: accessibilityIssueCount > 0 ? COLORS.danger : COLORS.textSecondary,
          }}
        >
          <Sparkles size={14} />
          <span style={{ fontSize: '13px' }}>
            {accessibilityIssueCount} issue{accessibilityIssueCount !== 1 ? 's' : ''}
          </span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        <select
          value={fontSizeScale}
          onChange={(e) => setFontSizeScale(e.target.value)}
          style={{
            padding: `${SPACING.xs} ${SPACING.sm}`,
            borderRadius: RADIUS.md,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.panel,
            fontSize: '13px',
            color: COLORS.text,
            cursor: 'pointer',
          }}
          aria-label="Font Size Scale"
        >
          <option value="small">Small Text</option>
          <option value="medium">Medium Text</option>
          <option value="large">Large Text</option>
          <option value="extra-large">Extra Large Text</option>
        </select>
      </div>
    </div>
  )
}

// Canvas Component
function Canvas({
  htmlContent,
  selectedElementId,
  devicePreview,
  zoom,
  onSelectElement,
  onDeselect,
}: {
  htmlContent: string
  selectedElementId: string | null
  devicePreview: 'desktop' | 'tablet' | 'mobile'
  zoom: number
  onSelectElement: (id: string, type: string) => void
  onDeselect: () => void
}) {
  const canvasWidth = {
    desktop: 1280,
    tablet: 768,
    mobile: 375,
  }[devicePreview]

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING['3xl'],
        overflow: 'auto',
        backgroundColor: COLORS.background,
      }}
      onClick={onDeselect}
    >
      <div
        style={{
          width: canvasWidth,
          minHeight: '800px',
          backgroundColor: '#FFFFFF',
          boxShadow: SHADOWS.lg,
          borderRadius: RADIUS.lg,
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {/* Empty state or content */}
        {!htmlContent ? (
          <EmptyCanvasState />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}
      </div>
    </div>
  )
}

// Empty Canvas State
function EmptyCanvasState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: SPACING['3xl'],
        gap: SPACING.lg,
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: COLORS.primaryLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.primary,
        }}
      >
        <Sparkles size={32} />
      </div>
      
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 600,
            color: COLORS.text,
            marginBottom: SPACING.sm,
          }}
        >
          Start Building Your Website
        </h3>
        <p
          style={{
            fontSize: '15px',
            color: COLORS.textSecondary,
            maxWidth: '400px',
            lineHeight: 1.5,
          }}
        >
          Use the toolbar on the left to add components, or ask AI to generate a section for you
        </p>
      </div>

      <div style={{ display: 'flex', gap: SPACING.md }}>
        <EditorButton variant="primary" icon={<Sparkles size={18} />}>
          Generate with AI
        </EditorButton>
        <EditorButton variant="secondary" icon={<Layers size={18} />}>
          Browse Templates
        </EditorButton>
      </div>
    </div>
  )
}

// Placeholder control components
function TypographyControls() {
  return <div style={{ padding: SPACING.sm, color: COLORS.textSecondary, fontSize: '14px' }}>Font controls here...</div>
}

function LayoutControls() {
  return <div style={{ padding: SPACING.sm, color: COLORS.textSecondary, fontSize: '14px' }}>Layout controls here...</div>
}

function AppearanceControls() {
  return <div style={{ padding: SPACING.sm, color: COLORS.textSecondary, fontSize: '14px' }}>Appearance controls here...</div>
}

function SpacingControls() {
  return <div style={{ padding: SPACING.sm, color: COLORS.textSecondary, fontSize: '14px' }}>Spacing controls here...</div>
}

function AdvancedControls() {
  return <div style={{ padding: SPACING.sm, color: COLORS.textSecondary, fontSize: '14px' }}>Advanced controls here...</div>
}

function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${SPACING['3xl']} ${SPACING.lg}`,
        textAlign: 'center',
        color: COLORS.textSecondary,
      }}
    >
      <MousePointer2 size={48} style={{ marginBottom: SPACING.lg, opacity: 0.5 }} />
      <p style={{ fontSize: '14px', marginBottom: SPACING.sm }}>
        Select an element on the canvas to edit its properties
      </p>
      <p style={{ fontSize: '13px' }}>
        Click anywhere on the page to begin
      </p>
    </div>
  )
}

import { COLORS, RADIUS, SPACING, ANIMATION, SHADOWS } from './design-tokens'

// Icon components
function LayoutIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}

function GridIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function MousePointer2({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 19 7-7 3 3V5H2v10l3-3 7 7Z" />
    </svg>
  )
}

// Main exported component
export function VisualEditor() {
  return (
    <AccessibilityProvider>
      <VisualEditorContent />
    </AccessibilityProvider>
  )
}
