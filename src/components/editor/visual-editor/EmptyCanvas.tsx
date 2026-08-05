'use client'

// ─── Empty Canvas Start Screen ─────────────────────────────────────────────
// Professional onboarding experience when no HTML content exists.
// Clean, minimal design with 4 action cards, keyboard shortcut hint.
// Uses framer-motion for polished hover/click animations.
// Dark mode supported via Tailwind dark: variants.

import * as React from 'react'
import { motion, type Variants } from 'framer-motion'
import { Sparkles, LayoutTemplate, FilePlus, Upload } from 'lucide-react'

export interface EmptyCanvasProps {
  onAction: (action: string) => void
}

// ── Card data ──────────────────────────────────────────────────────────────
interface ActionCard {
  id: string
  icon: React.ElementType
  title: string
  description: string
  variant: 'primary' | 'secondary' | 'tertiary'
}

const CARDS: ActionCard[] = [
  {
    id: 'ai',
    icon: Sparkles,
    title: 'AI Generate',
    description: 'Describe your site',
    variant: 'primary',
  },
  {
    id: 'templates',
    icon: LayoutTemplate,
    title: 'Templates',
    description: 'Browse templates',
    variant: 'secondary',
  },
  {
    id: 'start-blank',
    icon: FilePlus,
    title: 'Start Blank',
    description: 'Empty canvas',
    variant: 'tertiary',
  },
  {
    id: 'paste',
    icon: Upload,
    title: 'Import HTML',
    description: 'Paste your HTML',
    variant: 'tertiary',
  },
]

// ── Variant styles ─────────────────────────────────────────────────────────
const VARIANT_STYLES = {
  primary: {
    container:
      'border-2 border-blue-500/40 bg-blue-50/50 dark:border-blue-400/40 dark:bg-blue-950/30',
    containerHover:
      'hover:border-blue-500/70 hover:bg-blue-50/80 dark:hover:border-blue-400/70 dark:hover:bg-blue-950/50',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-gray-900 dark:text-gray-100',
    descColor: 'text-blue-600/70 dark:text-blue-400/70',
  },
  secondary: {
    container:
      'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50',
    containerHover:
      'hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-600 dark:hover:bg-gray-800/80',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
    titleColor: 'text-gray-900 dark:text-gray-100',
    descColor: 'text-gray-500 dark:text-gray-400',
  },
  tertiary: {
    container:
      'border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50',
    containerHover:
      'hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-600 dark:hover:bg-gray-800/80',
    iconBg: 'bg-gray-100 dark:bg-gray-700/60',
    iconColor: 'text-gray-600 dark:text-gray-400',
    titleColor: 'text-gray-900 dark:text-gray-100',
    descColor: 'text-gray-500 dark:text-gray-400',
  },
}

// ── Animation variants ─────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

// ─── Component ─────────────────────────────────────────────────────────────
export function EmptyCanvas({ onAction }: EmptyCanvasProps) {
  return (
    <section
      aria-label="Get started"
      className="relative flex h-full flex-col items-center justify-center px-6 py-10"
    >
      {/* Clean canvas background — no animated gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.04)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(96,165,250,0.06)_0%,transparent_60%)]"
      />

      <motion.div
        className="relative z-10 flex max-w-lg flex-col items-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Heading ─────────────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Start building
          </h2>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Choose a starting point or begin with a blank canvas
          </p>
        </motion.div>

        {/* ── Action cards grid ────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          role="list"
          aria-label="Ways to start"
          className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {CARDS.map((card) => {
            const Icon = card.icon
            const vs = VARIANT_STYLES[card.variant]

            return (
              <motion.button
                key={card.id}
                type="button"
                role="listitem"
                initial={{ y: 0, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)' }}
                whileTap={{ y: 0, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22, mass: 1 }}
                onClick={() => onAction(card.id)}
                className={`
                  group relative flex items-start gap-3.5 rounded-xl p-4 text-left
                  transition-colors duration-150 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                  dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900
                  ${vs.container} ${vs.containerHover}
                `}
              >
                {/* Icon */}
                <span
                  aria-hidden="true"
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                    transition-colors duration-150
                    ${vs.iconBg} ${vs.iconColor}
                  `}
                >
                  <Icon size={20} strokeWidth={1.75} />
                </span>

                {/* Text */}
                <span className="flex flex-col gap-0.5 pt-0.5">
                  <span className={`text-sm font-semibold leading-tight ${vs.titleColor}`}>
                    {card.title}
                  </span>
                  <span className={`text-xs leading-snug ${vs.descColor}`}>
                    {card.description}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* ── Keyboard shortcut hint ──────────────────────────────────── */}
        <motion.p
          variants={itemVariants}
          className="text-xs text-gray-400 dark:text-gray-500"
        >
          Press{' '}
          <kbd className="mx-0.5 inline-flex h-5 items-center rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[11px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Ctrl
          </kbd>
          {' + '}
          <kbd className="mx-0.5 inline-flex h-5 items-center rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[11px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Shift
          </kbd>
          {' + '}
          <kbd className="mx-0.5 inline-flex h-5 items-center rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[11px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            P
          </kbd>
          {' '}for command palette
        </motion.p>
      </motion.div>
    </section>
  )
}
