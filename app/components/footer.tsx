"use client";

import Image from "next/image";

/**
 * ══════════════════════════════════════════════════════════════════════
 * DESKTOP FOOTER
 * 100% pure, dedicated code for Laptop & PC displays (hidden md:flex)
 * ══════════════════════════════════════════════════════════════════════
 */
function DesktopFooter() {
  return (
    <div className="hidden md:flex relative w-full min-h-screen bg-black text-white flex-col justify-between overflow-hidden select-none">
      {/* ── CENTER BACKGROUND PORTRAIT (foot.png) ── */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none z-0 overflow-hidden">
        {/* Atmospheric Red Halo Glow behind head/shoulders */}
        <div
          className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[780px] rounded-full blur-[140px] pointer-events-none opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(220, 38, 38, 0.75) 0%, rgba(185, 28, 28, 0.4) 45%, transparent 72%)",
          }}
        />

        {/* Portrait container firmly resting at the bottom */}
        <div className="relative w-full max-w-[1340px] h-[91vh] flex items-end justify-center">
          <Image
            src="/assets/foot.png"
            alt="Portrait"
            fill
            priority
            sizes="1340px"
            className="object-contain object-bottom"
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

      {/* ── TOP NAVIGATION HEADER ── */}
      <header className="relative z-20 w-full bg-black flex items-center justify-between px-10 md:px-14 lg:px-16 pt-7 md:pt-9 pb-2">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold tracking-[0.25em] text-white/90 uppercase font-mono">
            MUNAS MK &middot; MODEL &amp; VISUAL DIRECTOR
          </span>
        </div>

        {/* Right: Desktop Navigation Links */}
        <nav className="flex items-center gap-9 lg:gap-14 text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase">
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
            PINTEREST
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

      {/* ── MAIN HERO BODY ── */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between px-10 md:px-14 lg:px-16 pt-2 md:pt-4 pointer-events-none">
        {/* Upper Layer: MUNAZ M K Title & Editorial Statement */}
        <div className="w-full flex flex-row items-start justify-between gap-8 pt-4">
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
                marginTop: "-8px",
                marginLeft: "-3px",
              }}
            >
              MUNAZ M K
            </h1>
          </div>

          {/* Right Side Editorial Serif Statement */}
          <div className="text-right pointer-events-auto pt-3 lg:pt-4">
            <h2
              className="text-4xl md:text-5xl lg:text-[3.4rem] font-normal leading-[1.08] text-white/95 tracking-tight"
              style={{
                fontFamily:
                  "'Playfair Display', Didot, 'Bodoni MT', Georgia, serif",
                marginRight: "0px",
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

        {/* Lower Layer: Explanatory Subtitle */}
        <div className="w-full flex items-center justify-between pb-6 pointer-events-auto">
          <div>
            <p className="text-[11px] uppercase text-white/65 font-light tracking-[0.22em] font-mono">
              TURNING CREATIVE IDEAS INTO INTERACTIVE FRAMES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ══════════════════════════════════════════════════════════════════════
 * MOBILE FOOTER
 * Dedicated, isolated code for Mobile Phone devices (flex md:hidden)
 * ══════════════════════════════════════════════════════════════════════
 */
function MobileFooter() {
  return (
    <div className="flex md:hidden relative w-full min-h-screen bg-black text-white flex-col justify-between overflow-hidden select-none">
      {/* ── Mobile Background Portrait (foot.png) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        {/* Mobile Atmospheric Red Halo Glow — Centered behind portrait */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-[85px] pointer-events-none opacity-75"
          style={{
            background:
              "radial-gradient(circle, rgba(220, 38, 38, 0.85) 0%, rgba(185, 28, 28, 0.45) 45%, transparent 72%)",
          }}
        />

        {/* Mobile Portrait Container — Large & Centered */}
        <div className="relative w-full h-[65vh] flex items-center justify-center">
          <Image
            src="/assets/foot.png"
            alt="Portrait"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />

          {/* Seamless zero-edge blend on top, bottom, and sides */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 75% 65% at 50% 50%, transparent 42%, rgba(0,0,0,0.6) 75%, #000000 100%),
                linear-gradient(to right, #000000 0%, transparent 16%, transparent 84%, #000000 100%),
                linear-gradient(to bottom, #000000 0%, transparent 22%, transparent 78%, #000000 100%)
              `,
            }}
          />
        </div>
      </div>

      {/* ── Mobile Top Header ── */}
      <header className="relative z-20 w-full bg-black/75 backdrop-blur-md flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-white/90 uppercase font-mono">
            MUNAS MK &middot; MODEL &amp; VISUAL DIRECTOR
          </span>
        </div>
      </header>

      {/* ── Mobile Main Hero Body ── */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between px-5 pt-2 pb-6 pointer-events-none">
        {/* Mobile Top Section: Title & Editorial Headline */}
        <div className="w-full flex flex-col gap-2 pt-1">
          {/* Mobile Metallic Gradient Title */}
          <div className="pointer-events-auto">
            <h1
              className="text-[clamp(2.8rem,11.5vw,4.2rem)] font-black leading-[0.88] tracking-[-0.04em] uppercase select-none"
              style={{
                fontFamily:
                  "'Syne', 'Impact', 'Bebas Neue', -apple-system, BlinkMacSystemFont, sans-serif",
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 30%, #959BA7 68%, #202228 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.9))",
                marginTop: "-4px",
                marginLeft: "-2px",
              }}
            >
              MUNAZ M K
            </h1>
          </div>

          {/* Mobile Editorial Serif Headline */}
          <div className="text-left pointer-events-auto pt-1">
            <h2
              className="text-2xl font-normal leading-[1.14] text-white/95 tracking-tight"
              style={{
                fontFamily:
                  "'Playfair Display', Didot, 'Bodoni MT', Georgia, serif",
              }}
            >
              Creating Frames That Feel Alive.
            </h2>
          </div>
        </div>

        {/* Mobile Bottom Section: Nav Links & Descriptor */}
        <div className="w-full flex flex-col items-start gap-3.5 pb-2 pointer-events-auto">
          {/* Mobile Dedicated Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium tracking-[0.2em] text-white/80 uppercase pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 active:text-red-500 transition-colors"
            >
              INSTAGRAM
            </a>
            <span className="text-white/20">&middot;</span>
            <a
              href="#about"
              className="hover:text-red-500 active:text-red-500 transition-colors"
            >
              ACID RECORD
            </a>
            <span className="text-white/20">&middot;</span>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 active:text-red-500 transition-colors"
            >
              PINTEREST
            </a>
            <span className="text-white/20">&middot;</span>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 active:text-red-500 transition-colors"
            >
              YOUTUBE
            </a>
          </nav>

          {/* Mobile Bottom Descriptor */}
          <div>
            <p className="text-[9px] uppercase text-white/55 font-light tracking-[0.18em] font-mono">
              TURNING CREATIVE IDEAS INTO INTERACTIVE FRAMES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ══════════════════════════════════════════════════════════════════════
 * ROOT FOOTER EXPORT
 * Houses isolated Desktop and Mobile implementations
 * ══════════════════════════════════════════════════════════════════════
 */
export default function Footer() {
  return (
    <footer className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Laptop / PC Layout */}
      <DesktopFooter />

      {/* Mobile Devices Layout */}
      <MobileFooter />
    </footer>
  );
}
