'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Palette } from 'lucide-react'

export function ThemePlayground({ isDark }: { isDark: boolean }) {
  const [accentColor, setAccentColor] = useState('#7c3aed')
  const [isPreviewDark, setIsPreviewDark] = useState(false)
  const [fontStyle, setFontStyle] = useState<'modern' | 'classic' | 'playful'>('modern')

  const fontStyles = {
    modern: { fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.02em' },
    classic: { fontFamily: 'Georgia, serif', letterSpacing: '0.01em' },
    playful: { fontFamily: 'system-ui, sans-serif', letterSpacing: '0.02em' },
  }

  const colorPresets = ['#7c3aed', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4', '#ec4899']

  const labelColor = isDark ? 'text-white/60' : 'text-foreground/60'
  const btnActiveBg = isDark ? 'oklch(1 0 0 / 10%)' : 'oklch(0.55 0.25 270 / 10%)'
  const btnActiveBorder = isDark ? 'oklch(1 0 0 / 20%)' : 'oklch(0.55 0.25 270 / 30%)'
  const btnActiveColor = isDark ? 'white' : 'oklch(0.55 0.25 270)'
  const btnInactiveBg = isDark ? 'oklch(1 0 0 / 3%)' : 'oklch(0.96 0.01 260)'
  const btnInactiveBorder = isDark ? 'oklch(1 0 0 / 5%)' : 'oklch(0.9 0.01 260)'
  const btnInactiveColor = isDark ? 'oklch(1 0 0 / 50%)' : 'oklch(0.5 0.02 260)'
  const previewBorder = isDark ? 'border-[oklch(0.25_0.02_260)]' : 'border-border'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-4">
        <div>
          <p className={`text-xs ${labelColor} mb-2 font-medium uppercase tracking-wider`}>Accent Color</p>
          <div className="flex gap-2 flex-wrap">
            {colorPresets.map((color) => (
              <motion.button key={color} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setAccentColor(color)}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{ background: color, borderColor: accentColor === color ? (isDark ? 'white' : color) : 'transparent', boxShadow: accentColor === color ? `0 0 12px ${color}60` : 'none' }}
              />
            ))}
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer border-0 bg-transparent" />
          </div>
        </div>

        <div>
          <p className={`text-xs ${labelColor} mb-2 font-medium uppercase tracking-wider`}>Preview Mode</p>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setIsPreviewDark(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ background: !isPreviewDark ? btnActiveBg : btnInactiveBg, border: `1px solid ${!isPreviewDark ? btnActiveBorder : btnInactiveBorder}`, color: !isPreviewDark ? btnActiveColor : btnInactiveColor }}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setIsPreviewDark(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ background: isPreviewDark ? btnActiveBg : btnInactiveBg, border: `1px solid ${isPreviewDark ? btnActiveBorder : btnInactiveBorder}`, color: isPreviewDark ? btnActiveColor : btnInactiveColor }}
            >
              <Moon className="w-3.5 h-3.5" /> Dark
            </motion.button>
          </div>
        </div>

        <div>
          <p className={`text-xs ${labelColor} mb-2 font-medium uppercase tracking-wider`}>Font Style</p>
          <div className="flex gap-2">
            {(['modern', 'classic', 'playful'] as const).map((style) => (
              <motion.button key={style} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setFontStyle(style)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize"
                style={{ background: fontStyle === style ? btnActiveBg : btnInactiveBg, border: `1px solid ${fontStyle === style ? btnActiveBorder : btnInactiveBorder}`, color: fontStyle === style ? btnActiveColor : btnInactiveColor, ...fontStyles[style] }}
              >
                {style}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-xl overflow-hidden border ${previewBorder} shadow-lg`}>
        <motion.div layout className="p-3" style={{ background: isPreviewDark ? '#0f0f1a' : '#ffffff', transition: 'background 0.4s ease' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: accentColor }} />
              <span className="text-[9px] font-bold" style={{ color: isPreviewDark ? '#fff' : '#111', ...fontStyles[fontStyle] }}>Brand</span>
            </div>
            <div className="flex gap-2">
              <div className="w-5 h-1 rounded" style={{ background: isPreviewDark ? '#ffffff20' : '#00000015' }} />
              <div className="w-5 h-1 rounded" style={{ background: isPreviewDark ? '#ffffff20' : '#00000015' }} />
            </div>
          </div>

          <div className="rounded-lg p-3 mb-2 text-center" style={{ background: isPreviewDark ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)` : `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`, transition: 'background 0.4s ease' }}>
            <motion.h3 layout className="text-[11px] font-bold mb-1" style={{ color: isPreviewDark ? '#fff' : '#111', ...fontStyles[fontStyle] }}>Build something amazing</motion.h3>
            <p className="text-[8px] mb-2" style={{ color: isPreviewDark ? '#ffffff80' : '#00000060' }}>Create stunning websites with AI</p>
            <motion.div layout className="inline-block px-2.5 py-1 rounded-full text-[8px] font-medium text-white" style={{ background: accentColor, transition: 'background 0.3s ease' }}>Get Started</motion.div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {[1, 2, 3].map((i) => (
              <motion.div key={i} layout className="rounded-md p-1.5 text-center"
                style={{ background: isPreviewDark ? '#ffffff08' : '#00000005', border: `1px solid ${isPreviewDark ? '#ffffff10' : '#00000008'}`, transition: 'background 0.4s ease' }}
              >
                <div className="w-3 h-3 rounded mx-auto mb-0.5" style={{ background: `${accentColor}40` }} />
                <div className="w-5 h-0.5 rounded mx-auto mb-0.5" style={{ background: isPreviewDark ? '#ffffff20' : '#00000015' }} />
                <div className="w-7 h-0.5 rounded mx-auto" style={{ background: isPreviewDark ? '#ffffff10' : '#00000008' }} />
              </motion.div>
            ))}
          </div>

          <div className="rounded-md p-1.5 flex items-center justify-between" style={{ background: isPreviewDark ? '#ffffff05' : '#00000003', transition: 'background 0.4s ease' }}>
            <div className="w-4 h-0.5 rounded" style={{ background: isPreviewDark ? '#ffffff15' : '#00000010' }} />
            <div className="w-6 h-0.5 rounded" style={{ background: isPreviewDark ? '#ffffff10' : '#00000008' }} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
