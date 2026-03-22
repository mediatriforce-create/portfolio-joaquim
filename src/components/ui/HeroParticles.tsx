"use client";

import { useEffect, useRef } from "react";

/* ─── paleta ─── */
const PALETTE = [
  "#4ade80", "#22c55e", "#86efac", "#6ee7b7", "#10b981",
  "#ffffff", "#d1fae5", "#bbf7d0",
];

/* ─── helpers ─── */
function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function hexToRgb(hex: string) {
  const v = parseInt(hex.slice(1), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* ─── partícula ─── */
interface Particle {
  hx: number;            // home X
  hy: number;            // home Y
  w: number;             // largura do tracinho
  h: number;             // altura (28% da largura)
  rot: number;           // rotação atual
  spin: number;          // velocidade de spin (rad/frame)
  r: number; g: number; b: number; // cor RGB
  baseAlpha: number;     // alpha base
  currentAlpha: number;  // alpha interpolado
  freqX: number;         // frequência flutuação X
  freqY: number;         // frequência flutuação Y
  ampX: number;          // amplitude flutuação X
  ampY: number;          // amplitude flutuação Y
  phase: number;         // fase individual
  offX: number;          // offset mouse X (interpolado)
  offY: number;          // offset mouse Y (interpolado)
  fx: number;            // posição final X (cache para linhas)
  fy: number;            // posição final Y (cache para linhas)
}

const COUNT = 100;
const RADIUS = 320;
const MAX_PUSH = 26;
const LINK_DIST = 80;   // distância máxima para conectar partículas
const LINK_ALPHA = 0.12; // alpha máximo das linhas

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ─── resize ─── */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ─── criar partículas ─── */
    const particles: Particle[] = [];
    for (let i = 0; i < COUNT; i++) {
      const w = rand(1.5, 4.5);
      const color = hexToRgb(pick(PALETTE));
      particles.push({
        hx: Math.random() * window.innerWidth,
        hy: Math.random() * window.innerHeight,
        w,
        h: w * 0.28,
        rot: Math.random() * Math.PI * 2,
        spin: rand(-0.005, 0.005),
        r: color.r, g: color.g, b: color.b,
        baseAlpha: rand(0.06, 0.18),
        currentAlpha: rand(0.06, 0.18),
        freqX: rand(0.12, 0.3),
        freqY: rand(0.12, 0.3),
        ampX: rand(5, 14),
        ampY: rand(5, 14),
        phase: Math.random() * Math.PI * 2,
        offX: 0,
        offY: 0,
        fx: 0,
        fy: 0,
      });
    }
    particlesRef.current = particles;

    /* ─── mouse ─── */
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    /* ─── loop ─── */
    const draw = () => {
      timeRef.current += 1;
      const t = timeRef.current * 0.016; // ~tempo em segundos a 60fps

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // suavizar posição do mouse
      const sm = smoothMouseRef.current;
      const rm = mouseRef.current;
      sm.x = lerp(sm.x, rm.x, 0.07);
      sm.y = lerp(sm.y, rm.y, 0.07);

      // 1) Atualizar posições
      for (const p of particles) {
        const floatX = Math.sin(t * p.freqX + p.phase) * p.ampX;
        const floatY = Math.cos(t * p.freqY + p.phase) * p.ampY;

        const dx = p.hx - sm.x;
        const dy = p.hy - sm.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetOffX = 0;
        let targetOffY = 0;
        let influence = 0;

        if (dist < RADIUS && dist > 0.1) {
          influence = Math.exp(-((dist / RADIUS) ** 2) * 2.0);
          const nx = dx / dist;
          const ny = dy / dist;
          targetOffX = nx * MAX_PUSH * influence;
          targetOffY = ny * MAX_PUSH * influence;
        }

        p.offX = lerp(p.offX, targetOffX, 0.06);
        p.offY = lerp(p.offY, targetOffY, 0.06);

        const targetAlpha = p.baseAlpha + influence * 0.75;
        p.currentAlpha = lerp(p.currentAlpha, targetAlpha, 0.08);

        p.fx = p.hx + p.offX + floatX;
        p.fy = p.hy + p.offY + floatY;
        p.rot += p.spin;
      }

      // 2) Desenhar linhas de conexão (spatial grid para performance)
      const cellSize = LINK_DIST;
      const cols = Math.ceil(canvas.width / cellSize) + 1;
      const grid = new Map<number, number[]>();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.floor(p.fx / cellSize);
        const cy = Math.floor(p.fy / cellSize);
        const key = cy * cols + cx;
        const arr = grid.get(key);
        if (arr) arr.push(i); else grid.set(key, [i]);
      }

      ctx.lineWidth = 0.5;
      for (const [key, indices] of grid) {
        const cy = Math.floor(key / cols);
        const cx = key - cy * cols;

        for (let nc = cx; nc <= cx + 1; nc++) {
          for (let nr = cy; nr <= cy + 1; nr++) {
            const nkey = nr * cols + nc;
            const neighbors = grid.get(nkey);
            if (!neighbors) continue;

            const isSelf = nkey === key;
            for (let ii = 0; ii < indices.length; ii++) {
              const i = indices[ii];
              const a = particles[i];
              const startJ = isSelf ? ii + 1 : 0;
              for (let jj = startJ; jj < neighbors.length; jj++) {
                const j = neighbors[jj];
                const b = particles[j];
                const ddx = a.fx - b.fx;
                const ddy = a.fy - b.fy;
                const d2 = ddx * ddx + ddy * ddy;
                if (d2 < LINK_DIST * LINK_DIST) {
                  const d = Math.sqrt(d2);
                  const alpha = (1 - d / LINK_DIST) * LINK_ALPHA * Math.min(a.currentAlpha, b.currentAlpha) * 8;
                  ctx.strokeStyle = `rgba(74,222,128,${alpha})`;
                  ctx.beginPath();
                  ctx.moveTo(a.fx, a.fy);
                  ctx.lineTo(b.fx, b.fy);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      // 3) Desenhar partículas
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.fx, p.fy);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.currentAlpha})`;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    /* ─── cleanup ─── */
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "#000" }}
    />
  );
}
