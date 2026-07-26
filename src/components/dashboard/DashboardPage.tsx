'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type DashboardTab } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import {
  LayoutDashboard,
  FolderOpen,
  Layers,
  Globe,
  Download,
  ImageIcon,
  Sparkles,
  Settings,
  CreditCard,
  User,
  Activity,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  Code2,
  Rocket,
  Palette,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  MoreVertical,
  Clock,
  Zap,
  ChevronDown,
  FileCode,
  Shield,
  Bell,
  Eye,
  Moon,
  Sun,
  LayoutGrid,
  Store,
  UtensilsCrossed,
  Megaphone,
  PenTool,
  ShoppingCart,
  BarChart3,
  Globe2,
  Server,
  HardDrive,
  Wallet,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
} from 'lucide-react'

// ── Demo Data ───────────────────────────────────────────────────────────

const DEMO_PROJECTS = [
  {
    id: 'p1',
    name: 'Aurora Studio',
    description: 'Creative portfolio for a digital design studio with 3D showcases and interactive galleries.',
    status: 'published',
    framework: 'React',
    theme: 'dark',
    createdAt: '2025-12-01',
    updatedAt: '2026-01-15',
  },
  {
    id: 'p2',
    name: 'Meridian SaaS',
    description: 'Analytics dashboard for a B2B SaaS product with real-time data visualization.',
    status: 'draft',
    framework: 'Next.js',
    theme: 'light',
    createdAt: '2026-02-10',
    updatedAt: '2026-03-05',
  },
  {
    id: 'p3',
    name: 'Ember E-Commerce',
    description: 'Modern online storefront with AI-powered product recommendations and checkout flow.',
    status: 'published',
    framework: 'Vue',
    theme: 'custom',
    createdAt: '2026-01-20',
    updatedAt: '2026-02-28',
  },
]

const DEMO_TEMPLATES = [
  { id: 't1', name: 'Stellar Portfolio', category: 'Portfolio', description: 'Minimalist portfolio with smooth scroll and gallery lightbox.' },
  { id: 't2', name: 'Nova Storefront', category: 'E-commerce', description: 'Clean product showcase with cart and Stripe integration.' },
  { id: 't3', name: 'Prism SaaS Dashboard', category: 'SaaS', description: 'Data-rich dashboard with charts, tables, and auth pages.' },
  { id: 't4', name: 'Sakura Restaurant', category: 'Restaurant', description: 'Elegant menu display with reservation system and gallery.' },
  { id: 't5', name: 'Vertex Agency', category: 'Agency', description: 'Bold agency site with case studies and team showcase.' },
  { id: 't6', name: 'Chronicle Blog', category: 'Blog', description: 'Clean editorial layout with categories and search.' },
  { id: 't7', name: 'Zenith Landing Page', category: 'Landing Page', description: 'Conversion-optimized landing with A/B testing support.' },
  { id: 't8', name: 'Flux App', category: 'SaaS', description: 'Mobile-first SaaS app with onboarding and settings pages.' },
  { id: 't9', name: 'Oasis Travel', category: 'Portfolio', description: 'Travel portfolio with map integration and story format.' },
  { id: 't10', name: 'Crest Fashion', category: 'E-commerce', description: 'Luxury fashion storefront with lookbook and wishlist.' },
]

const DEMO_DEPLOYMENTS = [
  { id: 'd1', platform: 'Vercel', url: 'aurora-studio.vercel.app', status: 'live', date: '2026-01-15', project: 'Aurora Studio' },
  { id: 'd2', platform: 'Netlify', url: 'meridian-saas.netlify.app', status: 'failed', date: '2026-03-04', project: 'Meridian SaaS' },
  { id: 'd3', platform: 'AWS Amplify', url: 'ember-shop.amplify.app', status: 'live', date: '2026-02-28', project: 'Ember E-Commerce' },
  { id: 'd4', platform: 'Vercel', url: 'aurora-v2.vercel.app', status: 'building', date: '2026-03-10', project: 'Aurora Studio' },
]

