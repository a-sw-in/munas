"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import VideoWorks from "./videoworks";

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  counter: string;
  image: string;
  liveUrl: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "robin-sebastian",
    title: "Robin Sebastian",
    subtitle: "Visual Artist & Creative Technologist",
    counter: "01 / 07",
    image: "/projects/Screenshot 2026-11-14 at 4.21.40 PM.png",
    liveUrl: "https://sencruzo.web.app/",
  },
  {
    id: "cafe-website",
    title: "Cafe Website",
    subtitle: "Artisanal Bakery & Specialty Coffee",
    counter: "02 / 07",
    image: "/projects/Cafe Website.png",
    liveUrl: "https://mochaandmiso.web.app/",
  },
  {
    id: "julian-vance",
    title: "Photographer Portfolio",
    subtitle: "Editorial & Analog Photography",
    counter: "03 / 07",
    image: "/projects/Photographer Portfolio.png",
    liveUrl: "https://julianvance.vercel.app/",
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    subtitle: "Personal Developer & Designer Portfolio",
    counter: "04 / 07",
    image: "/projects/Portfolio Website.png",
    liveUrl: "https://jishnumondal.vercel.app/",
  },
  {
    id: "design-studio",
    title: "Design Studio",
    subtitle: "Digital Product & Design Direction",
    counter: "05 / 07",
    image: "/projects/Design Studio.png",
    liveUrl: "https://echo-design-studio-ex.vercel.app/",
  },
  {
    id: "portfolio-design",
    title: "Portfolio Design",
    subtitle: "Brand Identity & Spatial Architecture",
    counter: "06 / 07",
    image: "/projects/Portfolio Design.png",
    liveUrl: "https://echooo.web.app/",
  },
  {
    id: "video-works",
    title: "Video Works",
    subtitle: "Cinematography & Creative Direction",
    counter: "07 / 07",
    image: "", // Window into the full VideoWorks view
    liveUrl: "#",
  },
];

const TOTAL = PROJECTS.length; // 7 cards (indices 0 to 6)
const SLICES = 8;

// Carousel scroll positions:
// 0.0 → 6.0: horizontal carousel of 7 cards (Robin Sebastian → Video Works)
// 6.0 → 7.4: Video Works card window expands wider & wider until it vanishes into fullscreen
const CAROUSEL_END = 6.0;   // 100% of carousel (Card 6 in center)
const EXPAND_END   = 7.4;   // Fullscreen window expansion complete
const REAL_MAX     = EXPAND_END; // Maximum scroll position

export interface WorkProps {
  isActive?: boolean;
  onPrevSection?: () => void;
  onExitProgress?: (ratio: number) => void;
  onEntranceProgress?: (progress: number) => void;
}

