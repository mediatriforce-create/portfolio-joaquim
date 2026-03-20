"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { Terminal, Zap, ShieldCheck, Box, ArrowRight } from "lucide-react";
import Image from "next/image";

// Título com efeito de cor baseada no scroll
function ScrollColorTitle({ text, scrollYProgress }: { text: string, scrollYProgress: MotionValue<number> }) {
  // Conforme o scroll desce (0 a 1), a cor muda de branco/cinza para Verde Neon
  const color = useTransform(scrollYProgress, [0.3, 0.6], ["#404040", "#00ff66"]);
  const scale = useTransform(scrollYProgress, [0.3, 0.6], [0.9, 1]);
  
  return (
    <motion.span style={{ color, scale, display: "inline-block" }}>
      {text}
    </motion.span>
  );
}

// Revelação de texto caractere por caractere (Efeito Máquina de Escrever fluida)
function ScrollRevealText({ text }: { text: string }) {
  const words = text.split(" ");
  
  return (
    <div className="flex flex-wrap gap-x-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

const CHAPTERS = [
  {
    id: "01",
    title: "A Origem",
    highlight: "do Fim do Caos",
    text: "Tudo começou resolvendo meus próprios problemas. Criei automações para eliminar tarefas repetitivas e organizar meu dia a dia. O que era experimentação virou necessidade: apliquei os mesmos sistemas para minha família e logo escalei para projetos maiores.",
    icon: <Terminal className="w-6 h-6 text-[#00ff66]" />,
  },
  {
    id: "02",
    title: "Impacto",
    highlight: "em Escala",
    text: "Ao desenvolver sistemas para ONGs, vi o impacto real: horas de trabalho manual recuperadas e processos que antes eram papel virando dashboards automáticos. Ali eu entendi minha função no mercado.",
    icon: <Box className="w-6 h-6 text-[#00ff66]" />,
  },
  {
    id: "03",
    title: "O Cockpit",
    highlight: "Inteligente",
    text: "Hoje, aos 16 anos, construo ecossistemas end-to-end com IA e automação para quem sofre com o mesmo desafio: operações que drenam tempo. Minha abordagem é direta: entender o problema real e entregar a solução que roda sozinha.",
    icon: <ShieldCheck className="w-6 h-6 text-[#00ff66]" />,
  }
];

function ChapterCard({ chapter, index }: { chapter: typeof CHAPTERS[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start center", "end center"]
  });

  // O card "acende" e aumenta conforme passa pelo meio da tela
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const borderColor = useTransform(scrollYProgress, [0, 0.5, 1], ["rgba(255,255,255,0.05)", "rgba(0,255,102,0.4)", "rgba(255,255,255,0.05)"]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ scale, opacity }}
      className="min-h-[50vh] flex flex-col justify-center py-10 origin-left"
    >
      <motion.div 
        style={{ borderColor }}
        className="pl-8 border-l-2 transition-colors duration-300"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[#00ff66] font-mono text-sm tracking-widest">{chapter.id} {"//"}</span>
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            {chapter.icon}
          </div>
        </div>
        
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight uppercase flex gap-3 flex-wrap">
          {chapter.title}
          <ScrollColorTitle text={chapter.highlight} scrollYProgress={scrollYProgress} />
        </h3>
        
        <div className="text-xl md:text-3xl text-neutral-400 leading-tight font-medium max-w-3xl">
          <ScrollRevealText text={chapter.text} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function About() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const avatarScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 0.9]);
  const avatarRotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <section 
      ref={containerRef}
      className="relative z-10 w-full bg-black rounded-t-[3rem] md:rounded-t-[5rem] border-t border-white/10 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] will-change-transform"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
        
        {/* LADO ESQUERDO: Avatar Fixo (Sticky) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-0 h-screen flex flex-col items-center justify-center py-20">
            <motion.div 
              style={{ scale: avatarScale, rotate: avatarRotate }}
              className="relative w-64 h-64 md:w-80 md:h-80"
            >
              <div className="absolute inset-[-20px] border border-dashed border-[#00ff66]/20 rounded-full animate-[spin_40s_linear_infinite]"></div>
              
              <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-[#00ff66]/40 to-transparent shadow-[0_0_50px_rgba(0,255,102,0.1)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-white/5 relative group">
                  <Image 
                    src="/profile.jpg" 
                    alt="Joaquim Salles — System Architect & AI Developer"
                    fill
                    sizes="(max-width: 768px) 256px, 320px"
                    priority
                    className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-[#00ff66]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl flex flex-col items-center gap-1 shadow-2xl min-w-[140px]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse"></span>
                  <span className="text-[9px] font-mono text-white uppercase tracking-[0.2em]">Active_System</span>
                </div>
                <span className="text-[11px] font-black text-[#00ff66] uppercase tracking-[0.3em] mt-1">vibecoder</span>
              </div>
            </motion.div>

            <div className="mt-16 grid grid-cols-2 gap-8 w-full max-w-sm">
              <div className="border-l border-white/10 pl-4">
                <p className="text-neutral-600 text-[10px] uppercase tracking-widest mb-1">Developer</p>
                <p className="text-white text-sm font-bold uppercase font-mono">Joaquim</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-neutral-600 text-[10px] uppercase tracking-widest mb-1">Age</p>
                <p className="text-white text-sm font-bold uppercase font-mono">16 Units</p>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: Storytelling Interativo */}
        <div className="lg:col-span-7 relative h-full">
          <div className="sticky bottom-12 pb-32">
            <div className="pt-[30vh]">
            <motion.h2 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-[7rem] font-black text-white tracking-tighter uppercase mb-20 leading-[0.9]"
            >
              Tornando o caos <br/>
              <span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.2)" }}>obsoleto.</span>
            </motion.h2>
            
            <div className="space-y-12">
              {CHAPTERS.map((chapter, i) => (
                <ChapterCard key={i} chapter={chapter} index={i} />
              ))}
            </div>

            {/* Manifesto Final - Aparece puxando tudo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="mt-20 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff66]/10 blur-[50px] group-hover:bg-[#00ff66]/20 transition-colors"></div>
              
              <Zap className="w-12 h-12 text-[#00ff66] mb-8 relative z-10" />
              <p className="text-2xl md:text-4xl font-bold text-white leading-tight mb-8 relative z-10">
                &quot;Eu elimino o trabalho braçal da sua operação para que você <span className="text-[#00ff66]">recupere o controle absoluto</span> do seu tempo.&quot;
              </p>
              <div className="flex items-center gap-4 text-[#00ff66] font-mono text-xs uppercase tracking-widest relative z-10">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                Next Phase
              </div>
            </motion.div>
          </div>
          </div>
        </div>

      </div>

      {/* Spacer: zona de "congelamento". O avatar sticky continua visível
          enquanto o scroll percorre esses 100vh vazios. O Scaling (mt-[-100vh])
          se sobrepõe EXATAMENTE nessa zona, e o wipe cobre a tela congelada. */}
      <div className="h-[100vh]" />

    </section>
  );
}
