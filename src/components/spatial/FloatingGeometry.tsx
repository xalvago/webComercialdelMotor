"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// MOTOR COMPONENT SHAPES
// Each returns a <group> of meshes that form a recognisable motor part
// ─────────────────────────────────────────────────────────────────────────────

interface MatProps { color: string; metalness: number; roughness: number; opacity: number; emissive?: string; emissiveIntensity?: number }

function Mat({ color, metalness, roughness, opacity, emissive = "#000000", emissiveIntensity = 0 }: MatProps) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      transparent
      opacity={opacity}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      envMapIntensity={1.4}
    />
  );
}

// Pistón — cylindrical body + 3 piston ring grooves
function Piston({ mat }: { mat: MatProps }) {
  return (
    <group>
      {/* Main skirt */}
      <mesh>
        <cylinderGeometry args={[0.21, 0.21, 0.52, 32]} />
        <Mat {...mat} />
      </mesh>
      {/* Crown (top cap, slightly wider) */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.06, 32]} />
        <Mat {...mat} metalness={Math.min(mat.metalness + 0.05, 1)} roughness={Math.max(mat.roughness - 0.05, 0)} />
      </mesh>
      {/* Ring grooves */}
      {[0.18, 0.08, -0.02].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.215, 0.012, 4, 36]} />
          <Mat {...mat} opacity={mat.opacity * 0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Aro / Segmento — thin flat piston ring
function Ring({ mat }: { mat: MatProps }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.30, 0.022, 6, 72]} />
      <Mat {...mat} />
    </mesh>
  );
}

// Válvula — disc head + long thin stem
function Valve({ mat }: { mat: MatProps }) {
  return (
    <group>
      {/* Head disc */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 0.04, 32]} />
        <Mat {...mat} />
      </mesh>
      {/* Stem taper */}
      <mesh position={[0, 0.10, 0]}>
        <cylinderGeometry args={[0.05, 0.035, 0.40, 16]} />
        <Mat {...mat} />
      </mesh>
      {/* Keeper groove */}
      <mesh position={[0, -0.10, 0]}>
        <cylinderGeometry args={[0.020, 0.020, 0.28, 12]} />
        <Mat {...mat} />
      </mesh>
    </group>
  );
}

// Engranaje — gear with teeth silhouette (low-segment torus = teeth effect) + hub disc
function Gear({ mat }: { mat: MatProps }) {
  return (
    <group>
      {/* Teeth ring (10 segments = visible teeth) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.09, 4, 12]} />
        <Mat {...mat} />
      </mesh>
      {/* Hub disc */}
      <mesh>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 24]} />
        <Mat {...mat} roughness={Math.min(mat.roughness + 0.1, 1)} />
      </mesh>
      {/* Hub bore */}
      <mesh>
        <cylinderGeometry args={[0.045, 0.045, 0.08, 16]} />
        <Mat {...mat} opacity={Math.min(mat.opacity * 1.2, 1)} />
      </mesh>
    </group>
  );
}

// Cigüeñal — crankshaft: main journals + offset big-end throw
function Crankshaft({ mat }: { mat: MatProps }) {
  return (
    <group>
      {/* Main journal (centre) */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 20]} />
        <Mat {...mat} />
      </mesh>
      {/* Crank throw arm left */}
      <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.22, 12]} />
        <Mat {...mat} />
      </mesh>
      {/* Big-end journal left */}
      <mesh position={[-0.27, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 18]} />
        <Mat {...mat} />
      </mesh>
      {/* Crank throw arm right */}
      <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.22, 12]} />
        <Mat {...mat} />
      </mesh>
      {/* Big-end journal right (180° out of phase) */}
      <mesh position={[0.27, -0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 18]} />
        <Mat {...mat} />
      </mesh>
      {/* Counterweights */}
      <mesh position={[-0.18, -0.12, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.12, 0.08, 0.16]} />
        <Mat {...mat} />
      </mesh>
      <mesh position={[0.18, 0.12, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.12, 0.08, 0.16]} />
        <Mat {...mat} />
      </mesh>
    </group>
  );
}

