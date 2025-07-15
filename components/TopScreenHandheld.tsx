'use client'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Html, useProgress } from '@react-three/drei'
import { Scanline } from '@react-three/postprocessing'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import type { Group } from 'three'

type GLTFResult = { scene: Group }
interface ModelProps { url: string }

function HandheldModel({ url }: ModelProps) {
  const gltf = useLoader(GLTFLoader, url) as GLTFResult
  const ref = useRef<Group>(null!)
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001
  })
  return <primitive ref={ref} object={gltf.scene} />
}

function LoaderOverlay() {
  const { active, progress, errors } = useProgress()
  if (!active) return null
  if (errors.length) {
    console.error('Loader errors:', errors)
    return <Html center><div style={{ color:'red' }}>Error loading model</div></Html>
  }
  return <Html center><div>Loading… {progress.toFixed(0)}%</div></Html>
}

export default function TopScreenHandheld() {
  const modelUrl = '/models/duck.glb' // or '/models/duck.glb' to test

  return (
    <Canvas
      camera={{ position: [0, 1, 2.5], fov: 45 }}
      style={{ width: '100%', height: '500px', background: '#e0d6c3' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      <Suspense fallback={<LoaderOverlay />}>
        <HandheldModel url={modelUrl} />
        <Scanline density={0.5} />
      </Suspense>

      <OrbitControls enableRotate enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
