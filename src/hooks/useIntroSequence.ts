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
  // Only freeze if an explicit developer stage (other than dormant) was given
  const isDebugStaticStage = Boolean(
    mergedConfig.initialStage && mergedConfig.initialStage !== "dormant"
  );

  const [state, setState] = useState<IntroState>(
    isDebugStaticStage ? (mergedConfig.initialStage as IntroState) : "dormant"
  );
  const [sequenceKey, setSequenceKey] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const sparkleCleanupRef = useRef<(() => void) | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const isReplayingRef = useRef(false);

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

  const runSequence = useCallback(
    (forceReplay = false) => {
      clearAllTimers();

      // If an explicit debug stage was requested and not forced to replay, stay on it
      if (isDebugStaticStage && !forceReplay && !isReplayingRef.current) {
        setState(mergedConfig.initialStage as IntroState);
        return;
      }

      if (isReducedMotion) {
        setState("revealed");
        const t = setTimeout(() => setState("transition"), 1500);
        timersRef.current.push(t);
        return;
      }

      // Step 0: Dormant start (dark ambiance & stars)
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
        sparkleCleanupRef.current = startContinuousSparkles(
          mergedConfig.sparkleDurationMs
        );
      }, mergedConfig.titleDelayMs);
      timersRef.current.push(t3);

      // Step 4: Smooth transition towards the next stage
      const t4 = setTimeout(() => {
        setState("transition");
      }, mergedConfig.transitionDelayMs);
      timersRef.current.push(t4);
    },
    [
      clearAllTimers,
      isDebugStaticStage,
      isReducedMotion,
      mergedConfig.initialStage,
      mergedConfig.emblemDelayMs,
      mergedConfig.burstDelayMs,
      mergedConfig.titleDelayMs,
      mergedConfig.transitionDelayMs,
      mergedConfig.sparkleDurationMs,
    ]
  );

  useEffect(() => {
    runSequence();
    return () => clearAllTimers();
  }, [runSequence, clearAllTimers]);

  const replay = useCallback(() => {
    isReplayingRef.current = true;
    setSequenceKey((k) => k + 1);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
      // If URL had stage param, remove it to keep browser history clean
      if (window.location.search) {
        const url = new URL(window.location.href);
        if (url.searchParams.has("stage")) {
          url.searchParams.delete("stage");
          window.history.replaceState(
            {},
            "",
            url.pathname + (url.search ? url.search : "")
          );
        }
      }
    }

    runSequence(true);
  }, [runSequence]);

  // Listen for global replay events from any section (e.g. FinalFarewellSection)
  useEffect(() => {
    const handleGlobalReplay = () => {
      replay();
    };

    window.addEventListener("replay-intro", handleGlobalReplay);
    return () => window.removeEventListener("replay-intro", handleGlobalReplay);
  }, [replay]);

  const skipToTransition = useCallback(() => {
    clearAllTimers();
    setState("transition");
  }, [clearAllTimers]);

  return {
    state,
    sequenceKey,
    isReducedMotion,
    replay,
    skipToTransition,
  };
}
