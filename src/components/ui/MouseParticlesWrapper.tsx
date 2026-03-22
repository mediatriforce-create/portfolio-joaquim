"use client";

import dynamic from "next/dynamic";

const MouseParticles = dynamic(
  () => import("./MouseParticles").then((m) => m.MouseParticles),
  { ssr: false }
);

export function MouseParticlesWrapper() {
  return <MouseParticles />;
}
