"use client";

import React, { memo } from "react";
import { SeniorPhotoItem } from "@/types/photos";

interface CinematicCarouselCardProps {
  photo: SeniorPhotoItem;
  photoIndex: number;
  /** 0..1 progress for entering (0 = offscreen, 1 = settled) */
  enterProgress: number;
  /** 0..1 progress for exiting (0 = settled, 1 = offscreen) */
  exitProgress: number;
  /** Slideshow navigation direction: next = incoming from right, prev = incoming from left */
  direction: "next" | "prev";
  isMobile: boolean;
  isReducedMotion: boolean;
  isActive: boolean;
}

export const CinematicCarouselCard = memo(function CinematicCarouselCard({
  photo,
  photoIndex,
  enterProgress,
  exitProgress,
  direction,
  isMobile,
  isReducedMotion,
  isActive,
}: CinematicCarouselCardProps) {
  const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(t * Math.PI);

  // vw offset for the offscreen start/end position
  const slideVw = isMobile ? 110 : 115;

  let opacity = 0;
  let scale = 1;
  let xVw = 0; // horizontal offset in vw
  let y = 0;
  let rotate = photo.rotation || 0;
  let zIndex = 10;
  let captionOpacity = 0;

  if (isActive) {
    // Settled: fully centered
    opacity = 1;
    scale = 1;
    xVw = 0;
    y = 0;
    rotate = isReducedMotion ? 0 : photo.rotation || 0;
    zIndex = 20;
    captionOpacity = Math.min(1, enterProgress * 3.5);
  } else if (enterProgress > 0 && enterProgress < 1) {
    // Entering: slide in from right (next) or left (prev)
    const eased = easeInOut(enterProgress);
    const startVw = direction === "next" ? slideVw : -slideVw;
    xVw = isReducedMotion ? 0 : startVw * (1 - eased);
    opacity = eased;
    scale = isReducedMotion ? 1 : 0.92 + 0.08 * eased;
    rotate = isReducedMotion
      ? 0
      : (photo.rotation || 0) * eased + (direction === "next" ? 1 : -1) * 3 * (1 - eased);
    zIndex = 20;
    captionOpacity = 0;
  } else if (exitProgress > 0) {
    // Exiting: slide out to left (next) or right (prev)
    const eased = easeInOut(Math.min(exitProgress, 1));
    const endVw = direction === "next" ? -slideVw : slideVw;
    xVw = isReducedMotion ? 0 : endVw * eased;
    opacity = Math.max(0, 1 - eased * 1.4);
    scale = isReducedMotion ? 1 : 1 - 0.06 * eased;
    y = isReducedMotion ? 0 : -20 * eased;
    rotate = isReducedMotion ? 0 : photo.rotation || 0;
    zIndex = 10;
    captionOpacity = Math.max(0, 1 - eased * 4);
  } else {
    // Not visible at all
    return null;
  }

  // Formatting category text for display
  const displayCategory = photo.category.replace("/", " • ").toUpperCase();

  return (
    <div
      suppressHydrationWarning
      style={{
        opacity,
        transform: `translate3d(calc(-50% + ${xVw}vw), calc(-50% + ${y}px), 0) scale(${scale}) rotate(${rotate}deg)`,
        zIndex,
        willChange: "transform, opacity",
        position: "absolute",
        top: "50%",
        left: "50%",
      }}
    >
      {/* The Cinematic Card Container */}
      <div className="relative w-[88vw] max-w-[420px] h-[68vh] max-h-[570px] sm:w-[72vw] sm:max-w-4xl sm:h-[75vh] sm:max-h-[730px] rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1020]/95 via-[#070b16]/98 to-[#03050c] backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.08)] overflow-hidden flex flex-col items-center justify-between select-none">
        {/* Subtle Ambient Glow matching photo colors */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <img
            src={photo.src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover filter blur-3xl opacity-25 scale-125"
          />
        </div>

        {/* Top edge glass sheen */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent z-20" />

        {/* The Main High-Resolution Photo */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-6 pb-28 sm:pb-32">
          <div className="relative max-w-full max-h-full flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] bg-black/40">
            <img
              src={photo.src}
              alt={photo.alt || photo.caption}
              loading={photoIndex < 2 ? "eager" : "lazy"}
              decoding="async"
              className="max-w-full max-h-[46vh] sm:max-h-[54vh] object-contain rounded-xl sm:rounded-2xl"
            />
          </div>
        </div>

        {/* Caption & Category Overlay (bottom of card) */}
        <div
          suppressHydrationWarning
          style={{
            opacity: captionOpacity,
            transform: `translateY(${(1 - captionOpacity) * 10}px)`,
          }}
          className="absolute inset-x-0 bottom-0 z-30 px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-t from-[#02040a] via-[#02040a]/95 to-transparent flex flex-col items-center text-center pointer-events-none"
        >
          {/* Category Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/40 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-amber-200 mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span>{displayCategory}</span>
          </div>

          {/* Cinematic Caption */}
          <p className="font-serif text-base sm:text-2xl md:text-3xl font-normal italic leading-snug tracking-tight text-[#FFF8E7] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] max-w-2xl">
            &ldquo;{photo.caption}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
});
