"use client";

import React from "react";

interface OutroBuyButtonProps {
  onOpenCart: () => void;
}

export default function OutroBuyButton({ onOpenCart }: OutroBuyButtonProps) {
  return (
    <button
      id="outro-buy"
      onClick={onOpenCart}
      aria-label="View and order collection"
      className="fixed z-20 flex items-center justify-center bg-white cursor-pointer select-none transition-shadow hover:shadow-2xl active:scale-95"
      style={{
        mixBlendMode: "exclusion",
        transformOrigin: "right bottom",
        transform: "scale(0)",
        borderRadius: "1335px",
        willChange: "transform",
      }}
    >
      <style jsx>{`
        #outro-buy {
          left: 16px;
          right: 16px;
          bottom: 60px;
          height: 100px;
        }
        @media (min-width: 1024px) {
          #outro-buy {
            left: auto;
            right: 32px;
            bottom: 32px;
            width: 330px;
            height: 174px;
          }
        }
      `}</style>
      <span
        className="font-medium text-[72px] lg:text-[110px] tracking-[-0.04em] text-white leading-none"
        style={{ mixBlendMode: "exclusion" }}
      >
        view
      </span>
    </button>
  );
}
