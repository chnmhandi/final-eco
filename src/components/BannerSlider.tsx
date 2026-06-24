"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Percent, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  title: string;
  subtitle: string;
  couponCode?: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const banners: Banner[] = [
  {
    title: "SUMMER SOLSTICE PROMOTION",
    subtitle: "Enjoy complimentary express shipping and 10% off storewide.",
    couponCode: "AURA10",
    icon: <Percent className="h-5 w-5" />,
    bgColor: "bg-accent/5",
    borderColor: "border-accent/20",
    textColor: "text-accent"
  },
  {
    title: "THE AURA LIFETIME PROMISE",
    subtitle: "Every full-grain leather bag carries a lifetime guarantee of care.",
    icon: <ShieldCheck className="h-5 w-5 animate-pulse" />,
    bgColor: "bg-emerald-500/5",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-600"
  },
  {
    title: "NEXT-DAY CONCIERGE SHIPMENTS",
    subtitle: "Place your order within the next 4 hours for immediate shipping dispatch.",
    icon: <Zap className="h-5 w-5" />,
    bgColor: "bg-blue-500/5",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-600"
  }
];

const BannerSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className={`border rounded-2xl p-4 overflow-hidden relative transition-all duration-500 ${banners[current].bgColor} ${banners[current].borderColor}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left px-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className={`p-3 rounded-full bg-white shadow-sm border ${banners[current].borderColor} ${banners[current].textColor}`}>
                {banners[current].icon}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {banners[current].title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {banners[current].subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {banners[current].couponCode && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Use Code:</span>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold font-mono tracking-wider text-slate-900 shadow-sm">
                    {banners[current].couponCode}
                  </span>
                </div>
              )}
              <Link
                href="/products"
                className="text-xs font-bold text-slate-800 hover:text-slate-900 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Learn More</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BannerSlider;