const DEMO_EXPORTS = [
  { id: 'e1', format: 'HTML/CSS', date: '2026-01-10', project: 'Aurora Studio' },
  { id: 'e2', format: 'React Component', date: '2026-02-15', project: 'Meridian SaaS' },
  { id: 'e3', format: 'Static Site', date: '2026-02-28', project: 'Ember E-Commerce' },
]

const DEMO_DOMAINS = [
  { id: 'dom1', domain: 'aurora-studio.design', status: 'active', ssl: true, project: 'Aurora Studio' },
  { id: 'dom2', domain: 'meridian-analytics.io', status: 'pending', ssl: false, project: 'Meridian SaaS' },
  { id: 'dom3', domain: 'ember-shop.co', status: 'active', ssl: true, project: 'Ember E-Commerce' },
]

const DEMO_ASSETS = [
  { id: 'a1', name: 'hero-gradient.svg', type: 'SVG', size: '24 KB', date: '2026-01-05' },
  { id: 'a2', name: 'brand-logo.png', type: 'PNG', size: '156 KB', date: '2026-01-05' },
  { id: 'a3', name: 'dashboard-mock.webp', type: 'WebP', size: '420 KB', date: '2026-02-12' },
  { id: 'a4', name: 'app-icon-set.zip', type: 'ZIP', size: '1.2 MB', date: '2026-02-28' },
]

const DEMO_ACTIVITIES = [
  { id: 'act1', action: 'Published Aurora Studio', time: '2 hours ago', type: 'publish' },
  { id: 'act2', action: 'Generated new landing page for Meridian SaaS', time: '5 hours ago', type: 'generate' },
  { id: 'act3', action: 'Exported Ember E-Commerce as static site', time: '1 day ago', type: 'export' },
  { id: 'act4', action: 'Deployed Aurora Studio to Vercel', time: '3 days ago', type: 'deploy' },
  { id: 'act5', action: 'Created project Ember E-Commerce', time: '1 week ago', type: 'create' },
  { id: 'act6', action: 'Used 120 AI credits for page generation', time: '2 weeks ago', type: 'credits' },
]

const DEMO_CREDIT_HISTORY = [
  { date: 'Mar 1', used: 45, remaining: 855 },
  { date: 'Mar 2', used: 120, remaining: 735 },
  { date: 'Mar 3', used: 30, remaining: 705 },
  { date: 'Mar 4', used: 85, remaining: 620 },
  { date: 'Mar 5', used: 15, remaining: 605 },
  { date: 'Mar 6', used: 0, remaining: 605 },
  { date: 'Mar 7', used: 60, remaining: 545 },
]

// ── Sidebar Config ──────────────────────────────────────────────────────

const SIDEBAR_ITEMS: { tab: DashboardTab; icon: React.ReactNode; label: string }[] = [
  { tab: 'projects', icon: <FolderOpen size={18} />, label: 'Projects' },
  { tab: 'templates', icon: <Layers size={18} />, label: 'Templates' },
  { tab: 'deployments', icon: <Rocket size={18} />, label: 'Deployments' },
  { tab: 'exports', icon: <Download size={18} />, label: 'Exports' },
  { tab: 'domains', icon: <Globe size={18} />, label: 'Domains' },
  { tab: 'assets', icon: <ImageIcon size={18} />, label: 'Assets' },
  { tab: 'credits', icon: <Sparkles size={18} />, label: 'AI Credits' },
  { tab: 'settings', icon: <Settings size={18} />, label: 'Settings' },
  { tab: 'billing', icon: <CreditCard size={18} />, label: 'Billing' },
  { tab: 'profile', icon: <User size={18} />, label: 'Profile' },
  { tab: 'activity', icon: <Activity size={18} />, label: 'Activity' },
]

// ── Gradient presets for thumbnails ─────────────────────────────────────

const GRADIENT_PRESETS = [
  'from-rose-500/20 via-orange-500/20 to-amber-500/20',
  'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
  'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
  'from-sky-500/20 via-blue-500/20 to-indigo-500/20',
  'from-amber-500/20 via-yellow-500/20 to-lime-500/20',
  'from-pink-500/20 via-rose-500/20 to-red-500/20',
]

