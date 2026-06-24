"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  align: "left" | "right" | "center";
}

const slides: Slide[] = [
  {
    id: 1,
    title: "AURA LUXURY GOODS",
    subtitle: "Designed for the Modern Voyager",
    description: "Discover our limited release of precision chronographs and full-grain leather bags hand-crafted in Milan.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Shop the Collection",
    ctaLink: "/products?category=Accessories",
    align: "left"
  },
  {
    id: 2,
    title: "TRANSITIONAL WEAR",
    subtitle: "Sustainably Crafted Apparel",
    description: "Experience double-breasted organic Belgian linen trench coats and bespoke Mulberry silk sleepwear sets.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Explore Apparel",
    ctaLink: "/products?category=Apparel",
    align: "center"
  },
  {
    id: 3,
    title: "MINIMALIST LIVING",
    subtitle: "Sculptural Home Accents",
    description: "Curated walnut drippers, stone ultrasonic diffusers, and design icons designed to elevate your living space.",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&auto=format&fit=crop&q=80",
    ctaText: "Shop Home Collection",
    ctaLink: "/products?category=Home",
    align: "right"
  }
];

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const alignStyles = {
    left: "text-left items-start mr-auto",
    right: "text-right items-end ml-auto",
    center: "text-center items-center mx-auto"
  };

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Slide Background Image */}
          <div className="absolute inset-0 bg-slate-950/40 z-10" />
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover object-center"
          />

          {/* Slide Content Box */}
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className={`max-w-2xl flex flex-col gap-4 text-white ${alignStyles[slides[current].align]}`}>
                
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-accent"
                >
                  {slides[current].title}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-serif text-4xl sm:text-6xl font-bold tracking-wide leading-tight"
                >
                  {slides[current].subtitle}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-lg text-slate-200 font-medium leading-relaxed max-w-lg"
                >
                  {slides[current].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4"
                >
                  <Link
                    href={slides[current].ctaLink}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all hover:gap-3 cursor-pointer shadow-lg"
                  >
                    <span>{slides[current].ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Slide Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/20 bg-slate-950/20 backdrop-blur-sm text-white hover:bg-white hover:text-slate-950 transition z-30 hidden sm:block cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/20 bg-slate-950/20 backdrop-blur-sm text-white hover:bg-white hover:text-slate-950 transition z-30 hidden sm:block cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
