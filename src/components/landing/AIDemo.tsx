'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, RotateCcw, CheckCircle2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/useTranslation'

export function AIDemo({ isDark }: { isDark: boolean }) {
  const t = useTranslation()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<'idle' | 'navbar' | 'hero' | 'features' | 'footer' | 'done'>('idle')

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setProgress(0)
    setStage('idle')

    const timeline = [
      { time: 0, progress: 5, stage: 'idle' as const },
      { time: 400, progress: 15, stage: 'navbar' as const },
      { time: 1200, progress: 35, stage: 'hero' as const },
      { time: 2800, progress: 70, stage: 'features' as const },
      { time: 4200, progress: 90, stage: 'footer' as const },
      { time: 5000, progress: 100, stage: 'done' as const },
    ]

    timeline.forEach(({ time, progress: p, stage: s }) => {
      setTimeout(() => { setProgress(p); setStage(s) }, time)
    })

    setTimeout(() => { setIsGenerating(false) }, 5200)
  }, [])

  const canvasBg = isDark ? 'bg-[oklch(0.1_0.01_260)]' : 'bg-[oklch(0.97_0.01_260)]'
  const canvasBorder = isDark ? 'border-[oklch(0.25_0.02_260)]' : 'border-border'
  const heroBg = isDark ? 'oklch(0.55 0.25 270 / 15%), oklch(0.65 0.25 350 / 15%)' : 'oklch(0.55 0.25 270 / 8%), oklch(0.65 0.25 350 / 8%)'
  const featureBg = isDark ? 'bg-white/5 border-white/5' : 'bg-foreground/5 border-border/50'
  const iconBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const lineBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const lineBg2 = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const emptyTextColor = isDark ? 'text-white/40' : 'text-muted-foreground'
  const emptyIconColor = isDark ? 'text-white/20' : 'text-foreground/20'
  const statusColor = isDark ? 'text-[oklch(0.85_0.08_260)]/70' : 'text-[oklch(0.55_0.25_270)]/70'
  const outlineBtnClass = isDark ? 'border-[oklch(0.25_0.02_260)] bg-[oklch(0.15_0.01_260)] text-white/70 hover:bg-[oklch(0.2_0.01_260)]' : 'border-border bg-secondary text-muted-foreground hover:bg-accent'
  const progressTrackBg = isDark ? 'bg-white/5' : 'bg-foreground/5'
  const barLineBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const borderBottomColor = isDark ? 'border-white/5' : 'border-border'
  const barBg = isDark ? 'bg-white/10' : 'bg-foreground/10'
  const dotPattern = isDark ? 'oklch(1 0 0 / 3%)' : 'oklch(0 0 0 / 3%)'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button onClick={handleGenerate} disabled={isGenerating}
            className="text-xs bg-[oklch(0.55_0.25_270)] text-white hover:bg-[oklch(0.5_0.22_270)] border-0 shadow-lg shadow-[oklch(0.55_0.25_270)_/_20]"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0" />{isGenerating ? t('aidemo.generating') : t('aidemo.watch')}
          </Button>
        </motion.div>
        {stage === 'done' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Button size="sm" variant="outline" onClick={handleGenerate} className={`text-xs ${outlineBtnClass}`}>
              <RotateCcw className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" /> {t('aidemo.regenerate')}
            </Button>
          </motion.div>
        )}
      </div>

      {isGenerating && (
        <div className={`w-full h-1.5 ${progressTrackBg} rounded-full overflow-hidden`}>
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, oklch(0.55 0.25 270), oklch(0.65 0.25 350), oklch(0.6 0.2 180))' }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      )}

      {isGenerating && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-[10px] ${statusColor} font-mono`}>
          {stage === 'idle' && t('aidemo.stage.idle')}
          {stage === 'navbar' && t('aidemo.stage.navbar')}
          {stage === 'hero' && t('aidemo.stage.hero')}
          {stage === 'features' && t('aidemo.stage.features')}
          {stage === 'footer' && t('aidemo.stage.footer')}
        </motion.p>
      )}

      <div className={`rounded-xl border ${canvasBorder} ${canvasBg} p-3 min-h-[200px] relative overflow-hidden`}
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${dotPattern} 1px, transparent 0)`, backgroundSize: '16px 16px' }}
      >
        <AnimatePresence>
          {stage !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex items-center justify-between mb-3 pb-2 ${borderBottomColor}`} style={{ borderBottomWidth: 1 }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[oklch(0.55_0.25_270)]" />
                <div className={`w-8 h-1.5 rounded ${barLineBg}`} />
              </div>
              <div className="flex gap-2">
                <div className={`w-6 h-1 rounded ${barLineBg}`} />
                <div className={`w-6 h-1 rounded ${barLineBg}`} />
                <div className={`w-6 h-1 rounded ${barLineBg}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(stage === 'hero' || stage === 'features' || stage === 'footer' || stage === 'done') && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-3 p-3 rounded-lg text-center" style={{ background: `linear-gradient(135deg, ${heroBg})` }}
            >
              <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-2 rounded ${isDark ? 'bg-white/20' : 'bg-foreground/15'} mx-auto mb-1.5`}
              />
              <motion.div initial={{ width: 0 }} animate={{ width: '50%' }} transition={{ duration: 0.6, delay: 0.5 }}
                className={`h-1 rounded ${isDark ? 'bg-white/10' : 'bg-foreground/8'} mx-auto mb-2`}
              />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 0.8 }}
                className="inline-block px-2.5 py-1 rounded-full text-[8px] font-medium text-white bg-[oklch(0.55_0.25_270)]"
              >
                {t('aidemo.cta')}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(stage === 'features' || stage === 'footer' || stage === 'done') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
              className="grid grid-cols-3 gap-1.5 mb-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.15 }}
                  className={`rounded-md p-2 ${featureBg}`}
                >
                  <div className={`w-4 h-4 rounded ${iconBg} mb-1`} />
                  <div className={`w-full h-1 rounded ${lineBg} mb-0.5`} />
                  <div className={`w-2/3 h-1 rounded ${lineBg2}`} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(stage === 'footer' || stage === 'done') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex items-center justify-between p-2 rounded-md ${isDark ? 'bg-white/5' : 'bg-foreground/5'}`}
            >
              <div className={`w-6 h-1 rounded ${barBg}`} />
              <div className="flex gap-1.5">
                <div className={`w-3 h-1 rounded ${isDark ? 'bg-white/5' : 'bg-foreground/5'}`} />
                <div className={`w-3 h-1 rounded ${isDark ? 'bg-white/5' : 'bg-foreground/5'}`} />
                <div className={`w-3 h-1 rounded ${isDark ? 'bg-white/5' : 'bg-foreground/5'}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stage === 'done' && !isGenerating && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute top-2 right-2 rtl:right-auto rtl:left-2 w-5 h-5 rounded-full bg-[oklch(0.6_0.2_160)] flex items-center justify-center"
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {stage === 'idle' && !isGenerating && (
          <div className={`flex flex-col items-center justify-center h-48 ${emptyTextColor}`}>
            <Wand2 className={`w-8 h-8 mb-2 ${emptyIconColor}`} />
            <p className="text-xs">{t('aidemo.empty')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
