import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Video, Zap, CalendarCheck, Pill, Star, Clock, Check } from "lucide-react";
import { listBookableProviders } from "@/services/booking";
import { isAvailableNow, getNextAvailable } from "@/lib/scheduling";

const visitTypes = [
  { id: "urgent",              label: "Urgent Care",           icon: Zap,           desc: "See a provider in minutes",              color: "text-red-600 bg-red-50",    service: "urgent"  },
  { id: "routine",             label: "Routine Consultation",  icon: CalendarCheck, desc: "Standard appointment",                   color: "text-blue-600 bg-blue-50",  service: "routine" },
  { id: "prescription_refill", label: "Prescription Refill",   icon: Pill,          desc: "Quick refill with provider approval",    color: "text-purple-600 bg-purple-50", service: "refills" },
];

const steps = [
  { num: 1, label: "Visit Type" },
  { num: 2, label: "Mode" },
  { num: 3, label: "Provider" },
];

export default function RequestVisit() {
  const navigate    = useNavigate();
  const [step, setStep]         = useState(1);
  const [visitType, setVisitType] = useState(null);
  const [provider, setProvider] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  // Load providers when reaching step 3
  useEffect(() => {
    if (step !== 3) return;
    const vt = visitTypes.find((v) => v.id === visitType);
    setLoadingProviders(true);
    listBookableProviders({ service: vt?.service ?? null })
      .then(setProviders)
      .catch(() => setProviders([]))
      .finally(() => setLoadingProviders(false));
  }, [step, visitType]);

  const handleConfirm = () => {
    // Route to MatchingScreen with this provider pre-selected so the slot picker opens directly
    const p = new URLSearchParams({
      concern:          visitType || "routine",
      provider_user_id: provider.provider_user_id,
    });
    navigate(createPageUrl("MatchingScreen") + "&" + p.toString());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        <Link to={createPageUrl("PatientDashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-xl font-bold text-[#1F2937] mb-2">Request a Visit</h1>
        <p className="text-slate-500 mb-8 text-sm">All visits are $59.99 — no insurance required.</p>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              {i > 0 && <div className={`flex-1 h-0.5 transition-colors ${step >= s.num ? "bg-teal-500" : "bg-slate-200"}`} />}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > s.num ? "bg-teal-600 text-white" : step === s.num ? "bg-teal-100 text-teal-700 ring-2 ring-teal-500" : "bg-slate-100 text-slate-400"
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className="hidden sm:block text-xs font-medium text-slate-500">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1 — Visit type */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Visit Type</h2>
              <div className="grid gap-3">
                {visitTypes.map((vt) => (
                  <Card
                    key={vt.id}
                    className={`cursor-pointer transition-all ${visitType === vt.id ? "ring-2 ring-teal-500 border-teal-200" : "hover:border-slate-300"}`}
                    onClick={() => setVisitType(vt.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`w-12 h-12 rounded-xl ${vt.color} flex items-center justify-center`}>
                        <vt.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{vt.label}</p>
                        <p className="text-sm text-slate-500">{vt.desc}</p>
                      </div>
                      {visitType === vt.id && (
                        <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button disabled={!visitType} onClick={() => setStep(2)} className="w-full sm:w-auto bg-[#2A7F7F] hover:bg-[#236969] rounded-xl px-6 py-4 sm:py-2">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Mode (always video) */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Visit Mode</h2>
              <Card className="ring-2 ring-teal-500 border-teal-200 cursor-default">
                <CardContent className="flex flex-col items-center text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
                    <Video className="w-10 h-10 text-teal-600" />
                  </div>
                  <p className="font-bold text-slate-900 text-lg">Video Visit</p>
                  <p className="text-sm text-slate-500 mt-1">Connect securely from anywhere — all Arogya visits are video-based.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-teal-700 font-medium">Selected</span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button onClick={() => setStep(3)} className="w-full sm:w-auto bg-[#2A7F7F] hover:bg-[#236969] rounded-xl px-6 py-4 sm:py-2">
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Provider selection */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Providers</h2>

              {loadingProviders && (
                <p className="text-sm text-slate-400 text-center py-8">Loading providers…</p>
              )}

              {!loadingProviders && providers.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">No providers available. Try a different visit type.</p>
              )}

              <div className="space-y-3">
                {providers.map((p) => {
                  const available = isAvailableNow(p);
                  const waitText  = available ? "Available Now" : getNextAvailable(p);
                  return (
                    <Card
                      key={p.provider_user_id}
                      className={`cursor-pointer transition-all ${provider?.provider_user_id === p.provider_user_id ? "ring-2 ring-teal-500 border-teal-200" : "hover:border-slate-300"}`}
                      onClick={() => setProvider(p)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {p.provider_name?.[0] ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-slate-900">{p.provider_name}, NP</p>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="text-xs font-medium">4.8</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium truncate">
                              <Clock className="w-3 h-3 shrink-0" /> {waitText}
                            </span>
                            <span className="text-xs font-bold text-teal-700 shrink-0">$59.99</span>
                          </div>
                        </div>
                        {provider?.provider_user_id === p.provider_user_id && (
                          <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                <Button
                  disabled={!provider}
                  onClick={handleConfirm}
                  className="w-full sm:w-auto bg-[#2A7F7F] hover:bg-[#236969] rounded-xl px-6 py-4 sm:py-2"
                >
                  Choose Time Slot <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
