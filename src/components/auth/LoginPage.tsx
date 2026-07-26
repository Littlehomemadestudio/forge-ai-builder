'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
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
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export function LoginPage() {
  const { navigate, login } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200))

    login({
      id: '1',
      email: email.trim(),
      name: 'User',
      aiCredits: 100,
      plan: 'free',
    })

    toast({
      title: 'Welcome back',
      description: 'You\'ve successfully signed in to Forge.',
    })

    navigate('dashboard')
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    await new Promise((resolve) => setTimeout(resolve, 1000))

    login({
      id: '1',
      email: 'user@gmail.com',
      name: 'Google User',
      aiCredits: 100,
      plan: 'free',
    })

    toast({
      title: 'Welcome back',
      description: 'Signed in with Google successfully.',
    })

    navigate('dashboard')
    setIsLoading(false)
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)
    setError('')
    await new Promise((resolve) => setTimeout(resolve, 1000))

    login({
      id: '1',
      email: 'user@github.com',
      name: 'GitHub User',
      aiCredits: 100,
      plan: 'free',
    })

    toast({
      title: 'Welcome back',
      description: 'Signed in with GitHub successfully.',
    })

    navigate('dashboard')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d0d15] to-[#0a0a0f]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-violet-500/[0.07] via-teal-500/[0.03] to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-teal-500/[0.05] to-transparent rounded-full blur-3xl" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <motion.div
        className="relative z-10 w-full max-w-md px-4 sm:px-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Back button */}
        <motion.div variants={fadeInUp} className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('landing')}
            className="text-white/60 hover:text-white hover:bg-white/[0.06] -ml-2 transition-colors duration-200"
          >
            <ArrowLeft className="size-4 mr-1.5" />
            Back
          </Button>
        </motion.div>

        {/* Auth Card */}
        <motion.div variants={fadeInUp}>
          <Card className="bg-white/[0.04] border-white/[0.08] backdrop-blur-xl shadow-[0_0_80px_rgba(139,92,246,0.04)] rounded-2xl overflow-hidden">
            {/* Card gradient shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] via-transparent to-teal-500/[0.02] pointer-events-none" />

            <CardHeader className="pb-2 pt-8 px-8 space-y-1">
              {/* Logo */}
              <motion.div
                className="flex items-center justify-center mb-6"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-xl bg-gradient-to-br from-violet-500 to-teal-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <div className="absolute inset-0 bg-white/10 rounded-xl" />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="relative z-10">
                      <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                      <path d="M12 22V12" stroke="white" strokeWidth="1.5" />
                      <path d="M20 6L12 12L4 6" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold text-white tracking-tight">
                    Forge
                  </span>
                </div>
              </motion.div>

              <motion.h2
                className="text-2xl font-semibold text-white text-center tracking-tight"
                variants={fadeInUp}
              >
                Welcome back
              </motion.h2>
              <motion.p
                className="text-white/50 text-sm text-center"
                variants={fadeInUp}
              >
                Sign in to continue building with AI
              </motion.p>
            </CardHeader>

            <CardContent className="px-8 pb-2 space-y-5">
              {/* Error state */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-500/[0.1] border border-red-500/[0.2] text-red-400 text-sm"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Social login buttons */}
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="h-11 bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/80 hover:text-white transition-all duration-200 rounded-lg"
                >
                  <Chrome className="size-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                  className="h-11 bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/80 hover:text-white transition-all duration-200 rounded-lg"
                >
                  <Github className="size-4 mr-2" />
                  GitHub
                </Button>
              </motion.div>

              {/* Separator */}
              <motion.div variants={fadeInUp} className="relative flex items-center py-1">
                <Separator className="bg-white/[0.06]" />
                <span className="absolute left-1/2 -translate-x-1/2 bg-transparent px-3 text-xs text-white/30">
                  or
                </span>
              </motion.div>

              {/* Email login form */}
              <motion.form variants={fadeInUp} onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-3">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs font-medium tracking-wide">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError('') }}
                        disabled={isLoading}
                        className="h-11 pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20 rounded-lg transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <Label className="text-white/60 text-xs font-medium tracking-wide">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        disabled={isLoading}
                        className="h-11 pl-10 pr-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus-visible:border-violet-500/40 focus-visible:ring-violet-500/20 rounded-lg transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('forgot-password')}
                    className="text-xs text-white/40 hover:text-violet-400 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-500 hover:to-teal-400 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 rounded-lg transition-all duration-300 font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </motion.form>
            </CardContent>

            <CardFooter className="px-8 pt-2 pb-8">
              <motion.p variants={fadeInUp} className="text-sm text-white/40 text-center w-full">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => navigate('register')}
                  className="text-violet-400 hover:text-violet-300 transition-colors duration-200 font-medium"
                >
                  Sign up
                </button>
              </motion.p>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Bottom note */}
        <motion.p variants={fadeInUp} className="mt-8 text-center text-xs text-white/20">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  )
}
