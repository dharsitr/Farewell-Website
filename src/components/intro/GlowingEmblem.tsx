"use client";

import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { IntroState } from "@/types/intro";

interface GlowingEmblemProps {
  state: IntroState;
  isReducedMotion: boolean;
}

export function GlowingEmblem({ state, isReducedMotion }: GlowingEmblemProps) {
  // Only visible during emblem and initial burst phase
  const isVisible = state === "emblem" || state === "burst";

  if (!isVisible) return null;

  return (
    <motion.div
      key="central-emblem"
      className="relative flex flex-col items-center justify-center select-none"
      initial={{ opacity: 0, scale: 0.75, filter: "blur(8px)" }}
      animate={
        state === "burst"
          ? {
              opacity: [1, 1, 0],
              scale: isReducedMotion ? 1 : [1, 1.35, 1.7],
              filter: "blur(6px)",
            }
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      exit={{ opacity: 0, scale: 1.4, filter: "blur(10px)" }}
      transition={{
        duration: state === "burst" ? 0.5 : 1.4,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
    >
      {/* Outer pulsating aura */}
      <motion.div
        className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-300/25 to-purple-500/15 blur-xl pointer-events-none"
        animate={
          isReducedMotion
            ? {}
            : {
                scale: [1, 1.22, 1],
                opacity: [0.6, 0.95, 0.6],
              }
        }
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />

      {/* Radiant glass ring */}
      <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-400/30 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md shadow-[0_0_35px_rgba(245,158,11,0.25)]">
        {/* Subtle spinning decorative ring dots */}
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed border-amber-300/30"
          animate={isReducedMotion ? {} : { rotate: 360 }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        />

        {/* Central graduation cap icon */}
        <div className="relative flex items-center justify-center text-amber-200 drop-shadow-[0_0_12px_rgba(251,191,36,0.65)]">
          <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.6]" />

          {/* Micro sparkles on the cap */}
          <motion.div
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_10px_4px_rgba(252,211,77,0.7)]"
            animate={
              isReducedMotion
                ? {}
                : {
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5],
                  }
            }
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Subtle class / honour badge under emblem */}
      <motion.div
        className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-medium tracking-widest uppercase text-amber-200/80 shadow-sm"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Honoring Our Graduates
      </motion.div>
    </motion.div>
  );
}
