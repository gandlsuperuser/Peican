"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HeroLuckyCat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const catWrapRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [activeView, setActiveView] = useState<"left" | "center" | "right">("center");

  // Physics animation loop for smooth 3D rotation following cursor
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const normX = (e.clientX - w / 2) / (w / 2); // -1 to 1
      const normY = (e.clientY - h / 2) / (h / 2); // -1 to 1

      targetX = normX;
      targetY = normY;

      // Update light sheen position
      if (sheenRef.current) {
        const sheenX = Math.round(((e.clientX / w) * 100));
        const sheenY = Math.round(((e.clientY / h) * 100));
        sheenRef.current.style.background = `radial-gradient(circle 380px at ${sheenX}% ${sheenY}%, rgba(255, 230, 140, 0.45) 0%, rgba(212, 160, 23, 0.15) 35%, transparent 70%)`;
      }

      // Switch discrete view based on cursor position
      // Dead-zone: [-0.15, 0.15]
      if (normX < -0.15) {
        setActiveView("left");
      } else if (normX > 0.15) {
        setActiveView("right");
      } else {
        setActiveView("center");
      }
    };

    // Auto-oscillation for mobile / touch devices
    let touchAngle = 0;
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;

    const loop = () => {
      if (isTouch) {
        touchAngle += 0.02;
        targetX = Math.sin(touchAngle) * 0.5;
        targetY = Math.cos(touchAngle * 0.7) * 0.2;
        if (targetX < -0.15) setActiveView("left");
        else if (targetX > 0.15) setActiveView("right");
        else setActiveView("center");
      }

      // Smooth damped lerp for weight and presence
      currentRotY += (targetX * 26 - currentRotY) * 0.08;
      currentRotX += (-targetY * 10 - currentRotX) * 0.08;

      if (catWrapRef.current) {
        catWrapRef.current.style.transform = `perspective(1200px) rotateY(${currentRotY.toFixed(
          2
        )}deg) rotateX(${currentRotX.toFixed(2)}deg) translateZ(10px)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      id="main-canvas"
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none flex items-center justify-center bg-black transition-opacity duration-500"
    >
      {/* Ambient auspicious gold back-glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(212,175,55,0.22)_0%,rgba(140,90,15,0.08)_40%,transparent_75%)]" />

      {/* Floating golden coin/sparkle dust */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#ffd700] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#ffd700] animate-bounce duration-1000" />
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 rounded-full bg-amber-100 shadow-[0_0_6px_#ffd700]" />
        <div className="absolute top-1/2 right-1/5 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#ffd700] animate-pulse" />
      </div>

      {/* 3D Rotating Wrapper for the Giant Restaurant Lucky Cat */}
      <div
        ref={catWrapRef}
        className="relative flex items-center justify-center will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          width: "min(88vh, 760px)",
          height: "min(88vh, 760px)",
          maxWidth: "92vw",
          maxHeight: "92vw",
        }}
      >
        {/* Layer 1: Left Angle Image */}
        <div
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            opacity: activeView === "left" ? 1 : 0,
            transform: "translateZ(0px)",
          }}
        >
          <Image
            src="/cat/cat-left.jpg"
            alt="Giant Restaurant Lucky Cat Left Angle"
            fill
            priority
            className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Layer 2: Center Face Image */}
        <div
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            opacity: activeView === "center" ? 1 : 0,
            transform: "translateZ(0px)",
          }}
        >
          <Image
            src="/cat/cat-center.jpg"
            alt="Giant Restaurant Lucky Cat Center"
            fill
            priority
            className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Layer 3: Right Angle Image */}
        <div
          className="absolute inset-0 transition-opacity duration-300 ease-out"
          style={{
            opacity: activeView === "right" ? 1 : 0,
            transform: "translateZ(0px)",
          }}
        >
          <Image
            src="/cat/cat-right.jpg"
            alt="Giant Restaurant Lucky Cat Right Angle"
            fill
            priority
            className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Dynamic metallic specular light reflection follows cursor */}
        <div
          ref={sheenRef}
          className="absolute inset-0 pointer-events-none rounded-full mix-blend-color-dodge transition-all"
          style={{
            background:
              "radial-gradient(circle 380px at 50% 50%, rgba(255, 230, 140, 0.35) 0%, rgba(212, 160, 23, 0.1) 35%, transparent 70%)",
            opacity: 0.65,
          }}
        />

        {/* Subtle auspicious badge at base */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/60 border border-amber-500/30 backdrop-blur-md text-[11px] font-mono tracking-widest text-amber-300 uppercase flex items-center gap-2 shadow-lg"
          style={{ transform: "translateX(-50%) translateZ(40px)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>MANEKI-NEKO • 招财进宝 • 888</span>
        </div>
      </div>
    </div>
  );
}
