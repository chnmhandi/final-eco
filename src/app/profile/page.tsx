"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { User, Mail, Phone, MapPin, Settings, ShieldAlert, LogOut, ChevronRight, Award } from "lucide-react";

export default function ProfilePage() {
  const { profile, updateProfile, orders, logout, isLoggedIn } = useShop();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Form states
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [street, setStreet] = useState(profile.street);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [zipCode, setZipCode] = useState(profile.zipCode);
  const [country, setCountry] = useState(profile.country);

  // View state
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "settings">("overview");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">My Account</span>
      </nav>

      {/* Profile Header Dashboard */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8 rounded-3xl bg-primary text-white relative overflow-hidden border border-slate-800 shadow-md">
        <img
          src={profile.avatarUrl}
          alt={profile.fullName}
          className="h-24 w-24 rounded-full object-cover border-2 border-accent relative z-10 shrink-0 shadow-lg"
        />
        <div className="space-y-2 text-center md:text-left relative z-10 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">{profile.fullName}</h1>
            <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>AURA Concierge Member</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 font-semibold">{profile.email} &bull; Joined {profile.memberSince}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 pt-2 text-xs text-slate-200">
            <span>Total Orders: <span className="font-bold">{orders.length}</span></span>
            <span>Default Shipments: <span className="font-bold">{profile.city}, {profile.state}</span></span>
          </div>
        </div>

        {/* Ambient background design details */}
        <div className="absolute right-[-5%] top-[-20%] text-white/5 font-serif text-[10rem] font-bold select-none pointer-events-none">
          AURA
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition border-b-2 -mb-0.5 cursor-pointer ${
            activeSubTab === "overview"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Overview & Info
        </button>
        <button
          onClick={() => setActiveSubTab("settings")}
          className={`pb-4 text-xs font-bold uppercase tracking-wider transition border-b-2 -mb-0.5 cursor-pointer ${
            activeSubTab === "settings"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Account Settings
        </button>
      </div>

      {activeSubTab === "overview" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Shipping info overview */}
          <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-slate-400" />
              <span>Default Shipping Address</span>
            </h3>
            <div className="text-sm text-slate-500 font-semibold space-y-0.5">
              <p className="text-slate-900 font-bold">{profile.fullName}</p>
              <p>{profile.street}</p>
              <p>{profile.city}, {profile.state} {profile.zipCode}</p>
              <p>{profile.country}</p>
              <p className="pt-2 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Phone className="h-3.5 w-3.5" />
                <span>{profile.phone}</span>
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab("settings")}
              className="text-xs font-bold text-accent hover:underline block pt-2 cursor-pointer"
            >
              Modify Address Details &rarr;
            </button>
          </div>

          {/* Card: Quick Links */}
          <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Settings className="h-4.5 w-4.5 text-slate-400" />
              <span>Concierge Quick Actions</span>
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/orders"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-950 transition"
              >
                <span>Track My Active Orders</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-950 transition"
              >
                <span>Browse Saved Masterpieces</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card: Membership info */}
          <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-slate-400" />
                <span>Membership Status</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Your AURA account has access to global concierge support, complimentary courier deliveries, and early-access catalogs.
              </p>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 py-3 rounded-full border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-100 text-xs font-bold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>

        </div>
      ) : (
        // Form view settings edit
        <form onSubmit={handleUpdate} className="p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6 max-w-3xl">
          <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">Edit Profile Settings</h3>
          
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address (Non-modifiable)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-slate-200 text-xs bg-slate-100 text-slate-400 cursor-not-allowed"
                disabled
              />
            </div>

          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-wider uppercase transition shadow-md cursor-pointer"
            >
              Save Profile Changes
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("overview")}
              className="px-6 py-3 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold tracking-wider uppercase transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
