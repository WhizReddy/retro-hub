'use client'

import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, OrbitControls, Bounds } from '@react-three/drei'
import { Raycaster, Vector2, Mesh, Group, CanvasTexture, Texture } from 'three'

type Section = 'Home' | 'About' | 'Projects' | 'Contact'

type GLTFResult = {
  scene: Group
  nodes: { [name: string]: Mesh }
}

// Map mesh names to your sections
const BUTTON_MAP: Record<string, Section> = {
  ButtonA: 'About',
  ButtonB: 'Home',
  DpadUp: 'Projects',
  DpadDown: 'Contact',
}

export default function InteractiveConsole() {
  const [section, setSection] = useState<Section>('Home')

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 50 }} style={{ background: '#222' }}>
        <Bounds fit clip observe margin={1}>
          <Suspense fallback={null}>
            <ConsoleScene section={section} onSelect={setSection} />
          </Suspense>
        </Bounds>

        <Environment preset="warehouse" background={false} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  )
}

function ConsoleScene({
  section,
  onSelect,
}: {
  section: Section
  onSelect: (sec: Section) => void
}) {
  // Load the GLB
  const { scene, nodes } = useGLTF('/models/game_console.glb') as unknown as GLTFResult

  // Create a canvas for dynamic textures
  const canvas = useRef<HTMLCanvasElement>()
  const texture = useRef<Texture>()

  // Initialize canvas once
  useEffect(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 256
    canvas.current = c
    texture.current = new CanvasTexture(c)
    // Apply to the screen mesh material
    const screenMesh = nodes['Screen']
    if (screenMesh && screenMesh.material) {
      ;(screenMesh.material as any).map = texture.current
      screenMesh.material.needsUpdate = true
    }
  }, [nodes])

  // Draw the current section into the canvas
  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    // Clear
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, c.width, c.height)
    // Draw text
    ctx.fillStyle = 'lime'
    ctx.font = '36px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(
      section === 'Home' ? 'Welcome!' : section,
      c.width / 2,
      c.height / 2 + 12
    )
    // Update texture
    texture.current!.needsUpdate = true
  }, [section])

  // Raycasting setup
  const { camera, size } = useThree()
  const raycaster = useRef(new Raycaster()).current
  const pointer = useRef(new Vector2()).current

  // Slow rotate for presentation
  const group = useRef<Group>(null!)
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.0005
  })

  // Handle clicks on buttons
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      pointer.set((e.clientX / size.width) * 2 - 1, -(e.clientY / size.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(Object.values(nodes), false)[0]
      if (hit) {
        const sec = BUTTON_MAP[hit.object.name]
        if (sec) onSelect(sec)
      }
    },
    [camera, nodes, onSelect, pointer, raycaster, size]
  )

  useEffect(() => {
    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [handlePointerDown])

  return <primitive ref={group} object={scene} castShadow receiveShadow />
}
