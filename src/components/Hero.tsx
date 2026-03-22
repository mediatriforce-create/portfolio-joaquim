"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CipherText } from "./ui/CipherText";

import gsap from "gsap";

const ROLES = [
  "System Architect",
  "AI Developer",
  "Automation Engineer",
  "Full-Stack Builder",
];

/* ─── Subtítulo rotativo ─── */
function RotatingRole() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[index]}
          initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-x-0 text-center text-[11px] md:text-sm font-mono tracking-[0.3em] text-[#00ff66]/70 uppercase"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ─── Scan Line CRT ─── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px z-[3] pointer-events-none"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(0,255,102,0.15) 20%, rgba(0,255,102,0.3) 50%, rgba(0,255,102,0.15) 80%, transparent 100%)",
        boxShadow: "0 0 8px rgba(0,255,102,0.15), 0 0 20px rgba(0,255,102,0.05)",
      }}
      animate={{
        top: ["-2%", "102%"],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "linear",
      }}
    />
  );
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef1 = useRef<HTMLDivElement>(null);
  const nameRef2 = useRef<HTMLDivElement>(null);
  const copyAreaRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [startReveal, setStartReveal] = useState(false);

  const { scrollY } = useScroll();
  const yText   = useSpring(useTransform(scrollY, [0, 600], [0, -60]),  { stiffness: 80, damping: 25 });
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale   = useTransform(scrollY, [0, 700], [1, 0.95]);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => setStartReveal(true) });

    if (curtainRef.current) {
      tl.to(curtainRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        delay: 0.3,
        force3D: true,
      });
    }

    tl.from([nameRef1.current, nameRef2.current], {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power4.out",
      force3D: true,
    }, "-=0.4")
    .from(copyAreaRef.current, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      force3D: true,
    }, "-=0.5");
  }, []);

  return (
    <section
      ref={containerRef}
      className="h-screen w-full sticky top-0 flex flex-col items-center justify-center overflow-hidden z-0"
    >
      {/* Cortina de entrada */}
      <div ref={curtainRef} className="fixed inset-0 z-[100] bg-black pointer-events-none" />

      {/* Grade sutil de fundo */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Partículas — canvas no layout.tsx via HeroParticlesWrapper */}

      {/* Brilho radial verde sutil no centro */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 48%, rgba(0,255,102,0.05) 0%, transparent 65%)"
        }}
      />

      {/* Vinheta nas bordas */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.7) 100%)"
        }}
      />

      {/* Gradiente para fundir com seção de baixo */}
      <div className="absolute inset-x-0 bottom-0 h-48 z-[2] pointer-events-none bg-gradient-to-t from-black to-transparent" />

      {/* Conteúdo central */}
      <motion.div
        style={{ opacity, scale, y: yText }}
        className="relative z-10 flex flex-col items-center justify-center w-full px-6 text-center will-change-transform"
      >
        {/* Badge de status */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
          className="mb-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
            Disponível para novos projetos
          </span>
        </motion.div>

        {/* Nome */}
        <div className="mb-8 select-none">
          <h1
            ref={nameRef1 as React.RefObject<HTMLHeadingElement>}
            className="block text-[19vw] sm:text-[15vw] md:text-[13vw] lg:text-[12rem] font-black text-white tracking-[-0.04em] leading-[0.85] uppercase"
          >
            <CipherText text="JOAQUIM" triggerReveal={startReveal} startDelay={0} glitch />
          </h1>
          <h1
            ref={nameRef2 as React.RefObject<HTMLHeadingElement>}
            className="block text-[19vw] sm:text-[15vw] md:text-[13vw] lg:text-[12rem] font-black tracking-[-0.04em] leading-[0.85] uppercase"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.2)",
            }}
          >
            <CipherText text="SALLES" triggerReveal={startReveal} startDelay={180} glitch />
            <sup
              className="text-[0.3em] tracking-normal align-super -ml-2"
              style={{ WebkitTextStroke: "0px", color: "#00ff66" }}
            >
              AI
            </sup>
          </h1>
        </div>

        {/* Role rotativo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mb-6"
        >
          <RotatingRole />
        </motion.div>

        {/* Linha divisória */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
          className="w-16 h-px bg-[#00ff66]/40 mb-8 origin-left"
        />

        {/* Copy */}
        <div ref={copyAreaRef} className="flex flex-col items-center gap-8 max-w-lg">
          <p className="text-base md:text-lg text-neutral-500 leading-relaxed">
            Você perde horas em tarefas que uma máquina poderia fazer.{" "}
            <span className="text-neutral-300">
              Eu construo o sistema que devolve esse tempo.
            </span>
          </p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-neutral-700 to-transparent"
        />
      </motion.div>
    </section>
  );
}
