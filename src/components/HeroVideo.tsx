"use client";

import React, { useEffect, useRef, useState } from "react";

const LEFT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4";
const RIGHT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4";

export default function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const activeSideRef = useRef<"left" | "right">("right");
  const rafIdRef = useRef<number | null>(null);
  const latestMouseXRef = useRef<number | null>(null);

  // Monitor loading of both videos
  useEffect(() => {
    let leftDone = false;
    let rightDone = false;

    const checkBoth = () => {
      if (leftDone && rightDone) {
        setIsLoaded(true);
      }
    };

    const left = leftVideoRef.current;
    const right = rightVideoRef.current;

    if (left && right) {
      if (left.readyState >= 2) leftDone = true;
      if (right.readyState >= 2) rightDone = true;
      checkBoth();

      const handleLeft = () => {
        leftDone = true;
        checkBoth();
      };
      const handleRight = () => {
        rightDone = true;
        checkBoth();
      };

      left.addEventListener("loadeddata", handleLeft);
      right.addEventListener("loadeddata", handleRight);

      // Fallback timeout in case video CDN is delayed
      const fallbackTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 1500);

      return () => {
        left.removeEventListener("loadeddata", handleLeft);
        right.removeEventListener("loadeddata", handleRight);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  // Desktop vs Mobile interaction logic
  useEffect(() => {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const left = leftVideoRef.current;
    const right = rightVideoRef.current;
    if (!left || !right) return;

    if (isTouch) {
      // Touch/Mobile: alternate autoplay
      if (prefersReducedMotion) return;

      left.style.display = "block";
      right.style.display = "none";
      left.play().catch(() => {});

      const onLeftEnded = () => {
        left.style.display = "none";
        right.style.display = "block";
        right.currentTime = 0;
        right.play().catch(() => {});
      };

      const onRightEnded = () => {
        right.style.display = "none";
        left.style.display = "block";
        left.currentTime = 0;
        left.play().catch(() => {});
      };

      left.addEventListener("ended", onLeftEnded);
      right.addEventListener("ended", onRightEnded);

      return () => {
        left.removeEventListener("ended", onLeftEnded);
        right.removeEventListener("ended", onRightEnded);
      };
    } else {
      // Desktop: scrub based on cursor X position via RAF
      // Pause both videos immediately for precise scrub control
      left.pause();
      right.pause();
      left.currentTime = 0;
      right.currentTime = 0;

      const onMouseMove = (e: MouseEvent) => {
        latestMouseXRef.current = e.clientX;
      };

      const loop = () => {
        const mouseX = latestMouseXRef.current;
        if (mouseX !== null) {
          const width = window.innerWidth;
          const centerX = width / 2;
          const deadZone = Math.max(30, width * 0.05);
          const leftEdge = centerX - deadZone;
          const rightEdge = centerX + deadZone;

          if (mouseX >= leftEdge && mouseX <= rightEdge) {
            // Inside dead zone: keep active video at currentTime = 0
            if (activeSideRef.current === "right") {
              right.style.display = "block";
              left.style.display = "none";
              if (!right.seeking && right.currentTime !== 0) {
                right.currentTime = 0;
              }
            } else {
              left.style.display = "block";
              right.style.display = "none";
              if (!left.seeking && left.currentTime !== 0) {
                left.currentTime = 0;
              }
            }
          } else if (mouseX < leftEdge) {
            // Cursor is left of dead zone -> show RIGHT video
            activeSideRef.current = "right";
            right.style.display = "block";
            left.style.display = "none";

            const dist = leftEdge - mouseX;
            const progress = Math.max(0, Math.min(1, dist / leftEdge));
            if (right.duration && !right.seeking) {
              const targetTime = progress * right.duration;
              if (isFinite(targetTime) && Math.abs(right.currentTime - targetTime) > 0.03) {
                right.currentTime = targetTime;
              }
            }
          } else {
            // Cursor is right of dead zone -> show LEFT video
            activeSideRef.current = "left";
            left.style.display = "block";
            right.style.display = "none";

            const dist = mouseX - rightEdge;
            const range = width - rightEdge;
            const progress = Math.max(0, Math.min(1, dist / range));
            if (left.duration && !left.seeking) {
              const targetTime = progress * left.duration;
              if (isFinite(targetTime) && Math.abs(left.currentTime - targetTime) > 0.03) {
                left.currentTime = targetTime;
              }
            }
          }
        }

        rafIdRef.current = requestAnimationFrame(loop);
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      rafIdRef.current = requestAnimationFrame(loop);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }
  }, []);

  return (
    <div
      id="main-canvas"
      ref={containerRef}
      className="pointer-events-none overflow-hidden transition-opacity duration-300 select-none"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        opacity: isLoaded ? 1 : 0,
      }}
    >
      <style jsx>{`
        #main-canvas {
          inset: 0;
          width: 100%;
          height: 100%;
        }
        @media (max-width: 1023px) {
          #main-canvas {
            left: 0;
            top: 220px;
            width: 100vw;
            height: calc(100vh - 220px);
          }
        }
      `}</style>

      {/* Left video: initially hidden */}
      <video
        ref={leftVideoRef}
        src={LEFT_VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "none" }}
      />

      {/* Right video: initially visible */}
      <video
        ref={rightVideoRef}
        src={RIGHT_VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "block" }}
      />
    </div>
  );
}
