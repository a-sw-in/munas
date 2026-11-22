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
const THRESHOLD_25 = 1.25;  // Entrance from previous section (Video Minimized)

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

  // Drag tracking
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragStartPos = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velocity = useRef(0);
  const hasTriggeredPrev = useRef(false);

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

  // Dynamic smooth spring physics: 0.082 on laptop wheel/mouse (silky, weighted), 0.11 on mobile touch
  const isTouchRef = useRef(false);

  // Velvety smooth spring physics animation loop
  const startPhysics = useCallback(() => {
    if (animFrame.current) return;

    const tick = () => {
      const diff = targetPos.current - currentPosRef.current;
      if (Math.abs(diff) < 0.0003) {
        currentPosRef.current = targetPos.current;
        setCurrentPos(targetPos.current);
        animFrame.current = null;
        return;
      }
      const ease = isTouchRef.current ? 0.11 : 0.082;
      currentPosRef.current += diff * ease;
      setCurrentPos(currentPosRef.current);
      animFrame.current = requestAnimationFrame(tick);
    };

    animFrame.current = requestAnimationFrame(tick);
  }, []);

  // Update entrance & exit ratios whenever currentPos changes
  useEffect(() => {
    const entranceProgress = Math.max(
      0,
      Math.min(1, currentPos / THRESHOLD_25)
    );
    const expandProgress = Math.max(
      0,
      Math.min(1, (currentPos - CAROUSEL_END) / (EXPAND_END - CAROUSEL_END))
    );

    if (onEntranceProgress) onEntranceProgress(entranceProgress);
    if (onExitProgress) onExitProgress(expandProgress);
  }, [currentPos, onEntranceProgress, onExitProgress]);

  // Pointer drag handlers (support touch and mouse seamlessly)
  const onPointerDown = (e: React.PointerEvent) => {
    if (currentPosRef.current >= EXPAND_END - 0.05) return;
    isTouchRef.current = e.pointerType === "touch";
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    lastX.current = e.clientX;
    lastY.current = e.clientY;
    dragStartPos.current = targetPos.current;
    velocity.current = 0;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - dragStartX.current;
    velocity.current = lastX.current - e.clientX;
    lastX.current = e.clientX;

    let step: number;
    if (e.pointerType === "mouse") {
      // Laptop mouse drag: pure horizontal movement
      step = -deltaX / cardSpacing;
    } else {
      // Touch drag on phone: responsive swipe
      const deltaY = e.clientY - dragStartY.current;
      lastY.current = e.clientY;
      const dominant = Math.abs(deltaX) >= Math.abs(deltaY) ? -deltaX : -deltaY * 1.25;
      step = dominant / cardSpacing;
    }

    let nextPos = dragStartPos.current + step;
    // Expanding into VideoWorks from Card 6
    if (dragStartPos.current >= CAROUSEL_END - 0.25 && step > 0.18) {
      nextPos = Math.min(REAL_MAX, CAROUSEL_END + step * 1.3);
    }

    targetPos.current = Math.max(0, Math.min(REAL_MAX, nextPos));
    startPhysics();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    const momentumDivisor = e.pointerType === "mouse" ? cardSpacing * 0.85 : cardSpacing * 0.7;
    const momentum = velocity.current / momentumDivisor;
    let nextTarget = targetPos.current + momentum;

    // When swiping forward on or near Card 6, cleanly expand to fullscreen VideoWorks
    if (dragStartPos.current >= CAROUSEL_END - 0.3 && nextTarget > CAROUSEL_END + 0.3) {
      nextTarget = EXPAND_END;
    } else if (nextTarget > CAROUSEL_END && nextTarget < CAROUSEL_END + 0.3) {
      nextTarget = CAROUSEL_END;
    }

    targetPos.current = Math.max(
      0,
      Math.min(REAL_MAX, nextTarget)
    );
    startPhysics();
  };

  // Keyboard arrows
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (currentPosRef.current >= EXPAND_END - 0.05) return;
      if (e.key === "ArrowRight") {
        targetPos.current = Math.min(REAL_MAX, targetPos.current + 1);
        startPhysics();
      } else if (e.key === "ArrowLeft") {
        targetPos.current = Math.max(0, targetPos.current - 1);
        startPhysics();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [startPhysics]);

  // Wheel — continuous proportional movement
  useEffect(() => {
    if (!isActive) return;

    const onWheel = (e: WheelEvent) => {
      isTouchRef.current = false;
      // If VideoWorks is expanded into fullscreen, VideoWorks controls its own wheel
      if (currentPosRef.current >= EXPAND_END - 0.05) return;

      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 32;
      else if (e.deltaMode === 2) dy *= window.innerHeight;

      const delta = Math.max(-0.25, Math.min(0.25, dy * 0.0011));

      if (dy > 0) {
        hasTriggeredPrev.current = false;
        if (targetPos.current < REAL_MAX) {
          targetPos.current = Math.min(REAL_MAX, targetPos.current + delta);
          startPhysics();
        }
      } else {
        if (targetPos.current > 0) {
          targetPos.current = Math.max(0, targetPos.current + delta);
          startPhysics();
        } else if (currentPosRef.current < 0.05 && !hasTriggeredPrev.current) {
          hasTriggeredPrev.current = true;
          if (onPrevSection) onPrevSection();
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isActive, onPrevSection, startPhysics]);

  // Touch swipe fallback — continuous responsive proportional movement
  useEffect(() => {
    if (!isActive) return;
    let lastY = 0;
    let lastX = 0;

    const onTouchStart = (e: TouchEvent) => {
      isTouchRef.current = true;
      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (currentPosRef.current >= EXPAND_END - 0.05) return;
      if (isDragging.current) return;

      const dy = lastY - e.touches[0].clientY;
      const dx = lastX - e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      lastX = e.touches[0].clientX;

      // Dominant swipe direction (horizontal swipe left/right or vertical swipe up/down)
      const effectiveDelta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
      const delta = Math.max(-0.4, Math.min(0.4, (effectiveDelta / cardSpacing) * 1.3));

      if (effectiveDelta > 0) {
        hasTriggeredPrev.current = false;
        if (targetPos.current < REAL_MAX) {
          // When at or near Card 6 (Video Works), swiping forward cleanly triggers expansion
          if (targetPos.current >= CAROUSEL_END - 0.25) {
            targetPos.current = EXPAND_END;
          } else {
            targetPos.current = Math.min(REAL_MAX, targetPos.current + delta);
          }
          startPhysics();
        }
      } else {
        if (targetPos.current > 0) {
          targetPos.current = Math.max(0, targetPos.current + delta);
          startPhysics();
        } else if (currentPosRef.current < 0.1 && !hasTriggeredPrev.current) {
          hasTriggeredPrev.current = true;
          if (onPrevSection) onPrevSection();
        }
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isActive, cardSpacing, onPrevSection, startPhysics]);

  // Active project for caption
  const clampedPos = Math.max(0, Math.min(TOTAL - 1, currentPos));
  const normalizedIndex = Math.min(TOTAL - 1, Math.max(0, Math.round(clampedPos)));
  const activeProject = PROJECTS[normalizedIndex];

  // Entrance from previous section (0%→20% scroll)
  const entranceRatio = Math.max(
    0,
    Math.min(1, (THRESHOLD_25 - currentPos) / THRESHOLD_25)
  );
  const stageTranslateY = entranceRatio * 100;
  const stageOpacity = Math.max(0, Math.min(1, 1 - entranceRatio * 1.15));

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
  const glowFade = 0.8 * stageOpacity * Math.max(0, 1 - expandProgress * 2.0);

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
          transform: stageTranslateY === 0 ? "none" : `translateY(${stageTranslateY}vh)`,
          opacity: stageOpacity,
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
                  if (isVideoWorks && expandProgress >= 0.95) {
                    // In VideoWorks (fullscreen): do not interfere with internal player
                    return;
                  }
                  if (isVideoWorks) {
                    // Tap on VideoWorks card expands straight to fullscreen
                    e.stopPropagation();
                    targetPos.current = EXPAND_END;
                    startPhysics();
                    return;
                  }
                  if (absDiff > 0.25) {
                    e.stopPropagation();
                    targetPos.current = idx;
                    startPhysics();
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
