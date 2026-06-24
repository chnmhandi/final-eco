"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import { ShoppingBag, Heart, User, Search, Menu, X, Trash2, Plus, Minus, ArrowRight, Bell, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const pathname = usePathname();
  const { cart, wishlist, removeFromCart, updateQuantity, isLoggedIn, userRole, notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useShop();
  const unreadCount = notifications ? notifications.filter((n: any) => !n.is_read).length : 0;

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Monitor scroll for solid background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
    setIsNotificationOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Shop All", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Our Story", href: "/about" },
    { name: "Concierge", href: "/contact" }
  ];

  const adminNavLinks = isLoggedIn && userRole === "admin"
    ? [...navLinks, { name: "Admin Portal", href: "/admin" }]
    : navLinks;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-md border-b border-slate-100 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-full hover:bg-slate-100 transition text-slate-600"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Branding Logo */}
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-widest text-primary-dark shrink-0 transition hover:opacity-80"
            >
              AURA
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {adminNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition relative py-1 hover:text-primary ${
                      isActive ? "text-primary font-semibold" : "text-slate-600"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Bar */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              
              {/* Search Toggle Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="p-2 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-primary relative hidden sm:block"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </Link>

              {/* Notifications Toggle */}
              {isLoggedIn && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-primary relative cursor-pointer font-bold"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-3xl shadow-xl py-4 z-50 max-h-[400px] flex flex-col overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-50">
                          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Notifications</span>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllNotificationsRead}
                              className="text-[10px] font-bold text-accent hover:underline cursor-pointer"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar py-2 max-h-[300px]">
                          {notifications && notifications.length > 0 ? (
                            notifications.map((n: any) => (
                              <div
                                key={n.id}
                                className={`flex gap-3 px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50/50 last:border-0 relative group ${
                                  !n.is_read ? "bg-slate-50/50" : ""
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-1">
                                    <h5 className={`text-xs text-slate-800 ${!n.is_read ? "font-bold" : "font-semibold"}`}>
                                      {n.title}
                                    </h5>
                                    {!n.is_read && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1" />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
                                    {n.message}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-1 items-end shrink-0 opacity-0 group-hover:opacity-100 transition">
                                  {!n.is_read && (
                                    <button
                                      onClick={() => markNotificationRead(n.id)}
                                      className="p-1 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 cursor-pointer"
                                      title="Mark as read"
                                    >
                                      <Check className="h-3 w-3" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(n.id)}
                                    className="p-1 text-slate-300 hover:text-rose-500 rounded-full hover:bg-slate-100 cursor-pointer"
                                    title="Delete"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 px-4">
                              <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                              <p className="text-xs text-slate-400 font-semibold">No notifications</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Order updates will appear here dynamically.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Account Profile Link */}
              <Link
                href="/profile"
                className="p-2 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-primary"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Bag Trigger Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full hover:bg-slate-100 transition text-slate-600 hover:text-primary relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
                  >
                    {totalCartItems}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Global Expandable Search Overlay Panel */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg px-4 sm:px-6 lg:px-8 py-4 z-40 overflow-hidden"
            >
              <div className="max-w-3xl mx-auto flex items-center gap-4">
                <SearchBar isOverlay onClose={() => setIsSearchOpen(false)} />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 shrink-0"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Cart Sliding Sidebar Drawer */}
      <div className={`fixed inset-0 z-50 ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
        )}

        {/* Cart Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isCartOpen ? 0 : "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5 shrink-0">
            <h3 className="font-serif text-xl font-bold text-primary-dark flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-accent" />
              <span>Shopping Bag ({totalCartItems})</span>
            </h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 -mr-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition relative group">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-lg object-cover bg-white border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 truncate pr-6">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex gap-2">
                        <span>Color: {item.selectedColor}</span>
                        {item.selectedSize && <span>| Size: {item.selectedSize}</span>}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full py-0.5 px-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-semibold text-slate-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingBag className="h-16 w-16 text-slate-200 mb-4" />
                <h4 className="text-base font-semibold text-slate-700">Your bag is empty</h4>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1 mx-auto">
                  Looks like you haven&rsquo;t added any luxury items to your collection yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 text-xs font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Cart Drawer Footer */}
          {cart.length > 0 && (
            <div className="border-t border-slate-100 pt-5 mt-5 shrink-0">
              <div className="flex items-center justify-between text-base font-semibold text-slate-800 mb-4">
                <span>Subtotal</span>
                <span>${cartSubtotal}</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-6">
                Shipping options, taxes, and promotional coupons will be calculated during checkout.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition text-center shadow-lg hover:shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 rounded-full border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold text-sm transition text-center cursor-pointer"
                >
                  View Full Bag
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
