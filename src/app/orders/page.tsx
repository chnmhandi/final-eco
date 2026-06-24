"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useShop, Order } from "@/context/ShopContext";
import { Package, Truck, Compass, CheckCircle2, ChevronRight, Clock, ShieldCheck, MapPin, FileText } from "lucide-react";
import { useEffect } from "react";

export default function OrdersPage() {
  const { orders, fetchOrders } = useShop();
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      const token = localStorage.getItem("aura_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const response = await fetch(`${baseUrl}/invoices/orders/${orderId}/invoice/html`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to load invoice");
      const html = await response.text();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing invoice:", error);
    }
  };

  const toggleDetails = (orderId: string) => {
    setSelectedOrderDetails(selectedOrderDetails === orderId ? null : orderId);
  };

  const statusMilestones = {
    Placed: 1,
    Processing: 2,
    Shipped: 3,
    Delivered: 4
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">My Orders</span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">Your Orders</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Track shipping progress and review transaction histories</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6 max-w-4xl">
          {orders.map((order) => {
            const currentStep = statusMilestones[order.status];
            const isDetailed = selectedOrderDetails === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 transition hover:shadow-md"
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Order ID</span>
                      <span className="text-sm font-bold text-slate-900 font-mono tracking-wider">{order.id}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Placed</span>
                      <span className="text-sm font-bold text-slate-900">{order.date}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Amount</span>
                      <span className="text-sm font-extrabold text-slate-900">${order.total}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracking Number</span>
                      <span className="text-xs font-bold text-slate-500 font-mono tracking-wider">{order.trackingNumber}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-full transition cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Invoice</span>
                    </button>
                    <button
                      onClick={() => toggleDetails(order.id)}
                      className="px-4 py-2 text-xs font-bold text-primary hover:bg-slate-50 border border-slate-200 rounded-full transition cursor-pointer"
                    >
                      {isDetailed ? "Hide Items" : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Progress bar timeline */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-accent animate-pulse" />
                      <span>Status: {order.status}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Estimated Delivery: <span className="font-bold text-slate-900">{order.estimatedDelivery}</span>
                    </span>
                  </div>

                  {/* Horizontal visual line */}
                  <div className="relative py-4 max-w-xl mx-auto">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {/* Nodes */}
                    <div className="relative flex justify-between">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center gap-1 text-center bg-white px-2">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition ${
                            currentStep >= 1 ? "bg-accent border-accent text-white" : "border-slate-200 text-slate-400"
                          }`}
                        >
                          1
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Placed</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center gap-1 text-center bg-white px-2">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition ${
                            currentStep >= 2 ? "bg-accent border-accent text-white" : "border-slate-200 text-slate-400"
                          }`}
                        >
                          2
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Processing</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center gap-1 text-center bg-white px-2">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition ${
                            currentStep >= 3 ? "bg-accent border-accent text-white" : "border-slate-200 text-slate-400"
                          }`}
                        >
                          3
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Shipped</span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center gap-1 text-center bg-white px-2">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition ${
                            currentStep >= 4 ? "bg-accent border-accent text-white" : "border-slate-200 text-slate-400"
                          }`}
                        >
                          4
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details view expandable */}
                {isDetailed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50 animate-fade-in-up">
                    
                    {/* Items */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Items Purchased</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3 items-start">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-12 w-12 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h5>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              Qty: {item.quantity} &bull; Color: {item.selectedColor}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-slate-900">${item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping info summary */}
                    <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>Shipping Address</span>
                        </h4>
                        <div className="text-slate-500 mt-1.5 space-y-0.5 font-semibold">
                          <p>{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <Truck className="h-4.5 w-4.5 text-slate-400" />
                        <span className="font-bold text-slate-800">{order.deliveryMethod}</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto px-6">
          <Package className="h-16 w-16 text-slate-200 mb-4" />
          <h3 className="font-serif text-xl font-bold text-slate-800">No orders found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            You haven&rsquo;t placed any premium orders yet. Items checked out will appear here dynamically.
          </p>
          <Link
            href="/products"
            className="mt-6 px-6 py-3 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase transition shadow-md"
          >
            Browse Collections
          </Link>
        </div>
      )}

    </div>
  );
}
