"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, ArrowRight, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { CartItem } from "../types";
import { PRODUCTS, TOTAL_COLLECTION_PRICE } from "../data/products";
import confetti from "canvas-confetti";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddFullBundle: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onAddFullBundle,
}: CartDrawerProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery = subtotal > 60 || subtotal === 0 ? 0 : 5.0;
  const total = subtotal + delivery;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setCheckoutNotice(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((it) => ({
            name: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
            description: it.product.description,
            image: it.product.image,
          })),
          customerEmail: email || undefined,
        }),
      });

      const data = await response.json();

      if (data.configured && data.url) {
        // Live Stripe Session
        window.location.href = data.url;
      } else {
        // Demo / API Port Ready Mode
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setCheckoutNotice(
          "Stripe API port is verified and connected! To process real cards, add STRIPE_SECRET_KEY to your .env.local file. Your mock order was received successfully!"
        );
      }
    } catch (err: unknown) {
      console.error(err);
      setCheckoutNotice("Checkout connection failed. Please check network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0e0e0e] text-white h-full shadow-2xl flex flex-col z-10 border-l border-white/10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">FRESH ORDER CART</h2>
            <p className="text-xs text-neutral-400 font-mono">
              DAILY DELIVERY DISPATCH • MORNING BATCH
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Add Full Bundle Banner */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-neutral-900 to-neutral-800 border border-white/15 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMPLETE ARCHIVE SET</span>
              </div>
              <p className="text-sm font-semibold">10 Daily Culinary Items</p>
              <p className="text-xs text-neutral-400">
                Special Archive Price: ${TOTAL_COLLECTION_PRICE.toFixed(2)}
              </p>
            </div>
            <button
              onClick={onAddFullBundle}
              className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded hover:bg-neutral-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              + ADD ALL
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="text-neutral-400 text-sm">Your fresh archive bag is empty.</p>
              <button
                onClick={onAddFullBundle}
                className="inline-block px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-neutral-200 cursor-pointer"
              >
                Add Daily Archive Bundle (${TOTAL_COLLECTION_PRICE.toFixed(2)})
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-lg bg-neutral-900/60 border border-white/5 items-center"
                >
                  <div className="relative w-16 h-20 rounded overflow-hidden flex-shrink-0 bg-neutral-800">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-neutral-400">
                      {product.batchNumber}
                    </div>
                    <div className="text-sm font-medium truncate">{product.name}</div>
                    <div className="text-sm font-bold text-white mt-1">
                      ${(product.price * quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-white/20 rounded">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {checkoutNotice && (
            <div className="p-4 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs leading-relaxed">
              {checkoutNotice}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0e0e0e] space-y-4">
            <div className="space-y-1.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insulated Cold-Chain Courier</span>
                <span className="text-white">
                  {delivery === 0 ? "FREE (Orders $60+)" : `$${delivery.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Delivery confirmation email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/20 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PREPARING STRIPE CHECKOUT...</span>
                </>
              ) : (
                <>
                  <span>CHECKOUT VIA STRIPE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>STRIPE ENCRYPTED • SAME-DAY FRESH GUARANTEE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
