"use client";

import { useEffect, useRef } from "react";

interface Props {
  selectedCard: number | null;
  hoveredProduct?: string | null;
}

const SHELVES_POS = [
  { x: 0, y: 0 }, { x: 0, y: 1.4 }, { x: 0, y: 2.8 }, { x: 0, y: 4.2 },
  { x: 4, y: 0 }, { x: 4, y: 1.4 }, { x: 4, y: 2.8 }, { x: 4, y: 4.2 },
  { x: 9, y: 0 }, { x: 9, y: 1.4 }, { x: 9, y: 2.8 }, { x: 9, y: 4.2 },
];

const SHELF_TARGETS = [
  { x: 3.3, y: 0.4 }, { x: 3.3, y: 1.8 }, { x: 3.3, y: 3.2 }, { x: 3.3, y: 4.6 },
  { x: 3.3, y: 0.4 }, { x: 3.3, y: 1.8 }, { x: 3.3, y: 3.2 }, { x: 3.3, y: 4.6 },
  { x: 8.3, y: 0.4 }, { x: 8.3, y: 1.8 }, { x: 8.3, y: 3.2 }, { x: 8.3, y: 4.6 },
];

// Map product IDs → shelf index
const PRODUCT_SHELF: Record<string, number> = {
  "pistones":           0,
  "camisas":            1,
  "cigüenales":         2,
  "culatas":            3,
  "kits-distribucion":  4,
  "turbos":             5,
  "juntas-motor":       6,
  "cojinetes":          7,
  "arboles-levas":      8,
  "bielas":             9,
  "anillos":            10,
  "valvulas":           11,
  "bombas-agua":        0,
  "bombas-aceite":      1,
  "enfriadores-aceite": 2,
  "filtros":            3,
  "inyectores":         4,
  "bombas-inyeccion":   5,
  "motores-completos":  6,
  "alternadores":       7,
  "motores-arranque":   8,
  "correas":            9,
  "radiadores":         10,
  "intercoolers":       11,
  "electrovalvulas":    0,
};

