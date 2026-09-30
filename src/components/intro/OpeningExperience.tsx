"use client";

import { AnimatePresence, motion } from "motion/react";
import { ParticleCanvas } from "@/components/visual/ParticleCanvas";
import { AmbientGlow } from "@/components/visual/AmbientGlow";
import { GlowingEmblem } from "@/components/intro/GlowingEmblem";
import { CinematicTitle } from "@/components/intro/CinematicTitle";
import { TransitionStage } from "@/components/intro/TransitionStage";
import { useIntroSequence } from "@/hooks/useIntroSequence";
import { FastForward } from "lucide-react";

import { IntroState } from "@/types/intro";

interface OpeningExperienceProps {
  initialStage?: IntroState;
}

export function OpeningExperience({ initialStage }: OpeningExperienceProps) {
  const { state, sequenceKey, isReducedMotion, replay, skipToTransition } =
    useIntroSequence({
      initialStage,
    });

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden select-none bg-[#02040a] text-white flex flex-col items-center justify-center px-4">
      {/* Background Starfield & Floating Particles */}
      <ParticleCanvas />

      {/* Deep Navy/Black + Warm Gold & Purple Ambient Glows + Light Burst */}
      <AmbientGlow state={state} />

      {/* Subtle Skip button (visible while intro is playing before transition) */}
      {state !== "dormant" && state !== "transition" && (
        <motion.button
          type="button"
          onClick={skipToTransition}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className="absolute top-5 right-5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light text-slate-300 bg-white/5 border border-white/10 backdrop-blur-md transition-all cursor-pointer"
          aria-label="Skip to transition"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5" />
        </motion.button>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Phase 1.1: Glowing graduation cap celebration emblem */}
          {(state === "emblem" || state === "burst") && (
            <GlowingEmblem
              key={`emblem-${sequenceKey}`}
              state={state}
              isReducedMotion={isReducedMotion}
            />
          )}

          {/* Phase 1.2 & 1.3: Revealed title and Transition stage */}
          {(state === "revealed" || state === "transition") && (
            <div
              key={`revealed-content-${sequenceKey}`}
              className="flex flex-col items-center justify-center w-full"
            >
              <CinematicTitle
                state={state}
                isReducedMotion={isReducedMotion}
              />

              <TransitionStage
                state={state}
                isReducedMotion={isReducedMotion}
                onReplay={replay}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
