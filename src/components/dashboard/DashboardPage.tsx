'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type DashboardTab } from '@/lib/store'
import { useTranslation } from '@/lib/useTranslation'
import { isRtl, type UiLanguage } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { toast } from '@/hooks/use-toast'
import {
  FolderOpen,
  Layers,
  Globe,
  Settings,
  CreditCard,
  User,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  PenTool,
  BarChart3,
  UtensilsCrossed,
  ShoppingCart,
  FileCode,
  Megaphone,
  CalendarDays,
  Moon,
  Sun,
  Home,
  Sparkles,
  Pencil,
  Check,
  X,
  ArrowLeft,
  LayoutDashboard,
  Clock,
  Zap,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProjectData {
  id: string
  name: string
  description: string | null
  prompt: string | null
  thumbnail: string | null
  status: string
  framework: string
  theme: string
  industry: string | null
  createdAt: string
  updatedAt: string
  pages?: { id: string; name: string; route: string }[]
  deployments?: { id: string; platform: string; url: string | null; status: string; createdAt: string }[]
}

interface UserData {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  plan: string
  aiCredits: number
  createdAt: string
  updatedAt: string
  projectCount: number
}

// ─── Constants ──────────────────────────────────────────────────────────────

const INDUSTRIES = ['portfolio', 'saas', 'restaurant', 'ecommerce', 'blog', 'agency', 'event', 'personal'] as const

const INDUSTRY_ICON_MAP: Record<string, React.ElementType> = {
  portfolio: PenTool,
  saas: BarChart3,
  restaurant: UtensilsCrossed,
  ecommerce: ShoppingCart,
  blog: FileCode,
  agency: Megaphone,
  event: CalendarDays,
  personal: User,
}

const STATUS_CONFIG: Record<string, { color: string; bgColor: string }> = {
  draft: { color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/40' },
  published: { color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/40' },
  archived: { color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800/40' },
}

const SIDEBAR_ITEMS: { tab: DashboardTab; icon: React.ElementType; labelKey: string }[] = [
  { tab: 'projects', icon: FolderOpen, labelKey: 'dashboard.projects' },
  { tab: 'templates', icon: Layers, labelKey: 'dashboard.templates' },
  { tab: 'deployments', icon: Globe, labelKey: 'dashboard.deployments' },
  { tab: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
  { tab: 'billing', icon: CreditCard, labelKey: 'dashboard.billing' },
]

// ─── Main Component ─────────────────────────────────────────────────────────

export function DashboardPage() {
  const t = useTranslation()
  const uiLanguage = useAppStore((s) => s.uiLanguage) as UiLanguage
  const dashboardTab = useAppStore((s) => s.dashboardTab)
  const setDashboardTab = useAppStore((s) => s.setDashboardTab)
  const navigate = useAppStore((s) => s.navigate)
  const themeMode = useAppStore((s) => s.themeMode)
  const setThemeMode = useAppStore((s) => s.setThemeMode)
  const selectProject = useAppStore((s) => s.selectProject)

  const rtl = isRtl(uiLanguage)

  // ─── State ────────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [industryFilter, setIndustryFilter] = useState<string>('all')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newIndustry, setNewIndustry] = useState('')
  const [newTheme, setNewTheme] = useState<string>('light')
  const [creating, setCreating] = useState(false)

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<ProjectData | null>(null)

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // ─── Data fetching ────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [projRes, userRes] = await Promise.all([
        fetch('/api/projects?userId=demo-user'),
        fetch('/api/user?userId=demo-user'),
      ])
      if (!projRes.ok || !userRes.ok) throw new Error('Fetch failed')
      const projData = await projRes.json()
      const userData = await userRes.json()
      setProjects(projData.projects || [])
      setUserData(userData.user || null)
    } catch {
      toast({ title: t('dashboard.fetchError'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ─── CRUD handlers ────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDescription.trim() || null,
          industry: newIndustry || null,
          theme: newTheme,
          userId: 'demo-user',
        }),
      })
      if (!res.ok) throw new Error('Create failed')
      const data = await res.json()
      setProjects((prev) => [data.project, ...prev])
      toast({ title: t('dashboard.projectCreated') })
      setCreateOpen(false)
      setNewName('')
      setNewDescription('')
      setNewIndustry('')
      setNewTheme('light')
      // Refresh user data to update project count
      const userRes = await fetch('/api/user?userId=demo-user')
      if (userRes.ok) {
        const ud = await userRes.json()
        setUserData(ud.user || null)
      }
    } catch {
      toast({ title: t('dashboard.createError'), variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast({ title: t('dashboard.projectDeleted') })
      setDeleteTarget(null)
      // Refresh user data
      const userRes = await fetch('/api/user?userId=demo-user')
      if (userRes.ok) {
        const ud = await userRes.json()
        setUserData(ud.user || null)
      }
    } catch {
      toast({ title: t('dashboard.deleteError'), variant: 'destructive' })
    }
  }

  const handleInlineEditSave = async (projectId: string) => {
    if (!editValue.trim()) {
      setEditingId(null)
      return
    }
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editValue.trim() }),
      })
      if (!res.ok) throw new Error('Update failed')
      const data = await res.json()
      setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, name: data.project.name } : p))
      toast({ title: t('dashboard.projectUpdated') })
    } catch {
      toast({ title: t('dashboard.updateError'), variant: 'destructive' })
    } finally {
      setEditingId(null)
    }
  }

  const handleOpenInBuilder = (project: ProjectData) => {
    selectProject(project.id)
    // Set builder prompt to existing project info
    useAppStore.getState().setBuilderPrompt(project.prompt || project.description || '')
    useAppStore.getState().setBuilderIndustry((project.industry as any) || 'portfolio')
    useAppStore.getState().setBuilderStyle((project.theme as any) || 'light')
    useAppStore.getState().setBuilderPhase('prompt')
    navigate('builder')
  }

  const handleBackToHome = () => {
    navigate('landing')
  }

  const handleToggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // ─── Filtering ────────────────────────────────────────────────────────────
  const filteredProjects = useMemo(() => {
    let result = projects
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter)
    }
    if (industryFilter !== 'all') {
      result = result.filter((p) => p.industry === industryFilter)
    }
    return result
  }, [projects, searchQuery, statusFilter, industryFilter])

  // ─── Stats ────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter((p) => p.status === 'published').length,
    draft: projects.filter((p) => p.status === 'draft').length,
    credits: userData?.aiCredits ?? 0,
  }), [projects, userData])

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setIndustryFilter('all')
  }

  // ─── Plan badge ───────────────────────────────────────────────────────────
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'pro':
        return { label: t('dashboard.planPro'), className: 'bg-primary text-primary-foreground' }
      case 'enterprise':
        return { label: t('dashboard.planEnterprise'), className: 'bg-amber-500 text-amber-50 dark:bg-amber-600 dark:text-amber-50' }
      default:
        return { label: t('dashboard.planFree'), className: 'bg-secondary text-secondary-foreground' }
    }
  }

  // ─── Industry label ───────────────────────────────────────────────────────
  const getIndustryLabel = (industry: string | null) => {
    if (!industry) return ''
    const key = `dashboard.industry${industry.charAt(0).toUpperCase() + industry.slice(1)}`
    return t(key)
  }

  // ─── Date format ──────────────────────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(uiLanguage === 'fa' ? 'fa-IR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // ─── Render helpers ───────────────────────────────────────────────────────
  const IndustryIcon = ({ industry }: { industry: string | null }) => {
    const IconComp = industry ? INDUSTRY_ICON_MAP[industry] || FolderOpen : FolderOpen
    return <IconComp className="h-4 w-4" />
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft
    return (
      <Badge variant="outline" className={`${config.color} ${config.bgColor} border-0 text-xs font-medium px-2 py-0.5`}>
        {status === 'draft' ? t('dashboard.filterDraft') :
         status === 'published' ? t('dashboard.filterPublished') :
         status === 'archived' ? t('dashboard.filterArchived') : status}
      </Badge>
    )
  }

  const ThemeIndicator = ({ theme }: { theme: string }) => (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span className={`inline-block h-3 w-3 rounded-full border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
      {theme === 'dark' ? t('dashboard.darkTheme') : t('dashboard.lightTheme')}
    </span>
  )

  // ─── Project card ─────────────────────────────────────────────────────────
  const ProjectCard = ({ project }: { project: ProjectData }) => {
    const isEditing = editingId === project.id

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group border border-border/60 bg-background hover:border-border hover:shadow-sm transition-all duration-200 overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Name (editable inline) */}
                {isEditing ? (
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleInlineEditSave(project.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      onBlur={() => handleInlineEditSave(project.id)}
                      autoFocus
                      className="h-7 text-sm font-medium"
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleInlineEditSave(project.id)}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(null)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <h3
                    className="text-sm font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors group/title"
                    onClick={() => {
                      setEditingId(project.id)
                      setEditValue(project.name)
                    }}
                    title={t('dashboard.editName')}
                  >
                    {project.name}
                    <Pencil className="h-3 w-3 opacity-0 group-hover/title:opacity-50 transition-opacity inline-block ml-1" />
                  </h3>
                )}

                {/* Description */}
                {project.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  <StatusBadge status={project.status} />
                  {project.industry && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <IndustryIcon industry={project.industry} />
                      {getIndustryLabel(project.industry)}
                    </span>
                  )}
                  <ThemeIndicator theme={project.theme} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => handleOpenInBuilder(project)}
                  title={t('dashboard.openInBuilder')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteTarget(project)}
                  title={t('dashboard.deleteProject')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // ─── Stat card ────────────────────────────────────────────────────────────
  const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) => (
    <Card className="border border-border/40 bg-secondary/30">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-border/40">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground leading-none">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // ─── Coming soon card ─────────────────────────────────────────────────────
  const ComingSoonCard = () => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 border border-border/40">
        <Sparkles className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mt-4">{t('dashboard.comingSoon')}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">{t('dashboard.comingSoonDesc')}</p>
    </div>
  )

  // ─── Empty state ──────────────────────────────────────────────────────────
  const EmptyState = ({ isFiltered }: { isFiltered: boolean }) => (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 border border-border/40">
        {isFiltered ? <Search className="h-8 w-8 text-muted-foreground" /> : <FolderOpen className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h2 className="text-lg font-semibold text-foreground mt-4">
        {isFiltered ? t('dashboard.noResults') : t('dashboard.noProjects')}
      </h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">
        {isFiltered ? '' : t('dashboard.createFirst')}
      </p>
      {isFiltered ? (
        <Button variant="outline" className="mt-4" onClick={clearFilters}>{t('dashboard.clearFilters')}</Button>
      ) : (
        <Button className="mt-4" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          {t('dashboard.newProject')}
        </Button>
      )}
    </div>
  )

  // ─── Loading skeleton ─────────────────────────────────────────────────────
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-border/40">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div>
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border border-border/40">
            <CardContent className="p-4 sm:p-5">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3 mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // ─── Sidebar ──────────────────────────────────────────────────────────────
  const SidebarSection = () => {
    const sidebarClass = sidebarCollapsed
      ? `w-14 ${rtl ? 'border-l' : 'border-r'} border-border/40 bg-background`
      : `w-52 ${rtl ? 'border-l' : 'border-r'} border-border/40 bg-background`

    return (
      <nav className={`${sidebarClass} hidden md:flex flex-col h-full transition-all duration-200`}>
        {/* Brand area */}
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2 px-3'} h-14 ${rtl ? 'border-l' : 'border-r'} border-border/40`}>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
            F
          </div>
          {!sidebarCollapsed && <span className="font-semibold text-foreground text-sm">Forge</span>}
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-auto text-muted-foreground"
              onClick={() => setSidebarCollapsed(true)}
            >
              <ArrowLeft className={`h-3.5 w-3.5 ${rtl ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </div>
        {sidebarCollapsed && (
          <div className="flex justify-center py-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => setSidebarCollapsed(false)}>
              <ArrowLeft className={`h-3.5 w-3.5 ${rtl ? '' : 'rotate-180'}`} />
            </Button>
          </div>
        )}
        <Separator />
        {/* Nav items */}
        <div className="flex-1 py-2 space-y-1 px-2">
          {SIDEBAR_ITEMS.map(({ tab, icon: Icon, labelKey }) => {
            const isActive = dashboardTab === tab
            return (
              <button
                key={tab}
                onClick={() => setDashboardTab(tab)}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2.5'} w-full rounded-md px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
                title={sidebarCollapsed ? t(labelKey) : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{t(labelKey)}</span>}
              </button>
            )
          })}
        </div>
      </nav>
    )
  }

  // ─── Mobile bottom tab bar ────────────────────────────────────────────────
  const MobileTabBar = () => (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border/40 flex items-center justify-around h-14 px-1 safe-area-bottom">
      {SIDEBAR_ITEMS.slice(0, 4).map(({ tab, icon: Icon, labelKey }) => {
        const isActive = dashboardTab === tab
        return (
          <button
            key={tab}
            onClick={() => setDashboardTab(tab)}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-md transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            <span className="text-[10px] font-medium leading-tight">{t(labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )

  // ─── Header ───────────────────────────────────────────────────────────────
  const HeaderSection = () => {
    const planInfo = userData ? getPlanBadge(userData.plan) : null
    return (
      <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-border/40 bg-background shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleBackToHome}>
            <Home className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">{t('dashboard.backToHome')}</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground">{userData?.name || 'Demo User'}</span>
            {planInfo && (
              <Badge className={`${planInfo.className} text-xs font-medium px-2 py-0.5 border-0`}>
                {planInfo.label}
              </Badge>
            )}
            {userData && (
              <Badge variant="outline" className="text-xs font-medium px-2 py-0.5 border-border/60 text-muted-foreground">
                {t('dashboard.creditsRemaining', { n: userData.aiCredits })}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher variant="pill" compact />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleToggleTheme}>
            {themeMode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>
    )
  }

  // ─── Projects tab content ─────────────────────────────────────────────────
  const ProjectsTab = () => (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={LayoutDashboard} value={stats.total} label={t('dashboard.statTotal')} />
        <StatCard icon={Globe} value={stats.published} label={t('dashboard.statPublished')} />
        <StatCard icon={PenTool} value={stats.draft} label={t('dashboard.statDraft')} />
        <StatCard icon={Zap} value={stats.credits} label={t('dashboard.statCredits')} />
      </div>

      {/* Search & filters + New project button */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('dashboard.searchPlaceholder')}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          {(['all', 'draft', 'published', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              {s === 'all' ? t('dashboard.filterAll') :
               s === 'draft' ? t('dashboard.filterDraft') :
               s === 'published' ? t('dashboard.filterPublished') :
               t('dashboard.filterArchived')}
            </button>
          ))}
        </div>
        {/* Industry filter */}
        <Select value={industryFilter} onValueChange={(v) => setIndustryFilter(v)}>
          <SelectTrigger className="h-9 w-auto min-w-[120px] text-xs">
            <SelectValue placeholder={t('dashboard.filterIndustry')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('dashboard.filterAll')}</SelectItem>
            {INDUSTRIES.map((ind) => (
              <SelectItem key={ind} value={ind}>{getIndustryLabel(ind)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="h-9 shrink-0" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          {t('dashboard.newProject')}
        </Button>
      </div>

      {/* Project grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredProjects.length === 0 ? (
        <EmptyState isFiltered={searchQuery.trim() || statusFilter !== 'all' || industryFilter !== 'all'} />
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )

  // ─── Tab content ──────────────────────────────────────────────────────────
  const TabContent = () => {
    if (dashboardTab === 'projects') return <ProjectsTab />
    return <ComingSoonCard />
  }

  // ─── Main layout ──────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col ${rtl ? 'rtl-ui' : 'ltr-ui'}`} dir={rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <HeaderSection />

      {/* Body: sidebar + content */}
      <div className="flex-1 flex overflow-hidden">
        <SidebarSection />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
            <TabContent />
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <MobileTabBar />

      {/* ─── Create Dialog ──────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dashboard.createProject')}</DialogTitle>
            <DialogDescription>{t('dashboard.createFirst')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-foreground">{t('dashboard.projectName')}</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t('dashboard.projectNamePlaceholder')}
                className="mt-1.5 h-9 text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t('dashboard.projectDescription')}</label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder={t('dashboard.projectDescriptionPlaceholder')}
                className="mt-1.5 text-sm min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t('dashboard.industry')}</label>
              <Select value={newIndustry} onValueChange={(v) => setNewIndustry(v)}>
                <SelectTrigger className="mt-1.5 h-9 text-sm">
                  <SelectValue placeholder={t('dashboard.industry')} />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>{getIndustryLabel(ind)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t('dashboard.theme')}</label>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  onClick={() => setNewTheme('light')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    newTheme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-border/40 text-muted-foreground hover:border-border'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  {t('dashboard.lightTheme')}
                </button>
                <button
                  onClick={() => setNewTheme('dark')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    newTheme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-border/40 text-muted-foreground hover:border-border'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  {t('dashboard.darkTheme')}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || creating}>
              {creating ? t('common.loading') : t('dashboard.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dashboard.deleteProject')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? t('dashboard.deleteConfirm', { name: deleteTarget.name }) : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              {t('dashboard.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DashboardPage
