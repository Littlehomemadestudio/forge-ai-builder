// ─── Editor Types ───────────────────────────────────────────────────────────

export interface ComputedElementInfo {
  id: string
  tag: string
  className: string
  rect: { top: number; left: number; width: number; height: number }
  styles: Record<string, string>
  content: string
  attributes: Record<string, string>
  parentId: string | null
  childIds: string[]
  textContent: string
}

export interface HistoryEntry {
  id: string
  html: string
  label: string
  timestamp: number
}

export interface CSSPropertyGroup {
  name: string
  icon: string
  properties: CSSProperty[]
}

export interface CSSProperty {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'color' | 'slider' | 'toggle' | 'composite' | 'gradient'
  options?: string[]
  unit?: string
  min?: number
  max?: number
  step?: number
  default?: string
  subProperties?: CSSProperty[]
}

export interface EditorComponent {
  id: string
  name: string
  category: string
  description: string
  html: string
  icon: string
}

export interface EditorComponentCategory {
  id: string
  name: string
  icon: string
  components: EditorComponent[]
}

export interface DeviceConfig {
  name: string
  width: number
  height: number
  icon: string
}

export const DEVICE_CONFIGS: DeviceConfig[] = [
  { name: 'desktop', width: 1280, height: 800, icon: 'Monitor' },
  { name: 'laptop', width: 1024, height: 640, icon: 'Monitor' },
  { name: 'tablet', width: 768, height: 1024, icon: 'Tablet' },
  { name: 'mobile', width: 375, height: 667, icon: 'Smartphone' },
  { name: 'mobile-landscape', width: 667, height: 375, icon: 'Smartphone' },
]
