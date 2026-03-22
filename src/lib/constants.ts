// ══════════════════════════════════════════════
// CONSTANTES GLOBAIS DO PORTFÓLIO
// ══════════════════════════════════════════════

// Contato
export const WHATSAPP_NUMBER = "5500000000000"; // Substituir pelo número real
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Cores do sistema
export const COLORS = {
  accent: "#00ff66",
  accentBlue: "#00b8ff",
  accentRed: "#ff003c",
  bg: "#000000",
} as const;

// Animações — timing
export const ANIM = {
  curtainDuration: 1.2,
  curtainDelay: 0.5,
  nameStagger: 0.2,
  nameDuration: 1,
  cardDuration: 0.8,
  copyDuration: 0.8,
  metricsDelay: 2,
  metricsDuration: 2,
} as const;

// Scroll triggers — Scaling section
export const SCROLL = {
  phase1End: 0.15,   // Foguete chega ao centro
  phase2End: 0.25,   // Foguete curva para cima
  // Fase 3: 0.25 → 1.00 — voo horizontal + conteúdo
} as const;
