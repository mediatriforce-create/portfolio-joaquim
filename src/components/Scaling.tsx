"use client";

import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Rocket } from "lucide-react";
import { 
  SiTypescript, SiPython, SiHtml5, SiCss, SiTailwindcss,
  SiSupabase, SiFirebase, SiOpenai, SiGooglegemini, SiClaude,
  SiGooglecloud, SiVercel, SiCloudflare, SiGithub
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

const TOOLS = [
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: SiCss, color: "#1572B6" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "OpenAI GPT", icon: SiOpenai, color: "#FFFFFF" },
  { name: "Gemini", icon: SiGooglegemini, color: "#4285F4" },
  { name: "Claude", icon: SiClaude, color: "#D97757" },
  { name: "VS Code", icon: VscVscode, color: "#007ACC" },
  { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4" },
  { name: "Vercel", icon: SiVercel, color: "#FFFFFF" },
  { name: "Cloudflare", icon: SiCloudflare, color: "#F38020" },
  { name: "GitHub", icon: SiGithub, color: "#FFFFFF" }
];

/* ═══════════════════════════════════════════════════════════════
   ESTRELAS — parallax horizontal durante a fase de conteúdo
   ═══════════════════════════════════════════════════════════════ */
const SingleStar = ({ star, scrollYProgress }: { 
  star: { id: number; top: number; left: number; size: number; depth: number };
  scrollYProgress: import("framer-motion").MotionValue<number>;
}) => {
  // Parallax só ativa na fase 3 (conteúdo horizontal, scroll > 0.22)
  const x = useTransform(scrollYProgress, [0.22, 1], [0, -200 * star.depth]);

  return (
    <motion.div
      className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
      style={{
        top: `${star.top}%`,
        left: `${star.left}vw`,
        width: star.size,
        height: star.size,
        opacity: 0.1 + (star.depth * 0.2),
        x,
      }}
    />
  );
};

const Stars = ({ scrollYProgress }: { scrollYProgress: import("framer-motion").MotionValue<number> }) => {
  const [stars, setStars] = useState<{ id: number; top: number; left: number; size: number; depth: number }[]>([]);
  
  useEffect(() => {
    const generated = Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 800, 
      size: Math.random() * 2 + 0.5,
      depth: Math.random() * 4 + 1,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-visible h-full w-full">
      {stars.map((star) => <SingleStar key={star.id} star={star} scrollYProgress={scrollYProgress} />)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SCALING SECTION
   
   SCROLL MAP (500vh total):
   ─────────────────────────────────────────────────
   0.00 → 0.15  FASE 1: Tela "congela" no About. Foguete entra Right→Left
                 NO MEIO DA TELA, puxando o espaço como cortina horizontal
   0.15 → 0.25  FASE 2: Foguete curva pra cima pela esquerda (45%→8%)
   0.25 → 1.00  FASE 3: Foguete voa Left→Right no topo + conteúdo horizontal
   ─────────────────────────────────────────────────
   ═══════════════════════════════════════════════════════════════ */
export function Scaling() {
  const containerRef = useRef<HTMLElement>(null);
  
  /* offset: ["start start", "end end"]
     → progress=0 quando o TOPO da seção alcança o TOPO do viewport
     → Nesse ponto, a seção (z-20) cobre o About (z-10) que fica "congelado" atrás
     → O About fica visível porque a seção NÃO tem bg-black
     → O clip-path revela o espaço de right→left, cobrindo o About por cima */
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  /* ═══ SPACE REVEAL — wipe horizontal right→left ═══
     clip-path: inset(0 0 0 X%) revela o espaço da DIREITA para a ESQUERDA.
     Enquanto isso, o About "congelado" é visível nas áreas ainda não reveladas. */
  const clipPercent = useTransform(scrollYProgress, [0, 0.15], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 0 0 ${clipPercent}%)`;

  const starsOpacity = useTransform(scrollYProgress, [0, 0.05, 0.15], [0, 0.3, 1]);

  /* ═══ PATH ROCKET — wipe horizontal no MEIO da tela ═══
     O foguete voa da DIREITA pra ESQUERDA no meio da tela (top: 45%)
     Depois curva pra cima e sobe pro topo (45% → 8%)
     
     Lucide <Rocket> default = apontando upper-right (~45deg)
     225deg = left | 270deg = curva | 405deg (=45deg) = right */
  const pathRocketLeft = useTransform(scrollYProgress,
    [0,      0.005,  0.15,  0.15,  0.25],
    ["105%", "95%",  "3%",  "3%",  "3%"]
  );
  const pathRocketTop = useTransform(scrollYProgress,
    [0,     0.15,  0.20,  0.25],
    ["45%", "45%", "25%", "8%"]
  );
  const pathRocketRotate = useTransform(scrollYProgress,
    [0,   0.15,  0.20,  0.25],
    [225, 225,   300,   405]
  );
  const pathRocketOpacity = useTransform(scrollYProgress, 
    [0, 0.005, 0.23, 0.27], 
    [0, 1,     1,    0]
  );
  const pathRocketScale = useSpring(
    useTransform(scrollYProgress, [0, 0.06], [0.5, 1]),
    { stiffness: 100, damping: 20 }
  );

  /* ═══ HORIZONTAL ROCKET — foguete no topo (fase 3) ═══ */
  const horizRocketOpacity = useTransform(scrollYProgress, [0.23, 0.28], [0, 1]);
  const baseProgress = useTransform(scrollYProgress, [0.25, 1], ["0%", "100%"]);
  const rocketProgress = useSpring(baseProgress, { stiffness: 50, damping: 20 });

  /* ═══ CONTEÚDO HORIZONTAL — aparece depois do wipe ═══ */
  const contentOpacity = useTransform(scrollYProgress, [0.23, 0.30], [0, 1]);
  const trackX = useSpring(
    useTransform(scrollYProgress, [0.25, 1], ["0%", "-66.66%"]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <section ref={containerRef} className="relative z-20 w-full h-[700vh] mt-[-200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ═══ SPACE BACKGROUND (revelado pelo clip-path) ═══
            O foguete "puxa" esse fundo atrás de si como uma cortina. */}
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 bg-black z-[1]"
        >
          {/* Estrelas dentro do espaço */}
          <motion.div style={{ opacity: starsOpacity }} className="absolute inset-0">
            <Stars scrollYProgress={scrollYProgress} />
          </motion.div>

          {/* Noise texture */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
            <filter id="scaling-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#scaling-noise)" />
          </svg>
        </motion.div>

        {/* ═══ PATH ROCKET (fases 1–2: entrada cinematográfica) ═══
            Voa da bottom-right → bottom-left → curva pra cima → topo-left
            Depois faz cross-fade pro foguete horizontal. */}
        <motion.div
          style={{
            left: pathRocketLeft,
            top: pathRocketTop,
            rotate: pathRocketRotate,
            opacity: pathRocketOpacity,
            scale: pathRocketScale,
          }}
          className="absolute z-[30] will-change-transform pointer-events-none"
        >
          <div className="relative">
            <Rocket className="w-12 h-12 md:w-16 md:h-16 text-[#00ff66] drop-shadow-[0_0_20px_rgba(0,255,102,0.6)]" />
            {/* Engine glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
              transition={{ duration: 0.15, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#00ff66]/30 blur-xl rounded-full"
            />
          </div>
        </motion.div>

        {/* ═══ HORIZONTAL ROCKET (fase 3: voo no topo) ═══
            Cross-fade suave. Foguete rotacionado 45deg voando pra direita. */}
        <motion.div
          style={{ opacity: horizRocketOpacity }}
          className="absolute top-[10vh] left-0 w-[90vw] md:w-[95vw] h-20 z-50 pointer-events-none overflow-visible"
        >
          {/* Fire trail */}
          <motion.div 
            style={{ width: rocketProgress }}
            className="absolute top-1/2 -translate-y-1/2 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ff66]/30 to-[#00ff66] shadow-[0_0_10px_#00ff66] z-40 origin-left"
          />
          {/* Rocket */}
          <motion.div style={{ left: rocketProgress }} className="absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-14 h-14">
              <Rocket className="w-10 h-10 md:w-14 md:h-14 text-[#00ff66] drop-shadow-[0_0_15px_#00ff66] rotate-[45deg] z-10" />
              <motion.div 
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 bg-[#00ff66]/40 blur-xl rounded-full z-0"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ═══ CONTENT TRACK (fase 3: horizontal) ═══ */}
        <motion.div style={{ x: trackX, opacity: contentOpacity }} className="absolute top-[30vh] flex w-[300vw] z-10">
          
          {/* TELA 1 */}
          <div className="w-[100vw] flex flex-col items-center px-6">
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 text-center max-w-4xl leading-tight">
              Domínio da <span className="text-[#00ff66]">Arquitetura Moderna.</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
              {TOOLS.slice(0, 5).map((tool) => (
                <div key={tool.name} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 w-24 md:w-28 shadow-xl">
                  <tool.icon size={32} color={tool.color} />
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest text-center">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TELA 2 */}
          <div className="w-[100vw] flex flex-col items-center px-6">
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 text-center max-w-4xl leading-tight">
              IA e Dados <span className="text-[#00ff66]">em Alta Performance.</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
              {TOOLS.slice(5, 10).map((tool) => (
                <div key={tool.name} className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 w-24 md:w-28 shadow-xl">
                  <tool.icon size={32} color={tool.color} />
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest text-center">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TELA 3 (FINAL) */}
          <div className="w-[100vw] flex flex-col items-center px-6">
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 text-center max-w-4xl leading-tight">
              Ecossistema <span className="text-[#00ff66]">Totalmente Integrado.</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-5xl">
              {TOOLS.map((tool) => (
                <motion.div 
                  key={`final-${tool.name}`} 
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.random() * 0.3 }}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/10"
                >
                  <tool.icon size={24} color={tool.color} className="opacity-60" />
                </motion.div>
              ))}
            </div>
            <p className="mt-10 text-neutral-500 font-mono text-[10px] uppercase tracking-[0.4em]">Ready for Liftoff</p>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