const TEMPLATE_GRADIENTS = [
  'from-rose-600 to-orange-600',
  'from-emerald-600 to-teal-600',
  'from-violet-600 to-purple-600',
  'from-amber-600 to-yellow-600',
  'from-sky-600 to-cyan-600',
  'from-pink-600 to-rose-600',
  'from-indigo-600 to-violet-600',
  'from-teal-600 to-emerald-600',
  'from-orange-600 to-amber-600',
  'from-cyan-600 to-sky-600',
]

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Portfolio': <Eye size={14} />,
  'E-commerce': <ShoppingCart size={14} />,
  'SaaS': <BarChart3 size={14} />,
  'Restaurant': <UtensilsCrossed size={14} />,
  'Agency': <Megaphone size={14} />,
  'Blog': <PenTool size={14} />,
  'Landing Page': <LayoutGrid size={14} />,
}

// ── Status helpers ──────────────────────────────────────────────────────

function statusVariant(status: string) {
  switch (status) {
    case 'published': case 'live': case 'active': return 'default'
    case 'draft': case 'building': case 'pending': return 'secondary'
    case 'failed': return 'destructive'
    default: return 'outline'
  }
}

function statusIcon(status: string) {
  switch (status) {
    case 'published': case 'live': case 'active': return <CheckCircle2 size={12} className="text-emerald-400" />
    case 'draft': return <AlertCircle size={12} className="text-amber-400" />
    case 'building': return <Clock size={12} className="text-sky-400" />
    case 'pending': return <Clock size={12} className="text-amber-400" />
    case 'failed': return <XCircle size={12} className="text-red-400" />
    default: return null
  }
}

function frameworkIcon(fw: string) {
  switch (fw) {
    case 'React': return <Code2 size={12} />
    case 'Next.js': return <Server size={12} />
    case 'Vue': return <Globe2 size={12} />
    default: return <FileCode size={12} />
  }
}

function activityIcon(type: string) {
  switch (type) {
    case 'publish': return <Rocket size={14} className="text-emerald-400" />
    case 'generate': return <Sparkles size={14} className="text-violet-400" />
    case 'export': return <Download size={14} className="text-sky-400" />
    case 'deploy': return <Globe size={14} className="text-amber-400" />
    case 'create': return <Plus size={14} className="text-teal-400" />
    case 'credits': return <Zap size={14} className="text-orange-400" />
    default: return <Activity size={14} className="text-zinc-400" />
  }
}

// ── Animation variants ──────────────────────────────────────────────────

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } },
}

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2, ease: 'easeOut' } },
}

