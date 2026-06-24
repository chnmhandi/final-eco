"use client";

import React from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/ProductCard";
import { Heart, Compass, ChevronRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">Saved Masterpieces</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review your curated luxury wishlist wishlist</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto px-6">
          <Heart className="h-16 w-16 text-slate-200 mb-4 animate-pulse" />
          <h3 className="font-serif text-xl font-bold text-slate-800">Your wishlist is empty</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            Save items to your wishlist by clicking the heart icon on any card or detail page.
          </p>
          <Link
            href="/products"
            className="mt-6 px-6 py-3 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
          >
            Explore Catalogue
          </Link>
        </div>
      )}

    </div>
  );
}
