'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
  User,
  AlertCircle,
  Check,
  Shield,
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

/* ── Password Strength ──────────────────────────────────── */
function getPasswordStrength(password: string) {
  let score = 0
  const checks: { label: string; passed: boolean }[] = []

  const lengthOk = password.length >= 8
  if (lengthOk) score += 1
  checks.push({ label: 'At least 8 characters', passed: lengthOk })

  const upperOk = /[A-Z]/.test(password)
  if (upperOk) score += 1
  checks.push({ label: 'One uppercase letter', passed: upperOk })

  const lowerOk = /[a-z]/.test(password)
  if (lowerOk) score += 1
  checks.push({ label: 'One lowercase letter', passed: lowerOk })

  const numOk = /\d/.test(password)
  if (numOk) score += 1
  checks.push({ label: 'One number', passed: numOk })

  const specialOk = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  if (specialOk) score += 1
  checks.push({ label: 'One special character', passed: specialOk })

  const levels = [
    { label: 'Very weak', color: 'bg-red-500', textColor: 'text-red-500' },
    { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-500' },
    { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
    { label: 'Very strong', color: 'bg-primary', textColor: 'text-primary' },
  ]

  const level = password.length === 0
    ? { label: '', color: 'bg-muted', textColor: 'text-muted-foreground' }
    : levels[Math.min(score, levels.length) - 1] || levels[0]

  return { score, checks, level, maxScore: 5 }
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

export function RegisterPage() {
  const { navigate, themeMode } = useAppStore()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address')
      return
    }
    // Username is optional but if provided, must be 3+ chars and alphanumeric/underscore
    if (username.trim() && !/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      setError('Username must be 3-20 characters (letters, numbers, underscore only)')
      return
    }
    if (!password) {
      setError('Please enter a password')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!termsAccepted) {
      setError('You must accept the terms of service')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Register the user in the database (creates bcrypt-hashed password)
      const registerRes = await fetch('/api/auth-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: name.trim(),
          email: email.trim(),
          username: username.trim() || undefined,
          password,
        }),
      })

      const registerData = await registerRes.json()

      if (!registerRes.ok) {
        setError(registerData.error || 'Registration failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Step 2: Sign in via NextAuth credentials provider so a session cookie is set
      const identifier = username.trim() || email.trim()
      const signInResult = await signIn('credentials', {
        identifier,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed — fall back to login page
        setError('Account created! Please sign in with your credentials.')
        setIsLoading(false)
        navigate('login')
        return
      }

      toast({
        title: 'Account created',
        description: 'Welcome to Forge! Your account has been created successfully.',
      })

      // The AppRouter will pick up the NextAuth session and sync to store,
      // but we also navigate directly to dashboard for instant feedback.
      navigate('dashboard')
    } catch (err) {
      console.error('Register error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setIsLoading(true)
    setError('')
    // Use real NextAuth Google OAuth — on first sign-in, the signIn callback
    // in src/lib/auth.ts will create the user in the database automatically.
    await signIn('google', { callbackUrl: '/' })
    // No need to setIsLoading(false) — page will redirect to Google
  }

  const handleGithubRegister = async () => {
    setError('GitHub sign-in is not configured yet. Please use Google or email/password.')
  }

  return (
    <div className="min-h-screen flex justify-center bg-background p-4 sm:p-6 py-8">
      <motion.div
        className="w-full max-w-[960px] my-auto"
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
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border bg-card flex flex-col md:flex-row">
            {/* ── Left Panel: Form (scrollable when content overflows) ── */}
            <div className="flex-1 md:flex-[1.1] flex flex-col p-6 sm:p-8 md:p-10 md:max-h-[680px] md:overflow-y-auto">
              {/* Logo */}
              <motion.div variants={fadeInUp} className="mb-4">
                <ForgeLogo />
              </motion.div>

              {/* Heading */}
              <motion.div variants={fadeInUp} className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                  Create your account
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Start building with AI-powered tools
                </p>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-3"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social buttons */}
              <motion.div variants={fadeInUp} className="space-y-2.5 mb-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                  className="h-10 w-full bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg"
                >
                  <Chrome className="size-4 mr-2" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGithubRegister}
                  disabled={isLoading}
                  className="h-10 w-full bg-background border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg"
                >
                  <Github className="size-4 mr-2" />
                  Continue with GitHub
                </Button>
              </motion.div>

              {/* OR divider */}
              <motion.div variants={fadeInUp} className="relative flex items-center py-1.5">
                <Separator />
                <span className="absolute left-1/2 -translate-x-1/2 bg-card px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  or
                </span>
              </motion.div>

              {/* Register Form */}
              <motion.form variants={fadeInUp} onSubmit={handleRegister} className="flex flex-col gap-3 mt-2">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium tracking-wide">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError('') }}
                      disabled={isLoading}
                      className="h-10 pl-10 rounded-lg transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Username (optional) */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium tracking-wide">
                    Username <span className="text-muted-foreground/60 font-normal">(optional — for login)</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 flex items-center justify-center text-xs font-mono">@</span>
                    <Input
                      type="text"
                      placeholder="yourname"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setError('') }}
                      disabled={isLoading}
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="h-10 pl-10 rounded-lg transition-all duration-200"
                    />
                  </div>
                </div>

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
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      disabled={isLoading}
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

                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 pt-1"
                    >
                      {/* Strength bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength.score / passwordStrength.maxScore) * 100}%` }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={`h-full rounded-full ${passwordStrength.level.color}`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${passwordStrength.level.textColor}`}>
                          {passwordStrength.level.label}
                        </span>
                      </div>

                      {/* Strength criteria */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                        {passwordStrength.checks.map((check) => (
                          <div key={check.label} className="flex items-center gap-1.5">
                            {check.passed ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <div className="size-3 rounded-full border border-muted-foreground/30" />
                            )}
                            <span className={`text-xs ${check.passed ? 'text-emerald-500/80' : 'text-muted-foreground/50'}`}>
                              {check.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-medium tracking-wide">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                      disabled={isLoading}
                      className="h-10 pl-10 pr-10 rounded-lg transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {/* Password match indicator */}
                  {confirmPassword.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-1.5 pt-0.5"
                    >
                      {password === confirmPassword ? (
                        <>
                          <Check className="size-3 text-emerald-500" />
                          <span className="text-xs text-emerald-500/80">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="size-3 text-orange-500" />
                          <span className="text-xs text-orange-500/80">Passwords don&apos;t match</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-3 pt-1">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(checked === true)
                      setError('')
                    }}
                    disabled={isLoading}
                    className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none"
                  >
                    I agree to the{' '}
                    <span className="text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </span>
                  </Label>
                </div>

                {/* Create account button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 rounded-lg transition-all duration-300 font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </motion.form>

              {/* Footer link */}
              <motion.div variants={fadeInUp} className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('login')}
                    className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                  >
                    Sign in
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
          Free plan includes 100 AI credits. No credit card required.
        </motion.p>
      </motion.div>
    </div>
  )
}
