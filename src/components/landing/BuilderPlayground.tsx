'use client'

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shuffle,
  Trash2,
  Type,
  Layout,
  MessageSquare,
  DollarSign,
  Star,
  Columns3,
  GripVertical,
  LayoutGrid,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/useTranslation'

interface PlaygroundBlock {
  id: string
  labelKey: string
  icon: React.ElementType
  color: string
  bgGradient: string
  height: string
}

const BLOCK_TYPES: PlaygroundBlock[] = [
  { id: 'hero', labelKey: 'playground.block.hero', icon: Layout, color: 'oklch(0.55 0.25 270)', bgGradient: 'linear-gradient(135deg, oklch(0.55 0.25 270), oklch(0.45 0.2 290))', height: 'h-12' },
  { id: 'features', labelKey: 'playground.block.features', icon: Columns3, color: 'oklch(0.6 0.2 180)', bgGradient: 'linear-gradient(135deg, oklch(0.6 0.2 180), oklch(0.5 0.15 160))', height: 'h-10' },
  { id: 'pricing', labelKey: 'playground.block.pricing', icon: DollarSign, color: 'oklch(0.65 0.2 80)', bgGradient: 'linear-gradient(135deg, oklch(0.65 0.2 80), oklch(0.55 0.18 60))', height: 'h-10' },
  { id: 'testimonials', labelKey: 'playground.block.testimonials', icon: Star, color: 'oklch(0.6 0.2 160)', bgGradient: 'linear-gradient(135deg, oklch(0.6 0.2 160), oklch(0.5 0.15 140))', height: 'h-10' },
  { id: 'cta', labelKey: 'playground.block.cta', icon: MessageSquare, color: 'oklch(0.55 0.25 270)', bgGradient: 'linear-gradient(135deg, oklch(0.55 0.25 270), oklch(0.5 0.2 290))', height: 'h-8' },
  { id: 'footer', labelKey: 'playground.block.footer', icon: Type, color: 'oklch(0.5 0.15 260)', bgGradient: 'linear-gradient(135deg, oklch(0.5 0.15 260), oklch(0.4 0.1 260))', height: 'h-6' },
]

