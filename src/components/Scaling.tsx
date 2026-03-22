"use client";

import { motion, useScroll, useTransform, useSpring, useMotionTemplate, AnimatePresence, type MotionValue } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";

/* ═══ FOGUETE SVG — horizontal ═══ */
function RocketSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="body" x1="20" y1="40" x2="90" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#666" /><stop offset="30%" stopColor="#a0a0a0" />
          <stop offset="60%" stopColor="#d4d4d4" /><stop offset="100%" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="win" x1="70" y1="34" x2="70" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#66ffaa" /><stop offset="100%" stopColor="#00cc55" />
        </linearGradient>
        <linearGradient id="fl1" x1="0" y1="40" x2="28" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00ff66" stopOpacity="0" /><stop offset="100%" stopColor="#00ff66" />
        </linearGradient>
        <linearGradient id="fl2" x1="5" y1="40" x2="28" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0" /><stop offset="100%" stopColor="white" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <motion.path d="M28 35 Q12 37, 0 40 Q12 43, 28 45" fill="url(#fl1)"
        animate={{ d: ["M28 35 Q12 37, 0 40 Q12 43, 28 45","M28 36 Q8 38, -4 40 Q8 42, 28 44","M28 35 Q12 37, 0 40 Q12 43, 28 45"] }}
        transition={{ duration: 0.2, repeat: Infinity }} />
      <motion.path d="M28 37 Q18 39, 10 40 Q18 41, 28 43" fill="url(#fl2)"
        animate={{ d: ["M28 37 Q18 39, 10 40 Q18 41, 28 43","M28 38 Q14 39, 5 40 Q14 41, 28 42","M28 37 Q18 39, 10 40 Q18 41, 28 43"] }}
        transition={{ duration: 0.15, repeat: Infinity }} />
      <path d="M32 26 L22 18 L28 30 Z" fill="#00ff66" opacity="0.7" />
      <path d="M32 54 L22 62 L28 50 Z" fill="#00ff66" opacity="0.7" />
      <path d="M28 30 C28 30 50 28 80 40 C50 52 28 50 28 50 Z" fill="url(#body)" />
      <path d="M28 30 C28 30 50 28 80 40 C50 52 28 50 28 50 Z" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <circle cx="58" cy="40" r="6" fill="url(#win)" filter="url(#glow)" />
      <circle cx="58" cy="40" r="6" fill="none" stroke="white" strokeWidth="0.7" opacity="0.4" />
      <ellipse cx="56" cy="38" rx="2.5" ry="1.5" fill="white" opacity="0.3" />
    </svg>
  );
}

