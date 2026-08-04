'use client'

import React from 'react'
import { VisualEditor } from './visual-editor/VisualEditor'

// This is a wrapper component that renders the new redesigned Visual Editor
// The actual editor implementation is in ./visual-editor/VisualEditor.tsx

export default function EditorPage() {
  return <VisualEditor />
}
