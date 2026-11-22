"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/* ── Design tool square badge ── */
function ToolBadge({ bg, label }: { bg: string; label: string }) {
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg"
      style={{ background: bg }}
    >
      {label}
    </div>
  );
}

export default function About({
  isVisible = false,
  animate = true,
}: {
  isVisible?: boolean;
  animate?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panels = [panelRef.current, mobilePanelRef.current];
    panels.forEach((el) => {
      if (!el) return;
      if (isVisible && animate) {
        // Coming from Home — replay wave-up animation
        el.classList.remove("about-animate", "about-static");
        void el.offsetWidth; // force reflow so animation restarts
        el.classList.add("about-animate");
      } else if (isVisible && !animate) {
        // Coming back from Video — show text instantly, no animation
        el.classList.remove("about-animate");
        el.classList.add("about-static");
      } else {
        el.classList.remove("about-animate", "about-static");
      }
    });
  }, [isVisible, animate]);

  return (
    <section
      id="about"
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "#050506" }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          1. LAPTOP / PC SCREEN (hidden md:block & hidden md:flex)
          DIRECT CHILDREN OF <section> — 100% EXACT ORIGINAL UNTOUCHED CODE
      ══════════════════════════════════════════════════════════════════ */}

      {/* IMAGE AREA — fluted-bg.jpg oval-faded behind, munas.png on top */}
      <div className="hidden md:block absolute right-[-60px] top-[10vh] w-[45%] h-full z-0">
        {/* fluted-bg.jpg with oval mask */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/fluted-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.8)",
            maskImage:
              "radial-gradient(ellipse 110% 55% at 23% 45%, black 0%, black 36%, rgba(0,0,0,0.5) 54%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 115% 55% at 23% 45%, black 0%, black 36%, rgba(0,0,0,0.5) 54%, transparent 72%)",
          }}
        />

        {/* munas.png — greyscale */}
        <Image
          src="/assets/munas.png"
          alt="Munas M K"
          fill
          sizes="45vw"
          className="object-cover object-center z-10 grayscale"
          priority
        />

        {/* bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-68 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #050506 0%, transparent 100%)",
          }}
        />

        {/* left-edge fade */}
        <div
          className="absolute inset-y-0 left-0 w-2/6 z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #050506 0%, transparent 100%)",
          }}
        />
      </div>

      {/* LEFT CONTENT PANEL (PC) */}
      <div
        ref={panelRef}
        className="hidden md:flex relative z-20 flex-col justify-center min-h-screen py-16"
        style={{
          width: "42%",
          paddingLeft: "clamp(4rem, 8vw, 8rem)",
          paddingTop: "clamp(2rem, 7vw, 7rem)",
        }}
      >
        {/* Hello I'am */}
        <p className="wi wi-1 text-white/70 text-2xl font-light mb-1 tracking-wide">
          Hello I&apos;am
        </p>

        {/* Name */}
        <h1
          className="wi wi-2 font-black text-white leading-none mb-5  tracking-tight"
          style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
        >
          Munas M K
        </h1>

        {/* Tentang Saya */}
        <h3
          className="wi wi-3 text-white font-bold text-sm mb-2"
          style={{ paddingTop: "clamp(1rem, 2vw, 2rem)" }}
        >
          Tentang Saya :
        </h3>
        <p className="wi wi-4 text-white/55 text-[13px] leading-[1.5] mb-7 max-w-[400px]">
          Seorang graphic designer otodidak dan mahasiswa Manajemen yang memandang
          desain sebagai alat strategis, bukan sekadar estetika. Bagi saya, Branding
          adalah perpaduan antara desain dan pemasaran. Bagaimana visual membentuk
          persepsi, menyampaikan nilai, dan mendorong tindakan. Karena itu, Setiap
          karya yang saya buat selalu menyeimbangkan keindahan dengan tujuan.
        </p>

        {/* 2-column: Pengalaman | Pendidikan */}
        <div
          className="wi wi-5 grid grid-cols-2 gap-x-6 gap-y-5 mb-6"
          style={{ paddingTop: "clamp(0.5rem, 0.5vw, 1rem)" }}
        >
          {/* Col 1 — Pengalaman */}
          <div>
            <h3 className="text-white font-bold text-sm mb-2">Pengalaman :</h3>
            <div className="text-white/55 text-[12px] leading-relaxed space-y-2">
              <div>
                <p className="text-white/80 font-semibold">2023 - 2025</p>
                <p>It Staff - Kspm Feb Unikal</p>
              </div>
              <div>
                <p className="text-white/80 font-semibold">2023 - Sekarang</p>
                <p>Freelancer - Logo &amp; Graphic Design</p>
              </div>
            </div>
          </div>

          {/* Col 2 — Pendidikan */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-white font-bold text-sm mb-2">Pendidikan :</h3>
              <div className="text-white/55 text-[12px] leading-relaxed">
                <p className="text-white/80 font-semibold">2023 - Sekarang</p>
                <p>S1 Manajemen</p>
                <p>Universitas Pekalongan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Design Tools + Social Media */}
        <div className="wi wi-6">
          <h3
            className="text-white font-bold text-sm mb-3"
            style={{
              paddingTop: "clamp(1rem, 0.5vw, 1rem)",
              paddingBottom: "clamp(0.7rem, 0.5vw, 1rem)",
            }}
          >
            Design Tools :
          </h3>
          <div
            className="flex gap-3 items-center flex-wrap"
            style={{ paddingBottom: "clamp(1rem, 2vw, 2rem)" }}
          >
            {/* Divider */}
            <div className="w-px h-8 bg-white/20 mx-1" />

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              style={{
                background:
                  "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              style={{ background: "#FF0000" }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              style={{ background: "#E60023" }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2. MOBILE SCREEN (block md:hidden)
          munas.png in background WITHOUT any fade or filter, just grayscale
          Text on bottom section with upward black gradient fade
      ══════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden w-full h-full min-h-screen relative">
        {/* Background munas.png with fluted-bg backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* fluted-bg.jpg with oval mask */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/fluted-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(1.8)",
              maskImage:
                "radial-gradient(ellipse 110% 55% at 23% 45%, black 0%, black 36%, rgba(0,0,0,0.5) 54%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 115% 55% at 23% 45%, black 0%, black 36%, rgba(0,0,0,0.5) 54%, transparent 72%)",
            }}
          />

          <Image
            src="/assets/munas.png"
            alt="Munas M K"
            fill
            sizes="100vw"
            className="object-cover object-top z-10 grayscale"
            style={{paddingBottom:'6rem',
              marginLeft:'3rem',
              
            }}
            priority
          />
        </div>

        {/* Upward black gradient: Height reduced by 25% (h-[75%]), bottom black fading to top */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[75%] pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to top, #050506 0%, #050506 35%, rgba(5,5,6,0.85) 60%, rgba(5,5,6,0.35) 80%, transparent 100%)",
          }}
        />

        {/* Text placed at the bottom section directly over the fade */}
        <div
          ref={mobilePanelRef}
          className="relative z-20 flex flex-col justify-end min-h-screen px-6 pt-[48vh] pb-10"
        >
          <div className="w-full" style={{ marginLeft: "0rem", marginBottom: "2rem" }} >
            {/* Hello I'am */}
            <p className="wi wi-1 text-white/70 text-base font-light mb-0.5 tracking-wide" >
              Hello I&apos;am
            </p>

            {/* Name */}
            <h1 className="wi wi-2 font-black text-white leading-none mb-3 tracking-tight text-3xl sm:text-4xl" style={{marginBottom: "1rem"}} >
              Munas M K
            </h1>

            {/* Tentang Saya */}
            <h3 className="wi wi-3 text-white font-bold text-xs sm:text-sm mb-1" style={{marginBottom: "0.3rem"}} >
              Tentang Saya :
            </h3>
            <p className="wi wi-4 text-white/75 text-[12px] leading-relaxed mb-4 max-w-sm" style={{marginBottom: "1rem"}} >
              Seorang graphic designer otodidak dan mahasiswa Manajemen yang memandang
              desain sebagai alat strategis, bukan sekadar estetika. Bagi saya, Branding
              adalah perpaduan antara desain dan pemasaran.
            </p>

            {/* 2-column: Pengalaman | Pendidikan */}
            <div className="wi wi-5 grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4" style={{marginBottom: "1rem"}} >
              <div>
                <h3 className="text-white font-bold text-xs mb-0.5" style={{marginBottom: "0.3rem"}} >Pengalaman :</h3>
                <div className="text-white/70 text-[11px] leading-snug space-y-1">
                  <div>
                    <p>It Staff - Kspm Feb Unikal</p>
                  </div>
                  <div>
                    <p>Freelancer - Logo Design</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold text-xs mb-0.5" style={{marginBottom: "0.3rem"}}>Pendidikan :</h3>
                <div className="text-white/70 text-[11px] leading-snug">
                  <p>S1 Manajemen</p>
                  <p>Universitas Pekalongan</p>
                </div>
              </div>
            </div>

            {/* Design Tools + Social Media */}
            <div className="wi wi-6 pt-1">
              <h3 className="text-white font-bold text-xs mb-2" style={{marginBottom: "0.7rem"}}>
                Design Tools :
              </h3>
              <div className="flex gap-2.5 items-center flex-wrap"
              style={{marginBottom: "1rem"}}
              >
                <div className="w-px h-6 bg-white/20 mx-0.5" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                  }}
                  title="Instagram"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  style={{ background: "#FF0000" }}
                  title="YouTube"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                  </svg>
                </a>

                {/* Pinterest */}
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  style={{ background: "#E60023" }}
                  title="Pinterest"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                </a>
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
