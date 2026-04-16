import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCircle, Stethoscope, Pill } from "lucide-react";

const ICONS = {
  match: Stethoscope,
  visit: CheckCircle,
  prescription: Pill,
  default: Bell,
};

export default function NotificationBanner({ notification, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!notification) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, 5000);
    return () => clearTimeout(t);
  }, [notification]);

  if (!notification) return null;

  const Icon = ICONS[notification.type] || ICONS.default;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
        >
          <div className="bg-white border border-slate-200 shadow-md rounded-xl px-4 py-3 flex items-center gap-3 max-w-sm w-full pointer-events-auto">
            <div className="w-7 h-7 rounded-lg bg-[#2A7F7F]/10 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#2A7F7F]" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-[#1F2937] flex-1 leading-snug">{notification.message}</p>
            <button
              onClick={() => { setVisible(false); setTimeout(() => onDismiss?.(), 300); }}
              className="text-slate-300 hover:text-slate-500 transition-colors ml-1 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}