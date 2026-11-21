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
          VIDEO COMPONENT: Fullscreen → Left Component
      ════════════════════════════════════════ */}
      <div
        className="z-10"
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
          RIGHT CONTENT PANEL (Structured like About's left component)
      ════════════════════════════════════════ */}
      <div
        className="relative z-20 flex flex-col justify-center min-h-screen "
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
          className="font-black text-red-700 leading-none mb-5 ml-[2rem] tracking-tight"
          style={{ fontSize: "clamp(3rem, 6.5vw, 5.5rem)" }}
        >
          ACID Record
        </h1>

        {/* Cinematography & Video Production */}
        <p className="text-white/55 text-[13px] leading-[1.5] mb-7 max-w-[400px]"
        style={{paddingTop:'1rem',paddingBottom:'0.5rem'}}>
        
          Menciptakan visual bergerak dengan kedalaman sinematik dan narasi visual
          yang kuat. Dari perencanaan konsep, sinematografi, hingga penyuntingan akhir,
          setiap frame dirancang untuk menyampaikan emosi dan pesan secara mendalam.
        </p>

        {/* 2-column: Pengalaman / Bidang Fokus */}
        <div
          className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6"
          style={{ paddingTop: "clamp(0.5rem, 0.5vw, 1rem)", paddingBottom: '0rem' }}
        >
          {/* Col 1 */}
          <div>
            <h3 className="text-white font-bold text-sm mb-2">Fokus &amp; Peran :</h3>
            <div className="text-white/55 text-[12px] leading-relaxed space-y-2">
              <div>
                <p>Visual Framing &amp; Lighting</p>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-white font-bold text-sm mb-2">Produksi :</h3>
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
    </section>
  );
}
