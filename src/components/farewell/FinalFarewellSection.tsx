"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Heart, RotateCcw, ArrowUp, Star } from "lucide-react";
import { SENIOR_PHOTOS } from "@/data/photos";

interface FinalFarewellSectionProps {
  id?: string;
}

export function FinalFarewellSection({
  id = "final-farewell",
}: FinalFarewellSectionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Select 4 memorable photos to float gracefully around the final farewell message
  const floatingPhotos = [
    {
      photo: SENIOR_PHOTOS[0], // photo-1
      className:
        "top-10 left-4 sm:top-16 sm:left-12 lg:left-24 -rotate-6 w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-56",
      floatRange: [-8, 8],
      duration: 6,
    },
    {
      photo: SENIOR_PHOTOS[1], // photo-2
      className:
        "top-12 right-4 sm:top-20 sm:right-12 lg:right-24 rotate-8 w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-56",
      floatRange: [6, -8],
      duration: 7,
    },
    {
      photo: SENIOR_PHOTOS[4], // photo-5
      className:
        "bottom-28 left-4 sm:bottom-24 sm:left-16 lg:left-28 rotate-6 w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-56 hidden sm:block",
      floatRange: [-10, 6],
      duration: 6.5,
    },
    {
      photo: SENIOR_PHOTOS[5], // photo-6
      className:
        "bottom-24 right-4 sm:bottom-20 sm:right-16 lg:right-28 -rotate-8 w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-56 hidden sm:block",
      floatRange: [8, -10],
      duration: 7.5,
    },
  ];

  return (
    <section
      id={id}
      className="relative min-h-screen w-full bg-[#02040a] text-white flex flex-col items-center justify-center pt-24 sm:pt-32 pb-36 sm:pb-36 px-4 overflow-hidden select-none"
    >
      {/* Cinematic Ambient Glow & Vignette */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Soft top gradient connecting from collage section */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#02040a] via-[#040817] to-transparent" />

        {/* Central warm gold highlight aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[500px] rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-400/15 to-purple-600/10 blur-[140px]" />

        {/* Deep royal purple bottom glow */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[85vw] max-w-[800px] h-[350px] rounded-full bg-indigo-950/20 blur-[130px]" />
      </div>

      {/* Floating Selected Senior Photos around the message */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {floatingPhotos.map((item, index) => (
          <motion.div
            key={item.photo.id || index}
            className={`absolute ${item.className} rounded-xl p-1.5 pb-4 sm:p-2 sm:pb-5 bg-gradient-to-b from-white/[0.1] to-white/[0.03] border border-white/15 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.06)] opacity-75 sm:opacity-85 hover:opacity-100 transition-opacity`}
            animate={{
              y: item.floatRange,
              rotate: [
                parseInt(item.className.match(/-?rotate-\d+/)?.[0]?.replace("rotate-", "") || "0"),
                (parseInt(item.className.match(/-?rotate-\d+/)?.[0]?.replace("rotate-", "") || "0") + 2),
                parseInt(item.className.match(/-?rotate-\d+/)?.[0]?.replace("rotate-", "") || "0"),
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: item.duration,
              ease: "easeInOut",
            }}
          >
            <div className="relative w-full h-[85%] rounded-lg overflow-hidden bg-slate-900/60">
              <Image
                src={item.photo.src}
                alt={item.photo.alt || item.photo.caption || "Farewell Senior Memory"}
                fill
                sizes="(max-width: 640px) 110px, 180px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <p className="mt-1 text-[9px] sm:text-[10px] text-amber-200/80 font-serif text-center truncate px-1">
              {item.photo.caption}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Central Grand Farewell Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col items-center justify-center text-center max-w-2xl px-4 mx-auto"
      >
        {/* Shimmering Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-300/30 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)] mb-6 sm:mb-8"
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-amber-200">
            A Farewell Tribute
          </span>
        </motion.div>

        {/* Requirement 2: Line 1 */}
        {/* "Some chapters end, but the memories never do." */}
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light italic leading-snug tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 drop-shadow-[0_2px_15px_rgba(253,224,71,0.25)]">
          &ldquo;Some chapters end,<br />
          but the memories never do.&rdquo;
        </h2>

        {/* Requirement 2: Line 2 */}
        {/* "Farewell Seniors ❤️" */}
        <div className="mt-5 sm:mt-7 flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
          <h1
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#F6D268] to-[#B37E19] drop-shadow-[0_4px_30px_rgba(234,179,8,0.55)]"
            style={{
              fontFamily: "var(--font-cinzel), var(--font-playfair), Georgia, serif",
            }}
          >
            Farewell Seniors
          </h1>
          <motion.span
            animate={{
              scale: [1, 1.25, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="inline-block drop-shadow-[0_0_16px_rgba(244,63,94,0.7)]"
          >
            <Heart className="w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 fill-rose-500 stroke-rose-400 inline" />
          </motion.span>
        </div>

        {/* Requirement 2: Line 3 */}
        {/* "Batch of 2026" */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3 sm:gap-4 w-full">
          <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <span className="font-sans text-xs sm:text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-amber-200/90 drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">
            Batch of 2026
          </span>
          <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-l from-transparent via-amber-400/60 to-transparent" />
        </div>

        {/* Emotional Farewell Sentiments */}
        <p className="mt-6 sm:mt-8 font-sans text-xs sm:text-base text-slate-300/85 max-w-lg mx-auto leading-relaxed">
          Through every challenge, every shared dream, and every unforgettable celebration, you left an imprint that time will never erase. Go conquer the world — your college family will always be cheering for you.
        </p>

        {/* Interactive Navigation Actions */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={scrollToTop}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-black bg-gradient-to-r from-[#FDE047] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Back to Top</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/?stage=dormant";
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>Replay Opening</span>
          </button>
        </div>
      </motion.div>

      {/* Smooth Final Fade / Bottom Vignette to Black */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#02040a] via-[#02040a]/90 to-transparent pointer-events-none" />

      {/* Bottom Star & Footer Note */}
      <div className="relative z-20 mt-16 sm:mt-24 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-amber-400/50 mb-2">
          <Star className="w-3 h-3 fill-amber-400/40" />
          <span className="w-8 h-px bg-amber-400/30" />
          <Star className="w-3.5 h-3.5 fill-amber-400/60" />
          <span className="w-8 h-px bg-amber-400/30" />
          <Star className="w-3 h-3 fill-amber-400/40" />
        </div>
        <p className="text-[11px] sm:text-xs tracking-widest uppercase text-slate-500">
          Created with Love for the Seniors • College Farewell 2026
        </p>
      </div>
    </section>
  );
}
