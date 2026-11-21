'use client';

import { useEffect, useRef, useState, useCallback } from "react";

import "@/app/globals.css";
import HeroSection from "./components/home";
import About from "./components/about";
import Video from "./components/video";
import Work from "./components/works";

const FADE_MS  = 480;
const SLIDE_MS = 950; // Slower, silky smooth slide between About and Video
const LOCK_MS  = 950; // Cooldown matching slide duration

// Steps:
// 0 = Home
// 1 = About
// 2 = Video Fullscreen
// 3 = Video Minimized (Card View)
// 4 = Works (3D Curved Cylinder Showcase ending with VideoWorks fullscreen expansion)
export default function Home() {
  const homeRef        = useRef<HTMLDivElement>(null);
  const aboutRef       = useRef<HTMLDivElement>(null);
  const videoRef       = useRef<HTMLDivElement>(null);
  const worksRef       = useRef<HTMLDivElement>(null);

  const stepRef     = useRef<number>(0);
  const isLockedRef = useRef<boolean>(false);

  const [section, setSection] = useState(0); // 0 = Home, 1 = About, 2 = Video, 3 = Works, 4 = Contact
  const [aboutShouldAnimate, setAboutShouldAnimate] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoSplit, setVideoSplit] = useState(false);

  const setOpacity = (el: HTMLDivElement | null, val: number, duration = FADE_MS) => {
    if (!el) return;
    el.style.transition = `opacity ${duration}ms ease-in-out`;
    el.style.opacity = String(val);
  };

  const slideVideo = (el: HTMLDivElement | null, direction: 'in' | 'out') => {
    if (!el) return;
    el.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    el.style.transform  = direction === 'in' ? 'translateX(0%)' : 'translateX(100%)';
    el.style.opacity    = direction === 'in' ? '1' : '0';
  };

  const slideAbout = (el: HTMLDivElement | null, direction: 'in' | 'out') => {
    if (!el) return;
    el.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    el.style.transform  = direction === 'out' ? 'translateX(-100%)' : 'translateX(0%)';
    el.style.opacity    = direction === 'out' ? '0' : '1';
  };

  /* ── 0 → 1: Home → About ── */
  const goToAbout = useCallback(() => {
    setAboutShouldAnimate(true);
    setSection(1);
    if (aboutRef.current) aboutRef.current.style.transform = 'translateX(0%)';
    setOpacity(aboutRef.current, 1, FADE_MS);
    setTimeout(() => { setOpacity(homeRef.current, 0, 300); }, FADE_MS);
  }, []);

  /* ── 1 → 2: About → Video Fullscreen ── */
  const goToVideo = useCallback(() => {
    setSection(2);
    setVideoPlaying(true);
    setVideoSplit(false);
    setOpacity(homeRef.current, 0, 0);
    setOpacity(videoRef.current, 1, 0);
    if (worksRef.current) {
      worksRef.current.style.transition = 'none';
      worksRef.current.style.transform  = 'none';
      worksRef.current.style.opacity    = '0';
    }
    slideVideo(videoRef.current, 'in');
    slideAbout(aboutRef.current, 'out');
  }, []);

  /* ── 2 → 3: Video Fullscreen → Minimized (Split View) ── */
  const splitVideo = useCallback(() => {
    setVideoSplit(true);
  }, []);

  /* ── 3 → 2: Video Minimized → Fullscreen ── */
  const unsplitVideo = useCallback(() => {
    setVideoSplit(false);
  }, []);

  /* ── 3 → 4: Video Minimized → Works (Scroll-driven entrance handled by Works) ── */
  const goToWorks = useCallback(() => {
    setSection(3);
    if (worksRef.current) {
      worksRef.current.style.transition = 'none';
      worksRef.current.style.transform  = 'none';
      worksRef.current.style.opacity    = '1';
    }
  }, []);

  /* ── 4 → 3: Works → Video Minimized (Back when scroll reaches 0) ── */
  const goBackToVideo = useCallback(() => {
    // Lock transitions for 850ms so scroll momentum does not carry over to big player
    isLockedRef.current = true;
    setTimeout(() => {
      isLockedRef.current = false;
    }, 850);

    stepRef.current = 3;
    setVideoPlaying(true);
    setVideoSplit(true);

    // Fast, crisp fade so works disappears cleanly and mini player is instantly ready
    if (worksRef.current) {
      worksRef.current.style.transition = 'opacity 180ms ease-out';
      worksRef.current.style.opacity    = '0';
      worksRef.current.style.pointerEvents = 'none';
    }
    if (videoRef.current) {
      videoRef.current.style.transition = 'opacity 180ms ease-out';
      videoRef.current.style.opacity    = '1';
      videoRef.current.style.pointerEvents = 'auto';
    }
    setSection(2);
  }, []);

  /* ── Continuous entrance progress from Works (0%→25%) ── */
  const onWorksEntranceProgress = useCallback((progress: number) => {
    // As user scrolls from 0%→25%, Works cards rise from bottom.
    // Video fades out simultaneously according to scroll.
    // If scroll pauses, video opacity & cards vertical position pause!
    if (videoRef.current) {
      videoRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.25));
      videoRef.current.style.pointerEvents = progress < 0.05 ? 'auto' : 'none';
    }
  }, []);

  /* ── 2 → 1: Video Fullscreen → About ── */
  const goBackToAbout = useCallback(() => {
    setAboutShouldAnimate(false);
    setVideoPlaying(false);
    setVideoSplit(false);
    slideVideo(videoRef.current, 'out');
    slideAbout(aboutRef.current, 'in');
    setTimeout(() => {
      setSection(1);
    }, SLIDE_MS);
  }, []);

  /* ── 1 → 0: About → Home ── */
  const goToHome = useCallback(() => {
    setOpacity(homeRef.current, 1, FADE_MS);
    setOpacity(aboutRef.current, 0, FADE_MS);
    setTimeout(() => { setSection(0); }, FADE_MS);
  }, []);

  /* ── Pre-warm Assets (Video & Project Images) ── */
  useEffect(() => {
    try {
      const v = document.createElement("video");
      v.src = "/assets/video.mp4";
      v.preload = "auto";
      v.load();
    } catch {}

    const projectImages = [
      "/projects/Screenshot 2026-11-14 at 4.21.40 PM.png",
      "/projects/Cafe Website.png",
      "/projects/Photographer Portfolio.png",
      "/projects/Portfolio Website.png",
      "/projects/Design Studio.png",
      "/projects/Portfolio Design.png",
    ];

    projectImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
    });
  }, []);

  /* ── Wheel trigger (No cursor movement required) ── */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // 1. If currently in transition lock, ignore all wheel events
      if (isLockedRef.current) return;

      // 2. Ignore micro-jitters / accidental touches (< 18px threshold for responsive first swipe)
      if (Math.abs(e.deltaY) < 18) return;

      // 3. Lock for the transition duration
      isLockedRef.current = true;
      setTimeout(() => {
        isLockedRef.current = false;
      }, LOCK_MS);

      if (e.deltaY > 0) {
        // Forward: 0 → 1 → 2 → 3 → 4 (Step 4 Works handles card movement & triggers Step 5 at 70%)
        if (stepRef.current === 0) {
          stepRef.current = 1;
          goToAbout();
        } else if (stepRef.current === 1) {
          stepRef.current = 2;
          goToVideo();
        } else if (stepRef.current === 2) {
          stepRef.current = 3;
          splitVideo();
        } else if (stepRef.current === 3) {
          stepRef.current = 4;
          goToWorks();
        }
      } else {
        // Backward: 3 → 2 → 1 → 0 (Works handles its own card scroll + onPrevSection callback)
        if (stepRef.current === 3) {
          stepRef.current = 2;
          unsplitVideo();
        } else if (stepRef.current === 2) {
          stepRef.current = 1;
          goBackToAbout();
        } else if (stepRef.current === 1) {
          stepRef.current = 0;
          goToHome();
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goToAbout, goToVideo, splitVideo, unsplitVideo, goToWorks, goBackToAbout, goToHome]);

  /* ── Touch trigger (Mobile / Touchscreen) ── */
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (isLockedRef.current) return;
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 35) return;

      isLockedRef.current = true;
      setTimeout(() => {
        isLockedRef.current = false;
      }, LOCK_MS);

      if (dy > 0) {
        if (stepRef.current === 0) {
          stepRef.current = 1;
          goToAbout();
        } else if (stepRef.current === 1) {
          stepRef.current = 2;
          goToVideo();
        } else if (stepRef.current === 2) {
          stepRef.current = 3;
          splitVideo();
        } else if (stepRef.current === 3) {
          stepRef.current = 4;
          goToWorks();
        }
      } else {
        // Backward: Works handles its own card scroll + onPrevSection callback
        if (stepRef.current === 3) {
          stepRef.current = 2;
          unsplitVideo();
        } else if (stepRef.current === 2) {
          stepRef.current = 1;
          goBackToAbout();
        } else if (stepRef.current === 1) {
          stepRef.current = 0;
          goToHome();
        }
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goToAbout, goToVideo, splitVideo, unsplitVideo, goToWorks, goBackToAbout, goToHome]);

  /* ── Lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      {/* ── Home (z-10) ── */}
      <div
        ref={homeRef}
        className="fixed inset-0 z-10"
        style={{ opacity: 1, pointerEvents: section === 0 ? 'auto' : 'none' }}
      >
        <HeroSection />
      </div>

      {/* ── About (z-20) ── */}
      <div
        ref={aboutRef}
        className="fixed inset-0 z-20"
        style={{ opacity: 0, transform: 'translateX(0%)', pointerEvents: section === 1 ? 'auto' : 'none' }}
      >
        <About isVisible={section === 1} animate={aboutShouldAnimate} />
      </div>

      {/* ── Video section (z-30) — starts off-screen to the right ── */}
      <div
        ref={videoRef}
        className="fixed inset-0 z-30"
        style={{ transform: 'translateX(100%)', opacity: 0, pointerEvents: section === 2 ? 'auto' : 'none' }}
      >
        <Video isPlaying={videoPlaying} isSplit={videoSplit} />
      </div>

      {/* ── Works section (z-40) — 3D Curved Cylinder Carousel ending with VideoWorks expansion ── */}
      <div
        ref={worksRef}
        className="fixed inset-0 z-40 overflow-hidden"
        style={{ opacity: 0, pointerEvents: section === 3 ? 'auto' : 'none' }}
      >
        <Work
          isActive={section === 3}
          onPrevSection={goBackToVideo}
          onEntranceProgress={onWorksEntranceProgress}
        />
      </div>
    </>
  );
}

