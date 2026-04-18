import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Activity, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/services/auth";
import { getRoleDashboardPage } from "@/services/profile";

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const dashboardPage = profile?.role ? getRoleDashboardPage(profile.role) : null;

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

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2">
              {!loading && user ? (
                <>
                  {dashboardPage ? (
                    <Link to={createPageUrl(dashboardPage)}>
                      <Button size="sm" className="bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-lg text-sm font-medium shadow-sm">
                        Dashboard
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </Button>
                    </Link>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-600 hover:text-[#1F2937] text-sm font-medium"
                    onClick={async () => {
                      await signOut();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to={`${createPageUrl("Signup")}?role=provider`}>
                    <Button size="sm" variant="ghost" className="text-slate-600 hover:text-[#1F2937] text-sm font-medium">
                      For Providers
                    </Button>
                  </Link>
                  <Link to={`${createPageUrl("Signup")}?role=patient`}>
                    <Button size="sm" className="bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-lg text-sm font-medium shadow-sm">
                      Get Started
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Login")}>
                    <Button size="sm" variant="outline" className="rounded-lg border-slate-200 text-sm font-medium">
                      Sign in
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: Get Started + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              {!loading && user ? (
                dashboardPage ? (
                  <Link to={createPageUrl(dashboardPage)}>
                    <Button size="sm" className="bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-lg text-xs font-medium px-3 py-1.5">
                      Dashboard
                    </Button>
                  </Link>
                ) : null
              ) : (
                <Link to={`${createPageUrl("Signup")}?role=patient`}>
                  <Button size="sm" className="bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-lg text-xs font-medium px-3 py-1.5">
                    Get Started
                  </Button>
                </Link>
              )}
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
                <div className="pt-3 border-t border-slate-100 mt-2">
                  {!loading && user ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-lg border-slate-200 text-sm font-medium mb-2"
                      size="sm"
                      onClick={async () => {
                        setMobileOpen(false);
                        await signOut();
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link to={createPageUrl("Login")} onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full rounded-lg border-slate-200 text-sm font-medium mb-2" size="sm">
                          Sign in
                        </Button>
                      </Link>
                      <Link to={`${createPageUrl("Signup")}?role=provider`} onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full rounded-lg border-slate-200 text-sm font-medium mb-2" size="sm">
                          For Providers
                        </Button>
                      </Link>
                    </>
                  )}
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
