"use client";

import React, { useState, useEffect } from "react";
import CustomCursor from "../components/CustomCursor";
import HeaderNav from "../components/HeaderNav";
import Caption from "../components/Caption";
import HeroLuckyCat from "../components/HeroLuckyCat";
import OutroInfo from "../components/OutroInfo";
import OutroBuyButton from "../components/OutroBuyButton";
import { OutroOverlay, OutroFooter } from "../components/OutroElements";
import BlackPanelGallery from "../components/BlackPanelGallery";
import CartDrawer from "../components/CartDrawer";
import ProductModal from "../components/ProductModal";
import AboutModal from "../components/AboutModal";
import { CartItem, ProductItem } from "../types";
import { PRODUCTS } from "../data/products";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Restore cart from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("prmpt_fresh_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("prmpt_fresh_cart", JSON.stringify(newCart));
    } catch {
      // ignore
    }
  };

  const handleAddToCart = (product: ProductItem) => {
    const existingIndex = cart.findIndex((i) => i.product.id === product.id);
    let newCart: CartItem[];
    if (existingIndex > -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    saveCart(newCart);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const newCart = cart
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(newCart);
  };

  const handleRemoveItem = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    saveCart(newCart);
  };

  const handleAddFullBundle = () => {
    // Add all 10 products
    const bundleItems: CartItem[] = PRODUCTS.map((prod) => ({
      product: prod,
      quantity: 1,
    }));
    saveCart(bundleItems);
    setIsCartOpen(true);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main
      id="scroll-spacer"
      className="relative select-none bg-white min-h-screen"
      style={{
        height: "500vh", // dynamic height calculated by BlackPanelGallery RAF
      }}
    >
      {/* 1A. Custom Cursor (Desktop Only) */}
      <CustomCursor />

      {/* Hero Lucky Cat (Restaurant Mascot with 3D cursor rotation) */}
      <HeroLuckyCat />

      {/* 1B & 1D. Logo & Top Navigation */}
      <HeaderNav
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* 1C. Caption */}
      <Caption />

      {/* SECTION 2: Black Panel Gallery */}
      <BlackPanelGallery
        onSelectProduct={(product) => setSelectedProduct(product)}
        onAddToCart={handleAddToCart}
      />

      {/* 1E. Product Info (Bottom Right) */}
      <OutroInfo />

      {/* 1F. "View" Button (Bottom Right, Initially Hidden) */}
      <OutroBuyButton onOpenCart={() => setIsCartOpen(true)} />

      {/* 1I. White Overlay */}
      <OutroOverlay />

      {/* 1J. Footer */}
      <OutroFooter onOpenPrivacy={() => setIsAboutOpen(true)} />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddFullBundle={handleAddFullBundle}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}
