import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Scaling } from "@/components/Scaling";
import { GlobalScrollIndicator } from "@/components/GlobalScrollIndicator";
import { MobilePage } from "@/components/MobilePage";

export default function Home() {
  return (
    <>
      {/* Desktop — escondido no mobile */}
      <div className="hidden md:block">
        <main className="bg-black text-white selection:bg-[#00ff66] selection:text-black">
          <GlobalScrollIndicator />
          <header className="fixed w-full flex items-center justify-between px-8 py-6 top-0 left-0 z-50 mix-blend-difference pointer-events-none">
            <div className="font-sans font-bold text-lg tracking-tight text-white pointer-events-auto cursor-pointer">JS.</div>
          </header>
          <Hero />
          <About />
          <Scaling />
        </main>
      </div>

      {/* Mobile — escondido no desktop */}
      <div className="block md:hidden">
        <MobilePage />
      </div>
    </>
  );
}
