"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const PROJECTS = [
  {
    id: "vav",
    title: "VAV CENTRAL",
    category: "SISTEMA NÚCLEO",
    description: "Plataforma centralizada de gestão operacional. O fim do caos sistêmico e o início do controle absoluto.",
    color: "#00ff66",
    bg: "bg-black",
    tech: ["Next.js", "Supabase", "Tailwind"],
    status: "OPERACIONAL",
    impact: "+120h/mês recuperadas",
    timeline: "2025 — Presente",
  },
  {
    id: "time",
    title: "TIME TRACK",
    category: "PERFORMANCE",
    description: "Rastreamento cirúrgico de produtividade. Recuperação massiva de horas perdidas em tarefas manuais.",
    color: "#00b8ff",
    bg: "bg-[#050505]",
    tech: ["React", "Firebase", "Node.js"],
    status: "EM PRODUÇÃO",
    impact: "3 equipes ativas",
    timeline: "2025",
  },
  {
    id: "cgr",
    title: "CGR1-PLANNER",
    category: "TÁTICO",
    description: "Motor de inteligência para planejamento estratégico de alto nível. Decisões baseadas em dados em tempo real.",
    color: "#ff003c",
    bg: "bg-[#0a0a0a]",
    tech: ["Python", "AI", "PostgreSQL"],
    status: "MVP ATIVO",
    impact: "Decisões 4x mais rápidas",
    timeline: "2026",
  }
];

const ProjectCard = ({ project, index, total }: { project: typeof PROJECTS[0], index: number, total: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Rastreia o scroll apenas DESTE card específico
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start start", "end start"]
  });

  // Conforme esse card sobe além do topo, ele encolhe e escurece levemente
  // formando uma pilha para o próximo card cobrir
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div ref={cardRef} className="h-screen w-full sticky top-0 flex items-center justify-center p-6 md:p-12">
      <motion.div 
        style={{ scale, opacity, transformOrigin: "top center" }}
        className={`relative w-full max-w-6xl h-full max-h-[80vh] rounded-[2rem] border border-white/10 ${project.bg} overflow-hidden shadow-2xl flex flex-col justify-between`}
      >
        {/* Top Bar - Terminal Style */}
        <div className="w-full h-12 border-b border-white/10 bg-white/5 flex items-center px-6 justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
            {project.id}.exe — Executing
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center relative">
          {/* Subtle Glow */}
          <div 
            className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 blur-[120px] pointer-events-none rounded-full"
            style={{ backgroundColor: project.color }}
          />

          <div className="relative z-10 max-w-3xl">
            <div 
              className="inline-block px-3 py-1 text-[10px] font-mono tracking-widest uppercase mb-6 rounded border bg-black/50"
              style={{ color: project.color, borderColor: `${project.color}30` }}
            >
              {project.category}
            </div>

            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-6">
              {project.title}
            </h3>

            <p className="text-xl md:text-2xl text-neutral-400 font-medium leading-relaxed mb-10 max-w-2xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {project.tech.map((t) => (
                <div key={t} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-neutral-300 uppercase tracking-wide">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - Metrics */}
        <div className="w-full border-t border-white/5 bg-black/50 p-6 flex flex-col md:flex-row gap-6 md:gap-12 text-white">
          <div>
            <div className="text-[10px] text-neutral-500 font-mono mb-1">STATUS</div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }}></span>
              {project.status}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-mono mb-1">IMPACTO</div>
            <div className="text-sm font-bold text-neutral-300">{project.impact}</div>
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-mono mb-1">TIMELINE</div>
            <div className="text-sm font-bold text-neutral-300">{project.timeline}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function Projects() {
  return (
    <section className="relative z-30 w-full bg-black">
      {/* Title Section */}
      <div className="w-full py-20 flex flex-col items-center justify-center border-t border-white/10">
        <h2 className="text-[12px] font-mono tracking-[0.5em] text-[#00ff66] uppercase mb-4">
          Arquitetura Aplicada
        </h2>
        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
          Projetos de Alto Calibre
        </h3>
      </div>

      {/* Stacking Cards Container */}
      <div className="relative w-full pb-[10vh]">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  );
}
