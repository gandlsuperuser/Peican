"use client";

import React from "react";
import { X, Sparkles, Truck, Flame, HeartHandshake, CheckCircle } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-[#0f0f0f] text-white rounded-xl border border-white/15 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FRESH ONLINE RETAIL MANIFESTO</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-1">PRMPT (R) ARCHIVE</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <p>
            <strong>PRMPT</strong> is a daily-batch culinary archive redefining food retail.
            We treat gastronomy with the meticulous precision of a luxury archive house. Every single
            item—from our hand-laminated purple taro brioche pockets to our small-batch Muscat grape gelato
            and slow-braised Sichuan prime beef bowls—is crafted starting at 05:00 AM every morning.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded bg-neutral-900 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Zero Storage / Same-Day Courier</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Cooked and chilled under sealed temperature control. Dispatched before 11:30 AM.
              </p>
            </div>

            <div className="p-3 rounded bg-neutral-900 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>No Artificial Additives</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                100% natural vegetable dyes, raw whole milk, organic taro, and hand-cut fresh fruits.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-neutral-900/80 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-mono font-bold uppercase">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Stripe Payment Integration Ready</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              API routes <code className="text-neutral-200">/api/checkout</code> and <code className="text-neutral-200">/api/stripe</code> are wired to Stripe Checkout Session endpoints. Add your <code className="text-neutral-200">STRIPE_SECRET_KEY</code> to immediately handle credit cards, Apple Pay, and Google Pay worldwide.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <HeartHandshake className="w-4 h-4" />
            <span>PRMPT FOODS • ALL RIGHTS RESERVED 2026</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
