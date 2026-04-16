import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Users, Stethoscope, Building2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30 min-h-[90vh] flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-50/20 to-blue-50/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 border border-teal-100 rounded-full text-sm font-medium text-teal-700 mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Now serving businesses nationwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Healthcare On-Demand for{" "}
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Everyone
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-700 font-semibold">
                Flat Membership or Pay Per Visit
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Connect with local NPs, MDs, and telehealth providers instantly, whether you're self-employed, part of a small business, or an individual.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          >
            <Link to={createPageUrl("EmployeeDashboard")}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-base rounded-xl shadow-lg shadow-teal-200/50 group">
                <Users className="w-5 h-5 mr-2" />
                Join as Employee
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl("EmployerDashboard")}>
              <Button size="lg" variant="outline" className="px-8 py-6 text-base rounded-xl border-slate-200 hover:bg-slate-50 group">
                <Building2 className="w-5 h-5 mr-2" />
                Join as Employer
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl("ProviderSignup")}>
              <Button size="lg" variant="ghost" className="px-8 py-6 text-base rounded-xl text-teal-700 hover:bg-teal-50 group">
                <Stethoscope className="w-5 h-5 mr-2" />
                Become a Provider
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Animated Flow */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-20 flex items-center justify-center gap-4 sm:gap-8"
          >
            {[
              { icon: Users, label: "Employee", color: "bg-blue-100 text-blue-600" },
              { icon: Stethoscope, label: "Provider", color: "bg-teal-100 text-teal-600" },
              { label: "Care Delivered", icon: null, color: "bg-emerald-100 text-emerald-600" },
            ].map((step, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6 + i * 0.3, duration: 0.5 }}
                    className="hidden sm:block w-16 h-0.5 bg-gradient-to-r from-teal-300 to-teal-500 origin-left"
                  />
                )}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.3, type: "spring", stiffness: 200 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-sm`}>
                    {step.icon ? (
                      <step.icon className="w-7 h-7 sm:w-9 sm:h-9" />
                    ) : (
                      <span className="text-2xl">✓</span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-600">{step.label}</span>
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}