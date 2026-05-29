"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import FloatingGeometry from "./FloatingGeometry";
import Lights from "./Lights";
import CameraRig from "./CameraRig";

interface Props {
  hoveredProduct: string | null;
  selectedProduct: string | null;
  searchQuery: string;
}

function SceneContents({ hoveredProduct, selectedProduct, searchQuery }: Props) {
  return (
    <>
      <CameraRig
        hoveredProduct={hoveredProduct}
        selectedProduct={selectedProduct}
      />
      <Lights
        hoveredProduct={hoveredProduct}
        selectedProduct={selectedProduct}
      />
      <FloatingGeometry
        hoveredProduct={hoveredProduct}
        selectedProduct={selectedProduct}
        searchQuery={searchQuery}
      />

      {/* Post-processing — bloom only, no darkening */}
      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.60}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>

      {/* Warm bright environment for PBR reflections */}
      <Environment preset="apartment" />
    </>
  );
}

export default function SpatialScene({ hoveredProduct, selectedProduct, searchQuery }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ReinhardToneMapping,
        toneMappingExposure: 1.6,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ReinhardToneMapping;
        gl.toneMappingExposure = 1.6;
      }}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>
        <SceneContents
          hoveredProduct={hoveredProduct}
          selectedProduct={selectedProduct}
          searchQuery={searchQuery}
        />
      </Suspense>
    </Canvas>
  );
}