// Biela — connecting rod: small end + shank + big end
function Biela({ mat }: { mat: MatProps }) {
  return (
    <group>
      {/* Shank */}
      <mesh>
        <capsuleGeometry args={[0.055, 0.42, 6, 14]} />
        <Mat {...mat} />
      </mesh>
      {/* Big end */}
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.115, 0.038, 8, 24]} />
        <Mat {...mat} />
      </mesh>
      {/* Small end */}
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.075, 0.030, 8, 20]} />
        <Mat {...mat} />
      </mesh>
    </group>
  );
}

// Turbo — impeller disc + radial blades
function Turbo({ mat }: { mat: MatProps }) {
  const BLADES = 8;
  return (
    <group>
      {/* Centre disc */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 20]} />
        <Mat {...mat} />
      </mesh>
      {/* Outer shroud ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.016, 6, 48]} />
        <Mat {...mat} opacity={mat.opacity * 0.8} />
      </mesh>
      {/* Blades */}
      {Array.from({ length: BLADES }).map((_, i) => {
        const angle = (i / BLADES) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.17, 0, Math.sin(angle) * 0.17]}
            rotation={[0, -angle + Math.PI / 4, 0.18]}
          >
            <boxGeometry args={[0.038, 0.07, 0.15]} />
            <Mat {...mat} />
          </mesh>
        );
      })}
    </group>
  );
}

// Árbol de levas — camshaft: shaft + two lobes
function CamShaft({ mat }: { mat: MatProps }) {
  return (
    <group>
      {/* Shaft */}
      <mesh>
        <cylinderGeometry args={[0.055, 0.055, 0.75, 18]} />
        <Mat {...mat} />
      </mesh>
      {/* Cam lobe 1 */}
      <mesh position={[0.14, 0.18, 0]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.115, 16, 10]} />
        <Mat {...mat} />
      </mesh>
      {/* Cam lobe 2 (opposite) */}
      <mesh position={[-0.14, -0.18, 0]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.115, 16, 10]} />
        <Mat {...mat} />
      </mesh>
      {/* Journal rings */}
      {[-0.28, 0, 0.28].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.022, 6, 24]} />
          <Mat {...mat} opacity={mat.opacity * 0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORBIT RING — red orbiting indicator for active pieces
// ─────────────────────────────────────────────────────────────────────────────

function OrbitRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    ringRef.current.rotation.z = t * 1.1;
    ringRef.current.rotation.x = t * 0.55 + 0.8;
  });
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[0.64, 0.007, 6, 64]} />
      <meshStandardMaterial
        color="#e02020"
        metalness={0.95}
        roughness={0.04}
        transparent
        opacity={0.82}
        emissive="#e02020"
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

type ShapeType = "piston" | "ring" | "valve" | "gear" | "crankshaft" | "biela" | "turbo" | "camshaft";

interface PieceConfig {
  id: string;
  shape: ShapeType;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  driftAmp: number;
}

