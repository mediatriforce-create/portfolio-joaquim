"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Terminal, Box, ShieldCheck, Zap, X } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { PROJECTS, type Project } from "@/data/projects";

/* ─── Fade in simples — sem delay, viewport generoso ─── */
function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── HERO ─── */
function MobileHero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,255,102,0.04) 0%, transparent 65%)" }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
            Disponível para projetos
          </span>
        </div>

        {/* Nome */}
        <h1 className="text-[17vw] font-black text-white tracking-[-0.04em] leading-[0.85] uppercase text-center">
          Joaquim
        </h1>
        <h1
          className="text-[17vw] font-black tracking-[-0.04em] leading-[0.85] uppercase text-center"
          style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}
        >
          Salles
          <sup className="text-[0.3em] tracking-normal align-super" style={{ WebkitTextStroke: "0px", color: "#00ff66" }}>
            AI
          </sup>
        </h1>

        {/* Role */}
        <span className="mt-4 mb-4 text-[10px] font-mono tracking-[0.2em] text-[#00ff66] uppercase">
          System Architect & AI Developer
        </span>

        {/* Linha */}
        <div className="w-12 h-px bg-[#00ff66]/40 mb-6" />

        {/* Copy */}
        <p className="text-sm text-neutral-500 leading-relaxed text-center max-w-xs">
          Você perde horas em tarefas que uma máquina poderia fazer.{" "}
          <span className="text-neutral-300">Eu construo o sistema que devolve esse tempo.</span>
        </p>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-6 w-px h-8 bg-gradient-to-b from-neutral-700 to-transparent"
      />
    </section>
  );
}

/* ─── SOBRE MIM ─── */
function MobileAbout() {
  const chapters = [
    { id: "01", title: "Do Caos", highlight: "ao Cockpit", icon: Terminal,
      text: "Eu não comecei querendo construir uma empresa. Comecei querendo recuperar meu tempo. Me incomodava ver inteligência desperdiçada em planilhas, WhatsApp e processos manuais que uma máquina faria melhor. Parei de reclamar e comecei a codificar." },
    { id: "02", title: "Impacto", highlight: "em Escala", icon: Box,
      text: "Meu primeiro teste real aconteceu nas ONGs. Desenvolvi sistemas que aniquilaram a dependência do papel e das planilhas soltas. Foi ali que entendi o que realmente estava vendendo: tempo de volta." },
    { id: "03", title: "O Cockpit", highlight: "Inteligente", icon: ShieldCheck,
      text: "Hoje, aos 16 anos, atuo como System Architect projetando ecossistemas End-to-End integrados com IA. Eu entrego um cockpit que pensa, conecta e executa — enquanto você assume o único papel que uma máquina nunca poderá substituir: o de decidir." },
  ];

  return (
    <section className="relative px-5 py-16 border-t border-white/10">
      {/* Avatar */}
      <FadeIn className="flex flex-col items-center mb-12">
        <div className="relative w-36 h-36 mb-4">
          <div className="absolute inset-[-12px] border border-dashed border-[#00ff66]/20 rounded-full animate-[spin_40s_linear_infinite]" />
          <div className="w-full h-full rounded-full p-0.5 bg-gradient-to-tr from-[#00ff66]/40 to-transparent">
            <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-white/5 relative">
              <Image src="/profile.jpg" alt="Joaquim Salles" fill sizes="144px" className="object-cover grayscale contrast-125" />
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#00ff66] animate-pulse" />
            <span className="text-[8px] font-mono text-white uppercase tracking-[0.15em]">Active</span>
          </div>
        </div>
        <div className="flex gap-8 mt-6">
          <div className="border-l border-white/10 pl-3">
            <p className="text-neutral-600 text-[9px] uppercase tracking-widest mb-0.5">Developer</p>
            <p className="text-white text-xs font-bold uppercase font-mono">Joaquim</p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-neutral-600 text-[9px] uppercase tracking-widest mb-0.5">Age</p>
            <p className="text-white text-xs font-bold uppercase font-mono">16 Units</p>
          </div>
        </div>
      </FadeIn>

      {/* Título */}
      <FadeIn className="mb-10">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          Tornando o caos{" "}
          <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}>obsoleto.</span>
        </h2>
      </FadeIn>

      {/* Chapters — cada um é um FadeIn separado */}
      {chapters.map((ch) => {
        const Icon = ch.icon;
        return (
          <FadeIn key={ch.id} className="mb-8">
            <div className="pl-4 border-l-2 border-[#00ff66]/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#00ff66] font-mono text-xs tracking-widest">{ch.id} //</span>
                <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
                  <Icon className="w-4 h-4 text-[#00ff66]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight uppercase">
                {ch.title}{" "}
                <span className="text-[#00ff66]">{ch.highlight}</span>
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{ch.text}</p>
            </div>
          </FadeIn>
        );
      })}

      {/* Manifesto */}
      <FadeIn className="mt-4">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00ff66]/10 blur-[40px]" />
          <Zap className="w-8 h-8 text-[#00ff66] mb-4 relative z-10" />
          <p className="text-lg font-bold text-white leading-tight relative z-10">
            &quot;Todo processo que ainda depende de você é tempo que ainda não te pertence.&quot;
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

