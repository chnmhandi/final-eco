"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import HeroSection from "@/components/HeroSection";
import BannerSlider from "@/components/BannerSlider";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { ArrowRight, Star, Quote, ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface Testimonial {
  id: number;
  userName: string;
  role: string;
  rating: number;
  comment: string;
  avatarUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    userName: "Julian K.",
    role: "Collector & Designer",
    rating: 5,
    comment: "The craftsmanship of the Meridian Chronograph is unparalleled. I've worn luxury watches twice the price, but this captures a minimalist beauty that is hard to find.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    userName: "Sophia L.",
    role: "Executive Traveler",
    rating: 5,
    comment: "My Classic Leather Weekender has been on a dozen long-haul flights and still looks pristine. The patina is developing into a rich, deep cognac. Exceptional utility and design.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    userName: "Alexander M.",
    role: "Architect",
    rating: 5,
    comment: "The Nouveau lounge chair completes my study. The walnut shell is molded to perfection and the cream boucle texture is incredibly premium. It's a true statement piece.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
  }
];

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { products, categories } = useShop();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter((p) => p.isTrending || p.isBestSeller).slice(0, 4);

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. Hero banner slider */}
      <HeroSection />

      {/* 2. Mini offer slide updates */}
      <BannerSlider />

      {/* 3. Browse categories grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-wide text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-bold text-slate-800 hover:text-slate-900 flex items-center gap-1 hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 5).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 4. Featured products grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 py-12 rounded-3xl border border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Design Icons
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-wide text-slate-900 mt-1">
              Featured Masterpieces
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-slate-800 hover:text-slate-900 flex items-center gap-1 hover:underline"
          >
            <span>See Full Store</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Campaign Promo Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Promo Box 1 */}
          <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-auto lg:h-[450px] group shadow-sm border border-slate-100">
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors z-10" />
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
              alt="Bespoke leather craft campaign"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 p-8 sm:p-10 z-20 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Craftsmanship Story
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 max-w-sm">
                Italian-Tanned Full Grain Leather
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mb-6 font-medium">
                Our workshops in Florence process leather using traditional oak extracts, creating deep, beautiful patinas that age beautifully over a lifetime.
              </p>
              <div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all hover:gap-3 cursor-pointer"
                >
                  <span>Explore Our Craft</span>
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Promo Box 2 */}
          <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-auto lg:h-[450px] group shadow-sm border border-slate-100">
            <div className="absolute inset-0 bg-slate-950/25 group-hover:bg-slate-950/35 transition-colors z-10" />
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
              alt="Premium lifestyle accessories"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 p-8 sm:p-10 z-20 flex flex-col justify-end text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-accent mb-2">
                Limited Release
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 max-w-sm">
                Apex Acetate Sun & Accessories
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md mb-6 font-medium">
                Designed with bio-degradable cellulose frames, double metal core hinges, and custom Carl Zeiss lenses for ultimate UV filtration.
              </p>
              <div>
                <Link
                  href="/products?category=Accessories"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all hover:gap-3 cursor-pointer"
                >
                  <span>Shop Accessories</span>
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Trending goods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Hot List
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-wide text-slate-900 mt-1">
              Trending Collections
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold text-slate-800 hover:text-slate-900 flex items-center gap-1 hover:underline"
          >
            <span>Explore All Goods</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Testimonials Client Reviews */}
      <section className="bg-primary text-white py-16 sm:py-20 overflow-hidden relative border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Quote className="h-10 w-10 text-accent/30 mx-auto mb-6 shrink-0" />
          
          <div className="min-h-[160px] flex items-center justify-center">
            <motion.p
              key={activeTestimonial}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-lg sm:text-2xl font-semibold leading-relaxed tracking-wide"
            >
              &ldquo;{testimonials[activeTestimonial].comment}&rdquo;
            </motion.p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <img
              src={testimonials[activeTestimonial].avatarUrl}
              alt={testimonials[activeTestimonial].userName}
              className="h-12 w-12 rounded-full object-cover border-2 border-accent"
            />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">{testimonials[activeTestimonial].userName}</h4>
              <span className="text-xs text-slate-400 font-semibold">{testimonials[activeTestimonial].role}</span>
            </div>
          </div>

          {/* Testimonial navigators */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevTestimonial}
              className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === idx ? "w-4 bg-accent" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextTestimonial}
              className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Backdrop visual detail */}
        <div className="absolute right-[-10%] top-[-20%] text-white/5 font-serif text-[12rem] font-bold select-none pointer-events-none">
          AURA
        </div>
      </section>

      {/* 8. Journal Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Aura Journal
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-wide text-slate-900 mt-1">
            Lifestyle & Inspiration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Post 1 */}
          <div className="space-y-3 group cursor-pointer">
            <div className="overflow-hidden rounded-2xl aspect-16/10 bg-slate-100 border border-slate-100/50 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80"
                alt="Slow living collection"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Design / June 2026</span>
              <h3 className="font-serif text-base font-bold text-slate-800 group-hover:text-primary transition mt-1">
                The Art of Slow Living & Minimalist Home Spaces
              </h3>
            </div>
          </div>

          {/* Post 2 */}
          <div className="space-y-3 group cursor-pointer">
            <div className="overflow-hidden rounded-2xl aspect-16/10 bg-slate-100 border border-slate-100/50 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
                alt="Horology craft post"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Horology / May 2026</span>
              <h3 className="font-serif text-base font-bold text-slate-800 group-hover:text-primary transition mt-1">
                An In-depth Guide to Modern Mechanical Timers
              </h3>
            </div>
          </div>

          {/* Post 3 */}
          <div className="space-y-3 group cursor-pointer">
            <div className="overflow-hidden rounded-2xl aspect-16/10 bg-slate-100 border border-slate-100/50 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
                alt="Leather sourcing post"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Sustainability / April 2026</span>
              <h3 className="font-serif text-base font-bold text-slate-800 group-hover:text-primary transition mt-1">
                Why Vegetable-Tanned Leather is Worth the Investment
              </h3>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
