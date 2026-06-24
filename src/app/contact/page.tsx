"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockFAQs } from "@/data/faq";
import { useShop } from "@/context/ShopContext";
import { ChevronRight, Phone, Mail, MapPin, Clock, Send, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const { showToast } = useShop();

  // Contact Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // FAQ accordion state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast("Please fill out all contact fields.", "error");
      return;
    }

    setLoading(true);

    // Simulate sending concierge ticket
    setTimeout(() => {
      setLoading(false);
      setFormSent(true);
      showToast("Concierge ticket received. We will respond within 4 hours.", "success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900">Contact Concierge</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Concierge Desk</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          How Can We Guide You?
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed font-semibold">
          Reach out to our global styling concierge desk or review our departments directory for help.
        </p>
      </div>

      {/* Contact Cards & Form Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left column info details */}
        <div className="space-y-4">
          
          <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Concierge Desk</h3>
            
            <div className="space-y-3.5 text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-accent shrink-0" />
                <span>+1 (800) 555-AURA (2872)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-accent shrink-0" />
                <span>concierge@aura.design</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">128 Luxury Vista Lane, Suite 400<br />San Francisco, CA 94107</span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <Clock className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <span>Concierge hours: 24 / 7 / 365</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 text-slate-500 space-y-2.5 text-xs font-semibold leading-relaxed">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Premium Service Guarantee</h4>
            <p>Every ticket submitted routes directly to an executive concierge coordinator. We do not use automated bot responses.</p>
          </div>

        </div>

        {/* Right column form */}
        <div className="lg:col-span-2">
          {formSent ? (
            <div className="p-8 sm:p-10 rounded-3xl border border-emerald-500/20 bg-emerald-50/50 shadow-sm text-center space-y-4 flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-pulse" />
              <h3 className="font-serif text-xl font-bold text-emerald-950">Ticket Successfully Opened</h3>
              <p className="text-xs text-emerald-800 max-w-sm leading-relaxed font-semibold">
                An executive styling concierge coordinator is reviewing your message. A detailed response will be sent to your email address shortly.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="mt-4 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition"
              >
                Send Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-50 pb-3">Open Concierge Ticket</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <input
                    type="text"
                    placeholder="Alexander Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <input
                    type="email"
                    placeholder="alexander@aura.design"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Subject</label>
                  <input
                    type="text"
                    placeholder="Inquiry regarding bespoke custom chronographs"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Detailed Message</label>
                  <textarea
                    placeholder="Describe your design specifications or details in length here..."
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-primary text-xs bg-slate-50 resize-none"
                    required
                  />
                </div>

              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? "Transmitting details..." : "Open Ticket"}</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>

      {/* Accordion FAQ section */}
      <section id="faqs" className="border-t border-slate-200 pt-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Frequent Questions</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Concierge FAQ Directory
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {mockFAQs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition hover:border-slate-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="space-y-1 flex-1 pr-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
                      {faq.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">{faq.question}</h4>
                  </div>
                  <ChevronDown
                    className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 pt-0 border-t border-slate-50 text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
