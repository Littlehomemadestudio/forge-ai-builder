'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  Chrome,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Hexagon,
  Zap,
  LayoutTemplate,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

/* ── Forge Logo Component ──────────────────────────────────── */
function ForgeLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative size-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
        <div className="absolute inset-0 bg-white/10 rounded-xl" />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="relative z-10 text-primary-foreground">
          <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 6L12 12L4 6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Forge
      </span>
    </div>
  )
}

/* ── Right Panel Component ──────────────────────────────────── */
function RightPanel() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.55 0.25 270), oklch(0.65 0.2 200), oklch(0.55 0.22 140))' }}>
      {/* Abstract geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large morphing blob */}
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] animate-morph bg-white/[0.08] mix-blend-overlay" />
        <div className="absolute -bottom-16 -left-16 w-[250px] h-[250px] animate-morph bg-white/[0.12] mix-blend-overlay" style={{ animationDelay: '-3s' }} />
        {/* Floating hexagons */}
        <motion.div
          className="absolute top-[15%] left-[10%] opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Hexagon className="size-8 text-white" />
        </motion.div>
        <motion.div
          className="absolute top-[60%] right-[15%] opacity-15"
          animate={{ y: [0, -10, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Hexagon className="size-6 text-white" />
        </motion.div>
        <motion.div
          className="absolute bottom-[20%] left-[30%] opacity-10"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Hexagon className="size-12 text-white" />
        </motion.div>
        {/* Grid dots pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-xs"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="inline-flex items-center gap-1.5 bg-white/[0.15] backdrop-blur-sm rounded-full px-3 py-1.5 mb-6 border border-white/[0.2]"
        >
          <Sparkles className="size-3.5 text-white" />
          <span className="text-xs font-medium text-white tracking-wide">
            AI-Powered Builder
          </span>
        </motion.div>

        {/* Headline */}
        <h3 className="text-2xl font-bold text-white mb-3 leading-tight tracking-tight">
          Build stunning websites with AI
        </h3>
        <p className="text-white/80 text-sm leading-relaxed mb-8">
          Describe your vision. Forge generates, edits, and deploys — all in one platform.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1.5">
              <div className="size-8 rounded-lg bg-white/[0.12] flex items-center justify-center">
                <Globe className="size-4 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">10K+</span>
            <p className="text-xs text-white/60 mt-0.5">Sites built</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1.5">
              <div className="size-8 rounded-lg bg-white/[0.12] flex items-center justify-center">
                <LayoutTemplate className="size-4 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">500+</span>
            <p className="text-xs text-white/60 mt-0.5">Templates</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1.5">
              <div className="size-8 rounded-lg bg-white/[0.12] flex items-center justify-center">
                <Zap className="size-4 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">100%</span>
            <p className="text-xs text-white/60 mt-0.5">Free start</p>
          </div>
        </div>

        {/* CTA arrow */}
        <motion.div
          className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span>Start building today</span>
          <ArrowRight className="size-4" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export function LoginPage() {
  const { navigate, login, themeMode, isAuthenticated } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)

    // Use NextAuth credentials provider for real auth
    const result = await signIn('credentials', {
      email: email.trim(),
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password. Try again or use Google sign-in.')
      setIsLoading(false)
      return
    }

    // If successful, the session will be picked up by the AuthProvider/useSession
    // The AppRouter useEffect will sync it to the store and redirect
    // But as a fallback, we can also manually set it
    try {
      const res = await fetch(`/api/user?userIdByEmail=${encodeURIComponent(email.trim())}`)
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          login({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatarUrl: data.user.avatarUrl,
            aiCredits: data.user.aiCredits,
            plan: data.user.plan,
          })
          navigate('dashboard')
        }
      }
    } catch {
      // Fallback: just navigate, session sync will handle it
      navigate('dashboard')
    }

    toast({
      title: 'Welcome back',
      description: 'You\'ve successfully signed in to Forge.',
    })

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    // Use real NextAuth Google OAuth
    await signIn('google', { callbackUrl: '/' })
    // No need to setIsLoading(false) — page will redirect
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)
    setError('')
    // GitHub isn't configured in NextAuth yet, so fallback to demo user
    await new Promise((resolve) => setTimeout(resolve, 1000))
    login({
      id: 'demo-user',
      email: 'demo@forge.ai',
      name: 'Demo User',
      aiCredits: 100,
      plan: 'free',
    })
    toast({
      title: 'Welcome back',
      description: 'Signed in with GitHub successfully (demo mode).',
    })
    navigate('dashboard')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6">
      <motion.div
        className="w-full max-w-[960px]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Back button */}
        <motion.div variants={fadeInUp} className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('landing')}
            className="text-muted-foreground hover:text-foreground -ml-2 transition-colors duration-200"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Back to home
          </Button>
        </motion.div>

        {/* Split-screen Card */}
        <motion.div variants={fadeInUp}>
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border bg-card flex flex-col md:flex-row md:h-[560px]">
            {/* ── Left Panel: Form ────────────────────── */}
            <div className="flex-1 md:flex-[1.1] flex flex-col p-6 sm:p-8 md:p-10">
              {/* Logo */}
              <motion.div variants={fadeInUp} className="mb-5">
                <ForgeLogo />
              </motion.div>

              {/* Heading */}
              <motion.div variants={fadeInUp} className="mb-5">
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                  Sign in to start building
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Create AI-powered websites with Forge
                </p>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social buttons — Google is primary */}
              <motion.div variants={fadeInUp} className="space-y-2.5 mb-4">
                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="h-10 w-full bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg font-medium"
                >
                  <Chrome className="size-4 mr-2" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                  className="h-10 w-full bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg"
                >
                  <Github className="size-4 mr-2" />
                  Continue with GitHub
                </Button>
              </motion.div>

              {/* OR divider */}
              <motion.div variants={fadeInUp} className="relative flex items-center py-2">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 bg-card px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  or
                </span>
              </motion.div>

              {/* Email/Password Form */}
              <motion.form variants={fadeInUp} onSubmit={handleLogin} className="flex-1 flex flex-col gap-3.5 mt-2">
                {/* Email */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium tracking-wide">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      disabled={isLoading}
                      className="h-10 pl-10 rounded-lg transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium tracking-wide">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="h-10 pl-10 pr-10 rounded-lg transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('forgot-password')}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit button - pushed to bottom */}
                <div className="flex-1" />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 rounded-lg transition-all duration-300 font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </motion.form>

              {/* Footer link */}
              <motion.div variants={fadeInUp} className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => navigate('register')}
                    className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            </div>

            {/* ── Divider (visible on md+) ────────────── */}
            <div className="hidden md:block w-px bg-border" />

            {/* ── Right Panel: Marketing (hidden on mobile) ── */}
            <div className="hidden md:flex md:flex-[1]">
              <RightPanel />
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.p variants={fadeInUp} className="mt-5 text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  )
}
