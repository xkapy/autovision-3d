import { Suspense, useRef, useMemo, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  Center,
  useProgress,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import { useEditorStore } from '../../stores/editorStore';
import { useAppStore } from '../../stores/appStore';

/** Error boundary to catch Three.js / R3F crashes */
class ViewerErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { hasError: boolean; error: string }
> {
  state = { hasError: false, error: '' };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-4 glass rounded-[var(--radius)]">
          <p className="text-[var(--danger)] font-semibold">3D Viewer Error</p>
          <p className="text-sm text-[var(--text-muted)] max-w-md text-center">{this.state.error}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: '' }); this.props.onReset(); }}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-[var(--radius-sm)] cursor-pointer text-sm"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoadingIndicator() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-3 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
          Loading model... {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

/** Procedural demo car — used when no GLTF model is loaded */
function DemoCar() {
  const { modifications } = useEditorStore();
  const color = modifications.paintColor;
  const metalness = modifications.metalness;
  const roughness = modifications.roughness;
  const wireframe = modifications.wireframe;

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness,
        roughness,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        wireframe,
      }),
    [color, metalness, roughness, wireframe]
  );

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#88CCFF',
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        transparent: true,
        opacity: 0.4,
        wireframe,
      }),
    [wireframe]
  );

  const tireMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9, metalness: 0.1, wireframe }),
    [wireframe]
  );

  const rimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: '#C0C0C0', roughness: 0.2, metalness: 0.9, wireframe }),
    [wireframe]
  );

  const lightMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FFFFFF',
        emissive: '#FFDDAA',
        emissiveIntensity: 0.5,
        wireframe,
      }),
    [wireframe]
  );

  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.45, 0]} material={bodyMaterial} castShadow>
        <boxGeometry args={[4.2, 0.7, 1.8]} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.95, 0]} material={bodyMaterial} castShadow>
        <boxGeometry args={[2.4, 0.6, 1.7]} />
      </mesh>
      {/* Windshield front */}
      <mesh position={[0.95, 0.95, 0]} rotation={[0, 0, 0.35]} material={glassMaterial}>
        <planeGeometry args={[0.7, 1.6]} />
      </mesh>
      {/* Windshield rear */}
      <mesh position={[-0.95, 0.95, 0]} rotation={[0, Math.PI, -0.35]} material={glassMaterial}>
        <planeGeometry args={[0.7, 1.6]} />
      </mesh>
      {/* Headlights */}
      <mesh position={[2.12, 0.45, 0.55]} material={lightMaterial}>
        <boxGeometry args={[0.05, 0.2, 0.35]} />
      </mesh>
      <mesh position={[2.12, 0.45, -0.55]} material={lightMaterial}>
        <boxGeometry args={[0.05, 0.2, 0.35]} />
      </mesh>
      {/* Tail lights */}
      <mesh position={[-2.12, 0.45, 0.55]}>
        <boxGeometry args={[0.05, 0.15, 0.3]} />
        <meshStandardMaterial color="#FF2222" emissive="#FF0000" emissiveIntensity={0.3} wireframe={wireframe} />
      </mesh>
      <mesh position={[-2.12, 0.45, -0.55]}>
        <boxGeometry args={[0.05, 0.15, 0.3]} />
        <meshStandardMaterial color="#FF2222" emissive="#FF0000" emissiveIntensity={0.3} wireframe={wireframe} />
      </mesh>
      {/* Wheels */}
      {[
        [1.3, 0.1, 1.05],
        [1.3, 0.1, -1.05],
        [-1.3, 0.1, 1.05],
        [-1.3, 0.1, -1.05],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={tireMaterial}>
            <torusGeometry args={[0.3, 0.12, 12, 24]} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={rimMaterial}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
          </mesh>
        </group>
      ))}
      {/* License plate area */}
      <mesh position={[2.13, 0.3, 0]}>
        <planeGeometry args={[0.6, 0.15]} />
        <meshStandardMaterial color="#FFFFFF" wireframe={wireframe} />
      </mesh>
    </group>
  );
}

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { modifications } = useEditorStore();

  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.isMeshStandardMaterial) {
          mat.color.set(modifications.paintColor);
          mat.metalness = modifications.metalness;
          mat.roughness = modifications.roughness;
          mat.wireframe = modifications.wireframe;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, modifications.paintColor, modifications.metalness, modifications.roughness, modifications.wireframe]);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export function ModelViewer() {
  const modelUrl = useAppStore((s) => s.modelUrl);
  const setModelUrl = useAppStore((s) => s.setModelUrl);
  const controlsRef = useRef<any>(null);

  return (
    <ViewerErrorBoundary onReset={() => {}}>
    <div className="w-full h-full min-h-[400px] rounded-[var(--radius)] overflow-hidden relative">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [6, 3, 6], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <fog attach="fog" args={['#1a1a2e', 20, 35]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[8, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.001}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />

        <Suspense fallback={<LoadingIndicator />}>
          {modelUrl ? <LoadedModel url={modelUrl} /> : <DemoCar />}
          <Environment preset="city" background={false} />
        </Suspense>

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          scale={15}
          blur={2.5}
          far={5}
        />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Ground grid */}
        <gridHelper args={[20, 40, '#444444', '#222222']} position={[0, -0.01, 0]} />
      </Canvas>
    </div>
    </ViewerErrorBoundary>
  );
}
