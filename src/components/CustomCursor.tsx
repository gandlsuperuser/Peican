"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop
    if (window.innerWidth < 1024) return;

    const el = cursorRef.current;
    if (!el) return;

    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    const onMouseEnter = () => {
      el.style.opacity = "1";
    };

    const onMouseLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="hidden lg:block fixed pointer-events-none z-50 mix-blend-mode-exclusion transition-opacity duration-300"
      style={{
        transform: "translate(-50%, -50%)",
        mixBlendMode: "exclusion",
        left: "-100px",
        top: "-100px",
        willChange: "left, top",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        {/* Circle with stroke (r=22.75, strokeWidth=2.5) */}
        <circle
          cx="24"
          cy="24"
          r="22.75"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        {/* Decorative artisan Japanese/editorial glyph path */}
        <path
          d="M24 10V38M14 18H34M17 28C17 28 20 33 24 33C28 33 31 28 31 28M15 14L33 34M33 14L15 34"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
