"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./insta";

export default function Video({
  isPlaying = false,
  isSplit = false,
}: {
  isPlaying?: boolean;
  isSplit?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobileClient, setIsMobileClient] = useState<boolean | null>(null);

  // Detect screen size on client mount and initialize iOS-compliant video buffering
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsMobileClient(isMobile);

    const activeEl = isMobile ? mobileVideoRef.current : videoRef.current;
    if (activeEl) {
      activeEl.defaultMuted = true;
      activeEl.muted = true;
      activeEl.load();
    }
  }, []);

  useEffect(() => {
    if (isMobileClient === null) return;
    const activeEl = isMobileClient ? mobileVideoRef.current : videoRef.current;

    if (activeEl) {
      activeEl.defaultMuted = true;
      activeEl.muted = true;
      if (isPlaying) {
        const p = activeEl.play();
        if (p !== undefined) p.catch(() => {});
      } else {
        activeEl.pause();
      }
    }
  }, [isPlaying, isMobileClient]);

  return (
    <section
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ background: "#050506" }}
    >
      {/* ════════════════════════════════════════════════════════
          LAPTOP / PC VIEW  — hidden on mobile, 100% UNTOUCHED
      ════════════════════════════════════════════════════════ */}

      {/* Video card — left side */}
      <div
        className="hidden md:block z-10"
        style={{
          position: "absolute",
          top: isSplit ? "10vh" : "0",
          left: isSplit ? "clamp(2rem, 5vw, 6rem)" : "0",
          width: isSplit ? "44%" : "100%",
          height: isSplit ? "80vh" : "100%",
          borderRadius: "0px",
          boxShadow: isSplit
            ? "0 25px 70px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.12)"
            : "none",
          transition: "all 0.95s cubic-bezier(0.16, 1, 0.28, 1)",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
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
        >
          {isMobileClient !== true && (
            <source src="/assets/video.mp4" type="video/mp4" />
          )}
        </video>
        {/* Subtle dark vignette overlay when split */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            opacity: isSplit ? 0.2 : 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Right content panel */}
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
          transition:
            "opacity 0.95s cubic-bezier(0.16, 1, 0.28, 1), transform 0.95s cubic-bezier(0.16, 1, 0.28, 1)",
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

        {/* Description */}
        <p
          className="text-white/55 text-[13px] leading-[1.5] max-w-[400px]"
          style={{ paddingTop: "1rem", paddingBottom: "0.5rem" }}
        >
          Menciptakan visual bergerak dengan kedalaman sinematik dan narasi visual
          yang kuat. Dari perencanaan konsep, sinematografi, hingga penyuntingan akhir,
          setiap frame dirancang untuk menyampaikan emosi dan pesan secara mendalam.
        </p>

        {/* 2-col grid */}
        <div
          className="grid grid-cols-2 gap-x-6 gap-y-5"
          style={{ paddingTop: "clamp(0.5rem, 0.5vw, 1rem)", paddingBottom: "0rem" }}
        >
          <div>
            <h3 className="text-white font-bold text-sm">Fokus &amp; Peran :</h3>
            <div className="text-white/55 text-[12px] leading-relaxed space-y-2">
              <div>
                <p>Visual Framing &amp; Lighting</p>
              </div>
            </div>
          </div>

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

        {/* Instagram Button */}
        <div className="flex justify-end pt-8">
          <Button />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MOBILE VIEW  (block md:hidden)
          Always rendered — animated via CSS transitions exactly
          like the desktop, driven by isSplit state.
      ════════════════════════════════════════════════════════ */}
      <div className="block md:hidden absolute inset-0 w-full h-full z-10">

        {/* ── Mobile Video Card ──
            Not split → fullscreen (top:0, left:0, w:100%, h:100%, radius:0)
            Split     → small top card (top:3.5vh, centered 90%, h:28vh, radius:1rem)
            Same cubic-bezier transition as desktop video card
        */}
        <div
          style={{
            position: "absolute",
            top: isSplit ? "3.5vh" : "0",
            left: isSplit ? "5%" : "0",
            width: isSplit ? "90%" : "100%",
            height: isSplit ? "28vh" : "100%",
            borderRadius: isSplit ? "1rem" : "0px",
            boxShadow: isSplit
              ? "0 12px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)"
              : "none",
            overflow: "hidden",
            transition: "top 0.45s cubic-bezier(0.16, 1, 0.28, 1), left 0.45s cubic-bezier(0.16, 1, 0.28, 1), width 0.45s cubic-bezier(0.16, 1, 0.28, 1), height 0.45s cubic-bezier(0.16, 1, 0.28, 1), border-radius 0.45s cubic-bezier(0.16, 1, 0.28, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.28, 1)",
          }}
        >
          <video
            ref={mobileVideoRef}
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
          >
            {isMobileClient !== false && (
              <source src="/assets/video.mp4" type="video/mp4" />
            )}
          </video>
          {/* Vignette — fades in when split, same as desktop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: isSplit ? 0.2 : 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
              transition: "opacity 0.7s ease",
            }}
          />
        </div>

        {/* ── Mobile Content Panel ──
            Not split → hidden below (translateY(60px) + opacity:0)
            Split     → slides up into view (translateY(0) + opacity:1)
            Mirrors the desktop right panel slide-in with same easing & delay
        */}
        <div
          style={{
            position: "absolute",
            /* Start just below the video card */
            top: "calc(3.5vh + 28vh + 1.5rem)",
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: "visible",
            touchAction: "pan-y",
            padding: "0 1.5rem 2.5rem",
            opacity: isSplit ? 1 : 0,
            transform: isSplit ? "translateY(0)" : "translateY(60px)",
            pointerEvents: isSplit ? "auto" : "none",
            transition:
              "opacity 0.45s cubic-bezier(0.16, 1, 0.28, 1), transform 0.45s cubic-bezier(0.16, 1, 0.28, 1)",
            transitionDelay: isSplit ? "0.08s" : "0s",
          }}
        >
          {/* Title */}
          <h1 className="font-black text-red-700 leading-none mb-3 tracking-tight text-[2.2rem]">
            ACID Record
          </h1>

          {/* Description */}
          <p className="text-white/60 text-[12px] leading-relaxed mb-5">
            Menciptakan visual bergerak dengan kedalaman sinematik dan narasi
            visual yang kuat. Dari perencanaan konsep, sinematografi, hingga
            penyuntingan akhir, setiap frame dirancang untuk menyampaikan
            emosi dan pesan secara mendalam.
          </p>

          {/* 2-col grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
            <div>
              <h3 className="text-white font-bold text-xs mb-1">Fokus &amp; Peran :</h3>
              <p className="text-white/55 text-[11px] leading-snug">
                Visual Framing &amp; Lighting
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-xs mb-1">Produksi :</h3>
              <p className="text-white/55 text-[11px] leading-snug">
                Social Media Reels &amp; Ads
              </p>
            </div>
          </div>

          {/* Instagram button */}
          <div className="flex justify-start pt-2">
            <a
              href="https://www.instagram.com/acid.record"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#e62626] active:opacity-70 transition-opacity"
            >
              <span className="font-bold text-base tracking-wider uppercase underline underline-offset-4">
                INSTAGRAM
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
