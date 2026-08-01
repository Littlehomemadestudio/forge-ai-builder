'use client'

import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession, signIn } from 'next-auth/react'
import { useAppStore } from '@/lib/store'
import dynamic from 'next/dynamic'
import { AuthProvider } from '@/components/auth/AuthProvider'

// Static import for landing page (first thing user sees)
import LandingPage from '@/components/landing/LandingPage'
import { HtmlDirLangSync } from '@/components/ui/HtmlDirLangSync'

// Lazy load all other pages - they're only needed when user navigates to them
const LoginPage = dynamic(() => import('@/components/auth/LoginPage').then(m => ({ default: m.LoginPage })), { ssr: false })
const RegisterPage = dynamic(() => import('@/components/auth/RegisterPage').then(m => ({ default: m.RegisterPage })), { ssr: false })
const DashboardPage = dynamic(() => import('@/components/dashboard/DashboardPage'), { ssr: false })
const BuilderPage = dynamic(() => import('@/components/builder/BuilderPage'), { ssr: false })
const EditorPage = dynamic(() => import('@/components/editor/EditorPage'), { ssr: false })

// Protected views that require authentication
const PROTECTED_VIEWS = ['builder', 'dashboard', 'editor'] as const

function AppRouter() {
  const currentView = useAppStore((s) => s.currentView)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const navigate = useAppStore((s) => s.navigate)
  const login = useAppStore((s) => s.login)
  const { data: session, status } = useSession()

  // When NextAuth session loads, sync it to the Zustand store
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isAuthenticated) {
      login({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatarUrl: session.user.image,
        aiCredits: session.user.aiCredits,
        plan: session.user.plan,
      })
      // If user is on landing or login, redirect to dashboard
      const current = useAppStore.getState().currentView
      if (current === 'landing' || current === 'login' || current === 'register' || current === 'forgot-password') {
        navigate('dashboard')
      }
    }
  }, [status, session, isAuthenticated, login, navigate])

  // Auth gating: redirect to login if trying to access protected views without auth
  useEffect(() => {
    if (PROTECTED_VIEWS.includes(currentView as any) && !isAuthenticated && status !== 'loading') {
      navigate('login')
    }
  }, [currentView, isAuthenticated, status, navigate])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
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

export default function Home() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
