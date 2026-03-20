"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Terminal, Activity } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { InteractiveParticles } from "./ui/InteractiveParticles";
import { TacticalBackground } from "./ui/TacticalBackground";
import { CipherText } from "./ui/CipherText";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const nameRef1 = useRef<HTMLDivElement>(null);
  const nameRef2 = useRef<HTMLDivElement>(null);
  const copyAreaRef = useRef<HTMLDivElement>(null);
  const cardLeftRef = useRef<HTMLDivElement>(null);
  const cardRightRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const metricsBarRef = useRef<HTMLDivElement>(null);

  const [startReveal, setStartReveal] = useState(false);
  
  const { scrollY } = useScroll();

  // EFEITOS DE PARALLAX (Mapeados para os primeiros 800px de scroll)
  const yTextTop = useSpring(useTransform(scrollY, [0, 800], [0, 150]), { stiffness: 100, damping: 30 });
  const yTextBottom = useSpring(useTransform(scrollY, [0, 800], [0, -100]), { stiffness: 100, damping: 30 });
  const yCardLeft = useSpring(useTransform(scrollY, [0, 800], [0, -250]), { stiffness: 100, damping: 30 });
  const yCardRight = useSpring(useTransform(scrollY, [0, 800], [0, 250]), { stiffness: 100, damping: 30 });
  
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 800], [1, 0.92]);

  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  // HOOKS EXTRAÍDOS DO JSX (Rules of Hooks - devem estar no top-level)
  const cardRotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const cardRotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);
  const nameOffsetX = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const nameOffsetY = useTransform(mouseY, [-0.5, 0.5], [-20, 20]);

  const onMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth) - 0.5);
    mouseY.set((clientY / innerHeight) - 0.5);
  };

  useEffect(() => {
    const tl = gsap.timeline({ 
      onComplete: () => setStartReveal(true) 
    });

    if (curtainRef.current) {
      tl.to(curtainRef.current, { 
        yPercent: -100, 
        duration: 1.2, 
        ease: "power4.inOut", 
        delay: 0.5,
        force3D: true 
      });
    }
    
    tl.from([nameRef1.current, nameRef2.current], { 
        y: 50, 
        opacity: 0, 
        stagger: 0.2, 
        duration: 1, 
        ease: "power4.out",
        force3D: true
      }, "-=0.5")
      .from([cardLeftRef.current, cardRightRef.current], { 
        scale: 0.8, 
        opacity: 0, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        stagger: 0.1,
        force3D: true
      }, "-=0.8")
      .from(copyAreaRef.current, { 
        y: 30, 
        opacity: 0, 
        duration: 0.8,
        ease: "power2.out",
        force3D: true
      }, "-=0.4");

    gsap.to(metricsBarRef.current, {
      width: "99.9%",
      duration: 2,
      ease: "power2.out",
      delay: 2
    });
  }, []);

  return (
    // 'h-screen' e 'bg-black' garantem que a seção ocupe 100% da viewport e impeça vazamentos cinzas
    <section 
      ref={containerRef} 
      onMouseMove={onMouseMove}
      className="h-screen w-full sticky top-0 bg-black flex flex-col items-center justify-center overflow-hidden z-0"
    >
      {/* Cinematic Curtain */}
      <div ref={curtainRef} className="fixed inset-0 z-[100] bg-black pointer-events-none" />

      <TacticalBackground />
      <InteractiveParticles />

      <motion.div style={{ opacity, scale }} className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-20 md:pt-32 will-change-transform">
        
        {/* CARDS LATERAIS (Posicionados para nunca obstruir o texto central) */}
        <motion.div 
          ref={cardLeftRef}
          style={{ 
            y: yCardLeft,
            rotateX: cardRotateX,
            rotateY: cardRotateY,
          }}
          className="hidden xl:flex absolute left-[2%] top-[25%] flex-col p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl w-64 z-0 pointer-events-none will-change-transform"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
            <Terminal className="w-4 h-4 text-[#00ff66]" />
            <span className="text-xs font-mono text-neutral-400">system_log.sh</span>
          </div>
          <div className="space-y-2 font-mono text-[10px] text-neutral-500">
            <p><span className="text-[#00ff66]">{">"}</span> core_init...</p>
            <p><span className="text-[#00ff66]">{">"}</span> automation active [OK]</p>
          </div>
        </motion.div>

        <motion.div 
          ref={cardRightRef}
          style={{ 
            y: yCardRight,
            rotateX: cardRotateX,
            rotateY: cardRotateY,
          }}
          className="hidden xl:flex absolute right-[2%] bottom-[25%] flex-col p-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl w-64 z-0 pointer-events-none will-change-transform"
        >
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
            <Activity className="w-4 h-4 text-[#00ff66]" />
            <span className="text-xs font-mono text-neutral-400">perf_metrics</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>EFFICIENCY</span>
              <span className="text-[#00ff66]">99%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div ref={metricsBarRef} className="w-0 h-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]"></div>
            </div>
          </div>
        </motion.div>

        {/* CONTEÚDO CENTRAL */}
        <div className="flex flex-col items-center justify-center w-full relative z-50">
          
          <div className="mb-6 md:mb-10 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest text-neutral-300 uppercase">System Architect</span>
          </div>

          {/* Nome com Parallax e Decodificação */}
          <motion.div 
            className="relative w-full max-w-[1400px] flex flex-col items-center justify-center px-4 will-change-transform z-50"
            style={{
              x: nameOffsetX,
              y: nameOffsetY,
            }}
          >
            <motion.h1 
              ref={nameRef1}
              style={{ y: yTextTop }}
              className="text-[14vw] md:text-[10rem] lg:text-[13rem] font-black text-white tracking-tighter leading-[0.75] uppercase w-full text-center drop-shadow-2xl"
            >
              <CipherText text="JOAQUIM" triggerReveal={startReveal} startDelay={0} />
            </motion.h1>
            
            <motion.h1 
              ref={nameRef2}
              style={{ y: yTextBottom, WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
              className="text-[14vw] md:text-[10rem] lg:text-[13rem] font-black text-transparent tracking-tighter leading-[0.75] uppercase w-full text-center"
            >
              <CipherText text="SALLES" triggerReveal={startReveal} startDelay={300} />
              <sup className="text-[#00ff66] text-[0.4em] tracking-normal -ml-1 align-super" style={{ WebkitTextStroke: "0px" }}>AI</sup>
            </motion.h1>
          </motion.div>

          {/* Copy e CTA */}
          <div ref={copyAreaRef} className="flex flex-col items-center mt-12 md:mt-20 z-40 pointer-events-auto relative will-change-transform">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-3xl blur-xl -z-10"></div>
            
            <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-2xl text-center mb-10 px-6 leading-relaxed">
              Do caos digital pro cockpit que roda sozinho. <br/> 
              <span className="text-white">Construindo sistemas de alta precisão.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://wa.me/5500000000000" 
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center justify-center h-14 md:h-16 px-10 rounded-2xl bg-white text-black font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 hover:bg-[#00ff66] cursor-pointer"
              >
                Iniciar Diagnóstico
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
