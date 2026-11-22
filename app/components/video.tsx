"use client";

import { useEffect, useRef } from "react";
import Button from "./insta";

export default function Video({
  isPlaying = false,
  isSplit = false,
}: {
  isPlaying?: boolean;
  isSplit?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play prevented by browser
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying]);

  return (
    <section
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ background: "#050506" }}
    >
      {/* ════════════════════════════════════════
          VIDEO COMPONENT: Fullscreen → Left (Desktop) / Top (Mobile)
      ════════════════════════════════════════ */}
      <div
        className={`z-10 absolute overflow-hidden transition-all duration-[950ms] ${
          isSplit
            ? "shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)] " +
              /* Mobile Split: Top Card */
              "top-[3.5vh] left-[5%] w-[90%] h-[28vh] rounded-2xl " +
              /* Desktop Split: Left Side (Exact Original) */
              "md:top-[10vh] md:left-[clamp(2rem,5vw,6rem)] md:w-[44%] md:h-[80vh] md:rounded-none"
            : "top-0 left-0 w-full h-full rounded-none shadow-none"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.28, 1)",
        }}
      >
        <video
          ref={videoRef}
          src="/assets/video.mp4"
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Subtle dark vignette overlay when split */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            opacity: isSplit ? 0.2 : 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ════════════════════════════════════════
          1. DESKTOP RIGHT CONTENT PANEL (hidden md:flex)
          100% EXACT ORIGINAL UNTOUCHED
      ════════════════════════════════════════ */}
      <div
        className="hidden md:flex relative z-20 flex-col justify-center min-h-screen"
        style={{
          marginLeft: "auto",
          width: "46%",
          paddingRight: "clamp(3rem, 7vw, 7rem)",
          paddingLeft: "clamp(1rem, 3vw, 4rem)",
          paddingTop: "clamp(2rem, 7vw, 7rem)",
          paddingBottom: "10vh",
          opacity: isSplit ? 1 : 0,
          transform: isSplit ? "translateX(0)" : "translateX(90px)",
          pointerEvents: isSplit ? "auto" : "none",
          transition: "opacity 0.95s cubic-bezier(0.16, 1, 0.28, 1), transform 0.95s cubic-bezier(0.16, 1, 0.28, 1)",
          transitionDelay: isSplit ? "0.15s" : "0s",
        }}
      >
        {/* Name / Title */}
        <h1
          className="font-black text-red-700 leading-none mb-5 tracking-tight"
          style={{ fontSize: "clamp(3rem, 6.5vw, 5.5rem)" }}
        >
          ACID Record
        </h1>

        {/* Cinematography & Video Production */}
        <p
          className="text-white/55 text-[13px] leading-[1.5] max-w-[400px]"
          style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}
        >
          Menciptakan visual bergerak dengan kedalaman sinematik dan narasi visual
          yang kuat. Dari perencanaan konsep, sinematografi, hingga penyuntingan akhir,
          setiap frame dirancang untuk menyampaikan emosi dan pesan secara mendalam.
        </p>

        {/* 2-column: Pengalaman / Bidang Fokus */}
        <div
          className="grid grid-cols-2 gap-x-6 gap-y-5"
          style={{ paddingTop: "clamp(0.5rem, 0.5vw, 1rem)", paddingBottom: '0rem' }}
        >
          {/* Col 1 */}
          <div>
            <h3 className="text-white font-bold text-sm">Fokus &amp; Peran :</h3>
            <div className="text-white/55 text-[12px] leading-relaxed space-y-2">
              <div>
                <p>Visual Framing &amp; Lighting</p>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-white font-bold text-sm">Produksi :</h3>
              <div className="text-white/55 text-[12px] leading-relaxed space-y-2">
                <div>
                  <p>Social Media Reels &amp; Ads</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Button placed at bottom right of right card */}
        <div className="flex justify-end pt-8">
          <Button />
        </div>
      </div>

      {/* ════════════════════════════════════════
          2. MOBILE CONTENT PANEL (block md:hidden)
          Dedicated responsive phone layout
      ════════════════════════════════════════ */}
      <div
        className="block md:hidden relative z-20 w-full h-full overflow-y-auto px-6 flex flex-col justify-center pt-[33vh] pb-8"
        style={{
          opacity: isSplit ? 1 : 0,
          transform: isSplit ? "translateY(0)" : "translateY(35px)",
          pointerEvents: isSplit ? "auto" : "none",
          transition: "opacity 0.95s cubic-bezier(0.16, 1, 0.28, 1), transform 0.95s cubic-bezier(0.16, 1, 0.28, 1)",
          transitionDelay: isSplit ? "0.15s" : "0s",
        }}
      >
        {/* Name / Title */}
        <h1 className="font-black text-red-700 leading-none mb-3 tracking-tight text-3xl sm:text-4xl">
          ACID Record
        </h1>

        {/* Cinematography & Video Production */}
        <p className="text-white/60 text-xs sm:text-[13px] leading-relaxed mb-4 max-w-sm pt-1">
          Menciptakan visual bergerak dengan kedalaman sinematik dan narasi visual
          yang kuat. Dari perencanaan konsep, sinematografi, hingga penyuntingan akhir,
          setiap frame dirancang untuk menyampaikan emosi dan pesan secara mendalam.
        </p>

        {/* 2-column: Pengalaman / Bidang Fokus */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 pt-1">
          {/* Col 1 */}
          <div>
            <h3 className="text-white font-bold text-xs mb-1">Fokus &amp; Peran :</h3>
            <div className="text-white/60 text-[11px] leading-snug space-y-1">
              <p>Visual Framing &amp; Lighting</p>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-white font-bold text-xs mb-1">Produksi :</h3>
            <div className="text-white/60 text-[11px] leading-snug space-y-1">
              <p>Social Media Reels &amp; Ads</p>
            </div>
          </div>
        </div>

        {/* Button placed at bottom right */}
        <div className="flex justify-end pt-1 -mt-12">
          <Button />
        </div>
      </div>
    </section>
  );
}
