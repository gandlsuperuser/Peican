"use client";

import React from "react";
import Image from "next/image";
import { X, Clock, Flame, Shield, Plus } from "lucide-react";
import { ProductItem } from "../types";

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#111111] text-white rounded-xl overflow-hidden border border-white/15 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/5] sm:aspect-auto sm:h-full bg-neutral-900">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-white/90 border border-white/10">
              {product.batchNumber}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  {product.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                  {product.name}
                </h3>
                <div className="text-xl font-bold text-white mt-2">
                  ${product.price.toFixed(2)}
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-neutral-900 border border-white/10 flex items-center gap-1.5 text-neutral-300">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="truncate">{product.prepTime}</span>
                </div>
                <div className="p-2 rounded bg-neutral-900 border border-white/10 flex items-center gap-1.5 text-neutral-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{product.calories}</span>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="text-[11px] font-mono uppercase text-neutral-400 mb-2">
                  Artisanal Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-neutral-200 border border-white/5"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>ADD TO DAILY BASKET (${product.price.toFixed(2)})</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                <Shield className="w-3 h-3" />
                <span>CRAFTED TODAY • SAME-DAY COLD CHAIN DISPATCH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
