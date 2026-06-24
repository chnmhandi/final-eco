"use client";

import React, { useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { Search, Compass, ChevronRight } from "lucide-react";
import Link from "next/link";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const { products } = useShop();

  // Perform filtering based on keyword query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  // Suggested keywords if search fails or is empty
  const trendingSearches = ["watch", "bag", "chair", "linen", "diffuser", "headphones"];
  
  // Recommended products for empty state
  const suggestions = products.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">Search Results</span>
      </nav>

      {/* Header and Re-search input */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            {query ? `Search Results for &ldquo;${query}&rdquo;` : "Find Luxury Essentials"}
          </h1>
          {query && (
            <p className="text-xs text-slate-400 font-semibold mt-2">
              Found {searchResults.length} {searchResults.length === 1 ? "match" : "matches"} in our collection
            </p>
          )}
        </div>
        <div className="w-full shadow-sm rounded-full bg-white">
          <SearchBar />
        </div>
      </div>

      {/* Results grid or Empty State */}
      {query && searchResults.length > 0 ? (
        <section className="space-y-6 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        // Empty State visual
        <div className="space-y-12">
          
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 px-6 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <Search className="h-16 w-16 text-slate-200 mb-4" />
            <h3 className="font-serif text-lg font-bold text-slate-800">
              {query ? `No matches found for &ldquo;${query}&rdquo;` : "Start search above"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              We couldn&rsquo;t find any premium timepieces, home decor, or apparel fitting your criteria. Try searching a different keyword.
            </p>

            {/* Popular tags suggestions */}
            <div className="space-y-3 mt-8">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Trending Suggestions
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Collections */}
          <section className="border-t border-slate-100 pt-10">
            <div className="mb-8 text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Concierge Select
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">Recommended Curations</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      )}

    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-400">Searching catalog...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