function MotorPiece({
  config,
  active,
  dimmed,
}: {
  config: PieceConfig;
  active: boolean;
  dimmed: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetScaleRef = useRef(config.scale);
  const currentOpacityRef = useRef(dimmed ? 0.06 : active ? 1.0 : 0.83);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth Y drift
    const targetY = config.pos[1] + Math.sin(t * config.speed + config.phase) * config.driftAmp;
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.06);

    // Smooth rotation
    groupRef.current.rotation.y += 0.0022 * config.speed;
    groupRef.current.rotation.x += 0.0008 * config.speed;

    // Smooth scale with spring feel
    const targetScale = active ? config.scale * 1.30 : dimmed ? config.scale * 0.55 : config.scale;
    targetScaleRef.current = targetScale;
    const lerpFactor = active ? 0.18 : 0.10;
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScaleRef.current, lerpFactor);
    groupRef.current.scale.setScalar(newScale);

    // Active: extra bob
    if (active) {
      groupRef.current.position.y += Math.sin(t * 3.5) * 0.028;
    }

    // Opacity — traverse all materials in the group
    const targetOpacity = dimmed ? 0.06 : active ? 1.0 : 0.83;
    currentOpacityRef.current = THREE.MathUtils.lerp(currentOpacityRef.current, targetOpacity, 0.09);
    groupRef.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat && mat.opacity !== undefined) mat.opacity = currentOpacityRef.current;
        if (mat && active) {
          mat.emissive?.setHex(0xe02020);
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity ?? 0, 0.52, 0.12);
        } else if (mat) {
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity ?? 0, 0, 0.1);
        }
      }
    });
  });

  const baseColor = active ? "#ede8e0" : "#c8c0b4";
  const mat: MatProps = {
    color: baseColor,
    metalness: active ? 0.92 : 0.80,
    roughness: active ? 0.06 : 0.24,
    opacity: currentOpacityRef.current,
  };

  const Shape = (() => {
    switch (config.shape) {
      case "piston":     return <Piston mat={mat} />;
      case "ring":       return <Ring mat={mat} />;
      case "valve":      return <Valve mat={mat} />;
      case "gear":       return <Gear mat={mat} />;
      case "crankshaft": return <Crankshaft mat={mat} />;
      case "biela":      return <Biela mat={mat} />;
      case "turbo":      return <Turbo mat={mat} />;
      case "camshaft":   return <CamShaft mat={mat} />;
    }
  })();

  return (
    <group
      ref={groupRef}
      position={config.pos}
      rotation={config.rot}
      scale={config.scale}
    >
      {Shape}
      {active && <OrbitRing />}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURAL RINGS — background depth
// ─────────────────────────────────────────────────────────────────────────────

function StructuralRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const ring4 = useRef<THREE.Mesh>(null);
  const ring5 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) { ring1.current.rotation.z = t * 0.032; ring1.current.rotation.x = Math.sin(t * 0.025) * 0.28; }
    if (ring2.current) { ring2.current.rotation.z = -t * 0.022; ring2.current.rotation.y = t * 0.016; }
    if (ring3.current) { ring3.current.rotation.x = t * 0.019; ring3.current.rotation.z = Math.cos(t * 0.032) * 0.18; }
    if (ring4.current) { ring4.current.rotation.y = t * 0.028; ring4.current.rotation.z = -t * 0.014; }
    if (ring5.current) { ring5.current.rotation.x = -t * 0.024; ring5.current.rotation.y = Math.sin(t * 0.02) * 0.22; }
  });

  return (
    <>
      <mesh ref={ring1} position={[1.5, 0.5, -3]}>
        <torusGeometry args={[2.2, 0.024, 8, 80]} />
        <meshStandardMaterial color="#e02020" metalness={0.9} roughness={0.1} transparent opacity={0.30} emissive="#e02020" emissiveIntensity={0.55} />
      </mesh>
      <mesh ref={ring2} position={[-1.5, -0.5, -2]}>
        <torusGeometry args={[1.4, 0.018, 8, 64]} />
        <meshStandardMaterial color="#c8bfb0" metalness={0.82} roughness={0.22} transparent opacity={0.20} />
      </mesh>
      <mesh ref={ring3} position={[0.5, 1.0, -1]}>
        <torusGeometry args={[0.8, 0.014, 6, 48]} />
        <meshStandardMaterial color="#e02020" metalness={0.95} roughness={0.05} transparent opacity={0.36} emissive="#ff2020" emissiveIntensity={0.72} />
      </mesh>
      <mesh ref={ring4} position={[-2.2, 1.4, -4]}>
        <torusGeometry args={[1.8, 0.018, 8, 72]} />
        <meshStandardMaterial color="#c4b8a8" metalness={0.78} roughness={0.28} transparent opacity={0.14} />
      </mesh>
      <mesh ref={ring5} position={[2.8, -1.2, -3.5]}>
        <torusGeometry args={[1.1, 0.020, 8, 56]} />
        <meshStandardMaterial color="#e02020" metalness={0.9} roughness={0.1} transparent opacity={0.20} emissive="#e02020" emissiveIntensity={0.38} />
      </mesh>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPATIAL RAILS — technical blueprint lines
// ─────────────────────────────────────────────────────────────────────────────

function SpatialRails() {
  const rails: Array<{ points: [number, number, number][]; color: string; opacity: number }> = [
    { points: [[-5, -0.5, -2],  [5, -0.5, -2]],   color: "#e02020", opacity: 0.30 },
    { points: [[-4, 1.2, -3],   [4, 1.2, -3]],    color: "#b8a898", opacity: 0.18 },
    { points: [[-2, -1.5, -1],  [2, -1.5, -1]],   color: "#b8a898", opacity: 0.14 },
    { points: [[-5, 2.2, -4.5], [5, 2.2, -4.5]],  color: "#c4b4a0", opacity: 0.09 },
    { points: [[-5, -2.2, -4],  [5, -2.2, -4]],   color: "#e02020", opacity: 0.14 },
  ];
  return (
    <>
      {rails.map((rail, i) => (
        <Line key={i} points={rail.points} color={rail.color} lineWidth={0.7} transparent opacity={rail.opacity} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT PARTICLES — depth field of floating dust/debris
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// PIECE DEFINITIONS — 12 motor components scattered in 3D space
// ─────────────────────────────────────────────────────────────────────────────

const PRODUCT_PIECES: PieceConfig[] = [
  // Left cluster
  { id: "pistones",          shape: "piston",     pos: [-2.8,  0.4, -1.2], rot: [0.2, 0, 0],    scale: 1.05, speed: 0.65, phase: 0,   driftAmp: 0.20 },
  { id: "camisas",           shape: "ring",        pos: [-2.2, -0.8, -0.8], rot: [0.8, 0.5, 0],  scale: 0.90, speed: 0.48, phase: 1.2, driftAmp: 0.15 },
  { id: "cigüenales",        shape: "crankshaft",  pos: [-3.2, -0.2, -2.0], rot: [0.5, 0.3, 0],  scale: 0.80, speed: 0.55, phase: 2.4, driftAmp: 0.18 },
  { id: "anillos",           shape: "ring",        pos: [-1.8,  1.2, -1.5], rot: [0, 0, 0.4],    scale: 0.95, speed: 0.38, phase: 0.8, driftAmp: 0.16 },
  // Centre-right cluster
  { id: "turbos",            shape: "turbo",       pos: [ 1.0,  0.8, -1.0], rot: [0, 0, 0],      scale: 1.20, speed: 0.72, phase: 0.5, driftAmp: 0.22 },
  { id: "kits-distribucion", shape: "gear",        pos: [ 0.5, -0.5, -1.8], rot: [0.3, 0, 0.2],  scale: 0.88, speed: 0.45, phase: 1.8, driftAmp: 0.14 },
  { id: "culatas",           shape: "valve",       pos: [ 2.2,  0.2, -2.2], rot: [0.1, 0.4, 0],  scale: 1.00, speed: 0.58, phase: 3.0, driftAmp: 0.19 },
  { id: "valvulas",          shape: "valve",       pos: [ 1.6, -1.0, -0.8], rot: [0, 0.6, 0],    scale: 0.82, speed: 0.66, phase: 2.1, driftAmp: 0.17 },
  // Far right
  { id: "motores-completos", shape: "gear",        pos: [ 3.0,  0.6, -2.5], rot: [0.3, 0, 0],    scale: 1.15, speed: 0.38, phase: 1.0, driftAmp: 0.13 },
  { id: "bielas",            shape: "biela",       pos: [ 2.6, -0.4, -1.5], rot: [0, 0.3, 0.4],  scale: 0.75, speed: 0.80, phase: 0.3, driftAmp: 0.21 },
  // Ambient
  { id: "arboles-levas",     shape: "camshaft",    pos: [-0.5,  1.6, -3.0], rot: [1.0, 0, 0],    scale: 0.65, speed: 0.28, phase: 1.5, driftAmp: 0.12 },
  { id: "filtros",           shape: "ring",        pos: [ 0.2, -1.8, -2.8], rot: [0.1, 0.8, 0],  scale: 0.68, speed: 0.46, phase: 4.0, driftAmp: 0.16 },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  hoveredProduct: string | null;
  selectedProduct: string | null;
  searchQuery: string;
}

export default function FloatingGeometry({ hoveredProduct, selectedProduct, searchQuery }: Props) {
  const active = hoveredProduct || selectedProduct;
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <group>
      <StructuralRings />
      <SpatialRails />
      {PRODUCT_PIECES.map((config, i) => {
        const isActive = active === config.id;
        const isDimmed = hasSearch
          ? !config.id.toLowerCase().includes(searchQuery.toLowerCase())
          : !!active && !isActive;
        return (
          <MotorPiece
            key={i}
            config={config}
            active={isActive}
            dimmed={isDimmed}
          />
        );
      })}
    </group>
  );
}
