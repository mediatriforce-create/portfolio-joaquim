import {
  SiTypescript, SiPython, SiHtml5, SiCss, SiTailwindcss,
  SiSupabase, SiFirebase, SiOpenai, SiGooglegemini, SiClaude,
  SiGooglecloud, SiVercel, SiCloudflare, SiGithub,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

export const TOOLS = [
  { name: "TypeScript",    icon: SiTypescript,   color: "#3178C6" },
  { name: "Python",        icon: SiPython,        color: "#3776AB" },
  { name: "HTML5",         icon: SiHtml5,         color: "#E34F26" },
  { name: "CSS3",          icon: SiCss,           color: "#1572B6" },
  { name: "Tailwind",      icon: SiTailwindcss,   color: "#06B6D4" },
  { name: "Supabase",      icon: SiSupabase,      color: "#3ECF8E" },
  { name: "Firebase",      icon: SiFirebase,      color: "#FFCA28" },
  { name: "OpenAI GPT",    icon: SiOpenai,        color: "#FFFFFF" },
  { name: "Gemini",        icon: SiGooglegemini,  color: "#4285F4" },
  { name: "Claude",        icon: SiClaude,        color: "#D97757" },
  { name: "VS Code",       icon: VscVscode,       color: "#007ACC" },
  { name: "Google Cloud",  icon: SiGooglecloud,   color: "#4285F4" },
  { name: "Vercel",        icon: SiVercel,        color: "#FFFFFF" },
  { name: "Cloudflare",    icon: SiCloudflare,    color: "#F38020" },
  { name: "GitHub",        icon: SiGithub,        color: "#FFFFFF" },
] as const;

export type Tool = typeof TOOLS[number];
