import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { VARIANTS, type VariantId } from '../../data'
import { prefersReducedMotion } from '../../lib/gsap'

type Mode = 'hero' | 'showcase'

type Materials = {
  body: THREE.MeshPhysicalMaterial
  tip: THREE.MeshPhysicalMaterial
  dark: THREE.MeshStandardMaterial
}

// Pointer position over the whole window, normalised to -1…1.
const pointer = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }, { passive: true })
}

// One earbud built from primitives: ellipsoid head, silicone tip, capsule stem.
function Bud({ m }: { m: Materials }) {
  return (
    <group>
      <mesh material={m.body} scale={[1, 0.92, 0.86]}>
        <sphereGeometry args={[0.5, 64, 64]} />
      </mesh>
      <mesh material={m.tip} position={[-0.4, 0.05, 0.04]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.75, 1]}>
        <sphereGeometry args={[0.25, 48, 48]} />
      </mesh>
      <mesh material={m.dark} position={[-0.58, 0.05, 0.04]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 0.04, 32]} />
      </mesh>
      <mesh material={m.dark} position={[0.1, 0.14, 0.4]} rotation={[0.25, 0.15, 0]}>
        <torusGeometry args={[0.09, 0.012, 16, 48]} />
      </mesh>
      <mesh material={m.body} position={[0.2, -0.78, 0]} rotation={[0, 0, 0.1]}>
        <capsuleGeometry args={[0.15, 1, 12, 32]} />
      </mesh>
      <mesh material={m.dark} position={[0.265, -1.42, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 32]} />
      </mesh>
    </group>
  )
}

// Soft studio reflections from three's built-in room scene (no HDR file to download).
function Env() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.55
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

// Drag state shared between the DOM wrapper (pointer events) and the render loop.
type Drag = { active: boolean; lastX: number; lastY: number; yaw: number; pitch: number }

function Pair({ variant, mode, drag }: { variant: VariantId; mode: Mode; drag: RefObject<Drag> }) {
  const group = useRef<THREE.Group>(null)
  const rimA = useRef<THREE.PointLight>(null)
  const rimB = useRef<THREE.PointLight>(null)
  const still = useMemo(() => prefersReducedMotion(), [])

  const v = VARIANTS[variant]

  // Created once on the current finish; later finish changes are lerped in useFrame.
  const [m] = useState<Materials>(() => ({
    body: new THREE.MeshPhysicalMaterial({ color: v.body, roughness: 0.32, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.18 }),
    tip: new THREE.MeshPhysicalMaterial({ color: v.tip, roughness: 0.75, sheen: 1, sheenRoughness: 0.6, sheenColor: v.a }),
    dark: new THREE.MeshStandardMaterial({ color: '#0A0A0F', roughness: 0.45, metalness: 0.6 }),
  }))

  const [target] = useState(() => ({ body: new THREE.Color(), tip: new THREE.Color(), a: new THREE.Color(), b: new THREE.Color() }))
  target.body.set(v.body)
  target.tip.set(v.tip)
  target.a.set(v.a)
  target.b.set(v.b)

  useEffect(() => () => Object.values(m).forEach((mat) => mat.dispose()), [m])

  useFrame((state, delta) => {
    const k = 1 - Math.exp(-delta * 5)
    m.body.color.lerp(target.body, k)
    m.tip.color.lerp(target.tip, k)
    m.tip.sheenColor.lerp(target.a, k)
    rimA.current?.color.lerp(target.a, k)
    rimB.current?.color.lerp(target.b, k)

    const g = group.current
    if (!g) return

    if (mode === 'showcase') {
      // Slow turntable spin; dragging takes over and the tilt eases back on release.
      const d = drag.current
      if (!d.active && !still) d.yaw += delta * 0.35
      if (!d.active) d.pitch = THREE.MathUtils.damp(d.pitch, 0, 3, delta)
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, d.yaw, 8, delta)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, d.pitch, 8, delta)
      return
    }

    if (still) return
    const t = state.clock.elapsedTime
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5)
    g.position.y = Math.sin(t * 0.9) * 0.08 - scroll * 0.35
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, Math.sin(t * 0.25) * 0.35 + scroll * Math.PI * 0.9 + pointer.x * 0.3, 4, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, pointer.y * 0.18, 4, delta)
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 4, 5]} intensity={2.2} />
      <pointLight ref={rimA} position={[-3, 1.5, 1.5]} intensity={40} color={v.a} />
      <pointLight ref={rimB} position={[3, -1.5, 1.5]} intensity={34} color={v.b} />
      <Env />
      <group ref={group}>
        <group position={[-0.62, 0.12, 0]} rotation={[0.15, 0.55, 0.38]}>
          <Bud m={m} />
        </group>
        <group position={[0.62, -0.05, 0]} rotation={[0.1, -0.55, -0.24]} scale={[-1, 1, 1]}>
          <Bud m={m} />
        </group>
      </group>
    </>
  )
}

// Renders only while on screen, so two canvases never burn GPU at once.
export default function Earbuds3D({ variant, mode = 'hero' }: { variant: VariantId; mode?: Mode }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const drag = useRef<Drag>({ active: false, lastX: 0, lastY: 0, yaw: 0.3, pitch: 0 })

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  const dragHandlers = mode === 'showcase' ? {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      Object.assign(drag.current, { active: true, lastX: e.clientX, lastY: e.clientY })
    },
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = drag.current
      if (!d.active) return
      d.yaw += (e.clientX - d.lastX) * 0.012
      d.pitch = THREE.MathUtils.clamp(d.pitch + (e.clientY - d.lastY) * 0.008, -0.5, 0.5)
      d.lastX = e.clientX
      d.lastY = e.clientY
    },
    onPointerUp: () => { drag.current.active = false },
    onPointerCancel: () => { drag.current.active = false },
  } : {}

  return (
    <div ref={wrap} className={`earbuds-3d is-${mode}`} {...dragHandlers}>
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, mode === 'hero' ? 5.9 : 5.6], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Pair variant={variant} mode={mode} drag={drag} />
      </Canvas>
    </div>
  )
}