/* ═══ ESTRELAS COM WARP ═══ */
function WarpStars({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const progressRef = useRef(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => { progressRef.current = v; });
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 200;
    const stars = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 3,
      z: Math.random(),
      speed: 0.3 + Math.random() * 0.7,
      size: 0.5 + Math.random() * 1.5,
      brightness: 0.15 + Math.random() * 0.35,
      dead: false,
      // Flutuação idle
      floatPhase: Math.random() * Math.PI * 2,
      floatFreqX: 0.3 + Math.random() * 0.5,
      floatFreqY: 0.3 + Math.random() * 0.5,
      floatAmpX: 0.015 + Math.random() * 0.04,
      floatAmpY: 0.015 + Math.random() * 0.04,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleFreq: 0.8 + Math.random() * 2.0,
    }));

    let prevTime = performance.now();
    let totalTime = 0;
    // Acumulador de tempo que só conta enquanto isDraining
    let drainAccum = 0;
    let wasDraining = false;

    const draw = () => {
      const now = performance.now();
      const dt = (now - prevTime) / 1000; // delta em segundos
      prevTime = now;

      totalTime += dt;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const p = progressRef.current;

      // Warp visual (clamped 0–1) — controla streak length
      const warpRaw = Math.max(0, (p - 0.56) / 0.14);
      const warp = Math.min(1, warpRaw);

      // Warp visual cresce de 0.56 a 0.70, push continua além
      const scrollPush = Math.max(0, p - 0.56);

      // Drain: ativa quando scroll >= 0.66
      const isDraining = p >= 0.66;

      // Reset se user voltou o scroll
      if (!isDraining && wasDraining) {
        drainAccum = 0;
        for (const s of stars) s.dead = false;
      }

      // Acumula tempo de drain
      if (isDraining) {
        drainAccum += dt;
      }
      wasDraining = isDraining;

      let visibleCount = 0;

      for (const s of stars) {
        if (s.dead) continue;

        let z: number;

        if (!isDraining) {
          // Fase normal: scroll empurra + recicla
          const offset = scrollPush * s.speed * 4;
          z = s.z - offset;
          z = ((z % 1) + 1) % 1;
        } else {
          // Fase drain: scroll continua empurrando, tempo é só backup suave
          // Stars devem durar de 0.66 até ~0.85 (último card)
          const scrollOffset = scrollPush * s.speed * 4;
          const timeOffset = drainAccum * s.speed * 0.6;
          z = s.z - scrollOffset - timeOffset;
          if (z < 0) {
            s.dead = true;
            continue;
          }
        }

        const perspective = 1 / (z + 0.05);
        // Flutuação suave idle
        const floatX = Math.sin(totalTime * s.floatFreqX + s.floatPhase) * s.floatAmpX;
        const floatY = Math.cos(totalTime * s.floatFreqY + s.floatPhase) * s.floatAmpY;
        const sx = cx + (s.x + floatX) * perspective * 100;
        const sy = cy + (s.y + floatY) * perspective * 100;

        if (sx < -100 || sx > w + 100 || sy < -100 || sy > h + 100) {
          if (isDraining) { s.dead = true; }
          continue;
        }

        visibleCount++;
        const starSize = s.size * Math.min(perspective * 0.3, 4);
        const effectiveWarp = isDraining ? Math.max(warp, 0.7) : warp;

        if (effectiveWarp < 0.05) {
          // Twinkle sutil quando idle
          const twinkle = 1 + Math.sin(totalTime * s.twinkleFreq + s.twinklePhase) * 0.3;
          ctx.globalAlpha = s.brightness * twinkle;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const dx = sx - cx;
          const dy = sy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.5) continue;
          const nx = dx / dist;
          const ny = dy / dist;

          const streakLen = effectiveWarp * effectiveWarp * (15 + perspective * 12) * s.speed;
          const tailX = sx - nx * streakLen;
          const tailY = sy - ny * streakLen;

          const alpha = Math.min(1, s.brightness + effectiveWarp * 0.6);

          const grad = ctx.createLinearGradient(tailX, tailY, sx, sy);
          grad.addColorStop(0, `rgba(255,255,255,0)`);
          grad.addColorStop(0.5, `rgba(200,255,230,${alpha * 0.4})`);
          grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = starSize * (0.6 + effectiveWarp * 0.5);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(sx, sy);
          ctx.stroke();

          ctx.globalAlpha = alpha * 0.8;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(sx, sy, starSize * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ═══ FASE — título ═══ */
function PhaseTitle({
  title, scrollYProgress, fadeIn, fadeOut,
}: {
  title: string;
  scrollYProgress: MotionValue<number>;
  fadeIn: [number, number]; fadeOut: [number, number];
}) {
  const opacity = useTransform(scrollYProgress, [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [fadeIn[0], fadeIn[1], fadeOut[0], fadeOut[1]], [40, 0, 0, -30]);
  const parts = title.split(/\*\*(.*?)\*\*/);

  return (
    <motion.div style={{ opacity, y }}
      className="absolute top-[20%] left-0 right-0 flex flex-col items-center z-20 pointer-events-none px-6"
    >
      <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter text-center leading-[1.1] mb-3 max-w-3xl">
        {parts.map((part, i) =>
          i % 2 === 1 ? <span key={i} className="text-[#00ff66]">{part}</span> : <span key={i}>{part}</span>
        )}
      </h3>
    </motion.div>
  );
}

/* ═══ TOOL — aparece quando foguete passa ═══ */
function InlineTool({
  tool, index, total, scrollYProgress,
}: {
  tool: typeof TOOLS[number]; index: number; total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const spawnAt = 0.22 + (index / (total - 1)) * 0.25;
  const opacity = useTransform(scrollYProgress, [spawnAt, spawnAt + 0.02, 0.50, 0.55], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [spawnAt, spawnAt + 0.02, spawnAt + 0.05], [0.3, 1.15, 1]);
  const y = useTransform(scrollYProgress, [spawnAt, spawnAt + 0.03], [20, 0]);
  const Icon = tool.icon;

  return (
    <motion.div style={{ opacity, scale, y }} className="flex flex-col items-center gap-1 will-change-transform">
      <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-white/[0.06] border border-white/8"
        style={{ boxShadow: `0 0 10px ${tool.color}12` }}>
        <Icon className="w-3 h-3 sm:w-4 sm:h-4" color={tool.color} />
      </div>
      <span className="font-mono text-[4px] sm:text-[5px] md:text-[6px] text-neutral-600 uppercase tracking-[0.06em] hidden sm:block">{tool.name}</span>
    </motion.div>
  );
}

/* ═══ PRIMEIRO PROJECT CARD — Z-Axis Slam + Exit ═══ */
function FirstProjectCard({
  project, scrollYProgress, fadeIn, exitRange, exitDirection, zIndex, onOpen,
}: {
  project: Project;
  scrollYProgress: MotionValue<number>;
  fadeIn: [number, number];
  exitRange: [number, number];
  exitDirection: "left" | "right" | "up";
  zIndex: number;
  onOpen: () => void;
}) {
  // Z-axis: vem de longe (-1500) e bate em 0
  const z = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[1]],
    [-1500, 0]
  );
  const zSpring = useSpring(z, { stiffness: 180, damping: 24, mass: 2.0 });

  const rotateX = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[0] + 0.02, fadeIn[1]],
    [6, 3, 0]
  );
  const rotateXSpring = useSpring(rotateX, { stiffness: 120, damping: 14 });

  const opacity = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[0] + 0.015],
    [0, 1]
  );

  const brightness = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[0] + 0.02, fadeIn[1]],
    [2.5, 1.5, 1]
  );
  const blur = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[0] + 0.02, fadeIn[1]],
    [4, 1, 0]
  );
  const filterStyle = useTransform(
    [brightness, blur] as [MotionValue<number>, MotionValue<number>],
    ([b, bl]: number[]) => `brightness(${b}) blur(${bl}px)`
  );

  const motionBlurOpacity = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[0] + 0.01, fadeIn[1]],
    [0, 0.7, 0]
  );

  // Exit animation
  const exitX = useTransform(scrollYProgress, exitRange,
    exitDirection === "left" ? ["0%", "-160%"] : exitDirection === "right" ? ["0%", "160%"] : ["0%", "0%"]
  );
  const exitY = useTransform(scrollYProgress, exitRange,
    exitDirection === "up" ? ["0%", "-160%"] : ["0%", "0%"]
  );
  const exitRotate = useTransform(scrollYProgress, exitRange,
    exitDirection === "left" ? [0, -20] : exitDirection === "right" ? [0, 20] : [0, 0]
  );
  const exitScale = useTransform(scrollYProgress, exitRange, [1, 0.7]);

  // Só clicável quando visível e antes de sair
  const cardPointer = useTransform(scrollYProgress, (v) =>
    v >= fadeIn[0] + 0.01 && v < exitRange[0] + 0.02 ? "auto" : "none"
  );

  return (
    <motion.div
      style={{ perspective: 1200, zIndex, x: exitX, y: exitY, rotate: exitRotate, scale: exitScale, pointerEvents: cardPointer }}
      className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-12"
    >
      <motion.div
        style={{
          opacity,
          z: zSpring,
          rotateX: rotateXSpring,
          filter: filterStyle,
        }}
        className="relative w-full max-w-6xl rounded-xl overflow-hidden"
      >
        <motion.div
          style={{ opacity: motionBlurOpacity }}
          className="absolute inset-0 pointer-events-none z-50"
          aria-hidden
        >
          <div className="w-full h-full" style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,102,0.06) 3px, rgba(0,255,102,0.06) 4px)"
          }} />
        </motion.div>

        <ProjectCardContent project={project} onOpen={onOpen} />
      </motion.div>
    </motion.div>
  );
}

