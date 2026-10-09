"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { ProductItem } from "../types";
import { PRODUCTS } from "../data/products";
import { Plus } from "lucide-react";

interface BlackPanelGalleryProps {
  onSelectProduct: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

// Algorithmic scattered layout builder specified in prompt
function buildLayout(count: number, cols: number): number[][] {
  const rows: number[][] = [];
  let itemIdx = 0;
  let r = 0;

  while (itemIdx < count) {
    const row = new Array(cols).fill(-1);
    const a = (r * 2 + (r % 2)) % cols;
    row[a] = itemIdx++;

    if (itemIdx < count && r % 3 === 0) {
      let b = (a + 2) % cols;
      if (b === a) b = (a + 1) % cols;
      row[b] = itemIdx++;
    }
    rows.push(row);
    r++;
  }

  return rows;
}

export default function BlackPanelGallery({
  onSelectProduct,
  onAddToCart,
}: BlackPanelGalleryProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const innerWrapRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [cols, setCols] = useState(4);

  // Responsive columns: 2 (<640), 3 (640-1024), 4 (>=1024)
  useEffect(() => {
    const updateCols = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(2);
      else if (w < 1024) setCols(3);
      else setCols(4);
    };

    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const gridRows = useMemo(() => {
    return buildLayout(PRODUCTS.length, cols);
  }, [cols]);

  // Main RAF Scroll Driver
  useEffect(() => {
    const panel = panelRef.current;
    const innerWrap = innerWrapRef.current;
    const spacer = document.getElementById("scroll-spacer");
    const outroOverlay = document.getElementById("outro-overlay");
    const outroInfo = document.getElementById("outro-info");
    const outroBuy = document.getElementById("outro-buy");
    const outroFooter = document.getElementById("outro-footer");
    const mainCanvas = document.getElementById("main-canvas");

    if (!panel || !innerWrap || !spacer) return;

    let isRunning = true;
    let rafId: number;

    const updateSpacerHeight = () => {
      const vh = window.innerHeight;
      const wrapHeight = innerWrap.offsetHeight;
      const maxScroll = Math.max(0, wrapHeight - vh);
      const totalSpacerHeight = vh + maxScroll + 2 * vh;
      spacer.style.height = `${totalSpacerHeight}px`;
      return { vh, maxScroll };
    };

    // Calculate dimensions after mount
    setTimeout(updateSpacerHeight, 100);
    window.addEventListener("resize", updateSpacerHeight);

    const tick = () => {
      if (!isRunning) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const wrapHeight = innerWrap.offsetHeight;
      const maxScroll = Math.max(0, wrapHeight - vh);

      const outroOffset =
        parseFloat(
          outroInfo?.getAttribute("data-outro-offset") ||
            (window.innerWidth >= 1024 ? "166" : "132")
        ) || 166;

      // Video visibility toggle
      if (mainCanvas) {
        if (scrollY > vh * 1.05) {
          mainCanvas.style.visibility = "hidden";
        } else {
          mainCanvas.style.visibility = "visible";
        }
      }

      // Phase 1: scrollY 0 to vh -> Black panel slides up from 100vh to 0
      if (scrollY <= vh) {
        const panelOffset = vh - scrollY;
        panel.style.transform = `translateY(${panelOffset}px)`;
        innerWrap.style.transform = "translateY(0px)";

        // Reset outro elements
        if (outroOverlay) outroOverlay.style.opacity = "0";
        if (outroBuy) outroBuy.style.transform = "scale(0)";
        if (outroInfo) outroInfo.style.transform = "translateY(0px)";
        if (outroFooter) outroFooter.style.opacity = "0";

        // Cards scale calculation during Phase 1
        cardsRef.current.forEach((card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          // rect already includes the panel translateY because card is inside panel
          const top = rect.top;
          const bottom = rect.bottom;

          if (bottom <= 0 || top >= vh) {
            card.style.transform = "scale(0)";
          } else {
            const enter = Math.min(1, (vh - top) / (vh * 0.6));
            const exit = Math.min(1, bottom / (vh * 0.4));
            const scale = Math.max(0, Math.min(enter, exit));
            card.style.transform = `scale(${scale})`;
          }
        });
      }
      // Phase 2: scrollY > vh -> Black panel stays fixed at top, inner wrapper translates up
      else {
        panel.style.transform = "translateY(0px)";
        const innerTranslateY = scrollY - vh;
        innerWrap.style.transform = `translateY(-${innerTranslateY}px)`;

        // Cards scale calculation during Phase 2
        cardsRef.current.forEach((card) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const top = rect.top;
          const bottom = rect.bottom;

          if (bottom <= 0 || top >= vh) {
            card.style.transform = "scale(0)";
          } else {
            const enter = Math.min(1, (vh - top) / (vh * 0.6));
            const exit = Math.min(1, bottom / (vh * 0.4));
            const scale = Math.max(0, Math.min(enter, exit));
            card.style.transform = `scale(${scale})`;
          }
        });

        // Outro phase: scrollY > vh + maxScroll
        if (scrollY > vh + maxScroll) {
          const denominator = Math.max(100, vh - 100);
          const outroProgress = Math.max(
            0,
            Math.min(1, (scrollY - vh - maxScroll) / denominator)
          );

          if (outroOverlay) outroOverlay.style.opacity = `${outroProgress}`;
          if (outroBuy) outroBuy.style.transform = `scale(${outroProgress})`;
          if (outroInfo) {
            outroInfo.style.transform = `translateY(-${outroProgress * outroOffset}px)`;
          }
          if (outroFooter) outroFooter.style.opacity = `${outroProgress}`;
        } else {
          if (outroOverlay) outroOverlay.style.opacity = "0";
          if (outroBuy) outroBuy.style.transform = "scale(0)";
          if (outroInfo) outroInfo.style.transform = "translateY(0px)";
          if (outroFooter) outroFooter.style.opacity = "0";
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateSpacerHeight);
    };
  }, [gridRows]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 bg-black z-10 overflow-hidden select-none"
      style={{
        transform: "translateY(100vh)",
        willChange: "transform",
      }}
    >
      {/* Inner Wrapper: width: 100%, padding-top: min(400px, 40vh) */}
      <div
        ref={innerWrapRef}
        className="w-full relative px-4 sm:px-8 lg:px-12 pb-64"
        style={{
          paddingTop: "min(400px, 40vh)",
          willChange: "transform",
        }}
      >
        {/* Scattered Grid Rows */}
        <div className="flex flex-col gap-6 sm:gap-10 lg:gap-14 w-full max-w-[1720px] mx-auto">
          {gridRows.map((row, rIdx) => (
            <div
              key={`row-${rIdx}`}
              className="grid gap-4 sm:gap-8 lg:gap-12 w-full"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              }}
            >
              {row.map((itemIdx, cIdx) => {
                if (itemIdx === -1 || !PRODUCTS[itemIdx]) {
                  // Empty spacer cell
                  return (
                    <div
                      key={`empty-${rIdx}-${cIdx}`}
                      className="w-full aspect-[2/3] pointer-events-none"
                    />
                  );
                }

                const product = PRODUCTS[itemIdx];
                const isLeftHalf = cIdx < cols / 2;
                const transformOrigin = isLeftHalf ? "right bottom" : "left bottom";

                return (
                  <div
                    key={product.id}
                    ref={(el) => {
                      cardsRef.current[itemIdx] = el;
                    }}
                    className="bp-card group relative w-full aspect-[2/3] rounded-sm overflow-hidden bg-[#121212] cursor-pointer"
                    style={{
                      transformOrigin,
                      transform: "scale(0)",
                      willChange: "transform",
                    }}
                    onClick={() => onSelectProduct(product)}
                  >
                    {/* Food Product Image */}
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        priority={itemIdx < 4}
                      />
                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-[10px] tracking-widest font-mono uppercase">
                        <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                          {product.batchNumber}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 backdrop-blur-md px-2 py-0.5 rounded border border-emerald-500/30">
                          FRESH DAILY
                        </span>
                      </div>

                      {/* Bottom Info overlay on Card */}
                      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 text-white">
                        <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                          {product.category}
                        </div>
                        <div className="text-[14px] sm:text-[16px] font-semibold tracking-[-0.03em] leading-tight line-clamp-2">
                          {product.name}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                          <span className="text-[16px] sm:text-[18px] font-bold text-white tracking-tight">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            className="bg-white text-black p-2 rounded-full hover:bg-neutral-200 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
                            aria-label={`Add ${product.name} to cart`}
                          >
                            <Plus className="w-4 h-4 text-black stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
