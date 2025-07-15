// components/MiniConsolePreview.tsx
'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import type { Group } from 'three'

type GLTFResult = { scene: Group }

function PreviewModel({ url }: { url: string }) {
  // ← This hook is inside a Canvas child—OK!
  const { scene } = useLoader(GLTFLoader, url) as GLTFResult
  const ref = useRef<Group>(null!)
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.01
  })
  return <primitive ref={ref} object={scene} />
}

export function MiniConsolePreview({ url }: { url: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      style={{
        width: 150,
        height: 150,
        borderRadius: 12,
        background: '#444',
        overflow: 'hidden',
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} intensity={0.8} />

      <Suspense
        fallback={
          <Html center>
            <div style={{ color: '#fff' }}>Loading…</div>
          </Html>
        }
      >
        <PreviewModel url={url} />
      </Suspense>
    </Canvas>
  )
}
