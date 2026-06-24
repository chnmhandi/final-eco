"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Heart, Sparkles, UserCheck } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const team: TeamMember[] = [
  {
    name: "Francesca Moretti",
    role: "Director of Leather Craft",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    bio: "Francesca has 18 years of heritage design experience in Florence, supervising our sourcing of organic vegetable-tanned hides."
  },
  {
    name: "Klaus Lindemann",
    role: "Master Watchmaker",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80",
    bio: "Klaus oversees the micro-movements of our chronographs, ensuring every dial matches strict Swiss chronometric regulations."
  },
  {
    name: "Aria Sterling",
    role: "Head of Textiles & Apparel",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    bio: "Aria curates our Belgian organic linen coatings and Mulberry silk layers, selecting standard fabrics that are clean and premium."
  }
];

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner header */}
      <section className="relative h-[400px] bg-slate-900 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-950/45 z-10" />
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&auto=format&fit=crop&q=80"
          alt="Luxury workshop sewing detail"
          className="w-full h-full object-cover object-center absolute inset-0"
        />
        <div className="relative z-20 text-center text-white space-y-4 px-4 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Aura Craftsmanship
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide">
            Our Brand Story
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Bridging Italian-leather watchmaking heritages with contemporary, sustainable lifestyles.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              The Genesis
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 leading-tight">
              Crafting Goods That Accumulate History
            </h2>
            <div className="text-slate-500 space-y-4 text-sm font-semibold leading-relaxed">
              <p>
                AURA was founded on a simple premise: in a world of quick-consumption products, true luxury is measured by time. We set out to design accessories, travel cases, and home furniture that doesn&rsquo;t deteriorate, but matures.
              </p>
              <p>
                By working alongside third-generation family workshops in Milan, Basel, and Bruges, we combine centuries-old leather-tanning, micro-chronometry, and organic linen-weaving secrets with clean, minimalist aesthetics.
              </p>
              <p>
                We do not compromise. We only launch items when their durability, utility, and environmental footprint satisfy our strict standards. This is the AURA lifetime commitment.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl aspect-square bg-slate-100 border border-slate-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
              alt="Curated accessories close-up"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Corporate values cards grid */}
        <section id="values" className="space-y-10 border-t border-slate-200 pt-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Values</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              The Pillars of AURA Design
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Value 1 */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-accent/5 border border-accent/10 text-accent flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">100% Sustainability</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Every single cowhide used is vegetable-tanned from gold-rated tanneries, and every textile is harvested from FSC-certified organic Belgian fields.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-accent/5 border border-accent/10 text-accent flex items-center justify-center shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Minimalist Precision</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                We pare away unnecessary detailing, leaving structural geometries that align with modern architecture and sit comfortably in visual environments.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-accent/5 border border-accent/10 text-accent flex items-center justify-center shadow-sm">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Bespoke Concierge Care</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Your purchase is the start of a partnership. Our global styling concierge is available round-the-clock for refurbishment requests.
              </p>
            </div>

          </div>
        </section>

        {/* Team Section */}
        <section id="craft" className="space-y-10 border-t border-slate-200 pt-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The Masters</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Our Styling Directors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-28 w-28 rounded-full object-cover mx-auto border-2 border-accent shadow-sm"
                />
                <div>
                  <h4 className="font-serif text-base font-bold text-slate-900">{member.name}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{member.role}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
