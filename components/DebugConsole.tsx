// components/DebugConsole.tsx
'use client'
import { useGLTF } from '@react-three/drei'
import React, { useEffect } from 'react'

export function DebugConsole() {
  const gltf = useGLTF('/models/game_console.glb')
  useEffect(() => {
    console.log('Console nodes:', Object.keys((gltf as any).nodes || {}))
    console.log('Scene children:', gltf.scene.children.map(c => c.name))
  }, [gltf])
  return null
}
