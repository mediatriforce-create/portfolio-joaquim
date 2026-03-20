import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="font-mono text-[10px] text-[#00ff66] tracking-[0.5em] uppercase mb-8">
        STATUS_404 // ROUTE_NOT_FOUND
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-4">
        404
      </h1>
      <p className="text-lg text-neutral-400 max-w-md mb-10">
        Este módulo não existe no sistema. Verifique o endereço ou retorne ao cockpit principal.
      </p>
      <Link
        href="/"
        className="bg-[#00ff66] text-black font-bold uppercase tracking-widest py-4 px-10 rounded-sm hover:scale-105 transition-transform cursor-pointer"
      >
        Voltar ao Cockpit
      </Link>
    </div>
  );
}
