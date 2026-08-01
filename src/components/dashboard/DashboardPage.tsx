'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
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
  Activity,
  Eye,
  Play,
  ChevronDown,
  RefreshCw,
  Shield,
  LogOut,
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
  pages?: { id: string; name: string; route: string; html?: string; css?: string }[]
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

interface ActivityItem {
  id: string
  type: 'project_created' | 'project_published' | 'project_archived' | 'page_generated' | 'deployment'
  message: string
  timestamp: number
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
  { tab: 'activity', icon: Activity, labelKey: 'dashboard.activity' },
  { tab: 'deployments', icon: Globe, labelKey: 'dashboard.deployments' },
  { tab: 'credits', icon: Zap, labelKey: 'dashboard.credits' },
  { tab: 'settings', icon: Settings, labelKey: 'dashboard.settings' },
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
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const user = useAppStore((s) => s.user)
  const logout = useAppStore((s) => s.logout)
  const { data: session } = useSession()

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

  // Preview dialog
  const [previewProject, setPreviewProject] = useState<ProjectData | null>(null)

  // Status change
  const [statusChangeTarget, setStatusChangeTarget] = useState<{ project: ProjectData; newStatus: string } | null>(null)

  // Activity feed
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([])

  // ─── Data fetching ────────────────────────────────────────────────────────
  const userId = user?.id || 'demo-user'

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [projRes, userRes] = await Promise.all([
        fetch(`/api/projects?userId=${userId}`),
        fetch(`/api/user?userId=${userId}`),
      ])
      if (!projRes.ok || !userRes.ok) throw new Error('Fetch failed')
      const projData = await projRes.json()
      const userDataResp = await userRes.json()
      setProjects(projData.projects || [])
      setUserData(userDataResp.user || null)

