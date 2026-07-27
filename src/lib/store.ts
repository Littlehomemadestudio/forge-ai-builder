import { create } from 'zustand'
import type { UiLanguage } from '@/lib/i18n'
import { saveUiLanguage, applyHtmlDirLang } from '@/lib/i18n'

// Re-export so callers can import from either location
export type { UiLanguage } from '@/lib/i18n'

export type AppView = 
  | 'landing'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'dashboard'
  | 'builder'
  | 'editor'
  | 'project-settings'
  | 'templates'
  | 'deployments'
  | 'exports'
  | 'domains'
  | 'assets'
  | 'billing'
  | 'profile'
  | 'settings'

export type DashboardTab = 
  | 'projects'
  | 'templates'
  | 'deployments'
  | 'exports'
  | 'domains'
  | 'assets'
  | 'credits'
  | 'settings'
  | 'billing'
  | 'profile'
  | 'activity'

export type BuilderPhase = 'prompt' | 'generating' | 'preview' | 'edit'

export type BuilderIndustry =
  | 'portfolio'
  | 'saas'
  | 'restaurant'
  | 'ecommerce'
  | 'blog'
  | 'agency'
  | 'event'
  | 'personal'

export type BuilderStyle = 'light' | 'dark' | 'minimal' | 'bold' | 'glassmorphism' | 'neobrutalism' | 'retro' | 'gradient'

export type BuilderLanguage = 'en' | 'fa' | 'ar' | 'de' | 'es' | 'fr'

export type BuilderComplexity = 'simple' | 'standard' | 'advanced' | 'comprehensive'
export type BuilderPageLength = 'short' | 'medium' | 'long' | 'extended'
export type BuilderLayoutDensity = 'compact' | 'comfortable' | 'spacious' | 'ultra-spacious'
export type BuilderAnimationLevel = 'none' | 'subtle' | 'moderate' | 'energetic' | 'immersive'
export type BuilderResponsivePriority = 'mobile-first' | 'desktop-first' | 'universal'
export type BuilderContentTone = 'professional' | 'casual' | 'playful' | 'elegant' | 'technical' | 'warm'
export type BuilderNavigationStyle = 'top' | 'sticky' | 'sidebar' | 'centered' | 'minimal'
export type BuilderSEOLevel = 'basic' | 'standard' | 'advanced'
export type BuilderAccessibilityLevel = 'basic' | 'enhanced' | 'maximum'
export type BuilderImageStyle = 'illustrations' | 'photos' | 'icons' | 'abstract' | 'mixed' | 'none'
export type BuilderCTAStyle = 'button' | 'pill' | 'link' | 'gradient' | 'outlined'

interface BuilderPageConfig {
  id: string
  name: string
  enabled: boolean
  length: BuilderPageLength
}

interface BuilderColorScheme {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
  muted: string
}

interface BuilderAdvancedOptions {
  complexity: BuilderComplexity
  pageLength: BuilderPageLength
  layoutDensity: BuilderLayoutDensity
  animationLevel: BuilderAnimationLevel
  responsivePriority: BuilderResponsivePriority
  contentTone: BuilderContentTone
  navigationStyle: BuilderNavigationStyle
  seoLevel: BuilderSEOLevel
  accessibilityLevel: BuilderAccessibilityLevel
  imageStyle: BuilderImageStyle
  ctaStyle: BuilderCTAStyle
  colorScheme: BuilderColorScheme
  fontFamily: string
  brandName: string
  pageConfigs: BuilderPageConfig[]
  includeHero: boolean
  includeFeatures: boolean
  includeTestimonials: boolean
  includePricing: boolean
  includeFAQ: boolean
  includeNewsletter: boolean
  includeCTA: boolean
  includeFooter: boolean
  includeAnimations: boolean
  includeSocialLinks: boolean
  includeContactForm: boolean
}

export type EditorPanel = 'layers' | 'components' | 'design-library' | 'design-tokens' | 'pages' | 'assets'

export interface ChatEntry {
  id: string
  title: string
  prompt: string
  timestamp: number
  projectId?: string
}
export type InspectorTab = 'style' | 'layout' | 'animation' | 'seo' | 'responsive' | 'content'
export type EditorCanvasMode = 'select' | 'text' | 'move' | 'draw'

