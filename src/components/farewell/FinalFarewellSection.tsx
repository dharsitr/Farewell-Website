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
        "top-16 left-4 md:left-8 lg:left-16 xl:left-24 -rotate-6 w-36 h-48 md:w-40 md:h-52 lg:w-44 lg:h-56 hidden md:block",
      floatRange: [-8, 8],
      duration: 6,
    },
    {
      photo: SENIOR_PHOTOS[1], // photo-2
      className:
        "top-20 right-4 md:right-8 lg:right-16 xl:right-24 rotate-8 w-36 h-48 md:w-40 md:h-52 lg:w-44 lg:h-56 hidden md:block",
      floatRange: [6, -8],
      duration: 7,
    },
    {
      photo: SENIOR_PHOTOS[4], // photo-5
      className:
        "bottom-28 left-4 md:left-8 lg:left-16 xl:left-24 rotate-6 w-36 h-48 md:w-40 md:h-52 lg:w-44 lg:h-56 hidden lg:block",
      floatRange: [-10, 6],
      duration: 6.5,
    },
    {
      photo: SENIOR_PHOTOS[5], // photo-6
      className:
        "bottom-24 right-4 md:right-8 lg:right-16 xl:right-24 -rotate-8 w-36 h-48 md:w-40 md:h-52 lg:w-44 lg:h-56 hidden lg:block",
      floatRange: [8, -10],
      duration: 7.5,
    },
  ];

  return (
    <section
      id={id}
      className="relative min-h-screen w-full bg-[#02040a] text-white flex flex-col items-center justify-center pt-16 sm:pt-28 pb-32 sm:pb-36 px-4 overflow-hidden select-none"
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

      {/* Floating Selected Senior Photos around the message (hidden on mobile to prevent clutter) */}
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
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-300/30 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-5 sm:mb-8"
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-amber-200">
            A Farewell Tribute
          </span>
        </motion.div>

        {/* Requirement 2: Line 1 */}
        {/* "Some chapters end, but the memories never do." */}
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light italic leading-snug tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 drop-shadow-[0_2px_15px_rgba(253,224,71,0.25)] max-w-xl mx-auto px-2">
          &ldquo;Some chapters end,<br />
          but the memories never do.&rdquo;
        </h2>

        {/* Requirement 2: Line 2 */}
        {/* "Farewell Seniors ❤️" */}
        <div className="mt-5 sm:mt-7 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <h1
            className="font-serif text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#F6D268] to-[#B37E19] drop-shadow-[0_4px_30px_rgba(234,179,8,0.55)]"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
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


      </motion.div>

      {/* Venue Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative z-20 w-full max-w-2xl mx-auto mt-14 sm:mt-20 px-2"
      >
        {/* Venue Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#0c1020]/90 via-[#070b16]/95 to-[#03050c] backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.08)] overflow-hidden">
          {/* Top sheen */}
          <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent pointer-events-none z-10" />

          {/* Header */}
          <div className="flex flex-col items-center text-center px-6 pt-6 sm:pt-8 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/25 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-amber-200 mb-3">
              <span>📍</span>
              <span>Venue</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#F6D268] to-[#C89A2A]">
              JR Hall
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 tracking-wide">
              Coimbatore, Tamil Nadu
            </p>
          </div>

          {/* Map Embed */}
          <div className="relative w-full h-56 sm:h-72 overflow-hidden">
            {/* Gradient overlay on top/bottom edges */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#070b16]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#03050c]/80 to-transparent z-10 pointer-events-none" />
            <iframe
              title="JR Hall Location Map"
              src="https://maps.google.com/maps?q=JR+HALL,+11.0402477,77.0308503&z=17&output=embed&hl=en"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.8) brightness(0.85)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Footer: coords + directions button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-7 py-4 sm:py-5 border-t border-white/5">
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-slate-500 font-mono tracking-wider">
                11.0402477° N, 77.0308503° E
              </p>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=JR+HALL,+11.0402477,77.0308503"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-black cursor-pointer whitespace-nowrap overflow-hidden
                bg-gradient-to-r from-[#FFD96A] via-[#F59E0B] to-[#D97706]
                shadow-[0_0_28px_rgba(245,158,11,0.55),0_4px_20px_rgba(0,0,0,0.4)]
                hover:shadow-[0_0_45px_rgba(251,191,36,0.75),0_6px_30px_rgba(0,0,0,0.5)]
                hover:scale-105 active:scale-95 transition-all duration-300"
              style={{ letterSpacing: "0.04em" }}
            >
              {/* Shimmer sweep */}
              <span
                className="pointer-events-none absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
                }}
              />
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-amber-400 pointer-events-none" style={{ animationDuration: "2s" }} />

              {/* Navigation arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>

              <span className="relative z-10">Get Directions</span>

              {/* Trailing chevron */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5 flex-shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-1"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons — below the map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative z-20 mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5"
      >
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
            window.scrollTo({ top: 0, behavior: "instant" });
            window.dispatchEvent(new CustomEvent("replay-intro"));
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
          <span>Replay Opening</span>
        </button>
      </motion.div>

      {/* Smooth Final Fade / Bottom Vignette to Black */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#02040a] via-[#02040a]/90 to-transparent pointer-events-none" />

      {/* Bottom Star & Footer Note */}
      <div className="relative z-20 mt-16 sm:mt-24 flex flex-col items-center text-center">
        <div className="mb-3.5 relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-400/50 via-yellow-200/30 to-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <img
            src="/college-logo.png"
            alt="Coimbatore Institute of Technology"
            className="w-full h-full object-contain rounded-full bg-white/95 p-0.5"
          />
        </div>
        <p className="text-xs sm:text-sm tracking-widest uppercase font-semibold text-amber-200/90 mb-1.5">
          Coimbatore Institute of Technology
        </p>
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

      {/* Right Corner Credit */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 pointer-events-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-amber-400/25 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-slate-400 hover:text-amber-200 hover:border-amber-400/50 transition-all duration-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs tracking-wider font-semibold text-amber-300">
            SS (BATCH 24)
          </span>
        </div>
      </div>
    </section>
  );
}
