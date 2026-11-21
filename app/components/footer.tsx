"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState("12:11 PM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* ═══════════════════════════════════════════════════════
          CENTER BACKGROUND PORTRAIT (foot.png)
          Vignetted seamlessly into pure black on all four sides
      ═══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-full max-w-[1240px] h-[75vh] md:h-[88vh]">
          <Image
            src="/assets/foot.png"
            alt="Portrait"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Deep multi-directional gradient mask for seamless zero-edge blend */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 50% 52%, transparent 35%, rgba(0,0,0,0.65) 68%, #000000 98%),
                linear-gradient(to bottom, #000000 0%, transparent 16%, transparent 80%, #000000 100%),
                linear-gradient(to right, #000000 0%, transparent 18%, transparent 82%, #000000 100%)
              `,
            }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TOP NAVIGATION HEADER
      ═══════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-7 md:pt-9 pb-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2.5">
          {/* Custom Stylized P Glyph */}
          <div className="w-5 h-5 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-white"
            >
              <path d="M6 3h7a5 5 0 0 1 0 10H6v8" />
              <path d="M12 8h1" />
            </svg>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-white/90 uppercase font-mono">
            PRINCE &middot; WEB KAIZEN
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-9 lg:gap-14 text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase">
          <a
            href="#home"
            className="hover:text-white transition-colors duration-200"
          >
            HOME
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors duration-200"
          >
            ABOUT
          </a>
          <a
            href="#showcase"
            className="hover:text-white transition-colors duration-200"
          >
            SHOWCASE
          </a>
          <a
            href="#contact"
            className="hover:text-white transition-colors duration-200"
          >
            CONTACT
          </a>
        </nav>

        {/* Right: Digital Clock */}
        <div className="text-[11px] sm:text-xs font-mono font-medium tracking-wider text-white/60">
          {currentTime}
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          MAIN HERO BODY
          - Big Silver-Gradient PRINCE on top left
          - Editorial Serif Headline on top right
      ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 pt-2 md:pt-4 pb-8 md:pb-12 pointer-events-none">
        {/* Upper Layer: PRINCE Title & Editorial Statement */}
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
              }}
            >
              PRINCE
            </h1>
          </div>

          {/* Right Side Editorial Serif Statement */}
          <div className="text-right pointer-events-auto md:pt-3 lg:pt-4">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-normal leading-[1.08] text-white/95 tracking-tight"
              style={{
                fontFamily:
                  "'Playfair Display', Didot, 'Bodoni MT', Georgia, serif",
              }}
            >
              Creating
              <br />
              Websites
              <br />
              That Feel
              <br />
              Alive.
            </h2>
          </div>
        </div>

        {/* Lower Layer: Explanatory Subtitle & Action Pill */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pt-12 sm:pt-16">
          {/* Bottom Left Descriptor */}
          <div className="pointer-events-auto max-w-sm sm:max-w-md">
            <p className="text-xs sm:text-[13px] text-white/60 font-light leading-relaxed tracking-wide">
              Turning creative ideas into interactive and
              <br />
              <span className="text-white font-medium">
                high-quality web experiences.
              </span>
            </p>
          </div>

          {/* Bottom Right Pill Action Button */}
          <div className="pointer-events-auto self-start sm:self-auto">
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 rounded-full border border-white/20 hover:border-white/50 bg-white/[0.03] hover:bg-white/[0.08] transition-all text-xs font-mono font-medium tracking-widest text-white uppercase group cursor-pointer"
            >
              <span>WEBKAIZEN</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
