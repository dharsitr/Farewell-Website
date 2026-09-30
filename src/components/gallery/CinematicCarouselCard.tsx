"use client";

import React, { memo } from "react";
import { motion } from "motion/react";
import { SeniorPhotoItem } from "@/types/photos";

interface CinematicCarouselCardProps {
  photo: SeniorPhotoItem;
  photoIndex: number;
  /** Which direction the slideshow navigated: next = slides in from right, prev = from left */
  direction: "next" | "prev";
  isMobile: boolean;
  isReducedMotion: boolean;
}

// Framer Motion custom variants — direction is passed as `custom`
const slideVariants = {
  initial: (dir: "next" | "prev") => ({
    x: dir === "next" ? "108vw" : "-108vw",
    opacity: 0,
    scale: 0.92,
    rotate: dir === "next" ? 3 : -3,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  exit: (dir: "next" | "prev") => ({
    x: dir === "next" ? "-108vw" : "108vw",
    opacity: 0,
    scale: 0.94,
    rotate: dir === "next" ? -2 : 2,
  }),
};

const captionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const CinematicCarouselCard = memo(function CinematicCarouselCard({
  photo,
  photoIndex,
  direction,
  isMobile: _isMobile,
  isReducedMotion,
}: CinematicCarouselCardProps) {
  const displayCategory = photo.category.replace("/", " • ").toUpperCase();

  const transition = isReducedMotion
    ? { duration: 0 }
    : { duration: 2.0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        willChange: "transform, opacity",
      }}
      className="-translate-x-1/2 -translate-y-1/2"
    >
      {/* The Cinematic Card Container */}
      <div className="relative w-[88vw] max-w-[420px] h-[68vh] max-h-[570px] sm:w-[72vw] sm:max-w-4xl sm:h-[75vh] sm:max-h-[730px] rounded-2xl sm:rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1020]/95 via-[#070b16]/98 to-[#03050c] backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.95),0_0_40px_rgba(245,158,11,0.08)] overflow-hidden flex flex-col items-center justify-between select-none">
        {/* Ambient Glow */}
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

        {/* Photo */}
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

        {/* Caption overlay — fades in after card settles */}
        <motion.div
          variants={captionVariants}
          initial="hidden"
          animate="visible"
          transition={
            isReducedMotion
              ? { duration: 0 }
              : { delay: 0.5, duration: 0.8, ease: "easeOut" }
          }
          className="absolute inset-x-0 bottom-0 z-30 px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-t from-[#02040a] via-[#02040a]/95 to-transparent flex flex-col items-center text-center pointer-events-none"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/40 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-amber-200 mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <span>{displayCategory}</span>
          </div>
          <p className="font-serif text-base sm:text-2xl md:text-3xl font-normal italic leading-snug tracking-tight text-[#FFF8E7] drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] max-w-2xl">
            &ldquo;{photo.caption}&rdquo;
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
});


