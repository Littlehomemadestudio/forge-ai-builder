'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import LandingPage from '@/components/landing/LandingPage'
import { LoginPage } from '@/components/auth/LoginPage'
import { RegisterPage } from '@/components/auth/RegisterPage'
import DashboardPage from '@/components/dashboard/DashboardPage'
import BuilderPage from '@/components/builder/BuilderPage'
import EditorPage from '@/components/editor/EditorPage'

export default function Home() {
  const currentView = useAppStore((s) => s.currentView)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
