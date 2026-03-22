"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section className="relative z-40 w-full bg-black min-h-screen flex flex-col justify-center items-center py-32 px-6 overflow-hidden">
      {/* Glow verde sutil */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,102,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Grid de fundo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vinheta */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[12px] font-mono tracking-[0.5em] text-[#00ff66] uppercase mb-8"
        >
          Fim da Linha. Início do Controle.
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-10 leading-tight"
        >
          Sua operação é <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-700">
            um caos?
          </span>
        </motion.h3>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-20 h-px bg-[#00ff66]/40 mx-auto mb-10 origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-neutral-400 font-medium leading-relaxed mb-16 max-w-2xl mx-auto"
        >
          Eu não construo sites bonitos. Eu desenvolvo sistemas operacionais que
          eliminam o trabalho braçal e garantem escalabilidade.{" "}
          <span className="text-neutral-200">Controle absoluto do tempo.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, type: "spring", bounce: 0.3 }}
        >
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-3 bg-[#00ff66] text-black font-black text-lg md:text-xl uppercase tracking-widest py-6 px-12 rounded-sm hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(0,255,102,0.4)] hover:shadow-[0_0_60px_-5px_rgba(0,255,102,0.5)] cursor-pointer"
          >
            Iniciar Protocolo
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </motion.div>
      </div>

      <footer className="absolute bottom-8 w-full text-center text-neutral-600 font-mono text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} — Arquitetura de Software & IA.
      </footer>
    </section>
  );
}
