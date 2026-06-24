"use client";

import React from "react";
import { useShop, Toast } from "@/context/ShopContext";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { dismissToast } = useShop();

  // Auto-dismiss after 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      dismissToast(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dismissToast]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
  };

  const borderColors = {
    success: "border-emerald-500/20 bg-emerald-50/90 text-emerald-950",
    info: "border-blue-500/20 bg-blue-50/90 text-blue-950",
    error: "border-rose-500/20 bg-rose-50/90 text-rose-950"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-start gap-3 w-80 max-w-full p-4 rounded-xl border glassmorphism shadow-xl ${borderColors[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
      <button
        onClick={() => dismissToast(toast.id)}
        className="text-slate-400 hover:text-slate-700 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useShop();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToastContainer;