export type DevicePreview = 'desktop' | 'tablet' | 'mobile' | 'landscape' | 'portrait'

export type ThemeMode = 'light' | 'dark' | 'custom'

interface Project {
  id: string
  name: string
  description?: string
  prompt?: string
  thumbnail?: string
  status: string
  framework: string
  theme: string
  createdAt: string
  updatedAt: string
}

interface GeneratedPage {
  id: string
  name: string
  route: string
  html: string
  css: string
  js?: string
}

interface EditorHistoryEntry {
  id: string
  html: string
  css: string
  timestamp: number
  label: string
}

interface AppState {
  // Navigation
  currentView: AppView
  previousView: AppView | null
  
  // Auth
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    name: string
    avatarUrl?: string
    aiCredits: number
    plan: string
  } | null
  
  // Dashboard
  dashboardTab: DashboardTab
  projects: Project[]
  selectedProjectId: string | null
  
  // Builder
  builderPhase: BuilderPhase
  builderPrompt: string
  builderIndustry: BuilderIndustry
  builderStyle: BuilderStyle
  builderLanguage: BuilderLanguage
  builderMode: 'ai' | 'templates'
  builderAdvancedOptions: BuilderAdvancedOptions
  builderAdvancedUnlocked: boolean
  generatedPages: GeneratedPage[]
  generatedSiteName: string
  currentPreviewPage: string
  isGenerating: boolean
  generationProgress: number
  generationStatus: string
  selectedTemplateHtml: string
  
  // Chat History (ChatGPT-like sidebar)
  chatHistory: ChatEntry[]
  activeChatId: string | null
  
  // Editor
  editorPanel: EditorPanel
  inspectorTab: InspectorTab
  devicePreview: DevicePreview
  selectedElementId: string | null
  editorHistory: EditorHistoryEntry[]
  historyIndex: number
  showCodePanel: boolean
  editorCanvasMode: EditorCanvasMode
  editorZoom: number
  editorShowGrid: boolean
  editorShowGuides: boolean
  editorSnapToGrid: boolean
  
  // Theme
  themeMode: ThemeMode
  
  // UI Language (separate from builderLanguage — controls the BUILDER UI itself, not the generated site)
  uiLanguage: UiLanguage
  
  // UI
  showCommandPalette: boolean
  showContextMenu: boolean
  contextMenuPosition: { x: number; y: number }
  isLoading: boolean
  loadingMessage: string
  
  // Actions - Navigation
  navigate: (view: AppView) => void
  goBack: () => void
  
  // Actions - Auth
  login: (user: AppState['user']) => void
  logout: () => void
  
  // Actions - Dashboard
  setDashboardTab: (tab: DashboardTab) => void
  setProjects: (projects: Project[]) => void
  selectProject: (id: string | null) => void
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  
  // Actions - Builder
  setBuilderPhase: (phase: BuilderPhase) => void
  setBuilderPrompt: (prompt: string) => void
  setBuilderIndustry: (industry: BuilderIndustry) => void
  setBuilderStyle: (style: BuilderStyle) => void
  setBuilderLanguage: (language: BuilderLanguage) => void
  setBuilderMode: (mode: 'ai' | 'templates') => void
  setBuilderAdvancedOptions: (options: Partial<BuilderAdvancedOptions>) => void
  setBuilderAdvancedUnlocked: (unlocked: boolean) => void
  setGeneratedPages: (pages: GeneratedPage[]) => void
  setGeneratedSiteName: (name: string) => void
  updateGeneratedPage: (pageId: string, updates: Partial<GeneratedPage>) => void
  setCurrentPreviewPage: (pageId: string) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationProgress: (progress: number) => void
  setGenerationStatus: (status: string) => void
  startGeneration: (prompt: string) => void
  setSelectedTemplateHtml: (html: string) => void
  addChatEntry: (entry: ChatEntry) => void
  setActiveChatId: (id: string | null) => void
  clearChatHistory: () => void
  
  // Actions - Editor
  setEditorPanel: (panel: EditorPanel) => void
  setInspectorTab: (tab: InspectorTab) => void
  setDevicePreview: (device: DevicePreview) => void
  setSelectedElement: (id: string | null) => void
  pushHistory: (entry: EditorHistoryEntry) => void
  undo: () => void
  redo: () => void
  setEditorCanvasMode: (mode: EditorCanvasMode) => void
  setEditorZoom: (zoom: number) => void
  setShowCodePanel: (show: boolean) => void
  
  // Actions - Theme
  setThemeMode: (mode: ThemeMode) => void
  
  // Actions - UI Language
  setUiLanguage: (lang: UiLanguage) => void
  
  // Actions - UI
  toggleCommandPalette: () => void
  setContextMenu: (show: boolean, position?: { x: number; y: number }) => void
  setLoading: (loading: boolean, message?: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentView: 'landing',
  previousView: null,
  
  isAuthenticated: false,
  user: null,
  
  dashboardTab: 'projects',
  projects: [],
  selectedProjectId: null,
  
  builderPhase: 'prompt',
  builderPrompt: '',
  builderIndustry: 'portfolio',
  builderStyle: 'light',
  builderLanguage: 'en',
  builderMode: 'ai',
  builderAdvancedUnlocked: false,
  builderAdvancedOptions: {
    complexity: 'standard',
    pageLength: 'medium',
    layoutDensity: 'comfortable',
    animationLevel: 'subtle',
    responsivePriority: 'universal',
    contentTone: 'professional',
    navigationStyle: 'sticky',
    seoLevel: 'standard',
    accessibilityLevel: 'enhanced',
    imageStyle: 'mixed',
    ctaStyle: 'button',
    colorScheme: { primary: '#7c3aed', accent: '#2dd4bf', background: '#0a0a0f', surface: '#1a1a2e', text: '#ffffff', muted: '#94a3b8' },
    fontFamily: 'Inter',
    brandName: '',
    pageConfigs: [
      { id: 'home', name: 'Home', enabled: true, length: 'long' },
      { id: 'about', name: 'About', enabled: true, length: 'medium' },
      { id: 'services', name: 'Services', enabled: true, length: 'medium' },
      { id: 'contact', name: 'Contact', enabled: true, length: 'short' },
      { id: 'blog', name: 'Blog', enabled: false, length: 'medium' },
      { id: 'pricing', name: 'Pricing', enabled: false, length: 'short' },
      { id: 'faq', name: 'FAQ', enabled: false, length: 'short' },
      { id: 'portfolio', name: 'Portfolio', enabled: false, length: 'medium' },
    ],
    includeHero: true,
    includeFeatures: true,
    includeTestimonials: true,
    includePricing: false,
    includeFAQ: false,
    includeNewsletter: true,
    includeCTA: true,
    includeFooter: true,
    includeAnimations: true,
    includeSocialLinks: true,
    includeContactForm: true,
  },
  generatedPages: [],
  generatedSiteName: '',
  currentPreviewPage: '',
  isGenerating: false,
  generationProgress: 0,
  generationStatus: '',
  selectedTemplateHtml: '',
  chatHistory: [],
  activeChatId: null,
  
  editorPanel: 'components',
  inspectorTab: 'style',
  devicePreview: 'desktop',
  selectedElementId: null,
  editorHistory: [],
  historyIndex: -1,
  showCodePanel: false,
  editorCanvasMode: 'select',
  editorZoom: 100,
  editorShowGrid: false,
  editorShowGuides: false,
  editorSnapToGrid: true,
  
  themeMode: 'light',
  
  // UI Language — initialized to 'en' (SSR-safe).
  // HtmlDirLangSync component will read localStorage/URL on mount and call setUiLanguage
  // to apply the user's actual preference after hydration. This avoids hydration mismatch
  // (server renders 'en' = "Forge", client initially hydrates with 'en' = "Forge" too).
  uiLanguage: 'en',
  
  showCommandPalette: false,
  showContextMenu: false,
  contextMenuPosition: { x: 0, y: 0 },
  isLoading: false,
  loadingMessage: '',
  
  // Navigation
  navigate: (view) => set((state) => ({
    currentView: view,
    previousView: state.currentView
  })),
  
  goBack: () => set((state) => ({
    currentView: state.previousView || 'landing',
    previousView: null
  })),
  
  // Auth
  login: (user) => set({ isAuthenticated: true, user, currentView: 'dashboard' }),
  logout: () => set({ isAuthenticated: false, user: null, currentView: 'landing' }),
  
  // Dashboard
  setDashboardTab: (tab) => set({ dashboardTab: tab }),
  setProjects: (projects) => set({ projects }),
  selectProject: (id) => set({ selectedProjectId: id }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  removeProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) })),
  
  // Builder
  setBuilderPhase: (phase) => set({ builderPhase: phase }),
  setBuilderPrompt: (prompt) => set({ builderPrompt: prompt }),
  setBuilderIndustry: (industry) => set({ builderIndustry: industry }),
  setBuilderStyle: (style) => set({ builderStyle: style }),
  setBuilderLanguage: (language) => set({ builderLanguage: language }),
  setBuilderMode: (mode) => set({ builderMode: mode }),
  setBuilderAdvancedOptions: (options) => set((state) => ({
    builderAdvancedOptions: { ...state.builderAdvancedOptions, ...options }
  })),
  setBuilderAdvancedUnlocked: (unlocked) => set({ builderAdvancedUnlocked: unlocked }),
  setGeneratedPages: (pages) => set({ generatedPages: pages }),
  setGeneratedSiteName: (name) => set({ generatedSiteName: name }),
  updateGeneratedPage: (pageId, updates) => set((state) => ({
    generatedPages: state.generatedPages.map(p =>
      p.id === pageId ? { ...p, ...updates } : p
    ),
  })),
  setCurrentPreviewPage: (pageId) => set({ currentPreviewPage: pageId }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  startGeneration: (prompt) => set({
    builderPrompt: prompt,
    builderPhase: 'generating',
    isGenerating: true,
    generationProgress: 0,
    generationStatus: 'Initializing…'
  }),
  setSelectedTemplateHtml: (html) => set({ selectedTemplateHtml: html }),
  addChatEntry: (entry) => set((state) => ({ chatHistory: [...state.chatHistory, entry], activeChatId: entry.id })),
  setActiveChatId: (id) => set({ activeChatId: id }),
  clearChatHistory: () => set({ chatHistory: [], activeChatId: null }),
  
  // Editor
  setEditorPanel: (panel) => set({ editorPanel: panel }),
  setInspectorTab: (tab) => set({ inspectorTab: tab }),
  setDevicePreview: (device) => set({ devicePreview: device }),
  setSelectedElement: (id) => set({ selectedElementId: id }),
  pushHistory: (entry) => set((state) => {
    const newHistory = [...state.editorHistory.slice(0, state.historyIndex + 1), entry]
    return { editorHistory: newHistory, historyIndex: newHistory.length - 1 }
  }),
  undo: () => set((state) => ({
    historyIndex: Math.max(0, state.historyIndex - 1)
  })),
  redo: () => set((state) => ({
    historyIndex: Math.min(state.editorHistory.length - 1, state.historyIndex + 1)
  })),
  setEditorCanvasMode: (mode) => set({ editorCanvasMode: mode }),
  setEditorZoom: (zoom) => set({ editorZoom: zoom }),
  setShowCodePanel: (show) => set({ showCodePanel: show }),
  
  // Theme
  setThemeMode: (mode) => set({ themeMode: mode }),
  
  // UI Language — persists to localStorage AND applies <html lang/dir> immediately
  setUiLanguage: (lang) => {
    saveUiLanguage(lang)
    applyHtmlDirLang(lang)
    // Update URL ?lang= without a full reload so the link is shareable
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href)
        url.searchParams.set('lang', lang)
        window.history.replaceState({}, '', url.toString())
      } catch {}
    }
    set({ uiLanguage: lang })
  },
  
  // UI
  toggleCommandPalette: () => set((state) => ({ showCommandPalette: !state.showCommandPalette })),
  setContextMenu: (show, position) => set({
    showContextMenu: show,
    contextMenuPosition: position || { x: 0, y: 0 }
  }),
  setLoading: (loading, message) => set({ isLoading: loading, loadingMessage: message || '' }),
}))

// ─── Expose store to window for dev/debug access ────────────────────────
if (typeof window !== 'undefined') {
  ;(window as any).__FORGE_STORE__ = useAppStore;
}
