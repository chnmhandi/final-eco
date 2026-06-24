"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useShop();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setSubscribed(true);
    showToast("Thank you for subscribing to AURA updates.", "success");
    setEmail("");
  };

  const footerLinks = {
    collections: [
      { name: "All Products", href: "/products" },
      { name: "New Arrivals", href: "/products?filter=trending" },
      { name: "Best Sellers", href: "/products?filter=bestseller" },
      { name: "Accessories", href: "/products?category=Accessories" },
      { name: "Home Collection", href: "/products?category=Home" }
    ],
    support: [
      { name: "Contact Concierge", href: "/contact" },
      { name: "FAQs & Help", href: "/contact#faqs" },
      { name: "Complimentary Shipping", href: "/about" },
      { name: "Complimentary Returns", href: "/about" },
      { name: "Order Tracking", href: "/orders" }
    ],
    company: [
      { name: "Our Story", href: "/about" },
      { name: "Craftsmanship", href: "/about#craft" },
      { name: "Sustainability Standards", href: "/about#values" },
      { name: "Press & Inquiries", href: "/contact" }
    ]
  };

  return (
    <footer className="bg-primary-dark text-white border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-white/10 pb-12">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="font-serif text-3xl font-bold tracking-widest text-white">
              AURA
            </Link>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Curating high-end design, sustainable craftsmanship, and luxury utility essentials for the modern lifestyle.
            </p>

            {/* Newsletter input */}
            <div className="space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Subscribe to our Journal
              </span>
              {subscribed ? (
                <div className="text-sm text-accent font-medium transition animate-fade-in-up">
                  Thank you! You are now subscribed to AURA Journal.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-white focus:ring-1 focus:ring-white text-sm text-white placeholder-slate-400 transition"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-white text-primary hover:bg-slate-100 rounded-full transition cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">
              Collections
            </h4>
            <ul className="space-y-3">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">
              Concierge
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">
              Our Brand
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Details */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} AURA Goods Inc. All rights reserved. Made with love for high-end commerce.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition" aria-label="Instagram">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
