"use client";

import { useRef, useState } from "react";

export function TacticalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto bg-black"
    >
      {/* 1. Base Noise Texture (E-Ink / Analog Grain) */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mix-blend-overlay z-10">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* 2. Topographic Blueprint SVG (Curvas de Nível) */}
      <div 
        className="absolute inset-0 opacity-[0.06] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='topo' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100 Q 25 50, 50 100 T 100 100 M 0 80 Q 30 30, 60 80 T 100 80 M 0 60 Q 35 10, 70 60 T 100 60' fill='none' stroke='%23FFFFFF' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23topo)'/%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
        }}
      />

      {/* 3. Interactive Mouse Light (Lanterna Tática) */}
      <div 
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 102, 0.08), transparent 40%)`
        }}
      />

      {/* 5. Subtle Scanlines (Cyberpunk Executivo) */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(transparent 50%, rgba(0, 0, 0, 1) 50%)`,
          backgroundSize: `100% 4px`
        }}
      />
    </div>
  );
}
