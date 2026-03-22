import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Scaling } from "@/components/Scaling";
import { GlobalScrollIndicator } from "@/components/GlobalScrollIndicator";

export default function Home() {
  return (
    <main className="bg-black text-white selection:bg-[#00ff66] selection:text-black">
      {/* Indicador de Progressão Global na Direita */}
      <GlobalScrollIndicator />

      {/* Navigation Minimalista */}
      <header className="fixed w-full flex items-center justify-between px-8 py-6 top-0 left-0 z-50 mix-blend-difference pointer-events-none">
        <div className="font-sans font-bold text-lg tracking-tight text-white pointer-events-auto cursor-pointer">JS.</div>
      </header>

      {/* 
        SISTEMA DE EMPILHAMENTO (OVERLAPPING):
        Hero (Sticky Z-0)
        About (Relative Z-10)
        Scaling (Relative Z-20) — inclui warp entry na fase inicial
        Projects (Relative Z-30)
        Contact (Relative Z-40)
      */}
      <Hero />
      <About />
      <Scaling />

    </main>
  );
}
