"use client";

import { motion } from "framer-motion";

export function Contact() {
  return (
    <section className="relative z-40 w-full bg-black min-h-screen flex flex-col justify-center items-center py-32 px-6 border-t border-white/10">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-[12px] font-mono tracking-[0.5em] text-[#00ff66] uppercase mb-8">
          Fim da Linha. Início do Controle.
        </h2>
        
        <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-10 leading-tight">
          Sua operação é <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-neutral-700">um caos?</span>
        </h3>

        <p className="text-xl md:text-2xl text-neutral-400 font-medium leading-relaxed mb-16 max-w-2xl mx-auto">
          Eu não construo sites bonitos. Eu desenvolvo sistemas operacionais que eliminam o trabalho braçal e garantem escalabilidade. Controle absoluto do tempo.
        </p>

        <a 
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-[#00ff66] text-black font-black text-lg md:text-xl uppercase tracking-widest py-6 px-12 rounded-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(0,255,102,0.4)] cursor-pointer"
        >
          Iniciar Protocolo
        </a>
      </div>

      <footer className="absolute bottom-8 w-full text-center text-neutral-600 font-mono text-xs uppercase tracking-widest">
        &copy; {new Date().getFullYear()} — Arquitetura de Software & IA.
      </footer>
    </section>
  );
}
