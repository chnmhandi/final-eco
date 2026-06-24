"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useShop, UserProfile } from "@/context/ShopContext";
import { ChevronRight, CreditCard, ShieldCheck, Ticket, CheckCircle2, Package, Truck, ArrowRight } from "lucide-react";
import Script from "next/script";
import { api } from "@/utils/api";

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponParam = searchParams.get("coupon") || "";

  const { cart, profile, placeOrder, showToast, isLoggedIn } = useShop();

  // Redirect if cart is empty and order wasn't just placed
  useEffect(() => {
    if (cart.length === 0 && !orderSuccessId) {
      router.push("/cart");
    }
  }, [cart]);

  // Success state
  const [orderSuccessId, setOrderSuccessId] = useState("");
  const [loading, setLoading] = useState(false);

  // Address forms
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [street, setStreet] = useState(profile.street);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [zipCode, setZipCode] = useState(profile.zipCode);
  const [country, setCountry] = useState(profile.country);

  // Shipping Speed option
  const [shippingMethod, setShippingMethod] = useState("Standard Insured Delivery");
  const [shippingCost, setShippingCost] = useState(0);

  // Payment form fields (Visual validation)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const handleShippingChange = (method: string, cost: number) => {
    setShippingMethod(method);
    setShippingCost(cost);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountRate = couponParam.toUpperCase() === "AURA10" ? 0.1 : 0;
  const discountAmount = Math.round(subtotal * discountRate * 100) / 100;
  const tax = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const total = Math.round((subtotal - discountAmount + shippingCost + tax) * 100) / 100;

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !street || !city || !state || !zipCode || !country) {
      showToast("Please fill out all shipping details.", "error");
      return;
    }

    if (!isLoggedIn && (!cardNumber || !cardExpiry || !cardCVV)) {
      showToast("Please enter mock payment details.", "error");
      return;
    }

    setLoading(true);

    const deliveryAddress: UserProfile = {
      fullName,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      avatarUrl: profile.avatarUrl,
      memberSince: profile.memberSince
    };

    try {
      if (isLoggedIn) {
        // 1. Create Razorpay order in backend
        const rpOrder = await api.post<{ id: string; amount: number; currency: string; key_id: string }>(
          "/orders/razorpay-order",
          { total }
        );

        // 2. Open Razorpay payment modal
        const options = {
          key: rpOrder.key_id,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: "AURA E-Commerce",
          description: "Premium Catalog Order",
          order_id: rpOrder.id,
          handler: async function (response: any) {
            try {
              setLoading(true);
              const generatedOrderId = await placeOrder(
                deliveryAddress,
                shippingMethod,
                shippingCost,
                couponParam,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
              );
              setOrderSuccessId(generatedOrderId);
            } catch (err: any) {
              showToast(err.message || "Failed to complete transaction.", "error");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone
          },
          theme: {
            color: "#1c2541"
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              showToast("Payment cancelled.", "info");
            }
          }
        };

        if (typeof window !== "undefined" && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          showToast("Razorpay SDK failed to load. Please try again.", "error");
          setLoading(false);
        }
      } else {
        // Guest mode mock placement
        const generatedOrderId = await placeOrder(deliveryAddress, shippingMethod, shippingCost, couponParam);
        setOrderSuccessId(generatedOrderId);
        setLoading(false);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to complete transaction.", "error");
      setLoading(false);
    }
  };

  // If order was successfully placed, render Success card
  if (orderSuccessId) {
    const deliveryDays = shippingCost > 15 ? "2 Business Days" : "4 Business Days";
    const dateToday = new Date();
    dateToday.setDate(dateToday.getDate() + (shippingCost > 15 ? 2 : 4));
    const formattedEstDelivery = dateToday.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in-up">
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-md">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">Order Confirmed</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Your Journey Begins</h2>
          <p className="text-sm text-slate-500 leading-relaxed font-semibold">
            Thank you for choosing AURA. Your premium collection items are being curated by our dispatch team.
          </p>
        </div>

        {/* Details Card */}
        <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-center text-sm font-semibold border-b border-slate-100 pb-3">
            <span className="text-slate-500">Order ID:</span>
            <span className="text-slate-900 font-bold font-mono tracking-wider">{orderSuccessId}</span>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <Package className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800">Tracking Number Generated</h4>
              <p className="text-slate-400 mt-0.5 font-semibold">Visit your Account dashboard to view progress timelines.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <Truck className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800">Estimated Delivery: {formattedEstDelivery}</h4>
              <p className="text-slate-400 mt-0.5 font-semibold">Method chosen: {shippingMethod} ({deliveryDays})</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link
            href="/orders"
            className="flex-1 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition shadow-lg text-center cursor-pointer"
          >
            Track Order Progress
          </Link>
          <Link
            href="/"
            className="flex-1 py-4 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition text-center cursor-pointer"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/cart" className="hover:text-primary transition">Bag</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">Checkout</span>
      </nav>

      <div className="border-b border-slate-100 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">Secured Checkout</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Provide your delivery details below to finalize order</p>
      </div>

      <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Forms column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-800">1. Delivery Address</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">State / Region</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">ZIP / Postcode</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address (Order Confirmation)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                  required
                />
              </div>

            </div>
          </div>

          {/* Shipping Method */}
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-800">2. Shipping Method</h3>
            
            <div className="space-y-3">
              {/* Option 1 */}
              <label
                onClick={() => handleShippingChange("Standard Insured Delivery", 0)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition cursor-pointer ${
                  shippingMethod === "Standard Insured Delivery"
                    ? "border-primary bg-slate-50/50"
                    : "border-slate-100 hover:border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "Standard Insured Delivery"}
                    onChange={() => {}}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Complimentary Standard Delivery</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Complimentary shipping. Insured, 3-5 business days.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Free</span>
              </label>

              {/* Option 2 */}
              <label
                onClick={() => handleShippingChange("Express Concierge Delivery", 25)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition cursor-pointer ${
                  shippingMethod === "Express Concierge Delivery"
                    ? "border-primary bg-slate-50/50"
                    : "border-slate-100 hover:border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "Express Concierge Delivery"}
                    onChange={() => {}}
                    className="text-primary focus:ring-primary"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Express Concierge Delivery</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Premium fast delivery. Insured, 1-2 business days.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">$25</span>
              </label>
            </div>
          </div>

          {/* Secure Payment details (Visual ONLY for guest, Razorpay for logged-in) */}
          {isLoggedIn ? (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-slate-800">3. Secured Payment</h3>
                <div className="flex gap-1.5 text-slate-300">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 font-semibold animate-fade-in-up">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-slate-800">Razorpay Gateway Enabled</h4>
                    <p className="text-slate-400 mt-1">Your transaction will be processed securely using the Razorpay gateway. (INR Converted rate: ₹83 / $1)</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-slate-800">3. Secured Payment</h3>
                <div className="flex gap-1.5 text-slate-300">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Alexander Sterling"
                    className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                    required={!isLoggedIn}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Card Number</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                      required={!isLoggedIn}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50 text-center"
                      required={!isLoggedIn}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Security CVV</label>
                    <input
                      type="password"
                      placeholder="&bull;&bull;&bull;"
                      maxLength={3}
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50 text-center"
                      required={!isLoggedIn}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-[10px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Encrypted visual mock gateway. No real transaction takes place.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Order summary column */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Order Summary</h3>
            
            {/* Products strip */}
            <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-12 w-12 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 py-0.5">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {item.quantity}x &bull; {item.selectedColor}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 py-0.5">
                    ${item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupons detail */}
            {couponParam && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-500/20 p-3 rounded-xl text-emerald-950 text-xs font-bold">
                <Ticket className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Promo &ldquo;{couponParam.toUpperCase()}&rdquo; Active</span>
                <span className="text-emerald-600">Applied</span>
              </div>
            )}

            {/* Pricing details */}
            <div className="space-y-3 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-900">${subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-slate-900">
                  {shippingCost === 0 ? "Complimentary" : `$${shippingCost}`}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition shadow-lg hover:shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Authorizing Security..." : "Authorize & Place Order"}</span>
              {!loading && <ArrowRight className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-slate-400">Loading secure checkout...</div>}>
      <CheckoutPageContent />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </Suspense>
  );
}
