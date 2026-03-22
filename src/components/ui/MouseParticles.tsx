"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function MouseParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -999, y: -999, moving: false });
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, moving: true };
    };
    const onMouseLeave = () => {
      mouseRef.current.moving = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const spawnParticles = (x: number, y: number, now: number) => {
      if (now - lastSpawnRef.current < 16) return; // max ~60 spawns/s
      lastSpawnRef.current = now;

      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.2;
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: Math.cos(angle) * speed * 0.4,
          vy: -Math.abs(Math.sin(angle) * speed) - 0.8, // sempre sobe
          life: 1,
          maxLife: 60 + Math.random() * 60,
          size: 1.5 + Math.random() * 2.5,
          hue: 140 + Math.random() * 20, // verde neon ~ 140-160
        });
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseRef.current.moving) {
        spawnParticles(mouseRef.current.x, mouseRef.current.y, now);
      }

      for (const p of particlesRef.current) {
        p.life -= 1 / p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vy -= 0.012;
      }

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      for (const p of particlesRef.current) {
        const alpha = Math.max(0, Math.min(1, Math.pow(p.life, 1.5)));
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grd.addColorStop(0, `hsla(${p.hue}, 100%, 65%, ${alpha})`);
        grd.addColorStop(0.4, `hsla(${p.hue}, 100%, 55%, ${alpha * 0.4})`);
        grd.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Núcleo brilhante
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 90%, ${alpha * 0.9})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
