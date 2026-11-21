"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import "@/app/globals.css"
/* ─── Fluted Column Hero Background — real image ─── */
function FlutedBg() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/fluted-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease-out",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "rgba(8,10,16,0.45)" }}
      />
    </div>
  );
}

/* ─── Reusable Phone Mockup ─── */
function Phone({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-[2.5rem] overflow-hidden ${className}`}
      style={{
        border: "3px solid #2a2d38",
        boxShadow: "0 0 0 1px #1a1d28, 0 24px 64px rgba(0,0,0,0.6)",
      }}
    >
      {/* notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-24 h-5 bg-black rounded-b-2xl" />
      <div className="w-full h-full">{children}</div>
    </div>
  );
}

/* ─── Section Label ─── */
function SectionMeta({ left, center, right }: { left?: string; center?: string; right?: string }) {
  return (
    <div className="flex justify-between items-center mb-6 text-[11px] tracking-[0.18em] uppercase font-medium text-gray-400">
      <span>{left ?? ""}</span>
      <span className="font-black text-gray-700">{center ?? ""}</span>
      <span>{right ?? ""}</span>
    </div>
  );
}

/* ─── Tool Badge ─── */
function ToolBadge({ bg, label }: { bg: string; label: string }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg"
      style={{ background: bg }}
    >
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MUNAS TITLE — phase 1: slide left→center (blurred)
                 phase 2: letter-by-letter blur-clear + scale-up
═══════════════════════════════════════════ */
function MunasTitle() {
  const text = "Munaz M K";
  const chars = text.split("");

  // Phase 1: slide in
  const [slid, setSlid] = useState(false);
  // Phase 2: which letter indices have been revealed
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Kick off slide on first paint
    const raf = requestAnimationFrame(() => setSlid(true));

    // Slide duration = 1.3s → then reveal letters one by one
    const SLIDE_MS = 650;
    const STAGGER_MS = 75;
    const letterIndices = chars
      .map((c, i) => (c !== " " ? i : -1))
      .filter((i) => i !== -1);

    // Fisher-Yates shuffle for random reveal order
    for (let i = letterIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letterIndices[i], letterIndices[j]] = [letterIndices[j], letterIndices[i]];
    }

    letterIndices.forEach((idx, order) => {
      const t = setTimeout(() => {
        setRevealed((prev) => new Set(prev).add(idx));
      }, SLIDE_MS + order * STAGGER_MS);
      timers.current.push(t);
    });

    return () => {
      cancelAnimationFrame(raf);
      timers.current.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <h1
      className="text-[clamp(4rem,12vw,9rem)] font-black text-white leading-none tracking-tighter"
      style={{
        textShadow: "0 0 80px rgba(150,180,255,0.14)",
        // Phase 1: whole title slides in; letters remain blurred during this
        transform: slid ? "translateX(0)" : "translateX(-36px)",
        transition: "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {chars.map((char, i) =>
        char === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span
            key={i}
            style={{
              display: "inline-block",
              // Phase 2: each letter de-blurs and scales up after slide settles
              opacity: revealed.has(i) ? 1 : 0.15,
              filter: revealed.has(i) ? "blur(0px)" : "blur(10px)",
              transform: revealed.has(i) ? "scale(1)" : "scale(0.88)",
              transition:
                "opacity 1.1s cubic-bezier(0.25,0.46,0.45,0.94), filter 1.1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          >
            {char}
          </span>
        )
      )}
    </h1>
  );
}

/* ═══════════════════════════════════════════
   CINEMATIC SUBTITLE — letter by letter, slide-up reveal
═══════════════════════════════════════════ */
function TypewriterText({ text }: { text: string }) {
  const [visibleCount, setVisibleCount] = useState(0);
  // Delay start until after MunasTitle slide finishes (~700ms)
  const START_DELAY_MS = 700;
  const PER_LETTER_MS = 48;

  useEffect(() => {
    setVisibleCount(0);
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setVisibleCount(i);
        if (i >= text.length) clearInterval(interval);
      }, PER_LETTER_MS);
      return () => clearInterval(interval);
    }, START_DELAY_MS);
    return () => clearTimeout(startTimer);
  }, [text]);

  return (
    <p
      className="text-white/55 text-sm md:text-base tracking-[0.3em] font-light overflow-hidden"
      style={{ lineHeight: 1.6 }}
    >
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: idx < visibleCount ? 1 : 0,
            transform: idx < visibleCount ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)`,
          }}
        >
          {char}
        </span>
      ))}
    </p>
  );
}

/* ═══════════════════════════════════════════
   SECTION 1 — HERO COVER
═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#0c0e14]"
    >
      <FlutedBg />


      {/* Hero text */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
        <MunasTitle />
        <TypewriterText text="MODEL & VISUAL DIRECTOR" />
        <a
          href="#about"
          className="anim-fade3 mt-6 flex items-center gap-2 text-white/40 text-sm hover:text-white/70 transition-colors"
        >
          Scroll to explore <ChevronDown size={14} />
        </a>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, #0c0e14)",
        }}
      />
    </section>
  );
}
export default HeroSection;