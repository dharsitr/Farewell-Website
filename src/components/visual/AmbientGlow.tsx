"use client";

import { motion } from "motion/react";
import { IntroState } from "@/types/intro";

interface AmbientGlowProps {
  state: IntroState;
}

export function AmbientGlow({ state }: AmbientGlowProps) {
  const isBurstOrRevealed = state === "burst" || state === "revealed" || state === "transition";

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Base deep navy / near-black cinematic gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040a] via-[#050914] to-[#010206]" />

      {/* Top ambient warm gold highlight */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 h-[50vh] w-[90vw] max-w-[800px] rounded-full bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-[120px]" />

      {/* Deep royal purple/indigo ambient aura */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 h-[60vh] w-[95vw] max-w-[900px] rounded-full bg-gradient-to-tr from-purple-900/15 via-indigo-900/10 to-blue-950/15 blur-[140px]" />

      {/* Cinematic Center Light Burst that triggers on celebration */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.2 }}
        animate={
          isBurstOrRevealed
            ? {
                opacity: state === "burst" ? 0.9 : 0.45,
                scale: state === "burst" ? 1.6 : 1.25,
              }
            : { opacity: 0, scale: 0.2 }
        }
        transition={{
          duration: state === "burst" ? 0.6 : 1.6,
          ease: [0.16, 1, 0.3, 1] as const,
        }}
        style={{
          width: "min(650px, 90vw)",
          height: "min(650px, 90vw)",
          background:
            "radial-gradient(circle, rgba(253, 224, 71, 0.25) 0%, rgba(245, 158, 11, 0.15) 30%, rgba(139, 92, 246, 0.08) 60%, transparent 75%)",
          filter: "blur(50px)",
        }}
      />

      {/* Secondary flash during burst moment */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-200/40 blur-2xl pointer-events-none"
        initial={{ opacity: 0, scale: 0.1 }}
        animate={
          state === "burst"
            ? { opacity: [0, 0.8, 0], scale: [0.2, 2.2, 2.8] }
            : { opacity: 0 }
        }
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      {/* Subtle bottom vignette to anchor mobile screens */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#010206] via-[#010206]/70 to-transparent" />
    </div>
  );
}
