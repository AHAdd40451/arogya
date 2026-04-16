import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Shield, Clock, Star,
  User, Video, Stethoscope, CheckCircle,
  ChevronRight, ChevronDown
} from "lucide-react";

const features = [
  { icon: Clock, title: "On-Demand Care", desc: "Connect with a licensed NP in minutes, any time of day." },
  { icon: Shield, title: "No Insurance Needed", desc: "Flat $59.99 per visit — simple, transparent pricing." },
  { icon: Star, title: "Licensed Providers", desc: "Board-certified Nurse Practitioners ready to help you." },
];

const steps = [
  { icon: User, label: "Create Account" },
  { icon: Video, label: "Video Visit" },
  { icon: Stethoscope, label: "Get Treated" },
  { icon: CheckCircle, label: "Care Delivered" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Hero */}
      <section className="bg-[#F7F9FB] border-b border-slate-100 pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              Providers available now
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#1F2937] leading-tight tracking-tight mb-4 sm:mb-6">
              Healthcare On-Demand —{" "}
              <span className="text-[#2A7F7F] block sm:inline">Anytime, Anywhere</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
              Connect instantly with licensed Nurse Practitioners for fast, affordable care.
            </p>

            {/* Price highlight */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 mb-8 sm:mb-10">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A7F7F] shrink-0" />
              <span className="text-[#1F2937] font-semibold text-sm sm:text-base">$59.99 per visit</span>
              <span className="text-slate-400 text-xs sm:text-sm hidden xs:inline">· no insurance needed</span>
            </div>

            {/* Buttons — full width on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 px-2 sm:px-0">
              <Link to={createPageUrl("PatientOnboarding1")} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#2A7F7F] hover:bg-[#236969] text-white px-7 py-5 text-sm font-semibold rounded-xl shadow-sm group">
                  Get Started as Patient
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link to={createPageUrl("ProviderOnboarding1")} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-slate-200 text-[#1F2937] hover:bg-slate-50 px-7 py-5 text-sm font-semibold rounded-xl group">
                  Become a Provider
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Step flow — vertical on mobile, horizontal on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 sm:mt-16"
          >
            {/* Mobile: vertical */}
            <div className="flex flex-col items-center gap-0 sm:hidden">
              {steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-[#2A7F7F]" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium text-slate-500">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronDown className="w-4 h-4 text-slate-300" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Desktop/tablet: horizontal */}
            <div className="hidden sm:flex items-center justify-center gap-0">
              {steps.map((step, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />}
                  <div className="flex flex-col items-center gap-2 px-4 sm:px-6">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-[#2A7F7F]" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium text-slate-500 whitespace-nowrap">{step.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-3">Why Arogya?</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
              Healthcare that fits your life — no waiting rooms, no insurance paperwork.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F7F9FB] border border-slate-100 rounded-2xl p-6 sm:p-7 hover:border-[#2A7F7F]/30 transition-colors"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                  <f.icon className="w-5 h-5 text-[#2A7F7F]" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#1F2937] mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 border-t border-slate-100 bg-[#F7F9FB]">
        <div className="max-w-xl mx-auto px-5 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-3">Ready to get started?</h2>
          <p className="text-slate-500 text-sm mb-8">No subscription. No insurance. Just care when you need it.</p>
          <Link to={createPageUrl("PatientOnboarding1")} className="block sm:inline-block">
            <Button className="w-full sm:w-auto bg-[#2A7F7F] hover:bg-[#236969] text-white px-9 py-5 text-sm font-semibold rounded-xl shadow-sm group">
              Get Started — $59.99 per visit
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}