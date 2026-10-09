"use client";

import React from "react";

export function OutroOverlay() {
  return (
    <div
      id="outro-overlay"
      className="fixed inset-0 pointer-events-none bg-white transition-none"
      style={{
        zIndex: 12,
        opacity: 0,
        willChange: "opacity",
      }}
    />
  );
}

export function OutroFooter({ onOpenPrivacy }: { onOpenPrivacy?: () => void }) {
  return (
    <footer
      id="outro-footer"
      className="fixed z-20 pointer-events-auto flex items-center select-none"
      style={{
        mixBlendMode: "exclusion",
        opacity: 0,
        willChange: "opacity",
        left: "16px",
      }}
    >
      <style jsx>{`
        #outro-footer {
          bottom: 24px;
          right: 16px;
          justify-content: space-between;
        }
        @media (min-width: 1024px) {
          #outro-footer {
            bottom: 32px;
            right: auto;
            justify-content: flex-start;
            gap: 80px;
          }
        }
      `}</style>
      <span className="font-medium text-[11px] lg:text-[13px] tracking-[-0.02em] uppercase text-white">
        PRMPT (R) 2026
      </span>
      <button
        onClick={onOpenPrivacy}
        className="font-medium text-[11px] lg:text-[13px] tracking-[-0.02em] uppercase text-white hover:underline cursor-pointer"
      >
        PRIVACY POLICY
      </button>
    </footer>
  );
}