export function BuilderPlayground({ isDark }: { isDark: boolean }) {
  const t = useTranslation()
  const [placedBlocks, setPlacedBlocks] = useState<PlaygroundBlock[]>([])
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragStart = useCallback((blockId: string) => { setDraggedBlock(blockId) }, [])
  const handleDragEnd = useCallback(() => { setDraggedBlock(null); setDragOverIndex(null) }, [])

  // Tap-to-add: clicking a palette block adds it to canvas (mobile fallback for drag)
  const handleTapAdd = useCallback((blockId: string) => {
    const block = BLOCK_TYPES.find(b => b.id === blockId)
    if (block) {
      const newBlock = { ...block, id: `${block.id}-${Date.now()}` }
      setPlacedBlocks(prev => [...prev, newBlock])
    }
  }, [])

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedBlock) return
    const block = BLOCK_TYPES.find(b => b.id === draggedBlock)
    if (block) {
      const newBlock = { ...block, id: `${block.id}-${Date.now()}` }
      if (dragOverIndex !== null) {
        setPlacedBlocks(prev => { const nb = [...prev]; nb.splice(dragOverIndex, 0, newBlock); return nb })
      } else {
        setPlacedBlocks(prev => [...prev, newBlock])
      }
    }
    setDraggedBlock(null); setDragOverIndex(null)
  }, [draggedBlock, dragOverIndex])

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const index = Math.floor(y / 50)
    setDragOverIndex(Math.min(index, placedBlocks.length))
  }, [placedBlocks.length])

  const handleShuffle = useCallback(() => {
    setPlacedBlocks(prev => {
      const s = [...prev]
      for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]] }
      return s
    })
  }, [])

  const handleClear = useCallback(() => { setPlacedBlocks([]) }, [])
  const handleRemoveBlock = useCallback((blockId: string) => { setPlacedBlocks(prev => prev.filter(b => b.id !== blockId)) }, [])

  const canvasBg = isDark ? 'bg-[oklch(0.1_0.01_260)]' : 'bg-[oklch(0.97_0.01_260)]'
  const canvasBorder = isDark ? 'border-[oklch(0.25_0.02_260)]' : 'border-[oklch(0.85_0.02_260)]'
  const dotPattern = isDark ? 'oklch(1 0 0 / 5%)' : 'oklch(0 0 0 / 5%)'
  const labelColor = isDark ? 'text-white/60' : 'text-foreground/60'
  const mutedColor = isDark ? 'text-white/40' : 'text-muted-foreground'
  const btnClass = isDark ? 'border-[oklch(0.25_0.02_260)] bg-[oklch(0.15_0.01_260)] text-white/70 hover:bg-[oklch(0.2_0.01_260)]' : 'border-border bg-secondary text-muted-foreground hover:bg-accent'
  const emptyIconColor = isDark ? 'text-white/20' : 'text-foreground/20'
  const emptyTextColor = isDark ? 'text-white/40' : 'text-muted-foreground'
  const navBarBg = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const navLineBg = isDark ? 'bg-white/10' : 'bg-foreground/10'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div>
        <p className={`text-xs ${mutedColor} mb-3 font-medium uppercase tracking-wider`}>{t('playground.dragBlocksToBuild')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BLOCK_TYPES.map((block) => {
            const Icon = block.icon
            return (
              <motion.div key={block.id} draggable onDragStart={() => handleDragStart(block.id)} onDragEnd={handleDragEnd}
                onClick={() => handleTapAdd(block.id)}
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-shadow focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={{ background: isDark ? `${block.color}15` : `${block.color}10`, border: `1px solid ${block.color}25` }}
              >
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: block.bgGradient }}>
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className={`text-xs font-medium ${labelColor}`}>{t(block.labelKey)}</span>
                <GripVertical className={`w-3 h-3 ${mutedColor} ml-auto rtl:ml-0 rtl:mr-auto`} />
              </motion.div>
            )
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={handleShuffle} disabled={placedBlocks.length < 2} className={`text-xs ${btnClass}`}>
            <Shuffle className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t('playground.shuffle')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear} disabled={placedBlocks.length === 0} className={`text-xs ${btnClass}`}>
            <Trash2 className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t('playground.clear')}
          </Button>
        </div>
      </div>

      <div>
        <p className={`text-xs ${mutedColor} mb-3 font-medium uppercase tracking-wider`}>{t('playground.livePreview')}</p>
        <div ref={canvasRef} onDrop={handleCanvasDrop} onDragOver={handleCanvasDragOver} onDragLeave={() => setDragOverIndex(null)}
          className={`min-h-[280px] rounded-xl border ${canvasBorder} ${canvasBg} p-3 relative overflow-hidden`}
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${dotPattern} 1px, transparent 0)`, backgroundSize: '20px 20px' }}
        >
          <div className={`h-5 rounded ${navBarBg} mb-2 flex items-center px-2 gap-1`}>
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-rose-500/60' : 'bg-rose-400/40'}`} />
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-500/60' : 'bg-amber-400/40'}`} />
            <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-emerald-500/60' : 'bg-emerald-400/40'}`} />
            <div className="flex-1" />
            <div className={`w-6 h-1.5 rounded ${navLineBg}`} />
            <div className={`w-6 h-1.5 rounded ${navLineBg}`} />
          </div>

          <AnimatePresence mode="popLayout">
            {placedBlocks.map((block, index) => {
              const Icon = block.icon
              return (
                <motion.div key={block.id} layout initial={{ opacity: 0, scale: 0.8, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -50 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="relative group mb-1.5"
                >
                  {dragOverIndex === index && <div className="absolute -top-1 left-0 right-0 h-0.5 bg-[oklch(0.55_0.25_270)] rounded-full" />}
                  <div className={`${block.height} rounded-lg flex items-center px-3 gap-2 cursor-pointer transition-all`}
                    style={{ background: block.bgGradient, opacity: 0.9 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.9' }}
                  >
                    <Icon className="w-3 h-3 text-white/80" />
                    <span className="text-[10px] font-medium text-white/80">{t(block.labelKey)}</span>
                    <button onClick={() => handleRemoveBlock(block.id)} className="ml-auto rtl:ml-0 rtl:mr-auto opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded-full bg-black/30 flex items-center justify-center">
                      <span className="text-white/60 text-[8px] leading-none">✕</span>
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {dragOverIndex === placedBlocks.length && draggedBlock && <div className="h-0.5 bg-[oklch(0.55_0.25_270)] rounded-full mb-1.5" />}
          {placedBlocks.length === 0 && (
            <div className={`flex flex-col items-center justify-center h-48 ${emptyTextColor}`}>
              <LayoutGrid className={`w-8 h-8 mb-2 ${emptyIconColor}`} />
              <p className="text-xs">{t('playground.empty')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
