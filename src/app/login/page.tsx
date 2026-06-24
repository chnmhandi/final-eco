"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { showToast, login } = useShop();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      showToast("Signed in successfully.", "success");
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      showToast(err.message || "Sign in failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <Link href="/" className="font-serif text-3xl font-bold tracking-widest text-primary-dark block hover:opacity-80">
            AURA
          </Link>
          <h2 className="text-base font-bold text-slate-800">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-semibold">Sign in to manage your orders and view your saved goods</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="alexander@aura.design"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-sm bg-slate-50 transition"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <a href="#" className="text-[10px] text-slate-400 hover:text-slate-600 underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-sm bg-slate-50 transition"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition shadow-lg hover:shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Account"}</span>
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

        </form>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-6 text-center text-xs font-semibold space-y-3">
          <p className="text-slate-400">
            Don&rsquo;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Create an Account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 bg-slate-50 py-2 rounded-xl">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Complimentary 256-bit Secure Gateway</span>
          </div>
        </div>

      </div>
    </div>
  );
}
