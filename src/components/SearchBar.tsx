"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/data/products";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onClose?: () => void;
  isOverlay?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose, isOverlay = false }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { recentSearches, addRecentSearch, clearRecentSearches, products } = useShop();

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions as query changes
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    setSuggestions(filtered);
  }, [query, products]);

  const handleSearchSubmit = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setIsOpen(false);
    if (onClose) onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(query);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products, brands, collections..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`w-full pl-12 pr-10 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/5 bg-slate-50 hover:bg-slate-100/50 transition-all text-sm text-slate-800 placeholder-slate-400 ${
            isOverlay ? "lg:py-4 lg:text-base" : ""
          }`}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 p-5 rounded-2xl bg-white border border-slate-100 shadow-2xl z-50 overflow-hidden"
          >
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Recent Searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-slate-400 hover:text-slate-600 transition"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(search);
                        handleSearchSubmit(search);
                      }}
                      className="flex items-center gap-3 py-2 px-3 hover:bg-slate-50 rounded-lg text-sm text-slate-600 hover:text-slate-900 transition text-left"
                    >
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live suggestions */}
            {query && (
              <div>
                {suggestions.length > 0 ? (
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      Suggestions
                    </span>
                    <div className="flex flex-col gap-2">
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            addRecentSearch(item.name);
                            setIsOpen(false);
                            if (onClose) onClose();
                            router.push(`/products/${item.id}`);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition text-left w-full group"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition">
                              {item.name}
                            </h4>
                            <span className="text-xs text-slate-400">{item.category}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-900">${item.price}</span>
                          <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <span className="text-sm text-slate-400">
                      No suggestions for &ldquo;{query}&rdquo;
                    </span>
                    <button
                      onClick={() => handleSearchSubmit(query)}
                      className="block mx-auto mt-2 text-xs font-semibold text-primary hover:text-primary-dark transition"
                    >
                      Search for &ldquo;{query}&rdquo; anyway
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
