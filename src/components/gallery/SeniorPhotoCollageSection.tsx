"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SENIOR_PHOTOS } from "@/data/photos";
import { CinematicCarouselCard } from "./CinematicCarouselCard";
import {
  Camera,
  Heart,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * ============================================================================
 * HORIZONTAL SLIDESHOW CONFIGURATION
 * - No scroll-driven navigation. Cards slide left/right between photos.
 * - Auto-advance every AUTO_ADVANCE_MS ms; paused on user interaction.
 * - Touch/swipe support for mobile.
 * - Keyboard ← → navigation.
 * ============================================================================
 */
const AUTO_ADVANCE_MS = 3000; // Auto-advance delay in ms
const TRANSITION_DURATION_MS = 420; // Animation duration in ms

interface SeniorPhotoCollageSectionProps {
  id?: string;
}

export function SeniorPhotoCollageSection({
  id = "senior-memories",
}: SeniorPhotoCollageSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [transitioning, setTransitioning] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(1); // 0..1
  const animFrameRef = useRef<number | null>(null);
  const animStartRef = useRef<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Show the climax card after the last photo
  const [showClimax, setShowClimax] = useState(false);

  const totalPhotos = SENIOR_PHOTOS.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Responsive & prefers-reduced-motion detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotion);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotion);
    };
  }, []);

  // Animate transition progress 0 → 1 over TRANSITION_DURATION_MS
  const startTransitionAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animStartRef.current = null;

    const duration = isReducedMotion ? 0 : TRANSITION_DURATION_MS;

    const step = (timestamp: number) => {
      if (!animStartRef.current) animStartRef.current = timestamp;
      const elapsed = timestamp - animStartRef.current;
      const progress = Math.min(1, elapsed / (duration || 1));
      setAnimationProgress(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        // Transition complete — clear prevIdx
        setPrevIdx(null);
        setTransitioning(false);
        setAnimationProgress(1);
      }
    };

    setAnimationProgress(0);
    animFrameRef.current = requestAnimationFrame(step);
  }, [isReducedMotion]);

  // Navigate to a specific index
  const goTo = useCallback((newIdx: number, dir: "next" | "prev") => {
    if (transitioning) return;
    setTransitioning(true);
    setDirection(dir);
    setPrevIdx(activeIdx);
    setActiveIdx(newIdx);
    startTransitionAnimation();
  }, [activeIdx, transitioning, startTransitionAnimation]);

  const goNext = useCallback(() => {
    if (activeIdx < totalPhotos - 1) {
      goTo(activeIdx + 1, "next");
    } else {
      // Show climax card
      setShowClimax(true);
    }
  }, [activeIdx, totalPhotos, goTo]);

  const goPrev = useCallback(() => {
    if (showClimax) {
      setShowClimax(false);
      return;
    }
    if (activeIdx > 0) {
      goTo(activeIdx - 1, "prev");
    }
  }, [activeIdx, showClimax, goTo]);

  // Auto-advance timer
  const resetAutoTimer = useCallback(() => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    if (!showClimax) {
      autoTimerRef.current = setTimeout(() => {
        goNext();
      }, AUTO_ADVANCE_MS);
    }
  }, [goNext, showClimax]);

  useEffect(() => {
    resetAutoTimer();
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [activeIdx, showClimax, resetAutoTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
        resetAutoTimer();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
        resetAutoTimer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, resetAutoTimer]);

  // Touch swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 50) return; // Too small — ignore
    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
    resetAutoTimer();
  }, [goNext, goPrev, resetAutoTimer]);

  // Preload adjacent photos
  const preloadIndices = useMemo(() => {
    const list: number[] = [];
    if (activeIdx + 1 < totalPhotos) list.push(activeIdx + 1);
    if (activeIdx + 2 < totalPhotos) list.push(activeIdx + 2);
    if (activeIdx - 1 >= 0) list.push(activeIdx - 1);
    return list;
  }, [activeIdx, totalPhotos]);

  // Progress percentage (0 to 100%)
  const progressPercent = Math.min(100, Math.max(0, ((activeIdx) / (totalPhotos - 1)) * 100));

  const activePhoto = SENIOR_PHOTOS[activeIdx];
  const prevPhoto = prevIdx !== null ? SENIOR_PHOTOS[prevIdx] : null;

  return (
    <section
      id={id}
      ref={containerRef}
      className="relative w-full h-[100dvh] bg-[#02040a] text-white select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cinematic Ambient Glow & Vignette */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[60vh] w-[90vw] max-w-[900px] rounded-full bg-gradient-to-tr from-amber-500/10 via-yellow-400/5 to-purple-700/10 blur-[140px]" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-[45vh] w-[90vw] max-w-[800px] rounded-full bg-gradient-to-t from-indigo-950/25 via-blue-950/15 to-transparent blur-[120px]" />
      </div>

      {/* Top Header: Progress Indicator */}
      <div className="absolute top-0 inset-x-0 z-40 px-4 py-3 sm:py-5 flex flex-col items-center pointer-events-none">
        {/* Gold progress bar */}
        <div className="w-full max-w-xs sm:max-w-md h-1 rounded-full bg-white/10 overflow-hidden mb-2.5">
          <div
            suppressHydrationWarning
            style={{
              width: `${isMounted ? progressPercent : 0}%`,
              transition: "width 500ms ease",
            }}
            className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
          />
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#080d1a]/85 border border-amber-400/25 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Camera className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-amber-200">
              MEMORIES
            </span>
          </div>
          <span className="w-1 h-1 rounded-full bg-amber-400/50" />
          <span
            suppressHydrationWarning
            className="font-mono text-xs sm:text-sm font-bold text-white tracking-widest"
          >
            {String(isMounted ? activeIdx + 1 : 1).padStart(2, "0")}{" "}
            <span className="text-white/40 font-normal">/ {totalPhotos}</span>
          </span>
        </div>
      </div>

      {/* Carousel Canvas */}
      <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden">
        {/* Previous card (exiting) */}
        {prevPhoto && (
          <CinematicCarouselCard
            key={`prev-${prevIdx}`}
            photo={prevPhoto}
            photoIndex={prevIdx!}
            enterProgress={1}
            exitProgress={animationProgress}
            direction={direction}
            isMobile={isMobile}
            isReducedMotion={isReducedMotion}
            isActive={false}
          />
        )}

        {/* Active card (entering → settled) */}
        {activePhoto && !showClimax && (
          <CinematicCarouselCard
            key={`active-${activeIdx}`}
            photo={activePhoto}
            photoIndex={activeIdx}
            enterProgress={transitioning ? animationProgress : 1}
            exitProgress={0}
            direction={direction}
            isMobile={isMobile}
            isReducedMotion={isReducedMotion}
            isActive={!transitioning || animationProgress >= 1}
          />
        )}
      </div>

      {/* Hidden Preloader */}
      <div className="hidden" aria-hidden="true">
        {preloadIndices.map((idx) => {
          const photo = SENIOR_PHOTOS[idx];
          if (!photo) return null;
          return <img key={`preload-${photo.id}`} src={photo.src} alt="" />;
        })}
      </div>

      {/* Climax Reveal: After all photos */}
      <AnimatePresence>
        {showClimax && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="relative rounded-2xl sm:rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#060a17]/95 via-[#030611]/98 to-[#010206] p-6 sm:p-9 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.25)] max-w-xl mx-auto">
              {/* Top rim sheen */}
              <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200 mb-3 sm:mb-4">
                <span>Memories Preserved • Legacy Eternal</span>
              </div>

              {/* "The memories stay forever." */}
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 drop-shadow-[0_2px_15px_rgba(253,224,71,0.3)]">
                &ldquo;The memories stay forever.&rdquo;
              </h2>

              {/* "Farewell Seniors ❤️" */}
              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3">
                <h3 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#F6D268] to-[#B37E19] drop-shadow-[0_4px_25px_rgba(234,179,8,0.5)]">
                  Farewell Seniors
                </h3>
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4,
                    ease: "easeInOut",
                  }}
                  className="inline-block text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)] text-3xl sm:text-5xl md:text-6xl"
                >
                  <Heart className="w-7 h-7 sm:w-11 sm:h-11 fill-rose-500 inline stroke-rose-400" />
                </motion.span>
              </div>

              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-300/80 max-w-md mx-auto leading-relaxed">
                Every late night, every laugh, and every triumph helped shape our
                college. May your next chapter be as golden as the memories left
                behind.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("final-farewell");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer"
                >
                  <span>Continue to Farewell Finale</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowClimax(false);
                    goTo(0, "prev");
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Revisit Memories</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation & Slide Dots */}
      {!showClimax && (
        <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-8">
          {/* Previous Button */}
          <button
            type="button"
            id="gallery-prev-btn"
            onClick={() => {
              goPrev();
              resetAutoTimer();
            }}
            disabled={activeIdx === 0}
            aria-label="Previous photo"
            className={`p-2.5 sm:p-3 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:border-amber-400/40 hover:bg-white/10 backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
              activeIdx === 0 ? "opacity-30 pointer-events-none" : "opacity-80"
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-[50vw]">
            {Array.from({ length: Math.min(totalPhotos, 20) }).map((_, i) => {
              // Group photos into 20 dots max
              const groupSize = Math.ceil(totalPhotos / 20);
              const groupStart = i * groupSize;
              const isActive = activeIdx >= groupStart && activeIdx < groupStart + groupSize;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to photo group ${i + 1}`}
                  onClick={() => {
                    const targetIdx = groupStart;
                    const dir = targetIdx > activeIdx ? "next" : "prev";
                    goTo(targetIdx, dir);
                    resetAutoTimer();
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-5 h-1.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]"
                      : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            id="gallery-next-btn"
            onClick={() => {
              goNext();
              resetAutoTimer();
            }}
            aria-label="Next photo"
            className="p-2.5 sm:p-3 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:border-amber-400/40 hover:bg-white/10 backdrop-blur-md transition-all active:scale-90 cursor-pointer opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </button>
        </div>
      )}
    </section>
  );
}
