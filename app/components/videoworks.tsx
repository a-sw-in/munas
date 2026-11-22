"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Film,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Footer from "./footer";

export interface VideoWorksProps {
  isExpanded?: boolean;
  onReturn?: () => void;
}

export interface VideoProject {
  id: string;
  title: string;
  category: string;
  role: string;
  duration: string;
  year: string;
  aspect: string;
  camera: string;
  client: string;
  synopsis: string;
  poster: string;
  tags: string[];
}

const FEATURED_VIDEOS: VideoProject[] = [
  {
    id: "acid-record",
    title: "ACID Record",
    category: "Music Film & Performance",
    role: "Director of Photography",
    duration: "03:42",
    year: "2026",
    aspect: "2.39:1 Anamorphic",
    camera: "Arri Alexa 35 · Hawk V-Lite",
    client: "Warp & Ghost Records",
    synopsis:
      "A visceral neon-drenched exploration of underground soundscapes, captured on 35mm high-contrast tungsten stock with custom anamorphic lens flares.",
    poster: "/projects/Photographer Portfolio.png",
    tags: ["35mm Anamorphic", "Dolby Vision", "Music Film"],
  },
  {
    id: "echo-spatial",
    title: "Echo Spatial Architecture",
    category: "Architectural & Spatial Film",
    role: "Cinematography & Color",
    duration: "02:18",
    year: "2025",
    aspect: "2.00:1 Univisium",
    camera: "RED V-Raptor 8K · Leica Summilux-C",
    client: "Studio Kroma Architecture",
    synopsis:
      "Brutalist concrete monoliths meet soft natural morning mist in an ambient visual study of acoustic resonance, negative space, and shadow architecture.",
    poster: "/projects/Design Studio.png",
    tags: ["Spatial Cinema", "Monochrome Grade", "8K VistaVision"],
  },
  {
    id: "nocturne-film",
    title: "Nocturne Series",
    category: "Analog 35mm Narrative Film",
    role: "Visual Direction & Analog Color",
    duration: "04:55",
    year: "2025",
    aspect: "1.33:1 Academy",
    camera: "Arriflex 416 · Kodak Vision3 500T",
    client: "Independent Film Collective",
    synopsis:
      "Shot entirely during blue hour across Tokyo backstreets, capturing transient human encounters through film grain, rain reflections, and sodium-vapor luminescence.",
    poster: "/projects/Cafe Website.png",
    tags: ["Kodak 500T", "Tokyo Blue Hour", "Analog 35mm"],
  },
  {
    id: "horizon-kinetic",
    title: "Horizon Kinetic Motion",
    category: "Commercial Automotive & Motion",
    role: "Lead Camera & Gimbal Rig",
    duration: "01:30",
    year: "2024",
    aspect: "2.39:1 Scope",
    camera: "Sony Venice 2 · Technocrane 38'",
    client: "Horizon Mobility Studio",
    synopsis:
      "High-speed pursuit across dry lake beds at dawn, synchronizing robotic arm crane movements with aerodynamic vehicle dynamics and morning sandstorms.",
    poster: "/projects/ICHHA Brand.png",
    tags: ["Technocrane", "High-Speed Cinema", "Venice 2"],
  },
  {
    id: "solstice-ritual",
    title: "Solstice Ritual",
    category: "Fashion & Experimental Cinema",
    role: "Cinematographer & Lighting Director",
    duration: "02:40",
    year: "2024",
    aspect: "1.85:1 Flat",
    camera: "Panavision DXL2 · Primo 70",
    client: "Maison De L'Ombre",
    synopsis:
      "Haute couture garments juxtaposed against volcanic black-sand coastlines, sculpted with massive diffused tungsten arrays and natural oceanic wind.",
    poster: "/projects/Portfolio Design.png",
    tags: ["Fashion Cinema", "Primo 70 Optics", "Natural Elements"],
  },
];

