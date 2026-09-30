"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
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
 * CAROUSEL CONFIGURATION & TIMING PACING
 * Configured strictly per requirements:
 * - PHOTO_SCROLL_DISTANCE = 900–1400px (slow, controlled scroll pacing)
 * - HOLD_RANGE = large enough so each image and caption remain readable
 * - TRANSITION_RANGE = smooth spring-eased transition between photos
 * - 100% scroll-driven without setTimeout timers
 * ============================================================================
 */
export const PHOTO_SCROLL_DISTANCE = 1100; // Px of vertical scroll required per photo
export const HOLD_RANGE = 0.70; // 70% hold (770px), 30% transition (330px)
export const TRANSITION_RANGE = 0.30; // 1 - HOLD_RANGE
export const EXIT_BUFFER_PX = 1300; // Px buffer after final photo for climax tribute

interface SeniorPhotoCollageSectionProps {
  id?: string;
}

export function SeniorPhotoCollageSection({
  id = "senior-memories",
}: SeniorPhotoCollageSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [floatIndex, setFloatIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Persistent refs for smooth inertia tracking that never reset across re-renders
  const targetIndexRef = useRef(0);
  const smoothedIndexRef = useRef(0);

  const totalPhotos = SENIOR_PHOTOS.length;

  // Responsive & prefers-reduced-motion detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleMotion = (e: MediaQueryListEvent) =>
      setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotion);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotion);
    };
  }, []);

  // Smooth scroll tracking loop for 60fps continuous animation
  useEffect(() => {
    let animationFrameId: number;

    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const currentScroll = window.scrollY - containerTop;

      // Compute raw float index
      const maxScrollUnits = totalPhotos - 1 + EXIT_BUFFER_PX / PHOTO_SCROLL_DISTANCE;
      const raw = currentScroll / PHOTO_SCROLL_DISTANCE;
      targetIndexRef.current = Math.max(0, Math.min(maxScrollUnits, raw));
    };

    // Inertial smoothing update
    const updateLoop = () => {
      if (isReducedMotion) {
        smoothedIndexRef.current = targetIndexRef.current;
      } else {
        // Smooth exponential dampening for silky inertial response
        const delta = targetIndexRef.current - smoothedIndexRef.current;
        smoothedIndexRef.current += delta * 0.22;
      }

      // Only trigger React state update if difference is perceptible
      setFloatIndex((prev) => {
        if (Math.abs(prev - smoothedIndexRef.current) < 0.001) {
          return prev;
        }
        return smoothedIndexRef.current;
      });

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    // Initialize immediately to current scroll position
    smoothedIndexRef.current = targetIndexRef.current;
    setFloatIndex(targetIndexRef.current);
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [totalPhotos, isReducedMotion]);

  // Current active photo index
  const activeIdx = Math.min(
    totalPhotos - 1,
    Math.max(0, Math.floor(floatIndex))
  );

  // Climax state when scrolling past the last photo
  const isPastLastPhoto = floatIndex >= totalPhotos - 1;
  const exitProgress = isPastLastPhoto
    ? Math.min(
        1,
        (floatIndex - (totalPhotos - 1)) /
          (EXIT_BUFFER_PX / PHOTO_SCROLL_DISTANCE)
      )
    : 0;

  // Climax tribute transforms
  const climaxCardOpacity = Math.min(1, Math.max(0, (exitProgress - 0.2) / 0.45));
  const climaxCardScale = 0.94 + 0.06 * climaxCardOpacity;
  const climaxCardY = (1 - climaxCardOpacity) * 30;

  // Virtualized indices: only render active card and immediate neighbors
  const visibleIndices = useMemo(() => {
    const list: number[] = [];
    const start = Math.max(0, activeIdx - 1);
    const end = Math.min(totalPhotos - 1, activeIdx + 1);
    for (let i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }, [activeIdx, totalPhotos]);

  // Preload indices: pre-decode adjacent images
  const preloadIndices = useMemo(() => {
    const list: number[] = [];
    if (activeIdx + 2 < totalPhotos) list.push(activeIdx + 2);
    if (activeIdx - 2 >= 0) list.push(activeIdx - 2);
    return list;
  }, [activeIdx, totalPhotos]);

  // Navigation handlers
  const scrollToPhoto = useCallback(
    (index: number) => {
      if (!containerRef.current) return;
      const targetY =
        containerRef.current.offsetTop + index * PHOTO_SCROLL_DISTANCE;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    },
    []
  );

  const scrollNext = useCallback(() => {
    if (activeIdx < totalPhotos - 1) {
      scrollToPhoto(activeIdx + 1);
    } else {
      // Scroll to final farewell section
      const el = document.getElementById("final-farewell");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeIdx, totalPhotos, scrollToPhoto]);

  const scrollPrev = useCallback(() => {
    if (activeIdx > 0) {
      scrollToPhoto(activeIdx - 1);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeIdx, scrollToPhoto]);

  // Keyboard navigation within the section
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inSection =
        rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
      if (!inSection) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollNext, scrollPrev]);

  // Total calculated height of the runway
  const totalRunwayHeightPx =
    (totalPhotos - 1) * PHOTO_SCROLL_DISTANCE + EXIT_BUFFER_PX;

  // Progress percentage (0 to 100%)
  const progressPercent = Math.min(
    100,
    Math.max(0, (floatIndex / (totalPhotos - 1)) * 100)
  );

  return (
    <section
      id={id}
      ref={containerRef}
      style={{ height: `${totalRunwayHeightPx}px` }}
      className="relative w-full bg-[#02040a] text-white select-none"
    >
      {/* Pinned 100dvh Fullscreen Viewport Stage */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Cinematic Ambient Glow & Vignette */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[60vh] w-[90vw] max-w-[900px] rounded-full bg-gradient-to-tr from-amber-500/10 via-yellow-400/5 to-purple-700/10 blur-[140px]" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-[45vh] w-[90vw] max-w-[800px] rounded-full bg-gradient-to-t from-indigo-950/25 via-blue-950/15 to-transparent blur-[120px]" />
        </div>

        {/* Top Header: Cinematic Progress Indicator */}
        <div className="absolute top-0 inset-x-0 z-40 px-4 py-3 sm:py-5 flex flex-col items-center pointer-events-none">
          {/* Subtle gold progress bar at top */}
          <div className="w-full max-w-xs sm:max-w-md h-1 rounded-full bg-white/10 overflow-hidden mb-2.5">
            <div
              suppressHydrationWarning
              style={{ width: `${isMounted ? progressPercent : 0}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            />
          </div>

          {/* Cinematic Counter Pill: MEMORIES 03 / 124 */}
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
              {String(Math.min(totalPhotos, (isMounted ? activeIdx : 0) + 1)).padStart(2, "0")}{" "}
              <span className="text-white/40 font-normal">/ {totalPhotos}</span>
            </span>
          </div>
        </div>

        {/* The Carousel Canvas: Focused Active Cards */}
        <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden">
          {visibleIndices.map((index) => {
            const photo = SENIOR_PHOTOS[index];
            if (!photo) return null;

            // diff = floatIndex - photoIndex
            const diff = floatIndex - index;

            return (
              <CinematicCarouselCard
                key={photo.id}
                photo={photo}
                photoIndex={index}
                diff={diff}
                holdRange={HOLD_RANGE}
                isMobile={isMobile}
                isReducedMotion={isReducedMotion}
              />
            );
          })}
        </div>

        {/* Hidden Preloader Images for Smooth Image Caching */}
        <div className="hidden" aria-hidden="true">
          {preloadIndices.map((idx) => {
            const photo = SENIOR_PHOTOS[idx];
            if (!photo) return null;
            return <img key={`preload-${photo.id}`} src={photo.src} alt="" />;
          })}
        </div>

        {/* Climax Reveal: Appears when user scrolls past all photos */}
        {isPastLastPhoto && (
          <div
            style={{
              opacity: climaxCardOpacity,
              transform: `translateY(${climaxCardY}px) scale(${climaxCardScale})`,
              pointerEvents: climaxCardOpacity > 0.5 ? "auto" : "none",
            }}
            className="absolute z-50 flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto transition-opacity duration-200"
          >
            <div className="relative rounded-2xl sm:rounded-3xl border border-amber-400/30 bg-gradient-to-b from-[#060a17]/95 via-[#030611]/98 to-[#010206] p-6 sm:p-9 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.25)]">
              {/* Top rim sheen */}
              <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200 mb-3 sm:mb-4">
                <span>Memories Preserved • Legacy Eternal</span>
              </div>

              {/* Requirement: "The memories stay forever." */}
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 drop-shadow-[0_2px_15px_rgba(253,224,71,0.3)]">
                &ldquo;The memories stay forever.&rdquo;
              </h2>

              {/* Requirement: "Farewell Seniors ❤️" */}
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
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Back to Opening</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Subtle Navigation & Scroll Cue at Bottom */}
        <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
          {/* Previous Button */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={activeIdx === 0}
            aria-label="Previous photo"
            className={`pointer-events-auto p-2.5 sm:p-3 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:border-amber-400/40 hover:bg-white/10 backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
              activeIdx === 0 ? "opacity-30 pointer-events-none" : "opacity-80"
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </button>

          {/* Gentle Scroll Hint */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] sm:text-xs tracking-widest uppercase text-slate-400/70 font-sans">
              Scroll slowly to experience memories
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-amber-300/60 animate-bounce mt-0.5" />
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next photo"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white hover:border-amber-400/40 hover:bg-white/10 backdrop-blur-md transition-all active:scale-90 cursor-pointer opacity-80 hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
