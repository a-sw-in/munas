"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* ═══════════════════════════════════════════════════════
          CENTER BACKGROUND PORTRAIT (foot.png)
          Anchored firmly to the bottom with zero gap ("resting on the bottom")
          Atmospheric red halo glow behind head and shoulders
      ═══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0 overflow-hidden">
        {/* Atmospheric Red Halo Glow behind head/shoulders */}
        <div
          className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[580px] sm:h-[780px] rounded-full blur-[140px] pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(220, 38, 38, 0.75) 0%, rgba(185, 28, 28, 0.4) 45%, transparent 72%)",
          }}
        />

        {/* Portrait container firmly resting at the bottom */}
        <div className="relative w-full max-w-[1340px] h-[82vh] md:h-[91vh] flex items-end justify-center">
          <Image
            src="/assets/foot.png"
            alt="Portrait"
            fill
            priority
            sizes="100vw"
            className="object-contain object-bottom "
          />

          {/* Seamless zero-edge blend on top, left and right — bottom rests solid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 75% 65% at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 75%, #000000 100%),
                linear-gradient(to right, #000000 0%, transparent 16%, transparent 84%, #000000 100%),
                linear-gradient(to bottom, #000000 0%, transparent 18%)
              `,
            }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TOP NAVIGATION HEADER
      ═══════════════════════════════════════════════════════ */}
      <header className="relative z-20 h-[10vh] w-full bg-black flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-7 md:pt-9 pb-2">
        {/* Left: Brand / Logo */}
        <div className="flex items-center bg-black gap-2.5">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-white/90 uppercase font-mono">
            MUNAS MK &middot; MODEL &amp; VISUAL DIRECTOR
          </span>
        </div>

        {/* Center/Right: Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 lg:gap-14 text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            INSTAGRAM
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200"
          >
            ACID RECORD
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            PINTREST
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200"
          >
            YOUTUBE
          </a>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════
          MAIN HERO BODY
          - Big Silver-Gradient MUNAZ M K on top left
          - Editorial Serif Headline on top right
          - Bottom left subtitle & N' badge pinned directly at the bottom
      ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-2 md:pt-4 pointer-events-none">
        {/* Upper Layer: MUNAZ M K Title & Editorial Statement */}
        <div className="w-full flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8 pt-2 sm:pt-4">
          {/* Big Metallic Gradient Title */}
          <div className="pointer-events-auto">
            <h1
              className="text-[clamp(4.2rem,13vw,10.5rem)] font-black leading-[0.88] tracking-[-0.04em] uppercase select-none"
              style={{
                fontFamily:
                  "'Syne', 'Impact', 'Bebas Neue', -apple-system, BlinkMacSystemFont, sans-serif",
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 30%, #959BA7 68%, #202228 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.85))",
                marginTop:'-25px',
                marginLeft:'-5px'
              }}
            >
              MUNAZ M K
            </h1>
          </div>

          {/* Right Side Editorial Serif Statement */}
          <div className="text-right pointer-events-auto md:pt-3 lg:pt-4">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-normal leading-[1.08] text-white/95 tracking-tight"
              style={{
                fontFamily:
                  "'Playfair Display', Didot, 'Bodoni MT', Georgia, serif",
                marginRight: "20px",
              }}
            >
              Creating
              <br />
              Frames
              <br />
              That Feel
              <br />
              Alive.
            </h2>
          </div>
        </div>

        {/* Lower Layer: Explanatory Subtitle & Circular N' Glyph pinned to the very bottom */}
        <div className="w-full flex flex-col items-start gap-2.5 pb-3 sm:pb-5">
          {/* Bottom Left Descriptor */}
          <div className="pointer-events-auto">
            <p className="text-[10px] sm:text-[11px] uppercase text-white/65 font-light tracking-[0.22em] font-mono">
              TURNING CREATIVE IDEAS INTO INTERACTIVE FRAMES
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
