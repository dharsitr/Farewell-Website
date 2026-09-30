"use client";

import React, { memo } from "react";
import { SeniorPhotoItem } from "@/types/photos";

interface CinematicCarouselCardProps {
  photo: SeniorPhotoItem;
  photoIndex: number;
  diff: number; // (floatIndex - photoIndex)
  holdRange: number; // fraction of slot spent holding, e.g. 0.70
  isMobile: boolean;
  isReducedMotion: boolean;
}

export const CinematicCarouselCard = memo(function CinematicCarouselCard({
  photo,
  photoIndex,
  diff,
  holdRange,
  isMobile,
  isReducedMotion,
}: CinematicCarouselCardProps) {
  const transRange = 1 - holdRange; // e.g. 0.30

  // Beyond visible transition bounds: do not render visuals
  if (diff < -transRange || diff > 1.0) {
    return null;
  }

  let opacity = 0;
  let scale = 1;
  let y = 0;
  let x = 0;
  let rotate = photo.rotation || 0;
  let zIndex = 10;
  let captionOpacity = 0;

  if (diff >= -transRange && diff < 0) {
    // 1. Entering transition (becoming the active photo)
    const t = (diff + transRange) / transRange; // 0.0 to 1.0
    // Smooth cosine easing
    const easeT = 0.5 - 0.5 * Math.cos(t * Math.PI);

    opacity = easeT;
    scale = isReducedMotion ? 1 : 0.93 + 0.07 * easeT;
    y = isReducedMotion ? 0 : 35 * (1 - easeT);
    x = isReducedMotion ? 0 : (isMobile ? 12 : 20) * (1 - easeT);
    rotate = isReducedMotion
      ? 0
      : (photo.rotation || 0) + (isMobile ? 1.5 : 2.5) * (1 - easeT);
    zIndex = 20;
    // Caption remains hidden until photo settles into center
    captionOpacity = 0;
  } else if (diff >= 0 && diff <= holdRange) {
    // 2. Stationary HOLD zone (centered, readable, appreciating memory)
    opacity = 1;
    scale = 1;
    y = 0;
    x = 0;
    rotate = isReducedMotion ? 0 : photo.rotation || 0;
    zIndex = 20;

    // Caption gently fades in as soon as settled
    // For photo 0, fade in immediately; for subsequent, gentle fade-in over 0.08
    const settleFraction = photoIndex === 0 ? 0.04 : 0.08;
    captionOpacity = Math.min(1, Math.max(0, diff / settleFraction));
  } else if (diff > holdRange && diff <= 1.0) {
    // 3. Exiting transition (previous photo retreating)
    const t = (diff - holdRange) / transRange; // 0.0 to 1.0
    const easeT = 0.5 - 0.5 * Math.cos(t * Math.PI);

    opacity = 1 - easeT;
    scale = isReducedMotion ? 1 : 1 - 0.07 * easeT;
    y = isReducedMotion ? 0 : -35 * easeT;
    x = isReducedMotion ? 0 : (isMobile ? -12 : -20) * easeT;
    rotate = isReducedMotion
      ? 0
      : (photo.rotation || 0) - (isMobile ? 1.5 : 2.5) * easeT;
    zIndex = 10;

    // Caption gently fades out during the first 30% of transition
    captionOpacity = Math.max(0, 1 - t * 3.3);
  }

  // Formatting category text for display
  const displayCategory =
    photo.category.replace("/", " • ").toUpperCase();

  return (
    <div
      suppressHydrationWarning
      style={{
        opacity,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
        zIndex,
        willChange: "transform, opacity",
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
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
              loading="lazy"
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
            transform: `translateY(${(1 - captionOpacity) * 8}px)`,
          }}
          className="absolute inset-x-0 bottom-0 z-30 px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-t from-[#02040a] via-[#02040a]/95 to-transparent flex flex-col items-center text-center pointer-events-none"
        >
          {/* Category Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/40 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-amber-200 mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span>{displayCategory}</span>
          </div>

          {/* Cinematic Caption - Solid high-contrast warm champagne gold */}
          <p className="font-serif text-base sm:text-2xl md:text-3xl font-normal italic leading-snug tracking-tight text-[#FFF8E7] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] max-w-2xl">
            &ldquo;{photo.caption}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
});
