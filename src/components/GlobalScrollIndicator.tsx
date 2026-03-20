"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function GlobalScrollIndicator() {
  const { scrollYProgress } = useScroll();
  
  // Suaviza o preenchimento da barra
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    // Container que representa o "Percurso Completo" na extrema direita
    <div className="fixed right-4 lg:right-8 top-[10vh] h-[80vh] w-[1px] bg-white/10 z-[100] hidden md:block">
      
      {/* A Barra que vai ficando verde conforme o scroll desce */}
      <motion.div 
        style={{ scaleY, originY: 0 }}
        className="w-full h-full bg-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.8)]"
      />
      
      {/* Pequeno detalhe estético nas pontas (Início e Fim do percurso) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/20 rounded-full" />
    </div>
  );
}
