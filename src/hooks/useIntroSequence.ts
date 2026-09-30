"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { IntroState, SequenceConfig } from "@/types/intro";
import { triggerCelebrationBurst, startContinuousSparkles } from "@/lib/confetti";

const DEFAULT_CONFIG: SequenceConfig = {
  emblemDelayMs: 600,
  burstDelayMs: 2700,
  titleDelayMs: 3100,
  transitionDelayMs: 6400,
  sparkleDurationMs: 4000,
};

export function useIntroSequence(config: Partial<SequenceConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<IntroState>(
    mergedConfig.initialStage ?? "dormant"
  );
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const sparkleCleanupRef = useRef<(() => void) | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Check user motion preferences
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
    if (sparkleCleanupRef.current) {
      sparkleCleanupRef.current();
      sparkleCleanupRef.current = null;
    }
  }, []);

  const runSequence = useCallback(() => {
    clearAllTimers();

    // If an explicit initialStage was requested (e.g. for previewing/debugging), stay on it
    if (mergedConfig.initialStage) {
      setState(mergedConfig.initialStage);
      return;
    }

    if (isReducedMotion) {
      // For reduced motion, immediately show the revealed/transition state without aggressive flashes
      setState("revealed");
      const t = setTimeout(() => setState("transition"), 1500);
      timersRef.current.push(t);
      return;
    }

    // Step 0: Dormant start
    setState("dormant");

    // Step 1: Reveal subtle glowing emblem
    const t1 = setTimeout(() => {
      setState("emblem");
    }, mergedConfig.emblemDelayMs);
    timersRef.current.push(t1);

    // Step 2: Trigger confetti celebration burst
    const t2 = setTimeout(() => {
      setState("burst");
      triggerCelebrationBurst();
    }, mergedConfig.burstDelayMs);
    timersRef.current.push(t2);

    // Step 3: Reveal Cinematic Title + continuous floating sparkles
    const t3 = setTimeout(() => {
      setState("revealed");
      sparkleCleanupRef.current = startContinuousSparkles(mergedConfig.sparkleDurationMs);
    }, mergedConfig.titleDelayMs);
    timersRef.current.push(t3);

    // Step 4: Smooth transition towards the next stage
    const t4 = setTimeout(() => {
      setState("transition");
    }, mergedConfig.transitionDelayMs);
    timersRef.current.push(t4);
  }, [clearAllTimers, isReducedMotion, mergedConfig.emblemDelayMs, mergedConfig.burstDelayMs, mergedConfig.titleDelayMs, mergedConfig.transitionDelayMs, mergedConfig.sparkleDurationMs]);

  useEffect(() => {
    runSequence();
    return () => clearAllTimers();
  }, [runSequence, clearAllTimers]);

  const replay = useCallback(() => {
    runSequence();
  }, [runSequence]);

  const skipToTransition = useCallback(() => {
    clearAllTimers();
    setState("transition");
  }, [clearAllTimers]);

  return {
    state,
    isReducedMotion,
    replay,
    skipToTransition,
  };
}