      // Generate activity items from project data
      const activities: ActivityItem[] = (projData.projects || []).flatMap((p: ProjectData) => [
        {
          id: `act-create-${p.id}`,
          type: 'project_created' as const,
          message: `Created "${p.name}"`,
          timestamp: new Date(p.createdAt).getTime(),
        },
        ...(p.status === 'published' ? [{
          id: `act-pub-${p.id}`,
          type: 'project_published' as const,
          message: `Published "${p.name}"`,
          timestamp: new Date(p.updatedAt).getTime(),
        }] : []),
      ])
      setActivityItems(activities.sort((a, b) => b.timestamp - a.timestamp))
    } catch {
      toast({ title: t('dashboard.fetchError'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [t, userId])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [fetchData, isAuthenticated])

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
          userId,
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
      // Add to activity
      setActivityItems((prev) => [{
        id: `act-create-${data.project.id}`,
        type: 'project_created',
        message: `Created "${data.project.name}"`,
        timestamp: Date.now(),
      }, ...prev])
      // Refresh user data to update project count
      const userRes = await fetch(`/api/user?userId=${userId}`)
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
      setActivityItems((prev) => [{
        id: `act-del-${deleteTarget.id}`,
        type: 'project_created',
        message: `Deleted "${deleteTarget.name}"`,
        timestamp: Date.now(),
      }, ...prev])
      setDeleteTarget(null)
      const userRes = await fetch(`/api/user?userId=${userId}`)
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

  const handleStatusChange = async () => {
    if (!statusChangeTarget) return
    const { project, newStatus } = statusChangeTarget
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Status update failed')
      const data = await res.json()
      setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, status: data.project.status } : p))
      toast({ title: `Status changed to ${newStatus}` })
      setActivityItems((prev) => [{
        id: `act-status-${project.id}-${Date.now()}`,
        type: newStatus === 'published' ? 'project_published' : 'project_archived',
        message: `${newStatus === 'published' ? 'Published' : 'Archived'} "${project.name}"`,
        timestamp: Date.now(),
      }, ...prev])
    } catch {
      toast({ title: t('dashboard.updateError'), variant: 'destructive' })
    } finally {
      setStatusChangeTarget(null)
    }
  }

  const handleOpenInBuilder = (project: ProjectData) => {
    selectProject(project.id)
    useAppStore.getState().setBuilderPrompt(project.prompt || project.description || '')
    useAppStore.getState().setBuilderIndustry((project.industry as any) || 'portfolio')
    useAppStore.getState().setBuilderStyle((project.theme as any) || 'light')
    useAppStore.getState().setBuilderPhase('prompt')
    navigate('builder')
  }

  const handlePreview = (project: ProjectData) => {
    setPreviewProject(project)
  }

  const handleBackToHome = () => {
    navigate('landing')
  }

  const handleSignOut = async () => {
    // Clear local store first for instant UI feedback
    logout()
    // Then revoke the NextAuth session (also clears the session cookie)
    try {
      await signOut({ redirect: false })
    } catch (err) {
      console.error('Sign out error:', err)
    }
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
    const previewRef = useRef<HTMLIFrameElement>(null)

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

                {/* Mini preview for projects with pages */}
                {project.pages && project.pages.length > 0 && project.pages[0].html && (
                  <div className="mt-3 rounded-md overflow-hidden border border-border/40 bg-muted/30 relative group/preview cursor-pointer" onClick={() => handlePreview(project)}>
                    <iframe
                      ref={previewRef}
                      srcDoc={project.pages[0].html}
                      title={`${project.name} preview`}
                      className="w-full h-32 origin-top-left scale-[0.25] pointer-events-none"
                      style={{ width: '400%', height: '128px' }}
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                  </div>
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
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-primary"
                  onClick={() => handleOpenInBuilder(project)}
                  title={t('dashboard.openInBuilder')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-primary"
                  onClick={() => handlePreview(project)}
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {/* Status dropdown */}
                <Select
                  value={project.status}
                  onValueChange={(v) => setStatusChangeTarget({ project, newStatus: v })}
                >
                  <SelectTrigger className="h-10 w-10 border-0 p-0 [&>svg]:hidden">
                    <span className="sr-only">Change status</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:text-destructive"
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

  // ─── Activity item ────────────────────────────────────────────────────────
  const ActivityItemRow = ({ item }: { item: ActivityItem }) => {
    const iconMap: Record<string, React.ElementType> = {
      project_created: Plus,
      project_published: Globe,
      project_archived: Shield,
      page_generated: Sparkles,
      deployment: Play,
    }
    const Icon = iconMap[item.type] || Activity
    return (
      <div className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/50 border border-border/40">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate">{item.message}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(item.timestamp).toLocaleDateString()} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    )
  }

  // ─── Credits tab ──────────────────────────────────────────────────────────
  const CreditsTab = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Zap} value={userData?.aiCredits ?? 0} label={t('dashboard.statCredits')} />
        <StatCard icon={Sparkles} value={projects.length} label="Sites Generated" />
        <StatCard icon={LayoutDashboard} value={stats.published} label={t('dashboard.statPublished')} />
      </div>
      <Card className="border border-border/40 bg-secondary/30">
        <CardContent className="p-5 sm:p-6">
          <h3 className="text-base font-semibold text-foreground mb-3">AI Credits Usage</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available Credits</span>
              <span className="font-semibold text-foreground">{userData?.aiCredits ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Used Credits</span>
              <span className="font-semibold text-foreground">{10 - (userData?.aiCredits ?? 0)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Plan</span>
              <Badge className={`${getPlanBadge(userData?.plan || 'free').className} text-xs font-medium px-2 py-0.5 border-0`}>
                {getPlanBadge(userData?.plan || 'free').label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Each site generation uses 1 AI credit. Upgrade to Pro for 100 credits/month.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // ─── Activity tab ─────────────────────────────────────────────────────────
  const ActivityTab = () => (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-foreground">Activity Feed</h2>
      {activityItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Activity className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground mt-3">No activity yet. Create a project to get started.</p>
        </div>
      ) : (
        <Card className="border border-border/40">
          <CardContent className="p-4">
            <div className="max-h-96 overflow-y-auto">
              {activityItems.slice(0, 20).map((item) => (
                <ActivityItemRow key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border border-border/40">
            <CardContent className="p-4 sm:p-5">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3 mb-2" />
              <Skeleton className="h-32 w-full rounded-md mb-2" />
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border/40 flex items-center justify-around h-14 px-1 safe-area-inset-bottom">
      {SIDEBAR_ITEMS.slice(0, 4).map(({ tab, icon: Icon, labelKey }) => {
        const isActive = dashboardTab === tab
        return (
          <button
            key={tab}
            onClick={() => setDashboardTab(tab)}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2.5 rounded-md transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-medium leading-tight">{t(labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )

  // ─── Header ───────────────────────────────────────────────────────────────
  const HeaderSection = () => {
    const planInfo = userData ? getPlanBadge(userData.plan) : null
    return (
      <header className="min-h-14 flex items-center justify-between px-4 sm:px-6 border-b border-border/40 bg-background shrink-0 flex-wrap gap-y-1">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" size="sm" className="text-muted-foreground shrink-0" onClick={handleBackToHome}>
            <Home className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">{t('dashboard.backToHome')}</span>
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-medium text-sm text-foreground truncate max-w-[120px]">{userData?.name || 'User'}</span>
            {planInfo && (
              <Badge className={`${planInfo.className} text-xs font-medium px-2 py-0.5 border-0 hidden sm:inline-flex`}>
                {planInfo.label}
              </Badge>
            )}
            {userData && (
              <Badge variant="outline" className="text-xs font-medium px-2 py-0.5 border-border/60 text-muted-foreground hidden sm:inline-flex">
                {t('dashboard.creditsRemaining', { n: userData.aiCredits })}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher variant="pill" compact />
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleToggleTheme}>
            {themeMode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1.5">Sign out</span>
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
    if (dashboardTab === 'activity') return <ActivityTab />
    if (dashboardTab === 'credits') return <CreditsTab />
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 border border-border/40">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mt-4">{t('dashboard.comingSoon')}</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs text-center">{t('dashboard.comingSoonDesc')}</p>
      </div>
    )
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

      {/* ─── Status Change Confirmation ────────────────────────────────────── */}
      <AlertDialog open={!!statusChangeTarget} onOpenChange={(open) => !open && setStatusChangeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Project Status</AlertDialogTitle>
            <AlertDialogDescription>
              {statusChangeTarget
                ? `Are you sure you want to change "${statusChangeTarget.project.name}" status to "${statusChangeTarget.newStatus}"?`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              Change Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Preview Dialog ────────────────────────────────────────────────── */}
      <Dialog open={!!previewProject} onOpenChange={(open) => !open && setPreviewProject(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] w-[calc(100vw-2rem)]">
          <DialogHeader>
            <DialogTitle>{previewProject?.name || 'Project Preview'}</DialogTitle>
            <DialogDescription>
              {previewProject?.description || 'Preview of your project'}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh] rounded-lg border border-border/40">
            {previewProject?.pages && previewProject.pages.length > 0 && previewProject.pages[0].html ? (
              <iframe
                srcDoc={previewProject.pages[0].html}
                title={`${previewProject.name} Preview`}
                className="w-full h-[400px] bg-white border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Eye className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground mt-3">No preview available yet. Open in Builder to generate content.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewProject(null)}>Close</Button>
            <Button onClick={() => {
              if (previewProject) handleOpenInBuilder(previewProject)
              setPreviewProject(null)
            }}>
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open in Builder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DashboardPage
