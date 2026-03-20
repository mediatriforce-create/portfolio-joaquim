"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="font-mono text-[10px] text-[#00ff66] tracking-[0.5em] uppercase mb-8">
        SYSTEM_ERROR // FAULT_DETECTED
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6">
        Algo quebrou.
      </h1>
      <p className="text-lg text-neutral-400 max-w-md mb-10">
        Um erro inesperado ocorreu no sistema. Tente reiniciar o módulo.
      </p>
      <button
        onClick={reset}
        className="bg-[#00ff66] text-black font-bold uppercase tracking-widest py-4 px-10 rounded-sm hover:scale-105 transition-transform cursor-pointer"
      >
        Reiniciar Módulo
      </button>
    </div>
  );
}
