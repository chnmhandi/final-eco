"use client";

import React from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import CategoryCard from "@/components/CategoryCard";
import { ChevronRight, ArrowUpRight } from "lucide-react";

export default function CategoriesPage() {
  const { categories } = useShop();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">Categories</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Curation Departments
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          Shop by Department
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed font-medium">
          Explore specialized departments crafted with exceptional standards of detail, sustainability, and aesthetic luxury.
        </p>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Department Promo Banner */}
      <section className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-auto lg:h-[320px] group shadow-sm border border-slate-100">
        <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/40 transition-colors z-10" />
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80"
          alt="Limited solstice department collections"
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
        />
        <div className="absolute inset-0 p-8 sm:p-10 z-20 flex flex-col justify-end text-white">
          <div className="max-w-xl space-y-3">
            <span className="inline-block text-[10px] font-bold tracking-wider bg-accent/20 border border-accent/30 text-accent px-3 py-1 rounded-full uppercase">
              Global Campaign
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              AURA Living & Wellness Collection
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium pb-2">
              Transform your modern household into a sanctuary. Our handcrafted ceramic aroma diffusers and premium pour-over brewing sets are now restocked in full-grain colorways.
            </p>
            <div>
              <Link
                href="/products?category=Home"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all hover:gap-3 cursor-pointer shadow-md"
              >
                <span>Explore Wellness Department</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
