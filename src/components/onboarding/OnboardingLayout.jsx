import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function OnboardingLayout({ step, totalSteps, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col font-inter">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <Link to={createPageUrl("Home")} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2A7F7F] flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-[#1F2937] text-base tracking-tight">Arogya</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">Step {step} of {totalSteps}</span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100 shrink-0">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full bg-[#2A7F7F]"
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-8">
            <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1.5">{title}</h1>
            <p className="text-sm text-slate-500 mb-5 sm:mb-6 leading-relaxed">{subtitle}</p>
            <div className="space-y-4">
              {children}
            </div>
          </div>

          {/* Bottom safe area padding for mobile */}
          <div className="h-8" />
        </motion.div>
      </div>
    </div>
  );
}