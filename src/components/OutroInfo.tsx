"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const SYMBOLS = ["8", "$", "^^", "%", "/"];

export default function OutroInfo() {
  const [symbol, setSymbol] = useState("8");
  const lastScrollTimeRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = performance.now();
      if (now - lastScrollTimeRef.current >= 80) {
        lastScrollTimeRef.current = now;
        const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
        setSymbol(SYMBOLS[randomIndex]);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      id="outro-info"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.45,
      }}
      data-outro-offset="166"
      className="fixed z-20 pointer-events-none select-none flex flex-col items-center"
      style={{
        mixBlendMode: "exclusion",
        willChange: "transform",
      }}
    >
      <style jsx>{`
        #outro-info {
          left: 0;
          right: 0;
          bottom: 48px;
          width: 100%;
        }
        @media (min-width: 1024px) {
          #outro-info {
            left: auto;
            right: 32px;
            bottom: 80px;
            width: 330px;
          }
        }
      `}</style>

      {/* Top block */}
      <div className="flex flex-col items-start w-[252px] lg:w-full mb-3 lg:mb-8">
        {/* Circle icon */}
        <div className="relative w-[20px] h-[20px] lg:w-[30px] lg:h-[30px] flex items-center justify-center mb-1 lg:mb-2">
          <svg
            viewBox="0 0 40 40"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="20"
              cy="20"
              r="18.75"
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />
          </svg>
          <span
            id="circle-symbol"
            className="absolute inset-0 flex items-center justify-center font-medium text-[10px] lg:text-[15px] tracking-[-0.04em] uppercase text-white"
          >
            {symbol}
          </span>
        </div>

        {/* Collection label */}
        <div className="text-[20px] lg:text-[30px] leading-[100%] text-center lg:text-left tracking-[-0.04em] uppercase text-white font-medium">
          <div>ARCHIVE COLLECTION</div>
          <div>&quot;PROMPT&quot;</div>
        </div>
      </div>

      {/* Price */}
      <div className="text-[60px] lg:text-[80px] leading-[100%] text-center tracking-[-0.04em] text-white font-medium">
        $97,33
      </div>
    </motion.div>
  );
}
