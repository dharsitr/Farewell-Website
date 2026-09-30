"use client";

import { motion } from "motion/react";
import { IntroState } from "@/types/intro";

interface CinematicTitleProps {
  state: IntroState;
  isReducedMotion: boolean;
}

export function CinematicTitle({ state, isReducedMotion }: CinematicTitleProps) {
  const isVisible = state === "revealed" || state === "transition";

  if (!isVisible) return null;

  const isTransitioning = state === "transition";

  // Transition parameters
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      key="cinematic-title-container"
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl select-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        y: isTransitioning ? -28 : 0,
      }}
      transition={{
        duration: isReducedMotion ? 0.3 : 1.2,
        ease,
      }}
    >
      {/* Soft light burst halo directly behind the title text */}
      <motion.div
        className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-400/20 to-purple-600/15 blur-3xl pointer-events-none"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.9, 0.65], scale: [0.7, 1.2, 1] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />

      {/* 1. "Happy" */}
      <motion.div
        initial={
          isReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 20, scale: 0.94 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.9,
          delay: 0.05,
          ease,
        }}
        className="mb-1 sm:mb-2"
      >
        <span className="font-serif tracking-[0.35em] sm:tracking-[0.45em] text-sm sm:text-xl md:text-2xl uppercase font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-100/90 via-yellow-200 to-amber-100/90 drop-shadow-[0_2px_10px_rgba(253,224,71,0.3)]">
          Happy
        </span>
      </motion.div>

      {/* 2. "Farewell" (The Dominant Word) */}
      <motion.div
        initial={
          isReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 32, scale: 0.88, filter: "blur(6px)" }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.1,
          delay: 0.22,
          ease,
        }}
        className="relative my-0 sm:my-1 flex items-center justify-center"
      >
        {/* Dominant Farewell text with gold luster and text-glow */}
        <motion.h1
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text drop-shadow-[0_4px_32px_rgba(245,158,11,0.55)] px-2"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            backgroundImage:
              "linear-gradient(135deg, #FFFDF0 0%, #FDE047 25%, #EAB308 50%, #CA8A04 75%, #FFFDF0 100%)",
            backgroundSize: "200% auto",
          }}
          animate={
            isReducedMotion
              ? {}
              : {
                  backgroundPosition: ["0% center", "200% center"],
                }
          }
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          }}
        >
          Farewell
        </motion.h1>
      </motion.div>

      {/* 3. "Seniors" */}
      <motion.div
        initial={
          isReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 22, scale: 0.94 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.9,
          delay: 0.42,
          ease,
        }}
        className="mt-2 sm:mt-3 flex items-center justify-center gap-3 sm:gap-5 w-full"
      >
        <span className="h-[1px] w-8 sm:w-16 md:w-24 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        <span className="font-sans text-xs sm:text-base md:text-xl font-semibold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-amber-200/90 drop-shadow-[0_2px_8px_rgba(251,191,36,0.35)]">
          Seniors
        </span>
        <span className="h-[1px] w-8 sm:w-16 md:w-24 bg-gradient-to-l from-transparent via-amber-400/60 to-transparent" />
      </motion.div>
    </motion.div>
  );
}
