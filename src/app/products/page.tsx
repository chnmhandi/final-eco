"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import { ChevronRight, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ProductListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, categories } = useShop();

  // URL parameters parsing
  const categoryParam = searchParams.get("category") || "";
  const filterParam = searchParams.get("filter") || ""; // 'trending' or 'bestseller'

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState<number>(600);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Mobile filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination loading states
  const [visibleCount, setVisibleCount] = useState(6);
  const [isSubmittingLoadMore, setIsSubmittingLoadMore] = useState(false);

  // Sync category state with search parameter
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Unique colors in our mock database
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => colors.add(c.name)));
    return Array.from(colors);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by special dashboard types
    if (filterParam === "trending") {
      result = result.filter((p) => p.isTrending);
    } else if (filterParam === "bestseller") {
      result = result.filter((p) => p.isBestSeller);
    }

    // Filter by max price
    result = result.filter((p) => p.price <= priceRange);

    // Filter by color
    if (selectedColor) {
      result = result.filter((p) => p.colors.some((c) => c.name === selectedColor));
    }

    // Filter by size
    if (selectedSize) {
      result = result.filter((p) => p.sizes && p.sizes.includes(selectedSize));
    }

    // Sort operations
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      // Default chronological layout mapping
      result.sort((a, b) => b.price - a.price); // Mock newer products are more premium
    }

    return result;
  }, [selectedCategory, filterParam, priceRange, selectedColor, selectedSize, sortBy]);

  // Load More logic simulator
  const handleLoadMore = () => {
    setIsSubmittingLoadMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsSubmittingLoadMore(false);
    }, 800);
  };

  const handleResetFilters = () => {
    setSelectedCategory("");
    setPriceRange(600);
    setSelectedColor("");
    setSelectedSize("");
    setSortBy("featured");
    router.push("/products");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">Collections</span>
        {selectedCategory && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-900 lowercase capitalize">{selectedCategory}</span>
          </>
        )}
      </nav>

      {/* Title & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            {selectedCategory ? `${selectedCategory} Collection` : "All Premium Products"}
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Displaying {Math.min(filteredProducts.length, visibleCount)} of {filteredProducts.length} results
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* Sorting */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 bg-white text-sm font-semibold text-slate-600">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:outline-none pr-2 cursor-pointer text-slate-700 font-semibold"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex gap-10">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          
          {/* Filter Section: Category */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Categories</h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  router.push("/products");
                }}
                className={`text-sm text-left transition font-semibold ${
                  !selectedCategory ? "text-primary font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Goods
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    router.push(`/products?category=${encodeURIComponent(cat.name)}`);
                  }}
                  className={`text-sm text-left transition font-semibold ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? "text-primary font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Section: Price Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Max Price</h4>
              <span className="text-xs font-bold text-slate-900">${priceRange}</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>$50</span>
              <span>$600</span>
            </div>
          </div>

          {/* Filter Section: Colors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Color Swatch</h4>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? "" : color)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                    selectedColor === color
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Section: Sizes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Sizing</h4>
            <div className="flex flex-wrap gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                  className={`h-9 w-9 rounded-full border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    selectedSize === size
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters Option */}
          {(selectedCategory || priceRange < 600 || selectedColor || selectedSize) && (
            <button
              onClick={handleResetFilters}
              className="w-full py-3 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 space-y-12">
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* simulated infinite scroll trigger */}
              {filteredProducts.length > visibleCount && (
                <div className="text-center pt-6">
                  {isSubmittingLoadMore ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <ProductCardSkeleton key={idx} />
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
                    >
                      Load More Products
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            // Custom Empty State
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
              <SlidersHorizontal className="h-16 w-16 text-slate-200 mb-4" />
              <h3 className="font-serif text-xl font-bold text-slate-800">No products match your filters</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Try widening your price range, choosing another luxury category, or resetting your filter configurations.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-wider uppercase transition shadow-md cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Sliding Drawer overlay */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <h3 className="font-serif text-lg font-bold text-slate-900">Refine Products</h3>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-2 -mr-2 text-slate-400 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Category</h4>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedCategory("")}
                        className={`text-sm text-left transition font-semibold ${
                          !selectedCategory ? "text-primary font-bold" : "text-slate-500"
                        }`}
                      >
                        All Products
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`text-sm text-left transition font-semibold ${
                            selectedCategory.toLowerCase() === cat.name.toLowerCase()
                              ? "text-primary font-bold"
                              : "text-slate-500"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Max Price</h4>
                      <span className="text-xs font-bold text-slate-900">${priceRange}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="600"
                      step="10"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  {/* Colors */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(selectedColor === color ? "" : color)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer ${
                            selectedColor === color
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizing */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Sizes</h4>
                    <div className="flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                          className={`h-9 w-9 rounded-full border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                            selectedSize === size
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-6 flex flex-col gap-2">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-3.5 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase transition shadow-md cursor-pointer"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsFilterDrawerOpen(false);
                  }}
                  className="w-full py-3.5 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold tracking-wider uppercase transition cursor-pointer"
                >
                  Reset All
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ProductListing() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-400">Loading catalog...</div>}>
      <ProductListingContent />
    </Suspense>
  );
}