/* ─── FERRAMENTAS ─── */
function MobileTools() {
  return (
    <section className="px-5 py-16 border-t border-white/5">
      <FadeIn className="text-center mb-8">
        <span className="text-[10px] font-mono tracking-[0.4em] text-[#00ff66] uppercase">Arsenal</span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mt-2">Ferramentas</h2>
      </FadeIn>

      {/* Grid inteiro como um único FadeIn */}
      <FadeIn>
        <div className="grid grid-cols-5 gap-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div key={tool.name} className="flex flex-col items-center gap-1.5">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/[0.04] border border-white/[0.08]"
                  style={{ boxShadow: `0 0 8px ${tool.color}10` }}
                >
                  <Icon className="w-5 h-5" color={tool.color} />
                </div>
                <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-wide text-center leading-tight">
                  {tool.name}
                </span>
              </div>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn className="mt-6 text-center">
        <p className="text-neutral-600 font-mono text-[9px] uppercase tracking-[0.3em]">
          15 ferramentas · um ecossistema · zero improviso
        </p>
      </FadeIn>
    </section>
  );
}

/* ─── PROJECT MODAL ─── */
function MobileProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-h-[90vh] overflow-y-auto overscroll-contain rounded-t-2xl sm:rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image */}
        <div className="relative w-full aspect-video">
          <Image src={project.image} alt={project.title} fill sizes="100vw" className="object-cover rounded-t-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
        </div>

        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center z-10">
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Content */}
        <div className="px-5 pb-8 -mt-8 relative z-10">
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: project.color }}>{project.category}</span>
          <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1 mb-1">{project.title}</h3>
          <div className="flex gap-3 text-[9px] font-mono text-neutral-500 uppercase tracking-wider mb-4">
            <span>{project.timeline}</span>
            <span>·</span>
            <span>{project.client}</span>
          </div>

          <div className="space-y-5 text-sm text-neutral-400 leading-relaxed">
            <div>
              <h4 className="text-[10px] font-mono text-[#00ff66] uppercase tracking-widest mb-2">Problema</h4>
              <p>{project.problem}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-mono text-[#00ff66] uppercase tracking-widest mb-2">Solução</h4>
              <p>{project.solution}</p>
            </div>
            <div>
              <h4 className="text-[10px] font-mono text-[#00ff66] uppercase tracking-widest mb-2">Resultado</h4>
              <p className="text-neutral-300">{project.result}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── PROJETOS ─── */
function MobileProjects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <section className="px-5 py-16 border-t border-white/5">
      <FadeIn className="text-center mb-10">
        <span className="text-[10px] font-mono tracking-[0.4em] text-[#00ff66] uppercase">Arquitetura Aplicada</span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mt-2">
          Meus{" "}
          <span className="text-transparent" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)" }}>Projetos</span>
        </h2>
      </FadeIn>

      {/* Cada card é um FadeIn separado */}
      {PROJECTS.map((project) => (
        <FadeIn key={project.id} className="mb-4">
          <button
            onClick={() => setOpenProject(project)}
            className="w-full text-left rounded-2xl overflow-hidden bg-neutral-900/50 border border-white/[0.06] active:scale-[0.98] transition-transform duration-150"
          >
            <div className="relative w-full aspect-[16/9]">
              <Image src={project.image} alt={project.title} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span
                  className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border"
                  style={{ color: project.color, borderColor: `${project.color}30`, backgroundColor: `${project.color}10` }}
                >
                  {project.status}
                </span>
              </div>
            </div>
            <div className="px-4 py-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-600">{project.category}</span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mt-0.5">{project.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed mt-1.5 line-clamp-2">{project.description}</p>
            </div>
          </button>
        </FadeIn>
      ))}

      <AnimatePresence>
        {openProject && <MobileProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
      </AnimatePresence>
    </section>
  );
}