// ── Main Component ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const {
    dashboardTab,
    projects,
    user,
    setDashboardTab,
    navigate,
    selectProject,
    addProject,
    removeProject,
  } = useAppStore()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterFramework, setFilterFramework] = useState<string>('all')
  const [newProjectOpen, setNewProjectOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [newProjectFramework, setNewProjectFramework] = useState('Next.js')

  // Settings local state
  const [settingsTheme, setSettingsTheme] = useState<string>('dark')
  const [settingsAutoSave, setSettingsAutoSave] = useState(true)
  const [settingsDefaultFramework, setSettingsDefaultFramework] = useState('Next.js')
  const [settingsNotifications, setSettingsNotifications] = useState(true)

  // Profile local state
  const [profileName, setProfileName] = useState(user?.name || 'Alex Chen')
  const [profileEmail, setProfileEmail] = useState(user?.email || 'alex@forge.ai')

  // Templates local state
  const [templateCategory, setTemplateCategory] = useState('All')

  // Merge store projects with demo projects
  const allProjects = useMemo(() => {
    if (projects.length > 0) return projects
    return DEMO_PROJECTS
  }, [projects])

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = filterStatus === 'all' || p.status === filterStatus
      const matchFramework = filterFramework === 'all' || p.framework === filterFramework
      return matchSearch && matchStatus && matchFramework
    })
  }, [allProjects, searchQuery, filterStatus, filterFramework])

  // ── Handlers ────────────────────────────────────────────────────────

  const handleNewProject = () => {
    if (!newProjectName.trim()) {
      toast({ title: 'Project name required', description: 'Please enter a name for your project.', variant: 'destructive' })
      return
    }
    const id = `p_${Date.now()}`
    addProject({
      id,
      name: newProjectName,
      description: newProjectDesc || 'A new Forge project.',
      status: 'draft',
      framework: newProjectFramework,
      theme: settingsTheme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setNewProjectOpen(false)
    setNewProjectName('')
    setNewProjectDesc('')
    toast({ title: 'Project created', description: `${newProjectName} has been added to your workspace.` })
  }

  const handleEditProject = (id: string) => {
    selectProject(id)
    navigate('builder')
  }

  const handleDeleteProject = (id: string) => {
    removeProject(id)
    toast({ title: 'Project deleted', description: 'The project has been removed from your workspace.' })
  }

  const handleUseTemplate = (templateName: string) => {
    const id = `p_${Date.now()}`
    addProject({
      id,
      name: templateName,
      description: `Created from ${templateName} template.`,
      status: 'draft',
      framework: 'Next.js',
      theme: 'dark',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    toast({ title: 'Template applied', description: `${templateName} has been created as a new project.` })
    setDashboardTab('projects')
  }

  // ── Sidebar ─────────────────────────────────────────────────────────

  const sidebarWidth = sidebarCollapsed ? 'w-16' : 'w-[240px]'

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-sm">
          F
        </div>
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-white">Forge</span>
            <span className="text-[10px] text-zinc-500 tracking-widest uppercase">AI Builder</span>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = dashboardTab === item.tab
          return (
            <button
              key={item.tab}
              onClick={() => setDashboardTab(item.tab)}
              className={`
                group flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-150
                ${isActive
                  ? 'bg-white/[0.08] text-white font-medium'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                }
              `}
            >
              <span className={`transition-colors duration-150 ${isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                {item.icon}
              </span>
              {!sidebarCollapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.label}</motion.span>}
            </button>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-2 py-3 border-t border-white/[0.06]">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {!sidebarCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-w-0">
              <span className="text-sm text-white truncate">{user?.name || 'Alex Chen'}</span>
              <span className="text-[11px] text-zinc-500 truncate">{user?.plan || 'Pro Plan'}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="flex items-center justify-center w-full py-2 border-t border-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  )

  // ── Tab Content Renderers ───────────────────────────────────────────

  const renderProjectsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Projects</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage and edit your AI-generated websites.</p>
        </div>
        <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/20 gap-2">
              <Plus size={16} />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-zinc-300">Project Name</Label>
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., My Portfolio"
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Description</Label>
                <Input
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief description of your project"
                  className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Framework</Label>
                <Select value={newProjectFramework} onValueChange={setNewProjectFramework}>
                  <SelectTrigger className="bg-zinc-800 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-white/10 text-white">
                    <SelectItem value="Next.js">Next.js</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Vue">Vue</SelectItem>
                    <SelectItem value="HTML/CSS">HTML/CSS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleNewProject}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                Create Project <ArrowRight size={16} />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="pl-9 bg-zinc-900/80 border-white/[0.06] text-white placeholder:text-zinc-500 backdrop-blur-sm"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px] bg-zinc-900/80 border-white/[0.06] text-white backdrop-blur-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-white/10 text-white">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterFramework} onValueChange={setFilterFramework}>
          <SelectTrigger className="w-[140px] bg-zinc-900/80 border-white/[0.06] text-white backdrop-blur-sm">
            <SelectValue placeholder="Framework" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-white/10 text-white">
            <SelectItem value="all">All Frameworks</SelectItem>
            <SelectItem value="Next.js">Next.js</SelectItem>
            <SelectItem value="React">React</SelectItem>
            <SelectItem value="Vue">Vue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <motion.div {...tabVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-4">
            <FolderOpen size={32} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-md">
            Start building your first AI-powered website. Describe what you want and Forge will generate it for you.
          </p>
          <Button
            onClick={() => setNewProjectOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white gap-2"
          >
            <Plus size={16} />
            Create Your First Project
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="group"
            >
              <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl overflow-hidden hover:border-white/[0.12] transition-colors duration-200">
                {/* Thumbnail */}
                <div className={`h-40 bg-gradient-to-br ${GRADIENT_PRESETS[idx % GRADIENT_PRESETS.length]} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-xl bg-white/[0.08] backdrop-blur-sm flex items-center justify-center border border-white/[0.1]">
                      <Code2 size={24} className="text-white/60" />
                    </div>
                  </div>
                  {/* Status overlay */}
                  <div className="absolute top-3 right-3">
                    <Badge variant={statusVariant(project.status)} className="gap-1 bg-black/40 backdrop-blur-sm border-white/10 text-xs">
                      {statusIcon(project.status)}
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{project.name}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs gap-1 border-white/10 text-zinc-300 bg-zinc-800/60">
                      {frameworkIcon(project.framework)}
                      {project.framework}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-white/10 text-zinc-300 bg-zinc-800/60">
                      {project.theme}
                    </Badge>
                  </div>
                  <div className="flex items-center text-[11px] text-zinc-500 gap-1">
                    <Clock size={11} />
                    Updated {project.updatedAt}
                  </div>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditProject(project.id)}
                    className="h-8 bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.06] gap-1 text-xs"
                  >
                    <ExternalLink size={12} /> Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toast({ title: 'Deploy initiated', description: `Deploying ${project.name}...` })}
                    className="h-8 bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.06] gap-1 text-xs"
                  >
                    <Rocket size={12} /> Deploy
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toast({ title: 'Export started', description: `Exporting ${project.name}...` })}
                    className="h-8 bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.06] gap-1 text-xs"
                  >
                    <Download size={12} /> Export
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                    className="h-8 bg-transparent hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border-0 gap-1 text-xs ml-auto"
                  >
                    <Trash2 size={12} />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  const renderTemplatesTab = () => {
    const categories = ['All', 'Portfolio', 'E-commerce', 'SaaS', 'Restaurant', 'Agency', 'Blog', 'Landing Page']

    const filteredTemplates = templateCategory === 'All'
      ? DEMO_TEMPLATES
      : DEMO_TEMPLATES.filter((t) => t.category === templateCategory)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Templates</h2>
          <p className="text-sm text-zinc-400 mt-1">Start from a professionally designed template.</p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setTemplateCategory(cat)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150
                ${templateCategory === cat
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-zinc-300'
                }
              `}
            >
              {cat !== 'All' && CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, idx) => (
            <motion.div key={template.id} variants={cardHover} initial="rest" whileHover="hover">
              <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl overflow-hidden hover:border-white/[0.12] transition-colors duration-200">
                <div className={`h-36 bg-gradient-to-br ${TEMPLATE_GRADIENTS[idx % TEMPLATE_GRADIENTS.length]} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-xl bg-white/[0.1] backdrop-blur-sm flex items-center justify-center border border-white/[0.12]">
                      {CATEGORY_ICONS[template.category] || <Layers size={20} className="text-white/70" />}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="text-xs gap-1 bg-black/40 backdrop-blur-sm border-white/10 text-zinc-200">
                      {CATEGORY_ICONS[template.category]}
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-white">{template.name}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{template.description}</p>
                </CardContent>
                <CardFooter className="px-4 pb-4 pt-0">
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template.name)}
                    className="w-full bg-gradient-to-r from-amber-500/80 to-orange-600/80 hover:from-amber-600 hover:to-orange-700 text-white gap-1 text-xs"
                  >
                    Use Template <ArrowRight size={12} />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderDeploymentsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Deployments</h2>
        <p className="text-sm text-zinc-400 mt-1">Track your project deployments across platforms.</p>
      </div>

      {DEMO_DEPLOYMENTS.length === 0 ? (
        <motion.div {...tabVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500/20 to-cyan-600/20 flex items-center justify-center mb-4">
            <Rocket size={32} className="text-sky-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No deployments yet</h3>
          <p className="text-sm text-zinc-400 mb-6">Deploy your projects to share them with the world.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {DEMO_DEPLOYMENTS.map((dep) => (
            <motion.div
              key={dep.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl hover:border-white/[0.12] transition-colors duration-200">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-600/20 flex items-center justify-center shrink-0">
                      <Rocket size={18} className="text-sky-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white truncate">{dep.project}</h3>
                        <Badge variant={statusVariant(dep.status)} className="text-xs gap-1">
                          {statusIcon(dep.status)}
                          {dep.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{dep.platform} &middot; {dep.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-zinc-500 hidden sm:inline">{dep.date}</span>
                    {dep.status === 'live' && (
                      <Button size="sm" className="h-7 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs gap-1">
                        <ExternalLink size={11} /> Visit
                      </Button>
                    )}
                    {dep.status === 'failed' && (
                      <Button size="sm" className="h-7 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs gap-1">
                        <Rocket size={11} /> Retry
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  const renderExportsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Exports</h2>
        <p className="text-sm text-zinc-400 mt-1">Download your projects in various formats.</p>
      </div>

      {DEMO_EXPORTS.length === 0 ? (
        <motion.div {...tabVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
            <Download size={32} className="text-violet-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No exports yet</h3>
          <p className="text-sm text-zinc-400 mb-6">Export your projects as code packages.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {DEMO_EXPORTS.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl hover:border-white/[0.12] transition-colors duration-200">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center shrink-0">
                      <Download size={18} className="text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-white">{exp.project}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{exp.format} export</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="outline" className="text-xs border-white/10 text-zinc-300 bg-zinc-800/60">{exp.format}</Badge>
                    <span className="text-xs text-zinc-500 hidden sm:inline">{exp.date}</span>
                    <Button size="sm" className="h-7 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs gap-1">
                      <Download size={11} /> Re-download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDomainsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Domains</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage custom domains for your projects.</p>
        </div>
        <Button className="bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.06] gap-2 text-sm">
          <Plus size={16} /> Add Domain
        </Button>
      </div>

      <div className="space-y-3">
        {DEMO_DOMAINS.map((dom) => (
          <motion.div
            key={dom.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl hover:border-white/[0.12] transition-colors duration-200">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center shrink-0">
                    <Globe size={18} className="text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">{dom.domain}</h3>
                      <Badge variant={statusVariant(dom.status)} className="text-xs gap-1">
                        {statusIcon(dom.status)}
                        {dom.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">Linked to {dom.project}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {dom.ssl ? (
                    <Badge className="text-xs gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      <Shield size={10} /> SSL
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs border-white/10 text-zinc-400">No SSL</Badge>
                  )}
                  <Button size="sm" className="h-7 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderAssetsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Assets</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage images, icons, and files for your projects.</p>
        </div>
        <Button className="bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.06] gap-2 text-sm">
          <Plus size={16} /> Upload Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_ASSETS.map((asset) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl hover:border-white/[0.12] transition-colors duration-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center shrink-0">
                  <ImageIcon size={18} className="text-pink-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-white truncate">{asset.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{asset.type} &middot; {asset.size}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{asset.date}</p>
                </div>
                <Button size="sm" className="h-7 bg-transparent hover:bg-white/[0.06] text-zinc-400 text-xs shrink-0">
                  <Copy size={12} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderCreditsTab = () => {
    const currentCredits = user?.aiCredits ?? 605
    const totalCredits = 1000
    const usagePercent = ((totalCredits - currentCredits) / totalCredits) * 100

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">AI Credits</h2>
          <p className="text-sm text-zinc-400 mt-1">Monitor your AI generation usage and credits.</p>
        </div>

        {/* Credits Overview Card */}
        <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center shrink-0">
                <Zap size={28} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{currentCredits} Credits Remaining</h3>
                    <p className="text-sm text-zinc-400">{totalCredits - currentCredits} of {totalCredits} used</p>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">{user?.plan || 'Pro'} Plan</Badge>
                </div>
                <Progress value={usagePercent} className="h-2 bg-zinc-800" />
                <p className="text-xs text-zinc-500 mt-2">Resets on April 1, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage History */}
        <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
          <CardHeader className="pb-2 px-6 pt-4">
            <h3 className="text-sm font-medium text-white">Usage History (Last 7 Days)</h3>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3">
              {DEMO_CREDIT_HISTORY.map((entry) => (
                <div key={entry.date} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-12">{entry.date}</span>
                    {entry.used > 0 ? (
                      <Badge variant="outline" className="text-xs border-white/10 text-zinc-300 bg-zinc-800/60">
                        {entry.used} used
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs border-white/10 text-zinc-500 bg-zinc-800/40">
                        No usage
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400">{entry.remaining} remaining</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buy Credits */}
        <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-amber-400" />
              <div>
                <h3 className="text-sm font-medium text-white">Need more credits?</h3>
                <p className="text-xs text-zinc-400">Purchase additional AI generation credits.</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white gap-2 text-sm shrink-0">
              <CreditCard size={16} /> Buy Credits
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Settings</h2>
        <p className="text-sm text-zinc-400 mt-1">Configure your Forge workspace preferences.</p>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Palette size={18} className="text-zinc-400" />
              <h3 className="text-sm font-medium text-white">Appearance</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300 text-sm">Theme Mode</Label>
                <p className="text-xs text-zinc-500">Choose your preferred color scheme.</p>
              </div>
              <Select value={settingsTheme} onValueChange={setSettingsTheme}>
                <SelectTrigger className="w-[140px] bg-zinc-800 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-white/10 text-white">
                  <SelectItem value="dark">
                    <span className="flex items-center gap-2"><Moon size={12} /> Dark</span>
                  </SelectItem>
                  <SelectItem value="light">
                    <span className="flex items-center gap-2"><Sun size={12} /> Light</span>
                  </SelectItem>
                  <SelectItem value="custom">
                    <span className="flex items-center gap-2"><Palette size={12} /> Custom</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Editor Preferences */}
        <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Monitor size={18} className="text-zinc-400" />
              <h3 className="text-sm font-medium text-white">Editor Preferences</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300 text-sm">Auto-save</Label>
                <p className="text-xs text-zinc-500">Automatically save changes every 30 seconds.</p>
              </div>
              <Switch checked={settingsAutoSave} onCheckedChange={setSettingsAutoSave} />
            </div>
            <Separator className="bg-white/[0.06]" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300 text-sm">Default Framework</Label>
                <p className="text-xs text-zinc-500">Framework for new projects.</p>
              </div>
              <Select value={settingsDefaultFramework} onValueChange={setSettingsDefaultFramework}>
                <SelectTrigger className="w-[140px] bg-zinc-800 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-white/10 text-white">
                  <SelectItem value="Next.js">Next.js</SelectItem>
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="Vue">Vue</SelectItem>
                  <SelectItem value="HTML/CSS">HTML/CSS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={18} className="text-zinc-400" />
              <h3 className="text-sm font-medium text-white">Notifications</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-zinc-300 text-sm">Email Notifications</Label>
                <p className="text-xs text-zinc-500">Receive updates about deployments and exports.</p>
              </div>
              <Switch checked={settingsNotifications} onCheckedChange={setSettingsNotifications} />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => toast({ title: 'Settings saved', description: 'Your preferences have been updated.' })}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
        >
          Save Settings
        </Button>
      </div>
    </div>
  )

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Billing</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                <Wallet size={22} className="text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{user?.plan || 'Pro'} Plan</h3>
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">Active</Badge>
                </div>
                <p className="text-sm text-zinc-400">$29/month &middot; Renews on April 1, 2026</p>
              </div>
            </div>
            <Button className="bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/[0.06] text-sm">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
        <CardHeader className="pb-2 px-6 pt-4">
          <h3 className="text-sm font-medium text-white">Plan Features</h3>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          {[
            'Unlimited projects',
            '1,000 AI credits/month',
            'Custom domains (3 included)',
            'All export formats',
            'Priority deployment',
            'Team collaboration (coming soon)',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span className="text-zinc-300">{feature}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
        <CardHeader className="pb-2 px-6 pt-4">
          <h3 className="text-sm font-medium text-white">Payment History</h3>
        </CardHeader>
        <CardContent className="px-6 pb-6 space-y-3">
          {[
            { date: 'Mar 1, 2026', amount: '$29.00', status: 'paid' },
            { date: 'Feb 1, 2026', amount: '$29.00', status: 'paid' },
            { date: 'Jan 1, 2026', amount: '$29.00', status: 'paid' },
          ].map((payment, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-2">
                <CalendarDays size={12} className="text-zinc-500" />
                <span className="text-sm text-zinc-300">{payment.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white font-medium">{payment.amount}</span>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{payment.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Profile</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your personal information and account.</p>
      </div>

      <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl">
        <CardContent className="p-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold shrink-0">
              {profileName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{profileName}</h3>
              <p className="text-sm text-zinc-400">{profileEmail}</p>
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs mt-1">{user?.plan || 'Pro'} Member</Badge>
            </div>
          </div>

          <Separator className="bg-white/[0.06] mb-6" />

          {/* Edit Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Display Name</Label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="bg-zinc-800 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Email Address</Label>
              <Input
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="bg-zinc-800 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Timezone</Label>
              <Select defaultValue="utc-8">
                <SelectTrigger className="bg-zinc-800 border-white/10 text-white">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-white/10 text-white">
                  <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                  <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                  <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                  <SelectItem value="utc+8">China Standard (UTC+8)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => toast({ title: 'Profile updated', description: 'Your changes have been saved.' })}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-zinc-900/60 border-red-500/10 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-400">Delete Account</h3>
              <p className="text-xs text-zinc-500">Permanently delete your account and all data.</p>
            </div>
            <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Activity</h2>
        <p className="text-sm text-zinc-400 mt-1">Track recent actions and events in your workspace.</p>
      </div>

      <div className="space-y-3">
        {DEMO_ACTIVITIES.map((act) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-zinc-900/60 border-white/[0.06] backdrop-blur-xl hover:border-white/[0.12] transition-colors duration-200">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                  {activityIcon(act.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-white">{act.action}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{act.time}</p>
                </div>
                <ChevronDown size={14} className="text-zinc-600 shrink-0" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )

  // ── Tab Content Map ──────────────────────────────────────────────────

  const tabContent: Record<DashboardTab, () => React.ReactNode> = {
    projects: renderProjectsTab,
    templates: renderTemplatesTab,
    deployments: renderDeploymentsTab,
    exports: renderExportsTab,
    domains: renderDomainsTab,
    assets: renderAssetsTab,
    credits: renderCreditsTab,
    settings: renderSettingsTab,
    billing: renderBillingTab,
    profile: renderProfileTab,
    activity: renderActivityTab,
  }

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarWidth} border-r border-white/[0.06] bg-[#0d0d14]/90 backdrop-blur-xl flex-shrink-0 transition-all duration-300 hidden md:flex`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <div className="md:hidden">
        {/* Mobile top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0d0d14]/95 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xs">
              F
            </div>
            <span className="text-sm font-semibold tracking-wide text-white">Forge</span>
          </div>
          <Button
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="bg-white/[0.06] hover:bg-white/[0.12] text-white h-8 w-8 p-0"
          >
            <MoreVertical size={16} />
          </Button>
        </div>

        {/* Mobile sidebar dropdown */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="fixed top-12 left-0 right-0 z-40 bg-[#0d0d14]/95 backdrop-blur-xl border-b border-white/[0.06] overflow-y-auto max-h-[70vh]"
            >
              <nav className="px-3 py-2 space-y-0.5">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setDashboardTab(item.tab)
                      setSidebarCollapsed(true)
                    }}
                    className={`
                      flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-all
                      ${dashboardTab === item.tab
                        ? 'bg-white/[0.08] text-white font-medium'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                      }
                    `}
                  >
                    <span className={dashboardTab === item.tab ? 'text-amber-400' : 'text-zinc-500'}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-0 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto mt-14 md:mt-0">
          {/* Tab Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={18} className="text-zinc-500 hidden md:block" />
              <span className="text-xs text-zinc-500 uppercase tracking-widest hidden md:block">Dashboard</span>
            </div>
          </div>

          {/* Animated Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {tabContent[dashboardTab]?.() ?? null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
