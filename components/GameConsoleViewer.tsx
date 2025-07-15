// components/GameConsoleViewer.tsx
'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import type { Group } from 'three'

type GLTFResult = {
  scene: Group
  // you can also pull out nodes if needed:
  // nodes: Record<string, THREE.Object3D>
}

function ConsoleScene() {
  // THIS hook is inside the Canvas → now valid
  const { scene } = useGLTF('/models/game_console.glb') as GLTFResult
  const ref = useRef<Group>(null!)
  
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001
  })

  return <primitive ref={ref} object={scene} />
}

export default function GameConsoleViewer() {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ width: '100%', height: 400 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <Suspense fallback={<Html center>Loading Console…</Html>}>
        <ConsoleScene />
      </Suspense>
    </Canvas>
  )
}
