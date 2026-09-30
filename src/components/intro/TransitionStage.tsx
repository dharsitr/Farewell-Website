"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, RotateCcw, Heart } from "lucide-react";
import { IntroState } from "@/types/intro";

interface TransitionStageProps {
  state: IntroState;
  isReducedMotion: boolean;
  onReplay: () => void;
}

export function TransitionStage({
  state,
  isReducedMotion,
  onReplay,
}: TransitionStageProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const isVisible = state === "transition";

  if (!isVisible) return null;

  return (
    <motion.div
      key="transition-stage-container"
      className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg px-4 mt-6 sm:mt-8 select-none"
      initial={
        isReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 30, scale: 0.95 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: isReducedMotion ? 0.3 : 1.1,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
    >
      {/* Frosted Glass Invitation Card */}
      <div className="relative w-full rounded-2xl border border-amber-400/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 sm:p-7 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.1)] text-center">
        {/* Subtle top rim light */}
        <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/25 text-[11px] sm:text-xs font-medium tracking-wider uppercase text-amber-200/90 mb-3 sm:mb-4">
          <span>Class of 2026 • The Legacy</span>
        </div>

        {/* Emotion / Tribute Text */}
        <p className="font-serif text-sm sm:text-base text-slate-200/90 leading-relaxed italic max-w-md mx-auto">
          &ldquo;To the memories made, the late nights shared, and the journeys ahead — thank you for paving the way.&rdquo;
        </p>

        {/* Transition Action / Teaser Cue */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Relive The Memories */}
            <button
              type="button"
              onClick={() => {
                setHasInteracted(true);
                const target = document.getElementById("senior-memories");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-black bg-gradient-to-r from-[#FDE047] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer"
            >
              <span>Relive The Memories</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />

              {/* Shimmer light over button */}
              <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </span>
            </button>

            {/* Venue Button */}
            <button
              type="button"
              onClick={() => {
                const target = document.getElementById("final-farewell");
                if (target) target.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-amber-200 border border-amber-400/35 bg-white/[0.06] hover:bg-amber-400/10 hover:border-amber-400/70 hover:text-amber-100 backdrop-blur-md active:scale-95 transition-all duration-300 shadow-[0_0_18px_rgba(245,158,11,0.12)] hover:shadow-[0_0_28px_rgba(245,158,11,0.28)] cursor-pointer overflow-hidden"
            >
              {/* Shimmer */}
              <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </span>
              <span className="text-base leading-none">📍</span>
              <span className="relative z-10">Venue</span>
            </button>
          </div>

          {/* Interactive note after tap */}
          {hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-amber-200/80 bg-amber-500/10 border border-amber-400/20 px-3 py-1.5 rounded-lg backdrop-blur-sm"
            >
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              <span>Scroll down to experience the memory collage ↓</span>
            </motion.div>
          )}

          {/* Replay intro action */}
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-200/90 transition-colors pt-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay opening sequence</span>
          </button>
        </div>
      </div>

      {/* Scroll to explore memories indicator */}
      <motion.button
        type="button"
        onClick={() => {
          const el = document.getElementById("senior-memories");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-5 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-amber-300/20 backdrop-blur-md text-amber-200/80 text-[11px] sm:text-xs tracking-wider uppercase hover:border-amber-400/50 hover:text-amber-200 transition-all cursor-pointer"
        animate={
          isReducedMotion
            ? {}
            : {
                y: [0, 4, 0],
                opacity: [0.75, 1, 0.75],
              }
        }
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <span>Scroll to explore memories</span>
        <ChevronDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
      </motion.button>
    </motion.div>
  );
}
