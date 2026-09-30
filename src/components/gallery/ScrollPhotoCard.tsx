"use client";

import { motion, MotionValue, useTransform } from "motion/react";
import Image from "next/image";
import { SeniorPhotoItem } from "@/types/photos";

interface ScrollPhotoCardProps {
  photo: SeniorPhotoItem;
  progress: MotionValue<number>;
  isMobile: boolean;
  isReducedMotion: boolean;
}

export function ScrollPhotoCard({
  photo,
  progress,
  isMobile,
  isReducedMotion,
}: ScrollPhotoCardProps) {
  const [startRange, endRange] = photo.scrollRange;

  const start = photo.initialPosition || photo.start || {
    x: 0,
    y: 80,
    rotate: 15,
    scale: 0.6,
    opacity: 0,
  };

  const target = isMobile
    ? photo.mobileFinalPosition || photo.mobileTarget || photo.finalPosition || photo.target
    : photo.finalPosition || photo.target;

  // Transform mapping from entry trajectory to settled collage placement
  const x = useTransform(
    progress,
    [startRange, endRange],
    [`${start.x}vw`, `${target.x}vw`]
  );

  const y = useTransform(
    progress,
    [startRange, endRange],
    [`${start.y}vh`, `${target.y}vh`]
  );

  const rotate = useTransform(
    progress,
    [startRange, endRange],
    [start.rotate, target.rotate]
  );

  const scale = useTransform(
    progress,
    [startRange, endRange],
    [start.scale, target.scale]
  );

  const opacity = useTransform(
    progress,
    [Math.max(0, startRange - 0.015), Math.min(1, startRange + 0.03), endRange],
    [0, 0.95, 1]
  );

  // Requirement: Automatic Visual Caption Animation
  // 1. Photo enters and settles at endRange.
  // 2. Caption appears subtly between endRange and endRange + 0.02.
  // 3. Caption remains prominent while viewer pauses on this photo.
  // 4. As visitor continues scrolling, caption softly fades to subtle/transparent.
  // 5. On hover or tap, caption always illuminates!
  const captionStart = endRange;
  const captionIn = Math.min(0.96, captionStart + 0.018);
  const captionHold = Math.min(0.98, captionStart + 0.048);
  const captionOut = Math.min(1.0, captionStart + 0.08);

  const captionOpacity = useTransform(
    progress,
    [
      Math.max(0, captionStart - 0.005),
      captionStart,
      captionIn,
      captionHold,
      captionOut,
    ],
    [0, 0, 1, 1, 0]
  );

  const captionY = useTransform(
    progress,
    [captionStart, captionIn],
    [6, 0]
  );

  return (
    <motion.div
      style={
        isReducedMotion
          ? {
              transform: `translate3d(${target.x}vw, ${target.y}vh, 0px) rotate(${target.rotate}deg) scale(${target.scale})`,
              zIndex: photo.zIndex,
            }
          : {
              x,
              y,
              rotate,
              scale,
              opacity,
              zIndex: photo.zIndex,
            }
      }
      whileHover={{
        scale: target.scale * 1.08,
        rotate: 0,
        zIndex: 99,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className="group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform select-none cursor-pointer"
    >
      {/* Physical Photo Frame (Matte Polaroid style with golden ambient shadow) */}
      <div className="relative w-28 h-38 sm:w-36 sm:h-48 md:w-46 md:h-60 rounded-xl p-1.5 pb-3 sm:p-2 sm:pb-4 bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-white/[0.03] border border-white/20 backdrop-blur-md shadow-[0_16px_36px_rgba(0,0,0,0.8),0_0_16px_rgba(245,158,11,0.06)] transition-all duration-300 group-hover:border-amber-400/60 group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.25)]">
        {/* Subtle glossy top corner reflection */}
        <div className="absolute top-0 inset-x-3 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Photo Image Container */}
        <div className="relative w-full h-[82%] rounded-lg overflow-hidden bg-slate-900/90">
          <Image
            src={photo.src}
            alt={photo.caption || "Senior Farewell Photo"}
            fill
            sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Subtle warm vignette on photo edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />

          {/* Subtle category badge inside top corner */}
          {photo.category && (
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm text-[8px] sm:text-[9px] uppercase tracking-wider text-amber-200/80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {photo.category.replace("/", " • ")}
            </div>
          )}
        </div>

        {/* Cinematic Animated Caption */}
        {/* Appears when photo settles, remains briefly, then softly fades out.
            Always visible on hover! */}
        <div className="relative mt-1 sm:mt-1.5 px-0.5 flex items-center justify-center min-h-[18px]">
          {/* Scroll-driven animated caption */}
          <motion.div
            style={{
              opacity: captionOpacity,
              y: captionY,
            }}
            className="w-full text-center group-hover:hidden"
          >
            <p className="font-serif text-[9px] sm:text-[11px] text-amber-200 font-medium tracking-wide truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {photo.caption}
            </p>
          </motion.div>

          {/* Hover illuminated caption (shows on mouse hover or tap) */}
          <div className="hidden group-hover:block w-full text-center animate-fade-in">
            <p className="font-serif text-[9px] sm:text-[11px] text-amber-300 font-semibold tracking-wide truncate drop-shadow-[0_1px_6px_rgba(245,158,11,0.5)]">
              {photo.caption}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
