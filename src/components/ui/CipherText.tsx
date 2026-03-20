"use client";

import { useState, useEffect, useCallback } from "react";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+?/<>[]{}";

export function CipherText({ text, startDelay = 0, triggerReveal = false }: { text: string, startDelay?: number, triggerReveal?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const [isRevealed, setIsRevealed] = useState(false);

  // Garante que o componente só comece a randomizar no lado do cliente
  useEffect(() => {
    // Usamos um micro-delay para evitar o erro de 'cascading renders' do compilador do React 19
    // mas garantindo que o estado de 'mounted' seja disparado apenas no cliente.
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const decode = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
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

  // Se não estiver montado (SSR), renderiza o texto original
  if (!mounted) {
    return <>{text}</>;
  }

  return <>{displayText}</>;
}