export default function VideoWorks({
  isExpanded = true,
  onReturn,
}: VideoWorksProps) {
  // Current active project index (0, 1, 2, ...)
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  // Animated continuous wheel position for the 3D wave rotation
  const [wheelPos, setWheelPos] = useState(0);
  const wheelPosRef = useRef(0);
  wheelPosRef.current = wheelPos;

  // Scroll lock to ensure a single small scroll cleanly steps 1 video at a time
  const scrollLockRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Video playback states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoTime, setVideoTime] = useState("00:00");
  const [isCardHovered, setIsCardHovered] = useState(false);

  // ── Footer Split-Reveal Expansion States (Center Slit Window) ──
  const [footerProgress, setFooterProgress] = useState(0);
  const footerProgressRef = useRef(0);
  const targetFooterProgress = useRef(0);
  const footerAnimFrame = useRef<number | null>(null);

  const startFooterPhysics = useCallback(() => {
    if (footerAnimFrame.current) return;

    const tick = () => {
      const diff = targetFooterProgress.current - footerProgressRef.current;
      if (Math.abs(diff) < 0.001) {
        footerProgressRef.current = targetFooterProgress.current;
        setFooterProgress(targetFooterProgress.current);
        footerAnimFrame.current = null;
        return;
      }
      footerProgressRef.current += diff * 0.22;
      setFooterProgress(footerProgressRef.current);
      footerAnimFrame.current = requestAnimationFrame(tick);
    };

    footerAnimFrame.current = requestAnimationFrame(tick);
  }, []);

  // ── Zoom Pop-Out States ──
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPhase, setZoomPhase] = useState<"idle" | "opening" | "open" | "closing">("idle");
  const [originRect, setOriginRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [isLargeHovered, setIsLargeHovered] = useState(false);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const zoomedVideoRef = useRef<HTMLVideoElement | null>(null);

  // Zoom pop-out handlers
  const openZoom = useCallback(() => {
    if (isZoomed || zoomPhase !== "idle") return;
    const rect = activeCardRef.current?.getBoundingClientRect();
    if (rect) {
      setOriginRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setOriginRect({
        top: typeof window !== "undefined" ? window.innerHeight / 2 - 135 : 200,
        left: typeof window !== "undefined" ? window.innerWidth / 2 - 240 : 200,
        width: 480,
        height: 270,
      });
    }
    // Pause wheel video immediately to prevent dual/multiple audio
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsLargeHovered(true);
    setIsZoomed(true);
    setZoomPhase("opening");

    // Next frame: animate smoothly to center
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setZoomPhase("open");
      });
    });
  }, [isZoomed, zoomPhase]);

  const closeZoom = useCallback(() => {
    if (!isZoomed || zoomPhase === "closing") return;
    setIsLargeHovered(false);
    // Capture time and sync back immediately to wheel video
    if (zoomedVideoRef.current && videoRef.current) {
      videoRef.current.currentTime = zoomedVideoRef.current.currentTime;
      zoomedVideoRef.current.pause();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
    setZoomPhase("closing");
    setTimeout(() => {
      setIsZoomed(false);
      setZoomPhase("idle");
    }, 480);
  }, [isZoomed, zoomPhase, isPlaying]);

  // Sync video time & play state when opening zoom (strictly one audio source)
  useEffect(() => {
    if (zoomPhase === "opening") {
      if (videoRef.current && zoomedVideoRef.current) {
        zoomedVideoRef.current.currentTime = videoRef.current.currentTime;
        videoRef.current.pause(); // Mute & pause underlying video
        if (isPlaying) {
          zoomedVideoRef.current.play().catch(() => {});
        }
      }
    }
  }, [zoomPhase, isPlaying]);

  // Sync video time & play state when closing zoom
  useEffect(() => {
    if (zoomPhase === "closing") {
      if (zoomedVideoRef.current && videoRef.current) {
        videoRef.current.currentTime = zoomedVideoRef.current.currentTime;
        zoomedVideoRef.current.pause();
        if (isPlaying) {
          videoRef.current.play().catch(() => {});
        }
      }
    }
  }, [zoomPhase, isPlaying]);


  // Slow, smooth harmonic wave easing transition (Perlin SmootherStep: 6t^5 - 15t^4 + 10t^3)
  const goToProject = useCallback((targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= FEATURED_VIDEOS.length) return;

    const start = wheelPosRef.current;
    const end = targetIndex;
    const startTime = performance.now();
    // Fast, snappy speed on mobile (260ms), smooth cinematic wave transition on desktop (500ms)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const duration = isMobile ? 260 : 500;

    setActiveIndex(targetIndex);
    setIsCardHovered(false);
    targetFooterProgress.current = 0;
    footerProgressRef.current = 0;
    setFooterProgress(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // SmootherStep wave curve: zero velocity and acceleration at start & end
      const waveEase = t * t * t * (t * (t * 6 - 15) + 10);
      const current = start + (end - start) * waveEase;

      wheelPosRef.current = current;
      setWheelPos(current);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        wheelPosRef.current = end;
        setWheelPos(end);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Video timecode and progress update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      setProgress(pct);

      const mins = Math.floor(video.currentTime / 60);
      const secs = Math.floor(video.currentTime % 60);
      setVideoTime(
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Calibrated card-by-card snap with reduced scroll sensitivity on PC
  useEffect(() => {
    if (!isExpanded || isZoomed) return;

    let wheelAccumulator = 0;
    let wheelCooldown = 0;
    let resetTimer: NodeJS.Timeout | null = null;

    const handleWheel = (e: WheelEvent) => {
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 28;
      else if (e.deltaMode === 2) dy *= window.innerHeight;

      // Ignore micro-jitters
      if (Math.abs(dy) < 8) return;

      const now = performance.now();

      // Guard against wheel momentum immediately after expanding into VideoWorks
      if (Date.now() - expandedAtRef.current < 550) return;

      // If already in cooldown from a video switch or footer transition, ignore momentum
      if (now < wheelCooldown || scrollLockRef.current) return;

      // Accumulate scroll input to prevent unintended micro-scrolls
      wheelAccumulator += dy;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 200);

      // Substantially reduced sensitivity threshold (requires deliberate 60px gesture on PC)
      const WHEEL_THRESHOLD = 60;
      if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) return;

      const isDown = wheelAccumulator > 0;
      wheelAccumulator = 0;

      // ── PHASE: FOOTER EXPANDED OR EXPANDING ──
      if (footerProgressRef.current > 0.001) {
        wheelCooldown = now + 620;
        if (isDown) {
          // Scroll down: expand footer window decisively to full
          targetFooterProgress.current = 1;
          startFooterPhysics();
        } else {
          // Scroll up: close footer window decisively back to 0
          targetFooterProgress.current = 0;
          startFooterPhysics();
        }
        return;
      }

      if (isDown) {
        // Scroll DOWN -> wave transition to next video
        if (activeIndexRef.current < FEATURED_VIDEOS.length - 1) {
          wheelCooldown = now + 620;
          scrollLockRef.current = true;
          goToProject(activeIndexRef.current + 1);
          setTimeout(() => {
            scrollLockRef.current = false;
          }, 560);
        } else {
          // Reached bottom of video works -> scroll down initiates swift Footer slit opening!
          wheelCooldown = now + 620;
          targetFooterProgress.current = 1;
          startFooterPhysics();
        }
      } else {
        // Scroll UP -> wave transition to previous video or return to carousel
        if (activeIndexRef.current > 0) {
          wheelCooldown = now + 620;
          scrollLockRef.current = true;
          goToProject(activeIndexRef.current - 1);
          setTimeout(() => {
            scrollLockRef.current = false;
          }, 560);
        } else {
          // At project 0, scroll up returns to carousel!
          if (onReturn) onReturn();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isExpanded, isZoomed, goToProject, onReturn, startFooterPhysics]);

  // Expanded timestamp to prevent entry gestures from leaking into onReturn
  const expandedAtRef = useRef(0);
  useEffect(() => {
    if (isExpanded) {
      expandedAtRef.current = Date.now();
      scrollLockRef.current = true;
      const t = setTimeout(() => {
        scrollLockRef.current = false;
      }, 550);
      return () => clearTimeout(t);
    }
  }, [isExpanded]);

  // Touch gesture swipe on mobile: 1 clean swipe = 1 video transition
  useEffect(() => {
    if (!isExpanded || isZoomed) return;
    let startY = 0;
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (scrollLockRef.current) return;
      // Guard against touch gestures leaking immediately after expanding
      if (Date.now() - expandedAtRef.current < 350) return;

      const dy = startY - e.changedTouches[0].clientY;
      const dx = startX - e.changedTouches[0].clientX;

      // Ignore micro taps or horizontal swipes
      if (Math.abs(dy) < 24 || Math.abs(dy) < Math.abs(dx)) return;

      if (dy > 0) {
        // Swipe UP -> next video OR footer opening at bottom
        if (footerProgressRef.current > 0.001) {
          targetFooterProgress.current = 1;
          startFooterPhysics();
          return;
        }
        if (activeIndexRef.current < FEATURED_VIDEOS.length - 1) {
          scrollLockRef.current = true;
          goToProject(activeIndexRef.current + 1);
          setTimeout(() => {
            scrollLockRef.current = false;
          }, 270);
        } else {
          // Bottom reached -> open footer window swiftly
          targetFooterProgress.current = 1;
          startFooterPhysics();
        }
      } else {
        // Swipe DOWN -> previous video OR footer closing OR return to carousel
        if (footerProgressRef.current > 0.001) {
          targetFooterProgress.current = 0;
          startFooterPhysics();
          return;
        }
        if (activeIndexRef.current > 0) {
          scrollLockRef.current = true;
          goToProject(activeIndexRef.current - 1);
          setTimeout(() => {
            scrollLockRef.current = false;
          }, 270);
        } else {
          // At project 0: deliberate downward swipe returns to carousel
          if (dy < -40 && onReturn) {
            scrollLockRef.current = true;
            onReturn();
            setTimeout(() => {
              scrollLockRef.current = false;
            }, 450);
          }
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isExpanded, isZoomed, goToProject, onReturn, startFooterPhysics]);

  // Keyboard navigation
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          closeZoom();
          return;
        }
        if (footerProgressRef.current > 0.001) {
          targetFooterProgress.current = 0;
          startFooterPhysics();
          return;
        }
        if (onReturn) onReturn();
        return;
      }

      if (isZoomed) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (footerProgressRef.current > 0.001 || activeIndexRef.current === FEATURED_VIDEOS.length - 1) {
          targetFooterProgress.current = Math.min(1, targetFooterProgress.current + 0.35);
          startFooterPhysics();
        } else if (activeIndexRef.current < FEATURED_VIDEOS.length - 1) {
          goToProject(activeIndexRef.current + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (footerProgressRef.current > 0.001) {
          targetFooterProgress.current = Math.max(0, targetFooterProgress.current - 0.35);
          startFooterPhysics();
        } else if (activeIndexRef.current > 0) {
          goToProject(activeIndexRef.current - 1);
        } else if (onReturn) {
          onReturn();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, isZoomed, closeZoom, goToProject, onReturn, startFooterPhysics]);

  // 3D Cylinder & Wave geometry parameters
  const cylinderRadius = 410;
  const stepAngleDeg = 38;

  return (
    <div
      className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between select-none"
      style={{
        backgroundColor: "#050506",
        color: "#ffffff",
        alignItems: "center"
      }}
    >
      {/* ── Ambient Background Radiance ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full blur-[140px] pointer-events-none opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.1) 50%, transparent 75%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050506]/90 via-transparent to-[#050506]/90 pointer-events-none" />
      </div>

      {/* ── Top-Right Circle Mute / Unmute Button (Visible in Minimized View) ── */}
      <div
        className="fixed top-5 right-5 sm:top-7 sm:right-8 z-30 transition-all duration-300 pointer-events-auto"
        style={{
          opacity: isZoomed ? 0 : Math.max(0, 1 - footerProgress * 2.5),
          pointerEvents: isZoomed || footerProgress > 0.05 ? "none" : "auto",
          transform: isZoomed ? "scale(0.8)" : "scale(1)",
        }}
      >
        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-red-500/60 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.7)] hover:scale-108 active:scale-95"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white/70 group-hover:text-red-400 transition-colors" />
          ) : (
            <Volume2 className="w-5 h-5 text-red-500 group-hover:text-red-400 transition-colors" />
          )}
        </button>
      </div>

      {/* ── Main Dual Wheel Stage: Left Video Wheel & Right Pure Typography ── */}
      <main className="relative z-20 flex-1 w-[100vw] items-center max-w-5xl xl:max-w-6xl mx-auto flex flex-col lg:flex-row justify-center px-6 sm:px-10 py-2 gap-8 lg:gap-14 overflow-hidden"
      >
        {/* ========================================================= */}
        {/* LEFT SIDE: 3D SLOW WAVE VIDEO MOVEMENT (CENTERED)         */}
        {/* Swipes out to LEFT as footer expands                     */}
        {/* ========================================================= */}
        <section
          className="relative w-full lg:w-1/2 h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center will-change-transform"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            marginLeft: "0rem",
            transform: footerProgress > 0 ? `translateX(-${footerProgress * 115}%)` : undefined,
            opacity: footerProgress > 0 ? Math.max(0, 1 - footerProgress * 1.3) : undefined,
          }}
          aria-label="Video Wheel"
        >
          {FEATURED_VIDEOS.map((project, index) => {
            const offset = index - wheelPos;
            if (Math.abs(offset) > 2.2) return null;

            const angleDeg = offset * stepAngleDeg;
            const angleRad = (angleDeg * Math.PI) / 180;

            // Base cylinder positioning
            const baseY = Math.sin(angleRad) * cylinderRadius;
            const baseZ = (Math.cos(angleRad) - 1) * 330;
            const baseRotX = -angleDeg * 0.85;

            // Wave dynamics: gentle undulating crest in depth & wave slope tilt
            const waveSwell = Math.sin(offset * 2.1) * 10;
            const waveY = baseY + waveSwell;
            const waveCrestZ = baseZ + Math.cos(Math.min(Math.PI / 2, Math.abs(offset) * 1.2)) * 18;
            const waveTiltX = baseRotX + Math.sin(offset * Math.PI) * 4.5;
            const waveTiltZ = Math.sin(offset * 1.8) * 1.2;

            const scale = Math.max(0.72, Math.pow(Math.cos(angleRad), 0.65));
            const opacity = Math.max(0, Math.pow(Math.cos(angleRad), 2.2));
            const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
            const isActive = index === activeIndex;
            const zIndex = Math.round((1 - Math.abs(offset) / 3) * 50);

            return (
              <div
                key={project.id}
                ref={isActive ? activeCardRef : undefined}
                onClick={() => {
                  if (!isActive) {
                    goToProject(index);
                  } else {
                    openZoom();
                  }
                }}
                onMouseEnter={() => {
                  if (isActive) setIsCardHovered(true);
                }}
                onMouseLeave={() => {
                  if (isActive) setIsCardHovered(false);
                }}
                className={`absolute w-full max-w-[440px] lg:max-w-[480px] aspect-[16/9] rounded-2xl overflow-hidden will-change-transform ${
                  isActive
                    ? "cursor-default shadow-[0_30px_70px_-15px_rgba(220,38,38,0.3),0_0_0_1px_rgba(255,255,255,0.25)]"
                    : "cursor-pointer hover:border-white/30 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.85)]"
                }`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate3d(0, ${waveY}px, ${waveCrestZ}px) rotateX(${waveTiltX}deg) rotateZ(${waveTiltZ}deg) scale(${scale})`,
                  opacity: isActive && isZoomed ? 0.2 : opacity,
                  filter: "none",
                  zIndex,
                  backgroundColor: "#0d0e12",
                  border: isActive
                    ? "1px solid rgba(255, 255, 255, 0.25)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Poster image background for continuous visual continuity */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${project.poster}")`,
                    filter: isActive ? "brightness(0.85)" : "brightness(0.5)",
                  }}
                />

                {/* Active Video Player with smooth playback */}
                {isActive && (
                  <div className="absolute inset-0">
                    <video
                      ref={videoRef}
                      src="/assets/video.mp4"
                      autoPlay
                      loop
                      muted={isZoomed ? true : isMuted}
                      playsInline
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />

                    {/* Subtle cinematic gradient overlay on hover */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none z-0"
                      style={{
                        opacity: isCardHovered ? 1 : 0,
                        transition: "opacity 280ms ease-in-out",
                      }}
                    />

                    {/* Cinematic top overlay with Zoom Button (visible on hover) */}
                    <div
                      className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-xs font-mono z-20"
                      style={{
                        opacity: isMobile ? 1 : (isCardHovered ? 1 : 0),
                        transition: "opacity 280ms ease-in-out",
                        pointerEvents: isMobile ? "auto" : (isCardHovered ? "auto" : "none"),
                      }}
                    >

                      {/* Zoom Out / Pop Out Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openZoom();
                        }}
                        className="inline-flex items-center m-5 gap-1.5 px-2.5 py-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white/90 hover:text-white backdrop-blur-md border border-white/20 hover:border-red-500 transition-all cursor-pointer shadow-lg hover:scale-105 pointer-events-auto"
                        title="Zoom out / pop out video to center"
                      >
                        <Maximize2 className="w-4.5 h-3.5 text-red-400 group-hover:text-white" />
                      </button>
                    </div>

                    {/* Center Play/Pause button (visible on hover only) */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (videoRef.current) {
                          if (isPlaying) {
                            videoRef.current.pause();
                            setIsPlaying(false);
                          } else {
                            const p = videoRef.current.play();
                            if (p !== undefined) p.catch(() => {});
                            setIsPlaying(true);
                          }
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                      style={{
                        opacity: isCardHovered ? 1 : 0,
                        pointerEvents: isCardHovered ? "auto" : "none",
                        transition: "opacity 240ms ease-in-out",
                      }}
                    >
                      <div className="w-13 h-13 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-transform hover:scale-110">
                        {isPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        )}
                      </div>
                    </div>

                   
                  </div>
                )}

                {/* Non-active video item card preview on wheel */}
                {!isActive && (
                  <div className="absolute inset-0 p-4 flex flex-col justify-between bg-black/40">
                    <div className="flex items-center justify-between text-xs font-mono text-white/50">
                      <span>0{index + 1}</span>
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-white/10 text-white/75 flex items-center justify-center border border-white/20">
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                      </div>
                    </div>
                    <h5 className="text-xs font-bold text-white/70 truncate font-mono">
                      {project.title}
                    </h5>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* ========================================================= */}
        {/* RIGHT SIDE: PURE TYPOGRAPHY (CENTERED SYMMETRICALLY)      */}
        {/* Swipes out to RIGHT as footer expands                     */}
        {/* ========================================================= */}
        <section
          className="relative w-full lg:w-1/2 h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center will-change-transform"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            marginLeft: "3rem",
            transform: footerProgress > 0 ? `translateX(${footerProgress * 115}%)` : undefined,
            opacity: footerProgress > 0 ? Math.max(0, 1 - footerProgress * 1.3) : undefined,
          }}
          aria-label="Project Text Showcase"
        >
          {FEATURED_VIDEOS.map((project, index) => {
            const offset = index - wheelPos;
            // No previous or next text visibility when resting; only active text is visible
            if (Math.abs(offset) >= 0.8) return null;

            // Harmonious wave displacement for typography during transition
            const textWaveY = offset * 110 + Math.sin(offset * Math.PI) * 8;
            const textTiltX = -offset * 8;
            // Opacity smoothly drops to 0 before adjacent offset, ensuring no lingering text
            const opacity = Math.pow(Math.max(0, 1 - Math.abs(offset) * 1.35), 1.5);
            const scale = Math.max(0.92, 1 - Math.abs(offset) * 0.08);
            const isActive = index === activeIndex;

            return (
              <div
                key={`text-${project.id}`}
                className={`absolute w-full max-w-[440px] lg:max-w-[480px] text-left will-change-transform ${
                  isActive ? "cursor-default pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate3d(0, ${textWaveY}px, 0) rotateX(${textTiltX}deg) scale(${scale})`,
                  opacity,
                }}
              >
                
                {/* 2. Bold Commanding Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-red-600 tracking-tight leading-none mb-2">
                  {project.title}
                </h2>

                
                {/* 4. Editorial Synopsis */}
                <p className="text-xs sm:text-sm lg:text-base text-white/70 font-normal leading-relaxed mb-6">
                  {project.synopsis}
                </p>

               
               
              </div>
            );
          })}
        </section>
      </main>

      {/* ========================================================= */}
      {/* RIGHT MARGIN: MINIMAL POSITION WHEEL TRACK (OUTSIDE MAIN) */}
      {/* ========================================================= */}
      <aside
        className="hidden md:flex flex-col items-center gap-3 fixed right-6 sm:right-8 top-1/2 -translate-y-1/2 z-30 transition-opacity duration-300"
        style={{
          opacity: footerProgress > 0 ? Math.max(0, 1 - footerProgress * 2.5) : 1,
          pointerEvents: footerProgress > 0.05 ? "none" : "auto",
        }}
        aria-label="Wheel Navigator"
      >
          <button
            onClick={() => {
              if (activeIndex > 0) {
                goToProject(activeIndex - 1);
              }
            }}
            disabled={activeIndex === 0}
            className={`w-7 h-7 rounded-full border border-white/10 flex items-center justify-center transition-all ${
              activeIndex === 0
                ? "bg-white/[0.02] text-white/20 cursor-default"
                : "bg-white/5 hover:bg-white/15 text-white/60 hover:text-white cursor-pointer"
            }`}
            title={activeIndex === 0 ? "First Video (Scroll up to return)" : "Previous Video"}
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          <div className="flex flex-col items-center gap-2.5 py-1">
            {FEATURED_VIDEOS.map((_, i) => {
              const isSelected = i === activeIndex;
              return (
                <button
                  key={i}
                  onClick={() => goToProject(i)}
                  className="group relative flex items-center justify-center cursor-pointer p-0.5"
                  title={`0${i + 1}`}
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isSelected
                        ? "w-2.5 h-2.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] scale-125"
                        : "w-1.5 h-1.5 bg-white/20 group-hover:bg-white/50"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              goToProject(Math.min(FEATURED_VIDEOS.length - 1, activeIndex + 1))
            }
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
            title="Next Video"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </aside>

      {/* ========================================================= */}
      {/* POP-OUT ZOOM THEATER MODAL                                */}
      {/* Flows from wheel card position to center, 75% size       */}
      {/* Reverses smoothly back into the wheel on close           */}
      {/* ========================================================= */}
      {isZoomed && originRect && (() => {
        const isOpen = zoomPhase === "open";
        const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        const targetWidth = Math.min(vw * 0.75, 1100);
        const targetHeight = targetWidth * (9 / 16);
        const targetTop = Math.max(20, (vh - targetHeight) / 2);
        const targetLeft = (vw - targetWidth) / 2;

        const currentTop = isOpen ? targetTop : originRect.top;
        const currentLeft = isOpen ? targetLeft : originRect.left;
        const currentWidth = isOpen ? targetWidth : originRect.width;
        const currentHeight = isOpen ? targetHeight : originRect.height;

        const currentProject = FEATURED_VIDEOS[activeIndex];

        return (
          <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
            {/* Backdrop: click outside to reverse animation back into the wheel */}
            <div
              onClick={closeZoom}
              className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500 ease-out cursor-pointer"
              style={{
                opacity: isOpen ? 1 : 0,
              }}
            />

            {/* Popped Out Video Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setIsLargeHovered(true)}
              onMouseLeave={() => setIsLargeHovered(false)}
              className="absolute rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.2),0_0_80px_rgba(220,38,38,0.25)] bg-[#0d0e12]"
              style={{
                top: `${currentTop}px`,
                left: `${currentLeft}px`,
                width: `${currentWidth}px`,
                height: `${currentHeight}px`,
                transition: "all 480ms cubic-bezier(0.16, 1, 0.3, 1)",
                transformOrigin: "center center",
              }}
            >
              {/* Poster image background for instant visual fidelity */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${currentProject.poster}")`,
                }}
              />

              {/* Synchronized Zoomed Video Player */}
              <video
                ref={zoomedVideoRef}
                src="/assets/video.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover relative z-0"
              />

              {/* Subtle top & bottom dark vignettes for controls readability (hidden when not hovered) */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none z-10 transition-opacity duration-300"
                style={{
                  opacity: isOpen && isLargeHovered ? 1 : 0,
                }}
              />

              {/* Top Bar with Return/Reverse Button (hidden when not hovered) */}
              <div
                className="absolute top-4 left-5 right-5 flex items-center justify-between z-20 transition-opacity duration-300"
                style={{
                  opacity: isOpen && isLargeHovered ? 1 : 0,
                  pointerEvents: isOpen && isLargeHovered ? "auto" : "none",
                }}
              >
                

                {/* Click again on button on player: reverse animation back to wheel */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeZoom();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white/90 hover:text-white backdrop-blur-md border border-white/20 hover:border-red-500 transition-all cursor-pointer shadow-lg hover:scale-105"
                  title="Reverse animation and return to wheel"
                >
                  <Minimize2 className="w-4 h-4 text-red-400 group-hover:text-white" />
                  <span className="text-xs font-mono font-bold tracking-wider">RETURN</span>
                </button>
              </div>

              {/* Center Play/Pause button (hidden when not hovered) */}
              <div
                onClick={() => {
                  if (zoomedVideoRef.current) {
                    if (isPlaying) {
                      zoomedVideoRef.current.pause();
                      setIsPlaying(false);
                    } else {
                      const p = zoomedVideoRef.current.play();
                      if (p !== undefined) p.catch(() => {});
                      setIsPlaying(true);
                    }
                  }
                }}
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 group"
                style={{
                  pointerEvents: isOpen && isLargeHovered ? "auto" : "none",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.7)] transition-all group-hover:scale-110"
                  style={{
                    opacity: isOpen && isLargeHovered ? 0.95 : 0,
                    transition: "opacity 300ms ease, transform 200ms ease",
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 ml-1 fill-current" />
                  )}
                </div>
              </div>

              {/* Bottom control bar (hidden when not hovered) */}
              <div
                className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs font-mono text-white/80 z-20 transition-opacity duration-300"
                style={{
                  opacity: isOpen && isLargeHovered ? 1 : 0,
                  pointerEvents: isOpen && isLargeHovered ? "auto" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted((prev) => !prev)}
                    className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 hover:border-white/30 text-white transition-all cursor-pointer"
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <span className="bg-black/50 px-2 py-0.5 rounded border border-white/10">
                    {videoTime} / {currentProject.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* FOOTER SPLIT-REVEAL EXPANDING WINDOW                      */}
      {/* Opens as a vertical line in center and widens to fullscreen*/}
      {/* ========================================================= */}
      {footerProgress > 0 && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          style={{
            clipPath: `inset(0% ${50 * (1 - footerProgress)}% 0% ${50 * (1 - footerProgress)}%)`,
            pointerEvents: footerProgress >= 0.85 ? "auto" : "none",
          }}
        >
          <div className="w-[100vw] h-[100vh] min-h-screen overflow-y-auto">
            <Footer />
          </div>
        </div>
      )}

      {/* Center slit vertical laser line(s) during opening/closing */}
      {footerProgress > 0 && footerProgress < 0.995 && (
        <>
          {footerProgress < 0.035 ? (
            /* Single razor-sharp glowing vertical line in the exact center */
            <div
              className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-white shadow-[0_0_15px_#ffffff,0_0_35px_rgba(255,255,255,0.9)] pointer-events-none z-50"
              style={{ opacity: Math.min(1, footerProgress * 40) }}
            />
          ) : (
            /* Dual splitting boundary lines moving outward as the window widens */
            <>
              <div
                className="fixed top-0 bottom-0 pointer-events-none z-50 w-[1.5px] bg-white/85 shadow-[0_0_14px_rgba(255,255,255,0.8)]"
                style={{ left: `calc(50% - ${50 * footerProgress}%)` }}
              />
              <div
                className="fixed top-0 bottom-0 pointer-events-none z-50 w-[1.5px] bg-white/85 shadow-[0_0_14px_rgba(255,255,255,0.8)]"
                style={{ left: `calc(50% + ${50 * footerProgress}%)` }}
              />
            </>
          )}
        </>
      )}

    </div>
  );
}
