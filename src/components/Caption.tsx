"use client";

import React from "react";
import { motion } from "motion/react";

export default function Caption() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.3,
      }}
      className="fixed z-20 pointer-events-none select-none text-white text-[12px] leading-[140%] tracking-[-0.04em] font-medium"
      style={{
        mixBlendMode: "exclusion",
        top: "var(--caption-top, 244px)",
        left: "var(--caption-left, 32px)",
        width: "var(--caption-width, 692px)",
      }}
    >
      <style jsx>{`
        div {
          --caption-top: 118px;
          --caption-left: 16px;
          --caption-width: calc(100vw - 32px);
        }
        @media (min-width: 640px) {
          div {
            --caption-top: 180px;
            --caption-left: 24px;
            --caption-width: calc(50vw - 48px);
          }
        }
        @media (min-width: 1024px) {
          div {
            --caption-top: 244px;
            --caption-left: 32px;
            --caption-width: 692px;
          }
        }
      `}</style>
      <p>
        DAILY FRESH ARCHIVE / RESTAURANT MASCOT. A giant golden porcelain Maneki-Neko (招财猫)
        blessing today&apos;s freshly crafted drops. Move your cursor horizontally across the viewport
        to rotate the ceramic statue in full 3D perspective. Center dead-zone holds poised gaze.
      </p>
    </motion.div>
  );
}
