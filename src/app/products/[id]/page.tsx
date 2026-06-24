"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/ProductCard";
import { ProductDetailsSkeleton } from "@/components/LoadingSkeleton";
import {
  ChevronRight,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  ChevronDown
} from "lucide-react";

export default function ProductDetails() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const { addToCart, toggleWishlist, isInWishlist, products } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Gallery index
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Variant choices
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Details accordion state
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "delivery">("description");

  // Fetch product from mock database
  useEffect(() => {
    setLoading(true);
    const item = products.find((p) => p.id === productId);
    if (item) {
      setProduct(item);
      setSelectedColor(item.colors[0]?.name || "");
      setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : "");
      setActiveImageIdx(0);
      setQuantity(1);
    } else {
      setProduct(null);
    }
    setLoading(false);
  }, [productId]);

  if (loading) return <ProductDetailsSkeleton />;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-400 mt-2">The luxury timepiece or accessory you are looking for does not exist in our catalog.</p>
        <Link href="/products" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isLiked = isInWishlist(product.id);

  const handleAddToBag = () => {
    addToCart(product, quantity, selectedColor, selectedSize || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize || undefined);
    router.push("/checkout");
  };

  // Compute discount percent
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-primary transition">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition lowercase capitalize">
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product showcase grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Photo Gallery */}
        <div className="space-y-4">
          
          {/* Main Visual Image */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-100 aspect-square border border-slate-100/50 shadow-sm group">
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
            {product.tag && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-primary text-white shadow-md">
                {product.tag}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`h-20 w-20 rounded-xl overflow-hidden bg-slate-100 border-2 shrink-0 transition relative cursor-pointer ${
                  activeImageIdx === idx ? "border-primary shadow-sm" : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`thumbnail-${idx}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

        </div>

        {/* Product details and configuration panel */}
        <div className="space-y-6 flex flex-col justify-between py-1">
          <div className="space-y-4">
            
            {/* Category tag & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{product.rating}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Price Tag with discount details */}
            <div className="flex items-baseline gap-4 py-2 border-y border-slate-100">
              <span className="text-2xl font-extrabold text-slate-900">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Brief description */}
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Color Swatch Selector */}
            <div className="space-y-3 pt-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                Selected Color: <span className="font-semibold text-slate-500">{selectedColor}</span>
              </span>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-9 w-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor === color.name
                        ? "border-primary ring-2 ring-primary/10 ring-offset-2 scale-105"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span
                      className="h-6.5 w-6.5 rounded-full border border-black/5"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizing Checkboxes if size is present */}
            {product.sizes && (
              <div className="space-y-3 pt-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                  Select Size: <span className="font-semibold text-slate-500">{selectedSize}</span>
                </span>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 w-11 rounded-full border text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        selectedSize === size
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity controls */}
            <div className="space-y-3 pt-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                Quantity
              </span>
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full w-fit p-1">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="p-2 rounded-full hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <Minus className="h-4.5 w-4.5" />
                </button>
                <span className="text-sm font-bold text-slate-800 w-8 text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 rounded-full hover:bg-slate-50 text-slate-500"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <div className="flex gap-3">
              
              {/* Add to Cart */}
              <button
                onClick={handleAddToBag}
                className="flex-1 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-all shadow-lg hover:shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>Add to Bag</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-rose-500 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>

            </div>

            {/* Buy Now direct triggers */}
            <button
              onClick={handleBuyNow}
              className="w-full py-4 rounded-full bg-accent hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg hover:shadow-accent/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4.5 w-4.5" />
              <span>Buy It Now</span>
            </button>
          </div>

        </div>
      </div>

      {/* Accordion Specs & Detailed Info */}
      <section className="border-t border-slate-200 pt-10">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-8 mb-6 overflow-x-auto no-scrollbar">
          {(["description", "specs", "delivery"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition border-b-2 -mb-0.5 shrink-0 cursor-pointer ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab === "description" && "Product Overview"}
              {tab === "specs" && "Specifications"}
              {tab === "delivery" && "Shipping & Returns"}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="min-h-[150px]">
          {activeTab === "description" && (
            <div className="max-w-3xl space-y-4">
              <h3 className="font-serif text-xl font-bold text-slate-800">Timeless Craft, Modern Design</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {product.longDescription || product.description}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((spec, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition"
                    >
                      <td className="py-3 pr-4 font-bold text-slate-900 w-1/3">{spec.label}</td>
                      <td className="py-3 text-slate-500 font-semibold">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="max-w-2xl space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-100/50 border border-slate-100">
                <Truck className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Complimentary Courier Shipments</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                    Standard complimentary delivery takes 2-4 business days. All packages are insured and carbon-neutral.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-100/50 border border-slate-100">
                <RotateCcw className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">30-Day Free Concierge Returns</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                    Return any items in their original condition within 30 days for an exchange or refund. Return slip included in the box.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-100/50 border border-slate-100">
                <ShieldCheck className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Certified Authentic Guarantee</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1">
                    Every piece purchased carries an official certificate card containing a hologram authenticity serial tracker.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Summary Section */}
      <section className="border-t border-slate-200 pt-10">
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-8">Client Testimonials</h3>
        
        {product.reviews.length > 0 ? (
          <div className="space-y-6 max-w-3xl">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-800">{rev.userName}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-amber-500" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="flex items-center gap-2 self-end text-[10px] text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <span>Helpful?</span>
                  <button className="hover:text-primary transition">Yes ({rev.helpfulCount})</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-slate-400 text-sm">
            No testimonials have been written for this product yet.
          </div>
        )}
      </section>

      {/* Related Products recommendation carousel */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-200 pt-10">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Recommended Collection
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">Related Masterpieces</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