export default function WarehouseScene({ selectedCard, hoveredProduct }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimRef = useRef({ logW: 0, logH: 0 });
  const stateRef = useRef({
    fkX: 3.5, fkY: 2.0,
    fkTargetX: 3.5, fkTargetY: 2.0,
    fkMast: 0.3, mastTimer: 0,
    pickP: 0, pickShelfIdx: -1,
    glowShelfIdx: -1,
    glowPulse: 0,
  });
  const rafRef = useRef<number>(0);

  // selectedCard prop → forklift + beam
  useEffect(() => {
    if (selectedCard === null) return;
    const shelfIdx = selectedCard % SHELVES_POS.length;
    const target = SHELF_TARGETS[shelfIdx];
    stateRef.current.fkTargetX = target.x;
    stateRef.current.fkTargetY = target.y;
    stateRef.current.pickP = 1.0;
    stateRef.current.pickShelfIdx = shelfIdx;
  }, [selectedCard]);

  // hoveredProduct prop → shelf glow + gentle forklift move
  useEffect(() => {
    if (!hoveredProduct) {
      stateRef.current.glowShelfIdx = -1;
      return;
    }
    const idx = PRODUCT_SHELF[hoveredProduct] ?? -1;
    stateRef.current.glowShelfIdx = idx;
    if (idx >= 0) {
      const target = SHELF_TARGETS[idx];
      stateRef.current.fkTargetX = target.x;
      stateRef.current.fkTargetY = target.y;
      stateRef.current.pickP = 0.5;
      stateRef.current.pickShelfIdx = idx;
    }
  }, [hoveredProduct]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dimRef.current.logW = rect.width;
      dimRef.current.logH = rect.height;
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Isometric projection ──────────────────────────────────────────────
    function iso(x: number, y: number, z: number) {
      const { logW, logH } = dimRef.current;
      return {
        x: logW * 0.48 + (x - y) * 20,
        y: logH * 0.52 + (x + y) * 10 - z * 16,
      };
    }

    // ── Primitive: filled isometric quad ─────────────────────────────────
    function quad(
      ctx: CanvasRenderingContext2D,
      pts: { x: number; y: number }[],
      fill: string,
      strokeAlpha: number
    ) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = `rgba(0,0,0,${strokeAlpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // ── Box ───────────────────────────────────────────────────────────────
    function drawBox(
      ctx: CanvasRenderingContext2D,
      x: number, y: number, z: number,
      w: number, d: number, h: number,
      cTop: string, cLeft: string, cRight: string
    ) {
      quad(ctx, [iso(x,y,z+h), iso(x+w,y,z+h), iso(x+w,y+d,z+h), iso(x,y+d,z+h)], cTop, 0.06);
      quad(ctx, [iso(x,y,z), iso(x+w,y,z), iso(x+w,y,z+h), iso(x,y,z+h)], cLeft, 0.10);
      quad(ctx, [iso(x+w,y,z), iso(x+w,y+d,z), iso(x+w,y+d,z+h), iso(x+w,y,z+h)], cRight, 0.14);
    }

    // ── Floor ─────────────────────────────────────────────────────────────
    function drawFloor(ctx: CanvasRenderingContext2D) {
      for (let gx = 0; gx < 13; gx++) {
        for (let gy = 0; gy < 10; gy++) {
          const inV = (gx >= 3 && gx < 4) || (gx >= 8 && gx < 9);
          const inH = gy >= 5 && gy < 6;
          const color = (inV || inH)
            ? "#242424"
            : (gx + gy) % 2 === 0 ? "#edeae0" : "#e6e3d8";
          quad(ctx,
            [iso(gx,gy,0), iso(gx+1,gy,0), iso(gx+1,gy+1,0), iso(gx,gy+1,0)],
            color, 0.04
          );
        }
      }
    }

    // ── Signage ───────────────────────────────────────────────────────────
    function drawSignage(ctx: CanvasRenderingContext2D) {
      ctx.strokeStyle = "rgba(255,210,0,0.8)";
      ctx.lineWidth = 1.5;
      for (const gx of [3, 4, 8, 9]) {
        for (let seg = 0; seg < 10; seg += 2) {
          const p0 = iso(gx, seg, 0.02);
          const p1 = iso(gx, seg + 0.65, 0.02);
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        }
      }
      for (const gy of [5, 6]) {
        for (let seg = 0; seg < 13; seg += 2) {
          const p0 = iso(seg, gy, 0.02);
          const p1 = iso(seg + 0.65, gy, 0.02);
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        }
      }
      ctx.strokeStyle = "rgba(255,50,50,0.18)";
      ctx.lineWidth = 6;
      for (let seg = 0; seg < 13; seg += 2) {
        const p0 = iso(seg, 5, 0.01);
        const p1 = iso(seg + 1, 6, 0.01);
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      }
    }

    // ── Shelf glow (hover highlight) ──────────────────────────────────────
    function drawShelfGlow(ctx: CanvasRenderingContext2D, shelfIdx: number, pulse: number) {
      if (shelfIdx < 0 || pulse <= 0) return;
      const s = SHELVES_POS[shelfIdx];
      const center = iso(s.x + 1.3, s.y + 0.2, 2.5);
      const alpha = pulse * 0.28;
      const radius = 55 + pulse * 20;
      const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
      grad.addColorStop(0, `rgba(224,32,32,${alpha})`);
      grad.addColorStop(0.5, `rgba(224,32,32,${alpha * 0.4})`);
      grad.addColorStop(1, "rgba(224,32,32,0)");
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    // ── Shelf ─────────────────────────────────────────────────────────────
    function drawShelf(ctx: CanvasRenderingContext2D, sx: number, sy: number) {
      const sw = 2.6, sd = 0.4, sh = 4.8;
      drawBox(ctx, sx,              sy, 0, 0.15, sd, sh, "#e02020", "#a01010", "#700808");
      drawBox(ctx, sx + sw - 0.15,  sy, 0, 0.15, sd, sh, "#e02020", "#a01010", "#700808");
      for (let lvl = 0; lvl < 4; lvl++) {
        drawBox(ctx, sx, sy, 0.6 + lvl * 1.1, sw, sd, 0.1, "#d4c8a8", "#b8a880", "#a09060");
      }
      const PT = [
        { top: "#8899bb", left: "#6677aa", right: "#445599" },
        { top: "#c8a060", left: "#9a7040", right: "#7a5030" },
        { top: "#aaaaaa", left: "#888888", right: "#666666" },
      ];
      const patterns = [[0,1,2],[1,2,0],[2,0,1]];
      for (let lvl = 0; lvl < 3; lvl++) {
        const z = 0.72 + lvl * 1.1;
        for (let slot = 0; slot < 3; slot++) {
          const pt = PT[patterns[lvl][slot]];
          drawBox(ctx, sx + 0.1 + slot * 0.77, sy + 0.02, z, 0.6, 0.35, 0.5, pt.top, pt.left, pt.right);
        }
      }
    }

    // ── Forklift + operator ───────────────────────────────────────────────
    function drawForklift(ctx: CanvasRenderingContext2D, fx: number, fy: number, mast: number) {
      const mh = 0.5 + mast * 2.5;
      drawBox(ctx, fx, fy, 0, 0.8, 0.6, 0.5, "#f5c518", "#d4a010", "#b08010");
      drawBox(ctx, fx, fy + 0.1, 0.5, 0.8, 0.5, 0.4, "#333333", "#222222", "#111111");
      drawBox(ctx, fx - 0.12, fy + 0.05, 0, 0.1, 0.1, mh, "#f5c518", "#d4a010", "#b08010");
      drawBox(ctx, fx + 0.72, fy + 0.05, 0, 0.1, 0.1, mh, "#f5c518", "#d4a010", "#b08010");
      drawBox(ctx, fx - 0.15, fy + 0.06, mh, 1.1, 0.07, 0.06, "#999999", "#777777", "#555555");
      drawBox(ctx, fx - 0.15, fy + 0.29, mh, 1.1, 0.07, 0.06, "#999999", "#777777", "#555555");
      const wheelPts: [number, number][] = [
        [fx + 0.05, fy - 0.05], [fx + 0.60, fy - 0.05],
        [fx + 0.05, fy + 0.53], [fx + 0.60, fy + 0.53],
      ];
      for (const [wx, wy] of wheelPts) {
        drawBox(ctx, wx, wy, 0, 0.15, 0.12, 0.12, "#222222", "#111111", "#000000");
      }
      drawBox(ctx, fx + 0.25, fy + 0.15, 0.5,  0.12, 0.15, 0.12, "#1a1a1a", "#111111", "#000000");
      drawBox(ctx, fx + 0.45, fy + 0.15, 0.5,  0.12, 0.15, 0.12, "#1a1a1a", "#111111", "#000000");
      drawBox(ctx, fx + 0.20, fy + 0.12, 0.62, 0.40, 0.35, 0.45, "#1a3a6a", "#122a50", "#0c1f3c");
      drawBox(ctx, fx + 0.22, fy + 0.14, 0.72, 0.36, 0.30, 0.28, "#f5a500", "#d48000", "#b06000");
      drawBox(ctx, fx + 0.28, fy + 0.16, 1.07, 0.24, 0.22, 0.22, "#f0c090", "#d0a070", "#b08050");
      drawBox(ctx, fx + 0.24, fy + 0.13, 1.27, 0.32, 0.26, 0.10, "#f5c518", "#d4a010", "#b08010");
      drawBox(ctx, fx + 0.29, fy + 0.14, 1.08, 0.22, 0.20, 0.10, "#88aadd", "#6688bb", "#446699");
    }

    // ── Beam ──────────────────────────────────────────────────────────────
    function drawBeam(ctx: CanvasRenderingContext2D, pickP: number, shelfIdx: number) {
      if (pickP <= 0 || shelfIdx < 0) return;
      const s = SHELVES_POS[shelfIdx];
      const origin = iso(s.x + 1.3, s.y + 0.2, 2.5);
      const { logW, logH } = dimRef.current;
      const colX = shelfIdx < 4 ? 0.2 : shelfIdx < 8 ? 0.5 : 0.8;
      const dest = { x: logW * colX, y: logH + 30 };
      const alpha = Math.sin(pickP * Math.PI) * 0.65;
      const ddx = dest.x - origin.x;
      const ddy = dest.y - origin.y;
      const len = Math.sqrt(ddx * ddx + ddy * ddy);
      const nx = -ddy / len;
      const ny = ddx / len;
      const grad = ctx.createLinearGradient(origin.x, origin.y, dest.x, dest.y);
      grad.addColorStop(0, `rgba(224,32,32,${alpha})`);
      grad.addColorStop(1, "rgba(224,32,32,0)");
      ctx.beginPath();
      ctx.moveTo(origin.x + nx * 5,  origin.y + ny * 5);
      ctx.lineTo(origin.x - nx * 5,  origin.y - ny * 5);
      ctx.lineTo(dest.x  - nx * 12,  dest.y  - ny * 12);
      ctx.lineTo(dest.x  + nx * 12,  dest.y  + ny * 12);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // ── Render loop ───────────────────────────────────────────────────────
    function render() {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext("2d");
      if (!ctx) return;
      const { logW, logH } = dimRef.current;
      const st = stateRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, logW, logH);
      ctx.fillStyle = "#f5f2eb";
      ctx.fillRect(0, 0, logW, logH);

      // Forklift movement
      const dx = st.fkTargetX - st.fkX;
      const dy = st.fkTargetY - st.fkY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      st.mastTimer += 0.03;
      if (dist > 0.08) {
        st.fkX += (dx / dist) * 0.018;
        st.fkY += (dy / dist) * 0.018;
        st.fkMast = Math.abs(Math.sin(st.mastTimer * 0.3));
      } else {
        st.fkMast = (Math.sin(st.mastTimer) + 1) / 2;
      }
      if (st.pickP > 0) st.pickP -= 0.014;

      // Glow pulse (hover)
      if (st.glowShelfIdx >= 0) {
        st.glowPulse = (Math.sin(st.mastTimer * 1.8) * 0.3 + 0.7);
      } else {
        st.glowPulse = Math.max(0, st.glowPulse - 0.04);
      }

      // 1. Floor
      drawFloor(ctx);
      // 2. Signage
      drawSignage(ctx);
      // 3. Shelf glow (behind shelves)
      drawShelfGlow(ctx, st.glowShelfIdx, st.glowPulse);
      // 4. Shelves sorted back→front
      const sorted = SHELVES_POS
        .map((s, i) => ({ ...s, i }))
        .sort((a, b) => (a.x + a.y) - (b.x + b.y));
      for (const s of sorted) drawShelf(ctx, s.x, s.y);
      // 5. Forklift
      drawForklift(ctx, st.fkX, st.fkY, st.fkMast);
      // 6. Beam
      if (st.pickP > 0) drawBeam(ctx, st.pickP, st.pickShelfIdx);

      ctx.restore();
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
