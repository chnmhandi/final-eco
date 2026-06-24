"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Percent, Ticket } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, showToast, products } = useShop();
  
  // Coupon state
  const [coupon, setCoupon] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCoupon = coupon.trim().toUpperCase();
    if (cleanCoupon === "AURA10") {
      setDiscountRate(0.1); // 10% discount
      setAppliedCoupon("AURA10");
      showToast("Coupon 'AURA10' applied! 10% discount subtracted.", "success");
      setCoupon("");
    } else {
      showToast("Invalid coupon code. Try using 'AURA10'.", "error");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountRate(0);
    setAppliedCoupon("");
    showToast("Coupon removed.", "info");
  };

  // Computations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discountRate * 100) / 100;
  const shippingFee = subtotal > 150 || subtotal === 0 ? 0 : 15; // Free over $150
  const tax = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100; // 8% sales tax
  const total = Math.round((subtotal - discountAmount + shippingFee + tax) * 100) / 100;

  // Recommendations: products not in cart
  const recommendations = products
    .filter((p) => !cart.some((item) => item.product.id === p.id))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      <div className="border-b border-slate-100 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">Your Shopping Bag</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review items in your active luxury collection</p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/50 transition relative group"
              >
                {/* Image */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0 mx-auto sm:mx-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1 text-center sm:text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 pr-6">
                      <Link href={`/products/${item.product.id}`} className="hover:text-primary">
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-400 flex flex-wrap justify-center sm:justify-start gap-2">
                      <span>Color: {item.selectedColor}</span>
                      {item.selectedSize && <span>| Size: {item.selectedSize}</span>}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full p-1.5 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 rounded-full hover:bg-slate-50 text-slate-500 transition"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-6 text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 rounded-full hover:bg-slate-50 text-slate-500 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Price calculations */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Total: ${item.product.price * item.quantity}
                      </span>
                      <span className="text-xs text-slate-400">(${item.product.price} each)</span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 transition hover:bg-slate-50 rounded-full"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}

            {/* Coupon Code Input */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Ticket className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Do you have a coupon code?</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Use AURA10 for 10% off during testing</p>
                </div>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-950 text-xs font-bold">
                  <Percent className="h-4 w-4 text-emerald-500" />
                  <span>Coupon &ldquo;{appliedCoupon}&rdquo; Applied (-10%)</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-emerald-500 hover:text-emerald-700 underline font-semibold ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2 w-full sm:w-80">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs uppercase font-semibold font-mono tracking-wider bg-slate-50"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Checkout price summary card */}
          <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Summary</h3>
            
            <div className="space-y-3.5 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900">${subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-slate-900">
                  {shippingFee === 0 ? "Complimentary" : `$${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="text-slate-900">${tax}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between text-base font-extrabold text-slate-900">
              <span>Total Amount</span>
              <span>${total}</span>
            </div>

            <div className="pt-2">
              <Link
                href={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon}` : ""}`}
                className="w-full py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition text-center shadow-lg hover:shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              All transactions are encrypted and secured. Standard returns are valid for 30 days.
            </p>
          </div>

        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto px-6">
          <ShoppingBag className="h-16 w-16 text-slate-200 mb-4 animate-bounce" />
          <h3 className="font-serif text-xl font-bold text-slate-800">Your bag is empty</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            You haven&rsquo;t added any premium goods to your shopping bag yet. Explore the catalogue to discover items.
          </p>
          <Link
            href="/products"
            className="mt-6 px-6 py-3 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Recommended products */}
      {recommendations.length > 0 && (
        <section className="border-t border-slate-100 pt-10">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Curator Picks
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mt-1">Discover Guest Favorites</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
