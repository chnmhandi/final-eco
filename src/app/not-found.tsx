"use client";

import React from "react";
import Link from "next/link";
import { Compass, HelpCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl">
        
        {/* Large graphic */}
        <div className="relative">
          <span className="font-serif text-[7rem] font-extrabold text-slate-100 select-none block leading-none">
            404
          </span>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full border border-slate-100 shadow-sm">
            <Compass className="h-10 w-10 text-accent animate-spin" style={{ animationDuration: "12s" }} />
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Journey Off Limits</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold max-w-xs mx-auto">
            The page you are looking for has been moved, renamed, or is currently unavailable. Let us guide you back to the collection.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/products"
            className="flex-1 py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Explore Goods</span>
          </Link>
          <Link
            href="/"
            className="flex-1 py-3.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back Home</span>
          </Link>
        </div>

        <div className="border-t border-slate-50 pt-5 text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <HelpCircle className="h-4 w-4" />
          <span>Need support? <Link href="/contact" className="text-primary hover:underline">Contact concierge desk</Link></span>
        </div>

      </div>
    </div>
  );
}
