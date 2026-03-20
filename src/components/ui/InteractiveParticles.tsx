"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export const InteractiveParticles = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.2,
              color: "#00ff66"
            }
          },
        },
      },
      particles: {
        color: {
          value: "#00ff66",
        },
        links: {
          color: "#00ff66",
          distance: 120,
          enable: true,
          opacity: 0.03,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.3,
        },
        number: {
          value: 20, // Reduzi para 20 partículas (ultra leve)
        },
        opacity: {
          value: 0.08,
        },
        size: {
          value: { min: 1, max: 2 },
        },
      },
      detectRetina: false,
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        className="absolute inset-0 z-0 pointer-events-none"
      />
    );
  }

  return <></>;
};
