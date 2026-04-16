import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Activity, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", page: "Home" },
    { label: "Patient", page: "PatientDashboard" },
    { label: "Providers", page: "ProviderDashboard" },
  ];

  return (
    <div className="min-h-screen bg-white font-inter">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-[#2A7F7F] flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <span className="font-bold text-[#1F2937] text-base tracking-tight">Arogya</span>
            </Link>

            {/* Desktop nav links — hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPageName === link.page
                      ? "text-[#2A7F7F] bg-teal-50"
                      : "text-slate-500 hover:text-[#1F2937] hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2">
              <Link to={createPageUrl("ProviderOnboarding1")}>
                <Button size="sm" variant="ghost" className="text-slate-600 hover:text-[#1F2937] text-sm font-medium">
                  For Providers
                </Button>
              </Link>
              <Link to={createPageUrl("PatientOnboarding1")}>
                <Button size="sm" className="bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-lg text-sm font-medium shadow-sm">
                  Get Started
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </Link>
            </div>

            {/* Mobile: Get Started + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <Link to={createPageUrl("PatientOnboarding1")}>
                <Button size="sm" className="bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-lg text-xs font-medium px-3 py-1.5">
                  Get Started
                </Button>
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      currentPageName === link.page
                        ? "text-[#2A7F7F] bg-teal-50"
                        : "text-slate-600 hover:text-[#1F2937] hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                ))}
                <div className="pt-3 border-t border-slate-100 mt-2">
                  <Link to={createPageUrl("ProviderOnboarding1")} onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full rounded-lg border-slate-200 text-sm font-medium mb-2" size="sm">
                      For Providers
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-14">{children}</main>
    </div>
  );
}