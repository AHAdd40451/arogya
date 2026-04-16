import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Stethoscope, CheckCircle, ArrowRight, X } from "lucide-react";

const MOCK_PROVIDER = {
  name: "Jane Smith",
  credentials: "NP",
  specialty: "Family Care",
  years: 8,
  rating: 4.8,
  reviews: 124,
  wait: "3 minutes",
  fee: "$59.99",
};

const STATUS_STEPS = [
  { id: "assigned", label: "Provider Assigned" },
  { id: "joining", label: "Provider Joining" },
  { id: "starting", label: "Visit Starting" },
  { id: "progress", label: "In Progress" },
];

export default function MatchingScreen() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const concern = params.get("concern") || "general";

  const [phase, setPhase] = useState("searching"); // searching | found
  const [currentStatus, setCurrentStatus] = useState(0);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase("found"), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    const p = new URLSearchParams({
      provider: MOCK_PROVIDER.name,
      credentials: MOCK_PROVIDER.credentials,
      fee: MOCK_PROVIDER.fee,
      type: concern,
      specialty: MOCK_PROVIDER.specialty,
      years: MOCK_PROVIDER.years,
      rating: MOCK_PROVIDER.rating,
    });
    navigate(createPageUrl("PaymentScreen") + "&" + p.toString());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1 flex flex-col">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-8">
          <X className="w-4 h-4" /> Cancel search
        </button>

        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === "searching" ? (
              <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                {/* Pulsing indicator */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-[#2A7F7F]/10 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-[#2A7F7F]/20 animate-ping" style={{ animationDelay: "0.3s" }} />
                  <div className="relative w-20 h-20 rounded-full bg-[#2A7F7F] flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-[#1F2937] mb-2">Searching for available providers…</h2>
                <p className="text-sm text-slate-500">Matching you with the best available NP for your concern.</p>
              </motion.div>
            ) : (
              <motion.div key="found" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                {/* Match notification */}
                <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-5">
                  <CheckCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  Provider found and ready
                </div>

                {/* Provider card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 mb-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#2A7F7F]/10 flex items-center justify-center">
                        <span className="text-[#2A7F7F] font-bold text-lg">{MOCK_PROVIDER.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1F2937]">{MOCK_PROVIDER.name}, {MOCK_PROVIDER.credentials}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{MOCK_PROVIDER.specialty} · {MOCK_PROVIDER.years} yrs exp.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-semibold text-amber-700">{MOCK_PROVIDER.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-slate-500">Estimated wait</p>
                        <p className="text-sm font-semibold text-[#1F2937]">{MOCK_PROVIDER.wait}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                      <div>
                        <p className="text-xs text-slate-500">Visit fee</p>
                        <p className="text-sm font-semibold text-[#2A7F7F]">{MOCK_PROVIDER.fee}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-3">{MOCK_PROVIDER.reviews} patient reviews</p>
                </div>

                {/* Status tracker */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Visit Progress</p>
                  {/* Desktop: horizontal */}
                  <div className="hidden sm:flex items-center justify-between">
                    {STATUS_STEPS.map((s, i) => (
                      <React.Fragment key={s.id}>
                        {i > 0 && <div className={`flex-1 h-px mx-1 ${i <= 1 ? "bg-[#2A7F7F]" : "bg-slate-100"}`} />}
                        <div className="flex flex-col items-center gap-1.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i <= 1 ? "bg-[#2A7F7F]" : "bg-slate-100"}`}>
                            {i <= 1 && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`text-xs font-medium whitespace-nowrap ${i <= 1 ? "text-[#2A7F7F]" : "text-slate-400"}`}>{s.label}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {/* Mobile: vertical */}
                  <div className="flex sm:hidden flex-col gap-2">
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s.id} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i <= 1 ? "bg-[#2A7F7F]" : "bg-slate-100"}`}>
                          {i <= 1 && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-sm ${i <= 1 ? "text-[#1F2937] font-medium" : "text-slate-400"}`}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancellation notice */}
                <p className="text-xs text-slate-400 text-center mb-4">
                  $10 fee if canceled within 10 minutes of your scheduled visit.
                </p>

                <Button
                  onClick={handleStart}
                  className="w-full bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-xl py-5 text-sm font-semibold group"
                >
                  Continue to Payment — {MOCK_PROVIDER.fee}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}