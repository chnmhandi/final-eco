"use client";

import React from "react";
import Link from "next/link";
import { X, Heart, ShoppingBag, User, Compass, HelpCircle, PhoneCall, Info, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useShop } from "@/context/ShopContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { cart, wishlist, isLoggedIn, userRole } = useShop();

  const links = [
    { name: "Shop All", href: "/products", icon: <Compass className="h-5 w-5" /> },
    { name: "Categories", href: "/categories", icon: <Compass className="h-5 w-5" /> },
    { name: "About Us", href: "/about", icon: <Info className="h-5 w-5" /> },
    { name: "Contact Concierge", href: "/contact", icon: <PhoneCall className="h-5 w-5" /> },
  ];

  const adminLinks = isLoggedIn && userRole === "admin"
    ? [...links, { name: "Admin Portal", href: "/admin", icon: <Lock className="h-5 w-5" /> }]
    : links;

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
      )}

      {/* Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl p-6 flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
            <span className="font-serif text-2xl font-bold tracking-widest text-primary-dark">
              AURA
            </span>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full hover:bg-slate-50 transition text-slate-500 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-slate-50 text-base font-medium text-slate-700 hover:text-primary transition"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User / Action Buttons at bottom */}
        <div className="border-t border-slate-100 pt-6 mt-auto flex flex-col gap-3">
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-slate-400" />
              <span>Wishlist</span>
            </div>
            {wishlist.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-slate-400" />
              <span>Shopping Bag</span>
            </div>
            {cart.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
          >
            <User className="h-5 w-5 text-slate-400" />
            <span>My Account</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileMenu;
