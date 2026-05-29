"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  hoveredProduct: string | null;
  selectedProduct: string | null;
}

export default function Lights({ hoveredProduct, selectedProduct }: Props) {
  const redLightRef  = useRef<THREE.PointLight>(null);
  const rimLightRef  = useRef<THREE.DirectionalLight>(null);
  const spotRef      = useRef<THREE.SpotLight>(null);

  const active = hoveredProduct || selectedProduct;

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Red accent — pulses on interaction
    if (redLightRef.current) {
      const targetIntensity = active ? 6 + Math.sin(t * 2.2) * 1.5 : 3 + Math.sin(t * 0.8) * 0.8;
      redLightRef.current.intensity +=
        (targetIntensity - redLightRef.current.intensity) * 0.06;

      // Drift position
      redLightRef.current.position.x = Math.sin(t * 0.18) * 3;
      redLightRef.current.position.y = 2 + Math.cos(t * 0.12) * 1;
    }

    // Rim — subtle movement
    if (rimLightRef.current) {
      rimLightRef.current.position.set(
        -4 + Math.sin(t * 0.1) * 0.5,
        3,
        -3 + Math.cos(t * 0.08) * 0.5
      );
    }

    // Spot — follows active product
    if (spotRef.current) {
      const targetI = active ? 12 : 0;
      spotRef.current.intensity += (targetI - spotRef.current.intensity) * 0.05;
    }
  });

  return (
    <>
      {/* Ambient — warm cream white, matches page palette */}
      <ambientLight intensity={0.55} color="#fff6ee" />

      {/* Main directional — warm fill */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.8}
        color="#fff8f0"
      />

      {/* Red accent — drifts, pulses */}
      <pointLight
        ref={redLightRef}
        position={[2, 2, 3]}
        intensity={3}
        color="#e02020"
        distance={14}
        decay={2}
      />

      {/* Rim — warm orange-gold, echoes brand warmth */}
      <directionalLight
        ref={rimLightRef}
        position={[-4, 3, -3]}
        intensity={0.7}
        color="#ffb080"
      />

      {/* Warm back fill — replaces cold blue */}
      <pointLight
        position={[0, -2, -6]}
        intensity={0.6}
        color="#ffe0c0"
        distance={18}
        decay={2}
      />

      {/* Dynamic spotlight for selected product */}
      <spotLight
        ref={spotRef}
        position={[0, 6, 2]}
        angle={0.35}
        penumbra={0.8}
        intensity={0}
        color="#ffffff"
        castShadow={false}
      />
    </>
  );
}
