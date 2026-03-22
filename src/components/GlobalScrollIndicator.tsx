"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function GlobalScrollIndicator() {
  const { scrollYProgress } = useScroll();

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Círculo do topo: verde quando scroll > 0
  const topColor = useTransform(scrollYProgress, [0, 0.01], ["rgba(255,255,255,0.2)", "#00ff66"]);
  const topShadow = useTransform(scrollYProgress, [0, 0.01], ["0 0 0px transparent", "0 0 6px rgba(0,255,102,0.8)"]);

  // Círculo de baixo: verde quando scroll > 0.95
  const bottomColor = useTransform(scrollYProgress, [0.94, 0.98], ["rgba(255,255,255,0.2)", "#00ff66"]);
  const bottomShadow = useTransform(scrollYProgress, [0.94, 0.98], ["0 0 0px transparent", "0 0 6px rgba(0,255,102,0.8)"]);

  return (
    <div className="fixed right-4 lg:right-8 top-[10vh] h-[80vh] w-[1px] bg-white/10 z-[100] hidden md:block">

      <motion.div
        style={{ scaleY, originY: 0 }}
        className="w-full h-full bg-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.8)]"
      />

      {/* Círculos nas pontas — ficam verdes quando a barra chega */}
      <motion.div
        style={{ backgroundColor: topColor, boxShadow: topShadow }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors"
      />
      <motion.div
        style={{ backgroundColor: bottomColor, boxShadow: bottomShadow }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full transition-colors"
      />
    </div>
  );
}
