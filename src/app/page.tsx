'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import dynamic from 'next/dynamic'

// Static import for landing page (first thing user sees)
import LandingPage from '@/components/landing/LandingPage'
import { HtmlDirLangSync } from '@/components/ui/HtmlDirLangSync'

// Lazy load all other pages - they're only needed when user navigates to them
const LoginPage = dynamic(() => import('@/components/auth/LoginPage').then(m => ({ default: m.LoginPage })), { ssr: false })
const RegisterPage = dynamic(() => import('@/components/auth/RegisterPage').then(m => ({ default: m.RegisterPage })), { ssr: false })
const DashboardPage = dynamic(() => import('@/components/dashboard/DashboardPage'), { ssr: false })
const BuilderPage = dynamic(() => import('@/components/builder/BuilderPage'), { ssr: false })
const EditorPage = dynamic(() => import('@/components/editor/EditorPage'), { ssr: false })

export default function Home() {
  const currentView = useAppStore((s) => s.currentView)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Keeps <html lang/dir> + .rtl-ui class in sync with uiLanguage store */}
      <HtmlDirLangSync />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 flex flex-col"
        >
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'login' && <LoginPage />}
          {currentView === 'register' && <RegisterPage />}
          {currentView === 'forgot-password' && <LoginPage />}
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'builder' && <BuilderPage />}
          {currentView === 'editor' && <EditorPage />}
          {currentView === 'project-settings' && <DashboardPage />}
          {currentView === 'templates' && <DashboardPage />}
          {currentView === 'deployments' && <DashboardPage />}
          {currentView === 'exports' && <DashboardPage />}
          {currentView === 'domains' && <DashboardPage />}
          {currentView === 'assets' && <DashboardPage />}
          {currentView === 'billing' && <DashboardPage />}
          {currentView === 'profile' && <DashboardPage />}
          {currentView === 'settings' && <DashboardPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
