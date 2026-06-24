"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/data/categories";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.name)}`}
      className="group relative block overflow-hidden rounded-2xl aspect-3/4 shadow-sm border border-slate-100/50 cursor-pointer"
    >
      {/* Background Image Zooming on hover */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Dark elegant overlay mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-slate-950/20 group-hover:via-slate-900/40 transition-all duration-300" />

      {/* Content overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        <div className="space-y-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
            {category.itemCount} Items
          </span>
          <h3 className="font-serif text-2xl font-bold tracking-wide">
            {category.name}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {category.description}
          </p>
        </div>
      </div>

      {/* Floating corner indicator icon */}
      <div className="absolute top-5 right-5 p-2 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 border border-white/15">
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </Link>
  );
};

export default CategoryCard;