/* ─── CONTATO ─── */
function MobileContact() {
  const [showLinks, setShowLinks] = useState(false);

  return (
    <section className="relative px-5 py-20 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,255,102,0.04) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <FadeIn className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.2em] text-neutral-500 uppercase">
              Disponível para novos projetos
            </span>
          </div>
        </FadeIn>

        <FadeIn>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-1">
            Tem um projeto
          </h2>
          <h2
            className="text-3xl font-black tracking-tighter uppercase leading-[0.85] mb-6"
            style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.2)" }}
          >
            em mente?
          </h2>
        </FadeIn>

        <FadeIn>
          <div className="w-12 h-px bg-[#00ff66]/40 mb-6" />
        </FadeIn>

        <FadeIn className="mb-8">
          <p className="text-base text-neutral-500">
            Me conta o caos. Eu devolvo{" "}
            <span className="text-neutral-300">o controle.</span>
          </p>
        </FadeIn>

        <FadeIn className="flex flex-col items-center w-full">
          <button
            onClick={() => setShowLinks(!showLinks)}
            className="relative inline-flex items-center gap-2 rounded-full overflow-hidden cursor-pointer mb-6"
          >
            <div className="absolute inset-0 bg-[#00ff66] rounded-full" />
            <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,255,102,0.2)]" />
            <span className="relative z-10 text-black font-bold text-xs uppercase tracking-[0.15em] py-3 px-8">
              Recuperar meu tempo
            </span>
            <svg className="relative z-10 w-3.5 h-3.5 text-black mr-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          <AnimatePresence>
            {showLinks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3 w-full max-w-xs overflow-hidden"
              >
                <a
                  href="https://wa.me/5571996591404"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-4 rounded-xl border border-white/10 bg-white/[0.03] active:bg-[#00ff66]/[0.05] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-400 flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-sm font-mono uppercase tracking-widest text-neutral-300">WhatsApp</span>
                </a>

                <a
                  href="mailto:sallesjoaquim111009@gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-4 rounded-xl border border-white/10 bg-white/[0.03] active:bg-[#00ff66]/[0.05] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-neutral-400 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <span className="text-sm font-mono uppercase tracking-widest text-neutral-300">Email</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>

      <div className="mt-16 text-center">
        <p className="text-neutral-700 font-mono text-[9px] uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Joaquim Salles — Arquitetura & IA
        </p>
      </div>
    </section>
  );
}

/* ─── PAGE COMPLETA MOBILE ─── */
export function MobilePage() {
  return (
    <main className="bg-black text-white selection:bg-[#00ff66] selection:text-black">
      <header className="fixed w-full flex items-center justify-between px-6 py-4 top-0 left-0 z-50 mix-blend-difference pointer-events-none">
        <div className="font-sans font-bold text-lg tracking-tight text-white pointer-events-auto cursor-pointer">JS.</div>
      </header>

      <MobileHero />
      <MobileAbout />
      <MobileTools />
      <MobileProjects />
      <MobileContact />
    </main>
  );
}