export default function Work({
  isActive = true,
  onPrevSection,
  onExitProgress,
  onEntranceProgress,
}: WorkProps) {
  const [currentPos, setCurrentPos] = useState(0);
  const currentPosRef = useRef(0);
  const targetPos = useRef(0);
  const animFrame = useRef<number | null>(null);

  // Discrete swipe tracking: no continuous touch sync during dragging
  const isPointerDown = useRef(false);
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);
  const swipeStartTime = useRef(0);
  const hasSwiped = useRef(false);
  const lastActionTime = useRef(0);

  // Ignore first scroll on PC after entering Works
  const hasIgnoredFirstScroll = useRef(false);
  const firstScrollEndTime = useRef(0);

  useEffect(() => {
    if (isActive) {
      hasIgnoredFirstScroll.current = false;
      firstScrollEndTime.current = 0;
    }
  }, [isActive]);

  // Card spacing & Viewport tracking
  const [cardSpacing, setCardSpacing] = useState(540);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });

  // Pre-decode project images on mount to prevent GPU texture upload stalls
  useEffect(() => {
    PROJECTS.forEach((p) => {
      if (!p.image) return;
      const img = new window.Image();
      img.src = p.image;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ w: width, h: height });
      if (width < 640) setCardSpacing(width * 0.88);
      else if (width < 1024) setCardSpacing(width * 0.62);
      else setCardSpacing(Math.min(560, width * 0.44));
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Smooth animation loop to glide the card cleanly to the center
  const startPhysics = useCallback(() => {
    if (animFrame.current) return;

    const tick = () => {
      const diff = targetPos.current - currentPosRef.current;
      if (Math.abs(diff) < 0.001) {
        currentPosRef.current = targetPos.current;
        setCurrentPos(targetPos.current);
        animFrame.current = null;
        return;
      }
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const baseEase = isMobile ? 0.18 : 0.15;

      // When expanding into fullscreen VideoWorks, increase speed by 20%
      const isExpanding = targetPos.current >= EXPAND_END - 0.05;
      const ease = isExpanding ? baseEase * 1.20 : baseEase;

      currentPosRef.current += diff * ease;
      setCurrentPos(currentPosRef.current);
      animFrame.current = requestAnimationFrame(tick);
    };

    animFrame.current = requestAnimationFrame(tick);
  }, []);

  // Navigate directly to an integer card index (centering it)
  const goToCard = useCallback((index: number) => {
    const next = Math.max(0, Math.min(REAL_MAX, index));
    targetPos.current = next;
    startPhysics();
  }, [startPhysics]);

  // Swipe Forward: advance to next card (or expand to VideoWorks from card 6)
  const nextCard = useCallback(() => {
    if (currentPosRef.current >= EXPAND_END - 0.05) return;
    const cur = targetPos.current;
    if (cur >= CAROUSEL_END - 0.1) {
      // Automatically expand window card to fullscreen with increased speed
      goToCard(EXPAND_END);
    } else {
      goToCard(Math.round(cur) + 1);
    }
  }, [goToCard]);

  // Swipe Backward: return to previous card (or return to previous section at card 0)
  const prevCard = useCallback(() => {
    if (currentPosRef.current >= EXPAND_END - 0.05) return;
    const cur = Math.round(targetPos.current);
    if (cur <= 0) {
      if (onPrevSection) onPrevSection();
    } else {
      goToCard(cur - 1);
    }
  }, [goToCard, onPrevSection]);

  // Unified swipe action with debouncing to ensure exactly 1 card per swipe
  const triggerSwipe = useCallback((direction: "next" | "prev") => {
    const now = performance.now();
    if (now - lastActionTime.current < 280) return;
    lastActionTime.current = now;

    if (direction === "next") {
      nextCard();
    } else {
      prevCard();
    }
  }, [nextCard, prevCard]);

  // When Works section becomes active, ensure Card 0 is centered
  useEffect(() => {
    if (isActive) {
      targetPos.current = 0;
      currentPosRef.current = 0;
      setCurrentPos(0);
      if (onEntranceProgress) onEntranceProgress(1);
    }
  }, [isActive, onEntranceProgress]);

  // Update exit ratio whenever currentPos changes
  useEffect(() => {
    const expandProgress = Math.max(
      0,
      Math.min(1, (currentPos - CAROUSEL_END) / (EXPAND_END - CAROUSEL_END))
    );
    if (onExitProgress) onExitProgress(expandProgress);
  }, [currentPos, onExitProgress]);

  // Pointer swipe handlers:
  // Discrete swipe recognition - NO continuous touch sync during dragging!
  const onPointerDown = (e: React.PointerEvent) => {
    if (currentPosRef.current >= EXPAND_END - 0.05) return;
    isPointerDown.current = true;
    hasSwiped.current = false;
    swipeStartX.current = e.clientX;
    swipeStartY.current = e.clientY;
    swipeStartTime.current = performance.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current || hasSwiped.current) return;
    if (currentPosRef.current >= EXPAND_END - 0.05) return;

    const dx = e.clientX - swipeStartX.current;
    const dy = e.clientY - swipeStartY.current;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const isAtWindowCard = targetPos.current >= CAROUSEL_END - 0.2;

    // Movement threshold to trigger swipe (even more responsive on window card to expand immediately)
    const SWIPE_THRESHOLD = isAtWindowCard ? 28 : isMobile ? 36 : 45;
    if (Math.abs(dx) >= SWIPE_THRESHOLD || Math.abs(dy) >= SWIPE_THRESHOLD) {
      hasSwiped.current = true;
      if (Math.abs(dx) >= Math.abs(dy)) {
        // Horizontal swipe: left swipe advances to next card, right swipe goes to prev
        if (dx < 0) triggerSwipe("next");
        else triggerSwipe("prev");
      } else {
        // Vertical swipe: swipe up advances to next card, swipe down goes to prev
        if (dy < 0) triggerSwipe("next");
        else triggerSwipe("prev");
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    // Check for quick flick gesture if movement threshold wasn't hit during move
    if (!hasSwiped.current && currentPosRef.current < EXPAND_END - 0.05) {
      const dx = e.clientX - swipeStartX.current;
      const dy = e.clientY - swipeStartY.current;
      const dt = performance.now() - swipeStartTime.current;

      const isAtWindowCard = targetPos.current >= CAROUSEL_END - 0.2;
      const flickThreshold = isAtWindowCard ? 18 : 25;

      if (dt < 300 && (Math.abs(dx) > flickThreshold || Math.abs(dy) > flickThreshold)) {
        hasSwiped.current = true;
        if (Math.abs(dx) >= Math.abs(dy)) {
          if (dx < 0) triggerSwipe("next");
          else triggerSwipe("prev");
        } else {
          if (dy < 0) triggerSwipe("next");
          else triggerSwipe("prev");
        }
      }
    }
  };

  // Keyboard navigation: Left/Right/Up/Down moves cleanly card-by-card
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (currentPosRef.current >= EXPAND_END - 0.05) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        triggerSwipe("next");
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        triggerSwipe("prev");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerSwipe]);

  // Wheel — calibrated card-by-card snap with reduced sensitivity on PC
  useEffect(() => {
    if (!isActive) return;

    let wheelAccumulator = 0;
    let wheelCooldown = 0;
    let resetTimer: NodeJS.Timeout | null = null;

    const onWheel = (e: WheelEvent) => {
      if (currentPosRef.current >= EXPAND_END - 0.05) return;

      let dy = e.deltaY;
      let dx = e.deltaX;
      if (e.deltaMode === 1) {
        dy *= 28;
        dx *= 28;
      } else if (e.deltaMode === 2) {
        dy *= window.innerHeight;
        dx *= window.innerWidth;
      }

      const dominant = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (Math.abs(dominant) < 8) return;

      const now = performance.now();

      // On PC: Ignore the first scroll gesture upon entering Works
      if (!hasIgnoredFirstScroll.current) {
        hasIgnoredFirstScroll.current = true;
        firstScrollEndTime.current = now;
        return;
      }
      if (now - firstScrollEndTime.current < 500) {
        firstScrollEndTime.current = now;
        return;
      }

      // If in cooldown from previous card step, ignore trailing momentum
      if (now < wheelCooldown) return;

      // Accumulate scroll input to prevent unintended micro-scrolls
      wheelAccumulator += dominant;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 200);

      // Substantially reduced sensitivity threshold (requires deliberate 60px gesture)
      const WHEEL_THRESHOLD = 60;
      if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
        const isNext = wheelAccumulator > 0;
        wheelAccumulator = 0;
        wheelCooldown = now + 620; // Lock for 620ms so 1 scroll = exactly 1 card step
        triggerSwipe(isNext ? "next" : "prev");
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isActive, triggerSwipe]);

  // Active project for caption
  const clampedPos = Math.max(0, Math.min(TOTAL - 1, currentPos));
  const normalizedIndex = Math.min(TOTAL - 1, Math.max(0, Math.round(clampedPos)));
  const activeProject = PROJECTS[normalizedIndex];

  // Expansion of the last card window into fullscreen (6.0 → 7.4)
  const expandProgress = Math.max(
    0,
    Math.min(1, (currentPos - CAROUSEL_END) / (EXPAND_END - CAROUSEL_END))
  );

  // Card window dimensions
  let cardW = Math.min(560, viewport.w * 0.48);
  if (viewport.w < 640) cardW = viewport.w * 0.86;
  else if (viewport.w < 1024) cardW = viewport.w * 0.62;
  const cardH = cardW / 2.2;

  // Fading of other carousel elements as VideoWorks window expands
  const otherCardsFade = Math.max(0, 1 - expandProgress * 2.5);
  const captionFade = Math.max(0, 1 - expandProgress * 3.0);
  const glowFade = 0.8 * Math.max(0, 1 - expandProgress * 2.0);

  return (
    <section
      id="works"
      className="relative w-full h-full min-h-screen flex flex-col justify-center items-center select-none overflow-hidden"
      style={{
        backgroundColor: "transparent",
        color: "#ffffff",
        cursor: expandProgress >= 0.95 ? "default" : "grab",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* ══════════════════════════════════════════════════════════════
          3D CYLINDRICAL CAROUSEL STAGE
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full max-w-7xl flex flex-col items-center justify-center z-10 px-4"
        style={{
          willChange: "transform, opacity",
        }}
      >
        {/* ── Center Light Red Circle Glow (BEHIND 3D cards stage) ── */}
        <div
          className="absolute top-[130px] sm:top-[170px] lg:top-[190px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] rounded-full blur-[70px] sm:blur-[90px] z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(220, 38, 38, 0.2) 45%, transparent 70%)",
            opacity: glowFade,
          }}
        />

        {/* ── 3D Cylinder Stage ── */}
        <div
          className="relative z-10 w-full h-[260px] sm:h-[340px] lg:h-[380px] flex items-center justify-center"
          style={{
            perspective: expandProgress > 0 ? "none" : "900px",
            perspectiveOrigin: "50% 50%",
            transformStyle: expandProgress > 0 ? "flat" : "preserve-3d",
          }}
        >
          {PROJECTS.map((project, idx) => {
            // Linear offset from current position
            const diff = idx - currentPos;
            const absDiff = Math.abs(diff);

            const isVideoWorks = project.id === "video-works";
            if (!isVideoWorks && absDiff > 2.2) return null;

            const isCenter = absDiff < 0.22;
            const isLeft = diff < -0.15;
            const isRight = diff > 0.15;
            const isExpanding = isVideoWorks && expandProgress > 0;

            // 3D cylindrical coordinates
            const x = diff * cardSpacing;
            const z = -absDiff * 115;
            const rotateY = -diff * 32;
            const scale = 1 - Math.min(0.15, absDiff * 0.08);
            const baseOpacity = Math.max(0, 1 - absDiff * 0.3);
            const opacity = isVideoWorks ? 1 : baseOpacity * otherCardsFade;
            const curvature = Math.min(1.3, absDiff * 1.1);

            return (
              <div
                key={project.id}
                suppressHydrationWarning
                onClick={(e) => {
                  if (hasSwiped.current) return;
                  if (isVideoWorks && expandProgress >= 0.95) {
                    // In VideoWorks (fullscreen): do not interfere with internal player
                    return;
                  }
                  if (isVideoWorks) {
                    // Tap on VideoWorks card expands straight to fullscreen
                    e.stopPropagation();
                    goToCard(EXPAND_END);
                    return;
                  }
                  if (absDiff > 0.25) {
                    e.stopPropagation();
                    goToCard(idx);
                    return;
                  } else {
                    window.open(project.liveUrl, "_blank");
                  }
                }}
                className={`will-change-transform group cursor-pointer ${
                  isExpanding
                    ? ""
                    : "absolute aspect-[2.2/1] w-[86vw] sm:w-[62vw] lg:w-[48vw] max-w-[560px]"
                }`}
                style={
                  isExpanding
                    ? {
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, calc(-50% - ${38 * (1 - expandProgress)}px))`,
                        width: `calc(${cardW}px + (100vw - ${cardW}px) * ${expandProgress})`,
                        height: `calc(${cardH}px + (100vh - ${cardH}px) * ${expandProgress})`,
                        borderRadius: `${16 * (1 - expandProgress)}px`,
                        zIndex: 100,
                        opacity: 1,
                        pointerEvents: expandProgress >= 0.85 ? "auto" : "none",
                        boxShadow:
                          expandProgress < 0.96
                            ? `0 30px 90px -15px rgba(0,0,0,${0.95 * (1 - expandProgress)})`
                            : "none",
                      }
                    : {
                        transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                        transformOrigin: isLeft
                          ? "right center"
                          : isRight
                          ? "left center"
                          : "center center",
                        transformStyle: "preserve-3d",
                        zIndex: isVideoWorks ? 60 : Math.round(50 - absDiff * 10),
                        opacity,
                        filter: isCenter ? "none" : "brightness(0.85)",
                      }
                }
              >
                {/* ── CARD WINDOW: Behind it is the full, un-shrunk VideoWorks view ── */}
                <div
                  className={`relative w-full h-full overflow-hidden bg-[#0A0A0C] ${
                    isExpanding ? "" : "rounded-xl sm:rounded-2xl"
                  }`}
                  style={{
                    transformStyle: isExpanding ? "flat" : "preserve-3d",
                    borderRadius: isExpanding
                      ? `${16 * (1 - expandProgress)}px`
                      : undefined,
                    border: isExpanding
                      ? expandProgress < 0.96
                        ? `1px solid rgba(255, 255, 255, ${0.15 * (1 - expandProgress)})`
                        : "none"
                      : "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: isCenter && !isExpanding
                      ? "0 30px 90px -15px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.18)"
                      : !isCenter && !isExpanding
                      ? "0 15px 45px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
                      : "none",
                  }}
                >
                  {isVideoWorks ? (
                    /* The card is a window: behind it sits the full un-shrunk VideoWorks page! */
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] overflow-hidden"
                      style={{
                        pointerEvents: expandProgress >= 0.85 ? "auto" : "none",
                      }}
                    >
                      <VideoWorks
                        isExpanded={expandProgress >= 0.95}
                        onReturn={() => {
                          targetPos.current = CAROUSEL_END;
                          startPhysics();
                        }}
                      />
                    </div>
                  ) : (
                    /* Project Image slices for 3D curved cylinder effect */
                    <>
                      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
                        {Array.from({ length: SLICES }).map((_, s) => {
                          const u = (s + 0.5) / SLICES - 0.5;
                          const rotYSlice = isCenter
                            ? 0
                            : u * 22 * curvature * (isLeft ? 1 : isRight ? 1 : 0);
                          const normX = isLeft
                            ? s / (SLICES - 1)
                            : (SLICES - 1 - s) / (SLICES - 1);
                          const zSlice = isCenter
                            ? 0
                            : -Math.pow(normX, 1.6) * 38 * curvature;
                          const ySlice = isCenter
                            ? 0
                            : (isLeft ? 1 : -1) * (1 - normX) * 5 * curvature;

                          return (
                            <div
                              key={s}
                              suppressHydrationWarning
                              className="absolute top-0 bottom-0 overflow-hidden pointer-events-none"
                              style={{
                                left: `${((s / SLICES) * 100).toFixed(2)}%`,
                                width: `${((1 / SLICES) * 100 + 0.3).toFixed(2)}%`,
                                transformOrigin: isLeft
                                  ? "right center"
                                  : isRight
                                  ? "left center"
                                  : "center center",
                                transform: isCenter
                                  ? "none"
                                  : `translate3d(0px, ${ySlice.toFixed(2)}px, ${zSlice.toFixed(2)}px) rotateY(${rotYSlice.toFixed(2)}deg)`,
                                backfaceVisibility: "hidden",
                                backgroundImage: `url("${project.image}")`,
                                backgroundSize: `${SLICES * 100}% 100%`,
                                backgroundPosition: `${((s / (SLICES - 1)) * 100).toFixed(2)}% center`,
                                backgroundRepeat: "no-repeat",
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Dark vignette & specular highlight */}
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          background: isCenter
                            ? "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 45%)"
                            : "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%), linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)",
                        }}
                      />

                      {/* Center card hover visit pill */}
                      {isCenter && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white text-black shadow-lg">
                            <span>Visit Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Active Center Caption (fades away as VideoWorks window expands) ── */}
        <div
          className="text-center mt-7 sm:mt-9 space-y-1 select-none pointer-events-none z-20"
          style={{ opacity: captionFade }}
        >
          <h3 className="text-base sm:text-xl font-bold tracking-tight text-white">
            {activeProject.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-white/55">
            {activeProject.subtitle}
          </p>
          <p className="text-[11px] sm:text-xs font-mono tracking-widest text-white/35 pt-1 font-semibold">
            {activeProject.counter}
          </p>
        </div>
      </div>
    </section>
  );
}
