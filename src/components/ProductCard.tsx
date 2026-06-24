"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();

  const isLiked = isInWishlist(product.id);

  // Compute discount percent if original price is provided
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first color variant
    const defaultColor = product.colors[0]?.name || "Default";
    // Default to first size if sizes are available
    const defaultSize = product.sizes ? product.sizes[0] : undefined;
    addToCart(product, 1, defaultColor, defaultSize);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block relative">
      <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-square mb-4 shadow-sm border border-slate-100/50">
        
        {/* Hover zoom image container */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-700"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
        </div>

        {/* Product Badges (Top Left) */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary text-white shadow-sm">
              {product.tag}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-accent text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Action Button (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 p-2.5 rounded-full glassmorphism hover:bg-white shadow-md z-10 transition-all duration-300 text-slate-500 hover:text-rose-500 active:scale-90"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              isLiked ? "fill-rose-500 text-rose-500" : "text-slate-500"
            }`}
          />
        </button>

        {/* Quick Add overlay button at bottom */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs tracking-wider uppercase transition shadow-xl hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add to Bag</span>
          </button>
        </div>

        {/* Dark overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Info details */}
      <div className="space-y-1">
        <span className="text-xs tracking-widest text-slate-400 uppercase font-semibold">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition truncate">
          {product.name}
        </h3>
        
        {/* Rating summary */}
        <div className="flex items-center gap-1">
          <div className="flex items-center text-amber-400">
            <Star className="h-3 w-3 fill-current" />
          </div>
          <span className="text-xs text-slate-500 font-semibold">{product.rating}</span>
          <span className="text-slate-300 text-[10px]">&bull;</span>
          <span className="text-[10px] text-slate-400 font-medium">({product.reviewCount})</span>
        </div>

        {/* Price Tag */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-sm font-bold text-slate-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
