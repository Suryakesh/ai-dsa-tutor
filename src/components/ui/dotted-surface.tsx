"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Dots() {
  const ref = useRef<THREE.Points>(null);
  
  // Create grid of points
  const { positions } = useMemo(() => {
    const positions = [];
    for (let x = -20; x < 20; x++) {
      for (let z = -30; z < 20; z++) {
        // Shifted origin slightly to look better from camera angle
        positions.push(x * 1.5, 0, z * 1.5);
      }
    }
    return { positions: new Float32Array(positions) };
  }, []);

  // Material setup
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0x8b5cf6, // Violet 500
        size: 0.08,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  // Animate dots wave effect
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    
    let i = 0;
    while (i < positions.length) {
      const x = positions[i];
      const z = positions[i + 2];
      // Wave equation based on x, z and time
      positions[i + 1] = Math.sin((x + time * 0.8) * 0.3) * Math.cos((z + time * 0.5) * 0.3) * 1.2;
      i += 3;
    }
    
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = Math.sin(time * 0.05) * 0.1; // Gentle sway
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
    </points>
  );
}

export function DottedSurface() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020617] pointer-events-none">
      <Canvas camera={{ position: [0, 8, 12], fov: 60 }}>
        {/* Fog to hide the edges blending into background */}
        <fog attach="fog" args={["#020617", 8, 25]} />
        <ambientLight intensity={0.5} />
        <Dots />
      </Canvas>
      {/* Bottom overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
