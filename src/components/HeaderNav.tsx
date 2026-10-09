"use client";

import React from "react";
import { motion } from "motion/react";

interface HeaderNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAbout: () => void;
}

export default function HeaderNav({ cartCount, onOpenCart, onOpenAbout }: HeaderNavProps) {
  const transitionConfig = (delay: number) => ({
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    delay,
  });

  return (
    <>
      {/* 1B. Logo (Top Left) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitionConfig(0)}
        className="fixed top-4 left-4 md:top-8 md:left-8 z-20 pointer-events-none select-none"
        style={{ mixBlendMode: "exclusion" }}
      >
        <svg
          viewBox="0 0 355 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[124px] sm:w-[266px] lg:w-[355px] h-auto drop-shadow-sm"
          aria-label="prmpt brand logo"
        >
          {/* Typographic 'prmpt' wordmark */}
          {/* 'p' */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 24H38V42.5C43 28.5 54.5 22 68 22C89 22 101 37.5 101 64C101 90.5 89 106 68 106C54.5 106 43 99.5 38 85.5V110H10V24ZM38 64C38 78 46.5 86.5 55.5 86.5C64.5 86.5 73 78 73 64C73 50 64.5 41.5 55.5 41.5C46.5 41.5 38 50 38 64Z"
            fill="#FFFFFF"
          />
          {/* 'r' */}
          <path
            d="M112 24H140V42C145 30 156 22 170 22V48C154 48 140 54 140 73V106H112V24Z"
            fill="#FFFFFF"
          />
          {/* 'm' */}
          <path
            d="M180 24H208V39C213 28 223 22 235 22C247 22 256 28 261 39C266 28 276 22 288 22C306 22 316 34 316 54V106H288V58C288 47 282 42 273 42C264 42 258 47 258 58V106H230V58C230 47 224 42 215 42C206 42 200 47 200 58V106H172V24H180Z"
            fill="#FFFFFF"
          />
          {/* 't' */}
          <path
            d="M322 24H334V8H344V24H354V38H344V84C344 94 348 98 354 98V106C342 106 334 98 334 84V38H322V24Z"
            fill="#FFFFFF"
          />
          {/* Circled (R) */}
          <circle cx="340" cy="18" r="8" stroke="#FFFFFF" strokeWidth="1.8" />
          <text
            x="340"
            y="21"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="8"
            fontWeight="700"
            fontFamily="sans-serif"
          >
            R
          </text>
        </svg>
      </motion.div>

      {/* 1D. Header Navigation (Top Right) */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitionConfig(0.15)}
        className="fixed top-4 right-4 md:top-8 md:right-8 z-20 h-[30px] flex items-center justify-between pointer-events-auto"
        style={{
          width: "auto",
          mixBlendMode: "exclusion",
        }}
      >
        <div className="flex items-center justify-between w-full lg:w-[330px] gap-6 md:gap-12">
          {/* ABOUT button */}
          <button
            onClick={onOpenAbout}
            className="hidden sm:inline-block text-[15px] uppercase tracking-[-0.04em] text-white hover:opacity-70 transition-opacity font-medium cursor-pointer"
            aria-label="About PRMPT"
          >
            ABOUT
          </button>

          <div className="flex items-center gap-[20px] lg:gap-[50px]">
            {/* Hamburger SVG icon */}
            <button
              onClick={onOpenAbout}
              className="p-1 hover:opacity-75 transition-opacity cursor-pointer flex items-center justify-center"
              aria-label="Menu"
            >
              <svg
                viewBox="0 0 40 40"
                className="w-[24px] h-[24px] lg:w-[30px] lg:h-[30px]"
                fill="none"
              >
                <path d="M0 14H40" stroke="#FFFFFF" strokeWidth="2.5" />
                <path d="M0 26H40" stroke="#FFFFFF" strokeWidth="2.5" />
              </svg>
            </button>

            {/* [ CART ] button */}
            <button
              onClick={onOpenCart}
              className="text-[13px] lg:text-[15px] uppercase tracking-[-0.04em] text-white hover:opacity-70 transition-opacity font-medium cursor-pointer flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <span>[ CART</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-white text-black text-[10px] w-4 h-4 rounded-full font-bold ml-0.5">
                  {cartCount}
                </span>
              )}
              <span>]</span>
            </button>
          </div>
        </div>
      </motion.header>
    </>
  );
}