/* ═══ PROJECT CARD — sobe de baixo cobrindo o anterior + Exit ═══ */
function StackingProjectCard({
  project, scrollYProgress, fadeIn, exitRange, exitDirection, zIndex, onOpen,
}: {
  project: Project;
  scrollYProgress: MotionValue<number>;
  fadeIn: [number, number];
  exitRange: [number, number];
  exitDirection: "left" | "right" | "up";
  zIndex: number;
  onOpen: () => void;
}) {
  const opacity = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[0] + 0.015],
    [0, 1]
  );
  const enterY = useTransform(scrollYProgress,
    [fadeIn[0], fadeIn[1]],
    ["110%", "0%"]
  );

  // Exit animation
  const exitX = useTransform(scrollYProgress, exitRange,
    exitDirection === "left" ? ["0%", "-160%"] : exitDirection === "right" ? ["0%", "160%"] : ["0%", "0%"]
  );
  const exitYOffset = useTransform(scrollYProgress, exitRange,
    exitDirection === "up" ? ["0%", "-160%"] : ["0%", "0%"]
  );
  const exitRotate = useTransform(scrollYProgress, exitRange,
    exitDirection === "left" ? [0, -20] : exitDirection === "right" ? [0, 20] : [0, 0]
  );
  const exitScale = useTransform(scrollYProgress, exitRange, [1, 0.7]);

  // Só clicável quando visível e antes de sair
  const cardPointer = useTransform(scrollYProgress, (v) =>
    v >= fadeIn[0] + 0.01 && v < exitRange[0] + 0.02 ? "auto" : "none"
  );

  return (
    <motion.div
      style={{ opacity, y: enterY, zIndex, x: exitX, rotate: exitRotate, scale: exitScale, pointerEvents: cardPointer }}
      className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 md:p-12"
    >
      <motion.div
        style={{ y: exitYOffset, boxShadow: "0 -20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8)" }}
        className="relative w-full max-w-6xl rounded-xl overflow-hidden"
      >
        <ProjectCardContent project={project} onOpen={onOpen} />
      </motion.div>
    </motion.div>
  );
}

