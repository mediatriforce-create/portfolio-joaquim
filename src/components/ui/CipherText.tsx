"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+?/<>[]{}";

export function CipherText({
  text,
  startDelay = 0,
  triggerReveal = false,
  glitch = false,
}: {
  text: string;
  startDelay?: number;
  triggerReveal?: boolean;
  glitch?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const decode = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsRevealed(true);
      }

      iteration += 1 / 3;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (mounted && triggerReveal && !isRevealed) {
      const timeout = setTimeout(decode, startDelay);
      return () => clearTimeout(timeout);
    }
  }, [mounted, triggerReveal, decode, startDelay, isRevealed]);

  // Glitch periódico após revelação
  useEffect(() => {
    if (!glitch || !isRevealed) return;

    const scheduleGlitch = () => {
      const delay = 6000 + Math.random() * 6000; // 6–12s entre glitches
      return setTimeout(() => {
        setIsGlitching(true);

        // Embaralhar 2–4 caracteres aleatórios por ~200ms
        const corruptCount = 2 + Math.floor(Math.random() * 3);
        const corruptIndices = new Set<number>();
        while (corruptIndices.size < corruptCount) {
          corruptIndices.add(Math.floor(Math.random() * text.length));
        }

        let ticks = 0;
        glitchRef.current = setInterval(() => {
          setDisplayText(
            text
              .split("")
              .map((char, i) => {
                if (corruptIndices.has(i)) {
                  return characters[Math.floor(Math.random() * characters.length)];
                }
                return char;
              })
              .join("")
          );
          ticks++;
          if (ticks >= 6) {
            clearInterval(glitchRef.current);
            setDisplayText(text);
            setIsGlitching(false);
          }
        }, 35);

        tid = scheduleGlitch();
      }, delay);
    };

    let tid = scheduleGlitch();
    return () => {
      clearTimeout(tid);
      if (glitchRef.current) clearInterval(glitchRef.current);
    };
  }, [glitch, isRevealed, text]);

  if (!mounted) return <>{text}</>;

  return (
    <span
      style={
        isGlitching
          ? {
              textShadow: "2px 0 #00ff66, -2px 0 #ff003c",
              display: "inline-block",
              transform: `translate(${Math.random() * 2 - 1}px, ${Math.random() * 1 - 0.5}px)`,
            }
          : undefined
      }
    >
      {displayText}
    </span>
  );
}
