"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Esfera central sutil
function CoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.06;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.4, 48, 48]} />
      <MeshDistortMaterial
        color="#00ff66"
        emissive="#00ff66"
        emissiveIntensity={0.2}
        distort={0.25}
        speed={1.5}
        roughness={0.2}
        metalness={0.9}
        transparent
        opacity={0.08}
        wireframe
      />
    </mesh>
  );
}

// Anéis orbitais finos
function OrbitalRing({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ringRef} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 6, 160]} />
      <meshStandardMaterial
        color="#00ff66"
        emissive="#00ff66"
        emissiveIntensity={0.8}
        transparent
        opacity={0.18}
      />
    </mesh>
  );
}

// Partículas esparsas
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 60;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.8 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.025;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00ff66" size={0.018} sizeAttenuation transparent opacity={0.5} />
    </points>
  );
}

export function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.05} />
        <pointLight position={[4, 4, 4]} intensity={0.3} color="#00ff66" />

        <CoreSphere />
        <OrbitalRing radius={2.4} speed={0.25}  tilt={Math.PI / 7} />
        <OrbitalRing radius={3.0} speed={-0.15} tilt={Math.PI / 3} />
        <OrbitalRing radius={3.7} speed={0.1}   tilt={Math.PI / 2} />
        <FloatingParticles />

        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