/* ═══ Conteúdo do card — Premium Interactive ═══ */
function ProjectCardContent({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, active: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0.5, y: 0.5, active: false });
  }, []);

  const tiltX = (mouse.y - 0.5) * (mouse.active ? -8 : 0);
  const tiltY = (mouse.x - 0.5) * (mouse.active ? 8 : 0);
  const glowX = mouse.x * 100;
  const glowY = mouse.y * 100;

  return (
    <div
      ref={cardRef}
      onClick={onOpen}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer group/card"
      style={{ perspective: "1200px" }}
    >
      {/* Card com tilt 3D */}
      <div
        className="relative rounded-2xl overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${mouse.active ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ── Borda gradient animada ── */}
        <div className="absolute inset-0 rounded-2xl z-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
          style={{
            padding: "1.5px",
            background: `conic-gradient(from 0deg, transparent 0%, ${project.color}50 25%, transparent 50%, ${project.color}30 75%, transparent 100%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            animation: mouse.active ? "border-rotate 3s linear infinite" : "none",
          }}
        />

        {/* ── Card body ── */}
        <div className="relative bg-[#111113] border border-white/[0.06] rounded-2xl overflow-hidden">

          {/* Glare — brilho branco que segue o mouse */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: mouse.active ? 1 : 0,
              background: `radial-gradient(350px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.06), transparent 60%)`,
            }}
          />

          {/* Glow colorido sutil */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: mouse.active ? 1 : 0,
              background: `radial-gradient(500px circle at ${glowX}% ${glowY}%, ${project.color}12, transparent 50%)`,
            }}
          />

          {/* Sweep reflection — linha de brilho que passa no hover */}
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover/card:opacity-100"
            style={{
              background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)`,
              backgroundSize: "200% 100%",
              animation: mouse.active ? "sweep 2s ease-in-out infinite" : "none",
            }}
          />

          {/* Listra de luz no topo */}
          <div className="absolute top-0 left-0 right-0 z-10">
            <div
              className="h-[2px] transition-all duration-500"
              style={{
                background: mouse.active
                  ? `linear-gradient(90deg, transparent 5%, ${project.color} 30%, ${project.color} 50%, ${project.color} 70%, transparent 95%)`
                  : `linear-gradient(90deg, transparent 10%, ${project.color}50 50%, transparent 90%)`,
                boxShadow: mouse.active ? `0 0 15px ${project.color}40, 0 0 30px ${project.color}20` : "none",
              }}
            />
            <div
              className="h-[30px] transition-opacity duration-500"
              style={{
                opacity: mouse.active ? 1 : 0.4,
                background: `linear-gradient(to bottom, ${project.color}18, transparent)`,
              }}
            />
          </div>

          {/* Screenshot */}
          <div className="relative w-full overflow-hidden bg-neutral-950">
            <Image
              src={project.image}
              alt={project.title}
              width={1920}
              height={960}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="w-full h-auto"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{ background: "linear-gradient(to top, #111113, transparent)" }}
            />
          </div>

          {/* Metadata */}
          <div className="px-6 pb-6 pt-2 md:px-8 md:pb-8">
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="w-1.5 h-1.5 rounded-full transition-shadow duration-300"
                style={{
                  backgroundColor: project.color,
                  boxShadow: mouse.active ? `0 0 8px ${project.color}80` : "none",
                }}
              />
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                {project.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-neutral-100 tracking-[-0.01em]">
                {project.title}
              </h3>
              <span
                className="text-xs font-mono uppercase tracking-wider transition-colors duration-300"
                style={{ color: mouse.active ? project.color : `${project.color}50` }}
              >
                Ver mais →
              </span>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 mb-5">
              {project.description}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ MODAL DE DETALHES DO PROJETO ═══ */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Captura wheel na fase de CAPTURE (antes de qualquer handler) e bloqueia
    const captureWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = modalContentRef.current;
      if (modal) modal.scrollTop += e.deltaY;
    };

    const captureTouch = (e: TouchEvent) => {
      // Permite touch dentro do modal
      const modal = modalContentRef.current;
      if (modal && modal.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };

    // capture: true — pega o evento ANTES de qualquer outro listener
    document.addEventListener("wheel", captureWheel, { capture: true, passive: false });
    document.addEventListener("touchmove", captureTouch, { capture: true, passive: false });
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("wheel", captureWheel, { capture: true });
      document.removeEventListener("touchmove", captureTouch, { capture: true });
      document.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        ref={modalContentRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl"
        style={{ boxShadow: `0 0 80px ${project.color}10, 0 25px 50px rgba(0,0,0,0.5)` }}
      >
        {/* Header com imagem */}
        <div className="relative w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            width={1920}
            height={960}
            sizes="700px"
            className="w-full h-auto"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: "linear-gradient(to top, rgb(23,23,23), transparent)" }}
          />
          {/* Glow line no topo */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent 0%, ${project.color}60 50%, transparent 100%)` }}
          />

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-7 pb-8 -mt-8 relative z-10">
          {/* Status + Cliente */}
          <div className="flex items-center flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.color }} />
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">{project.status}</span>
            </div>
            <span className="text-neutral-700">·</span>
            <span className="text-xs text-neutral-500">{project.client}</span>
            <span className="text-neutral-700">·</span>
            <span className="text-xs text-neutral-500">{project.timeline}</span>
          </div>

          {/* Título */}
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
            {project.title}
          </h2>
          <p className="text-xs font-mono tracking-widest uppercase mb-8" style={{ color: `${project.color}90` }}>
            {project.category}
          </p>

          {/* O Problema */}
          <div className="mb-8">
            <h4 className="text-xs font-mono tracking-widest text-neutral-600 uppercase mb-3">O Problema</h4>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* Separador */}
          <div className="w-8 h-px mb-8" style={{ backgroundColor: `${project.color}30` }} />

          {/* A Solução */}
          <div className="mb-8">
            <h4 className="text-xs font-mono tracking-widest text-neutral-600 uppercase mb-3">A Solução</h4>
            <p className="text-[15px] text-neutral-300 leading-relaxed">
              {project.solution}
            </p>
          </div>

          {/* O que foi entregue */}
          <div className="mb-8">
            <h4 className="text-xs font-mono tracking-widest text-neutral-600 uppercase mb-4">O que foi entregue</h4>
            <ul className="space-y-3">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: project.color }} />
                  <span className="text-sm text-neutral-300 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Separador */}
          <div className="w-8 h-px mb-8" style={{ backgroundColor: `${project.color}30` }} />

          {/* Resultado */}
          <div className="p-5 rounded-xl mb-8 border" style={{ backgroundColor: `${project.color}06`, borderColor: `${project.color}15` }}>
            <h4 className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: `${project.color}90` }}>Resultado</h4>
            <p className="text-[15px] text-neutral-200 leading-relaxed">
              {project.result}
            </p>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══ GRADE + PARTÍCULAS FLUTUANTES — fundo da área de projetos ═══ */
function ProjectsBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const progressRef = useRef(0);

  // Fade in conforme estrelas somem, fade out antes do contact
  const gridOpacity = useTransform(scrollYProgress, [0.68, 0.74, 0.85, 0.90], [0, 1, 1, 0]);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => { progressRef.current = v; });
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Partículas flutuantes lentas
    const COUNT = 40;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.1,
      alpha: 0.1 + Math.random() * 0.25,
    }));

    let prevTime = performance.now();

    const draw = () => {
      const now = performance.now();
      const dt = (now - prevTime) / 1000;
      prevTime = now;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const p = progressRef.current;
      if (p < 0.66) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Fade in das partículas
      const fade = Math.min(1, (p - 0.68) / 0.06);
      if (fade <= 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      for (const pt of particles) {
        pt.x += pt.speedX * dt;
        pt.y += pt.speedY * dt;
        // Wrap
        if (pt.x < -0.05) pt.x = 1.05;
        if (pt.x > 1.05) pt.x = -0.05;
        if (pt.y < -0.05) pt.y = 1.05;
        if (pt.y > 1.05) pt.y = -0.05;

        const sx = pt.x * w;
        const sy = pt.y * h;

        ctx.globalAlpha = pt.alpha * fade;
        ctx.fillStyle = "#00ff66";
        ctx.beginPath();
        ctx.arc(sx, sy, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Grade */}
      <motion.div
        style={{ opacity: gridOpacity }}
        className="absolute inset-0 z-[2] pointer-events-none"
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }} />
        {/* Vinheta pra grade não ficar chapada */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(4,4,8,1) 100%)"
        }} />
      </motion.div>

      {/* Partículas flutuantes */}
      <motion.div style={{ opacity: gridOpacity }} className="absolute inset-0 z-[2] pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </motion.div>
    </>
  );
}

/* ═══ TÍTULO DOS PROJETOS ═══ */
function ProjectsTitle({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.58, 0.62, 0.65, 0.68], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.58, 0.62, 0.65, 0.68], [50, 0, 0, -40]);
  const scale = useTransform(scrollYProgress, [0.58, 0.62, 0.65, 0.68], [0.8, 1, 1, 1.05]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="absolute inset-0 z-25 flex flex-col items-center justify-center pointer-events-none px-6"
    >
      <span className="text-[12px] font-mono tracking-[0.5em] text-[#00ff66] uppercase mb-4">
        Arquitetura Aplicada
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter text-center leading-[0.9]">
        Meus<br />
        <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)" }}>
          Projetos
        </span>
      </h2>
      <div className="mt-6 w-12 h-px bg-[#00ff66]/40" />
    </motion.div>
  );
}

/* ═══ CONTACT — Partículas estilo Hero + CTA ═══ */

function ContactParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mesma paleta e parâmetros do HeroParticles
    const PALETTE = ["#4ade80","#22c55e","#86efac","#6ee7b7","#10b981","#ffffff","#d1fae5","#bbf7d0"];
    const COUNT = 100;
    const RADIUS = 320;
    const MAX_PUSH = 26;
    const LINK_DIST = 80;
    const LINK_ALPHA = 0.12;

    const hexToRgb = (hex: string) => {
      const v = parseInt(hex.slice(1), 16);
      return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
    };
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Usar tamanho da janela como o Hero faz
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface P {
      hx: number; hy: number; w: number; h: number; rot: number; spin: number;
      r: number; g: number; b: number; baseAlpha: number; currentAlpha: number;
      freqX: number; freqY: number; ampX: number; ampY: number; phase: number;
      offX: number; offY: number; fx: number; fy: number;
    }

    const particles: P[] = [];
    for (let i = 0; i < COUNT; i++) {
      const w = rand(1.5, 4.5);
      const color = hexToRgb(pick(PALETTE));
      particles.push({
        hx: Math.random() * window.innerWidth,
        hy: Math.random() * window.innerHeight,
        w, h: w * 0.28,
        rot: Math.random() * Math.PI * 2,
        spin: rand(-0.005, 0.005),
        r: color.r, g: color.g, b: color.b,
        baseAlpha: rand(0.06, 0.18),
        currentAlpha: rand(0.06, 0.18),
        freqX: rand(0.12, 0.3), freqY: rand(0.12, 0.3),
        ampX: rand(5, 14), ampY: rand(5, 14),
        phase: Math.random() * Math.PI * 2,
        offX: 0, offY: 0, fx: 0, fy: 0,
      });
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const draw = () => {
      timeRef.current += 1;
      const t = timeRef.current * 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sm = smoothRef.current;
      sm.x = lerp(sm.x, mouseRef.current.x, 0.07);
      sm.y = lerp(sm.y, mouseRef.current.y, 0.07);

      // Atualizar posições
      for (const p of particles) {
        const floatX = Math.sin(t * p.freqX + p.phase) * p.ampX;
        const floatY = Math.cos(t * p.freqY + p.phase) * p.ampY;

        const dx = p.hx - sm.x;
        const dy = p.hy - sm.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetOffX = 0, targetOffY = 0, influence = 0;
        if (dist < RADIUS && dist > 0.1) {
          influence = Math.exp(-((dist / RADIUS) ** 2) * 2.0);
          const nx = dx / dist;
          const ny = dy / dist;
          targetOffX = nx * MAX_PUSH * influence;
          targetOffY = ny * MAX_PUSH * influence;
        }

        p.offX = lerp(p.offX, targetOffX, 0.06);
        p.offY = lerp(p.offY, targetOffY, 0.06);
        p.currentAlpha = lerp(p.currentAlpha, p.baseAlpha + influence * 0.75, 0.08);
        p.fx = p.hx + p.offX + floatX;
        p.fy = p.hy + p.offY + floatY;
        p.rot += p.spin;
      }

      // Linhas de conexão (spatial grid)
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

      // Desenhar partículas
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

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

const CONTACT_LINKS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/5571996591404",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:sallesjoaquim111009@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

function ContactPreview({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0.87, 0.93], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.87, 0.95], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0.87, 0.95], [40, 0]);
  const pointerEvents = useTransform(scrollYProgress, (v) => v > 0.95 ? "auto" : "none");

  const [revealed, setRevealed] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.92 && !revealed) setRevealed(true);
      if (v < 0.87) { setRevealed(false); setShowLinks(false); }
    });
  }, [scrollYProgress, revealed]);

  return (
    <>
    {/* Partículas — fora do wrapper transformado pra mouse funcionar corretamente */}
    <motion.div style={{ opacity }} className="absolute inset-0 z-[18] pointer-events-none">
      <ContactParticles />
      {/* Brilho radial verde */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 48%, rgba(0,255,102,0.05) 0%, transparent 65%)" }}
      />
      {/* Vinheta */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)" }}
      />
    </motion.div>

    <motion.div
      style={{ opacity, scale, y, pointerEvents }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 overflow-hidden"
    >

      {/* ── Conteúdo ── */}
      <div className="relative z-10 flex flex-col items-center max-w-3xl">
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-12"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-500 uppercase">
            Disponível para novos projetos
          </span>
        </motion.div>

        {/* Título */}
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black text-white tracking-tighter uppercase mb-2 leading-[0.85] text-center"
        >
          Tem um projeto
        </motion.h3>
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter uppercase mb-6 sm:mb-10 leading-[0.85] text-center"
          style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}
        >
          em mente?
        </motion.h3>

        {/* Linha decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={revealed ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="w-16 h-px bg-[#00ff66]/40 mb-8 origin-center"
        />

        {/* Subtexto */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-neutral-500 leading-relaxed mb-8 sm:mb-14 max-w-xl mx-auto text-center"
        >
          Me conta o caos. Eu devolvo{" "}
          <span className="text-neutral-300">o controle.</span>
        </motion.p>

        {/* CTA Button + Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6, type: "spring", bounce: 0.25 }}
          className="flex flex-col items-center"
        >
          {/* Botão principal — sempre visível */}
          <button
            onClick={() => setShowLinks(!showLinks)}
            className="group relative inline-flex items-center gap-3 rounded-full overflow-hidden cursor-pointer mb-8"
          >
            <div className="absolute inset-0 bg-[#00ff66] rounded-full" />
            <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(0,255,102,0.25)] group-hover:shadow-[0_0_60px_rgba(0,255,102,0.45)] transition-shadow duration-500" />
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 48%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.25) 52%, transparent 60%)",
                backgroundSize: "250% 100%",
                animation: "sweep 2s ease-in-out infinite",
              }}
            />
            <span className="relative z-10 text-black font-bold text-xs sm:text-sm md:text-base uppercase tracking-[0.15em] py-3 px-6 sm:py-4 sm:px-10 md:py-5 md:px-14">
              Recuperar meu tempo
            </span>
            <svg
              className="relative z-10 w-4 h-4 text-black mr-4 sm:mr-8 group-hover:translate-x-1.5 transition-transform duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          {/* Links de contato — aparecem abaixo do botão */}
          <AnimatePresence>
            {showLinks && (
              <motion.div
                key="links"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                {CONTACT_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.4, type: "spring", bounce: 0.3 }}
                    className="group flex flex-row sm:flex-col items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#00ff66]/40 hover:bg-[#00ff66]/[0.05] transition-all duration-300"
                  >
                    <span className="text-neutral-400 group-hover:text-[#00ff66] transition-colors duration-300">
                      {link.icon}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors duration-300">
                      {link.label}
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 w-full text-center pointer-events-none">
        <p className="text-neutral-700 font-mono text-[10px] uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Joaquim Salles — Arquitetura & IA
        </p>
      </footer>
    </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCALING + PROJECTS — SEÇÃO UNIFICADA (1500vh)

   Timeline do scroll (0 a 1):
   0.03–0.11  Clip-path revela o espaço
   S+0.04–S+0.40  Foguete cruza + frases + tools (0.14–0.50)
   0.56–0.70  Warp speed (estrelas)
   0.58–0.68  Título "Projetos de Alto Calibre"
   0.66–0.72  Projeto 1 (VAV CENTRAL) Z-Axis Slam
   0.74–0.78  Projeto 2 (CGR1-PLANNER) sobe
   0.80–0.84  Projeto 3 (TIME TRACK) sobe
   0.88–0.95  Cards voam: esquerda / direita / cima
   0.87–0.95  Contact aparece atrás
   ═══════════════════════════════════════════════════════════════ */
export function Scaling() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setOpenProject(null), []);

  // Conteúdo começa logo após o wipe
  // Seção é 1500vh: conteúdo original ocupa 0–0.80, saída dos cards 0.82–0.94, contact reveal 0.82–0.94
  const S = 0.10;

  // Clip-path revela espaço — wipe da DIREITA pra ESQUERDA
  const clipPercent = useTransform(scrollYProgress, [0.03, 0.11], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 0 0 ${clipPercent}%)`;

  // Foguete
  const rocketProgress = useTransform(scrollYProgress, [S + 0.04, S + 0.40], [0, 100]);
  const rocketProgressSmooth = useSpring(rocketProgress, { stiffness: 60, damping: 25 });
  const containerWidth = useTransform(rocketProgressSmooth, (v) => `${Math.min(v + 8, 108)}%`);
  const rocketOpacity = useTransform(scrollYProgress, [S + 0.02, S + 0.06, S + 0.40, S + 0.45], [0, 1, 1, 0]);
  const trailOpacity = useTransform(scrollYProgress, [S + 0.05, S + 0.10, S + 0.40, S + 0.45], [0, 0.6, 0.6, 0]);

  // Texto "15 ferramentas..."
  const finalTextOpacity = useTransform(scrollYProgress, [S + 0.38, S + 0.42, S + 0.45, S + 0.48], [0, 1, 1, 0]);


  return (
    <section ref={containerRef} className="relative z-20 w-full h-[1500vh] mt-[-300vh]">
      <motion.div style={{ clipPath }} className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Fundo espaço */}
        <div className="absolute inset-0 bg-[#040408] z-[1]">
          <WarpStars scrollYProgress={scrollYProgress} />
          <ProjectsBackground scrollYProgress={scrollYProgress} />
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04] mix-blend-overlay">
            <filter id="sn"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#sn)" />
          </svg>
        </div>

        {/* FOGUETE + TRAIL */}
        <motion.div
          style={{ width: containerWidth, opacity: rocketOpacity }}
          className="absolute top-[58%] left-0 -translate-y-1/2 z-[5] pointer-events-none flex items-center h-20"
        >
          <motion.div style={{ opacity: trailOpacity }}
            className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00ff66]/20 to-[#00ff66]/50 mr-[-20px]" />
          <div className="flex-shrink-0">
            <RocketSVG className="w-14 h-10 sm:w-20 sm:h-14 md:w-28 md:h-18" />
          </div>
        </motion.div>

        {/* 3 FASES */}
        <PhaseTitle
          title="Todo caos operacional tem **data de validade.**"
          scrollYProgress={scrollYProgress}
          fadeIn={[S + 0.06, S + 0.10]} fadeOut={[S + 0.18, S + 0.22]}
        />
        <PhaseTitle
          title="Seu tempo volta pra onde **sempre deveria estar.**"
          scrollYProgress={scrollYProgress}
          fadeIn={[S + 0.22, S + 0.26]} fadeOut={[S + 0.32, S + 0.36]}
        />
        <PhaseTitle
          title="Sistemas que rodam enquanto você **decide o próximo passo.**"
          scrollYProgress={scrollYProgress}
          fadeIn={[S + 0.36, S + 0.40]} fadeOut={[S + 0.45, S + 0.48]}
        />

        {/* FILA DE TOOLS */}
        <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 z-10 flex items-end flex-wrap justify-center gap-1 sm:gap-1.5 md:gap-2.5 max-w-[90vw] sm:max-w-none">
          {TOOLS.map((tool, i) => (
            <InlineTool key={tool.name} tool={tool} index={i} total={TOOLS.length} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        {/* Texto final ferramentas */}
        <motion.div style={{ opacity: finalTextOpacity }}
          className="absolute bottom-[12%] left-0 right-0 z-20 text-center pointer-events-none"
        >
          <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.4em]">
            15 ferramentas · um ecossistema · zero improviso
          </p>
        </motion.div>

        {/* ═══ PROJETOS ═══ */}
        <ProjectsTitle scrollYProgress={scrollYProgress} />

        {/* Contact preview — fica ATRÁS dos cards, revelado quando eles voam */}
        <ContactPreview scrollYProgress={scrollYProgress} />

        {/* 1º: Z-Axis Slam — chega durante o warp, sai pra ESQUERDA */}
        <FirstProjectCard
          project={PROJECTS[0]}
          scrollYProgress={scrollYProgress}
          fadeIn={[0.66, 0.72]}
          exitRange={[0.88, 0.95]}
          exitDirection="left"
          zIndex={30}
          onOpen={() => setOpenProject(PROJECTS[0])}
        />
        {/* 2º: sobe cobrindo o 1º, sai pra DIREITA */}
        <StackingProjectCard
          project={PROJECTS[1]}
          scrollYProgress={scrollYProgress}
          fadeIn={[0.74, 0.78]}
          exitRange={[0.88, 0.94]}
          exitDirection="right"
          zIndex={31}
          onOpen={() => setOpenProject(PROJECTS[1])}
        />
        {/* 3º: sobe cobrindo o 2º, sai pra CIMA */}
        <StackingProjectCard
          project={PROJECTS[2]}
          scrollYProgress={scrollYProgress}
          fadeIn={[0.80, 0.84]}
          exitRange={[0.88, 0.93]}
          exitDirection="up"
          zIndex={32}
          onOpen={() => setOpenProject(PROJECTS[2])}
        />
      </motion.div>

      {/* Modal de detalhes */}
      <AnimatePresence>
        {openProject && <ProjectModal project={openProject} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
}
