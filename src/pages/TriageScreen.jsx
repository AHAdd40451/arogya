import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Thermometer, Sparkles, Pill, MessageSquare, HelpCircle } from "lucide-react";

const concerns = [
  { id: "cold_flu", label: "Cold / Flu", icon: Thermometer, desc: "Fever, cough, sore throat, congestion" },
  { id: "skin", label: "Skin Issue", icon: Sparkles, desc: "Rash, irritation, or skin condition" },
  { id: "prescription", label: "Prescription Refill", icon: Pill, desc: "Renew an existing prescription" },
  { id: "general", label: "General Consultation", icon: MessageSquare, desc: "General health question or checkup" },
  { id: "other", label: "Other", icon: HelpCircle, desc: "Something else on your mind" },
];

export default function TriageScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    const params = new URLSearchParams({ concern: selected });
    navigate(createPageUrl("MatchingScreen") + "?" + params.toString());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold text-[#1F2937] mb-1">What do you need help with today?</h1>
          <p className="text-sm text-slate-500 mb-6">Select the option that best describes your concern.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {concerns.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selected === c.id
                    ? "border-[#2A7F7F] bg-teal-50/60 ring-1 ring-[#2A7F7F]/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selected === c.id ? "bg-[#2A7F7F]/10" : "bg-slate-50 border border-slate-100"}`}>
                    <c.icon className={`w-4 h-4 ${selected === c.id ? "text-[#2A7F7F]" : "text-slate-400"}`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${selected === c.id ? "text-[#2A7F7F]" : "text-[#1F2937]"}`}>{c.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            disabled={!selected}
            onClick={handleContinue}
            className="w-full bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-xl py-5 text-sm font-semibold disabled:opacity-40"
          >
            Find Care Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}