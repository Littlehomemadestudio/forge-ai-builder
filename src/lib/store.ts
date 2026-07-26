import { create } from 'zustand'

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

export type BuilderStyle = 'light' | 'dark' | 'minimal' | 'bold'

export type EditorPanel = 'layers' | 'components' | 'design-library'
export type InspectorTab = 'style' | 'layout' | 'animation' | 'seo'

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
  builderMode: 'ai' | 'templates'
  generatedPages: GeneratedPage[]
  generatedSiteName: string
  currentPreviewPage: string
  isGenerating: boolean
  generationProgress: number
  generationStatus: string
  
  // Editor
  editorPanel: EditorPanel
  inspectorTab: InspectorTab
  devicePreview: DevicePreview
  selectedElementId: string | null
  editorHistory: EditorHistoryEntry[]
  historyIndex: number
  showCodePanel: boolean
  
  // Theme
  themeMode: ThemeMode
  
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
  setBuilderMode: (mode: 'ai' | 'templates') => void
  setGeneratedPages: (pages: GeneratedPage[]) => void
  setGeneratedSiteName: (name: string) => void
  updateGeneratedPage: (pageId: string, updates: Partial<GeneratedPage>) => void
  setCurrentPreviewPage: (pageId: string) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationProgress: (progress: number) => void
  setGenerationStatus: (status: string) => void
  startGeneration: (prompt: string) => void
  
  // Actions - Editor
  setEditorPanel: (panel: EditorPanel) => void
  setInspectorTab: (tab: InspectorTab) => void
  setDevicePreview: (device: DevicePreview) => void
  setSelectedElement: (id: string | null) => void
  pushHistory: (entry: EditorHistoryEntry) => void
  undo: () => void
  redo: () => void
  setShowCodePanel: (show: boolean) => void
  
  // Actions - Theme
  setThemeMode: (mode: ThemeMode) => void
  
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
  builderStyle: 'dark',
  builderMode: 'ai',
  generatedPages: [],
  generatedSiteName: '',
  currentPreviewPage: '',
  isGenerating: false,
  generationProgress: 0,
  generationStatus: '',
  
  editorPanel: 'components',
  inspectorTab: 'style',
  devicePreview: 'desktop',
  selectedElementId: null,
  editorHistory: [],
  historyIndex: -1,
  showCodePanel: false,
  
  themeMode: 'dark',
  
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
  setBuilderMode: (mode) => set({ builderMode: mode }),
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
  setShowCodePanel: (show) => set({ showCodePanel: show }),
  
  // Theme
  setThemeMode: (mode) => set({ themeMode: mode }),
  
  // UI
  toggleCommandPalette: () => set((state) => ({ showCommandPalette: !state.showCommandPalette })),
  setContextMenu: (show, position) => set({
    showContextMenu: show,
    contextMenuPosition: position || { x: 0, y: 0 }
  }),
  setLoading: (loading, message) => set({ isLoading: loading, loadingMessage: message || '' }),
}))
