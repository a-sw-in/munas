"use client";

/*
From Uiverse.io by JaydipPrajapati1910 - https://uiverse.io/JaydipPrajapati1910/stale-pug-89
MIT License, Copyright (c) JaydipPrajapati1910 (Jaydip Prajapati)
*/

import { useEffect, useState } from "react";
import UiverseLoader from "./uiverse-loader";

const MEDIA_IMAGES = [
  "/assets/munas.png",
  "/assets/foot.png",
  "/projects/Photographer Portfolio.png",
  "/projects/Cafe Website.png",
  "/projects/Design Studio.png",
  "/projects/Portfolio Design.png",
  "/projects/Portfolio Website.png",
  "/projects/681210be0b24dede691834f1_face-1.avif",
  "/projects/681210befd586a86f7da095a_face-2.avif",
  "/projects/681210bec12b45a849356ced_face-3.avif",
  "/projects/681210be710d60755f407cac_face-4.avif",
  "/projects/681210be320f33da1bb17f66_face-5.avif",
];

const MEDIA_VIDEOS = ["/assets/video.mp4"];

export default function MediaPreloader({
  onLoaded,
}: {
  onLoaded?: () => void;
}) {
  const [isFading, setIsFading] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    // Helper to preload an image into browser cache
    const preloadImg = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    // Helper to warm video buffer into browser cache
    const preloadVid = (src: string) =>
      new Promise<void>((resolve) => {
        try {
          const req = new XMLHttpRequest();
          req.open("GET", src, true);
          req.responseType = "blob";
          req.setRequestHeader("Range", "bytes=0-1048576"); // First 1MB warm-up
          req.onload = () => resolve();
          req.onerror = () => resolve();
          req.send();
        } catch {
          resolve();
        }
      });

    // Minimum display duration (400ms) for smooth visual rhythm
    const minTimePromise = new Promise<void>((res) => setTimeout(res, 400));

    // Maximum wait timeout (2400ms) so slow connections never stall the user
    const maxTimeoutPromise = new Promise<void>((res) => setTimeout(res, 2400));

    const allMediaPromise = Promise.all([
      ...MEDIA_IMAGES.map(preloadImg),
      ...MEDIA_VIDEOS.map(preloadVid),
      minTimePromise,
    ]);

    Promise.race([allMediaPromise, maxTimeoutPromise]).then(() => {
      if (isCancelled) return;
      setIsFading(true);
      if (onLoaded) onLoaded();

      // Remove from DOM after fade-out completes
      setTimeout(() => {
        if (!isCancelled) setIsRemoved(true);
      }, 550);
    });

    return () => {
      isCancelled = true;
    };
  }, [onLoaded]);

  if (isRemoved) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050506]"
      style={{
        opacity: isFading ? 0 : 1,
        pointerEvents: isFading ? "none" : "auto",
        transition: "opacity 0.52s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <UiverseLoader />
    </div>
  );
}
