"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  hoveredProduct: string | null;
  selectedProduct: string | null;
}

// Per-product focus positions (subtle camera shifts)
const PRODUCT_CAM_OFFSETS: Record<string, [number, number, number]> = {
  "pistones":           [-0.4, 0.1, 0],
  "turbos":             [0.3,  0.2, 0.2],
  "motores-completos":  [0.5, -0.1, 0],
  "culatas":            [0.3,  0.0, 0],
  "kits-distribucion":  [0.2,  0.1, 0.1],
  "anillos":            [-0.3, 0.3, 0],
  "cigüenales":         [-0.4, 0.0, 0],
};

export default function CameraRig({ hoveredProduct, selectedProduct }: Props) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 6));

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const active = hoveredProduct || selectedProduct;

    // Idle cinematic drift — slow, heavy, elegant
    const driftX = Math.sin(t * 0.09) * 0.22;
    const driftY = Math.cos(t * 0.07) * 0.14;
    const driftZ = Math.sin(t * 0.05) * 0.08;

    // Product focus offset
    const offset = active
      ? (PRODUCT_CAM_OFFSETS[active] ?? [0, 0, 0])
      : [0, 0, 0];

    // Selected: dolly in slightly
    const zOffset = selectedProduct ? -0.5 : 0;

    targetPos.current.set(
      offset[0] + driftX,
      offset[1] + driftY,
      6 + zOffset + driftZ
    );

    // Lerp toward target — inertial, weighted
    camera.position.lerp(targetPos.current, 0.025);

    // Very subtle look-at drift — always toward origin
    const lookTarget = new THREE.Vector3(
      Math.sin(t * 0.06) * 0.1,
      Math.cos(t * 0.05) * 0.08,
      0
    );
    camera.lookAt(lookTarget);
  });

  return null;
}
