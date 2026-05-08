import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Clock, Stethoscope, ArrowRight, ArrowLeft, X, Wifi } from "lucide-react";
import { format, addDays, startOfDay, isAfter, isBefore } from "date-fns";
import { listBookableProviders, listProviderBookedTimes } from "@/services/booking";
import {
  generateSlots,
  getBookedSlotStarts,
  formatSlotTime,
  getNextAvailable,
  isAvailableNow,
} from "@/lib/scheduling";

// Map triage concern IDs to provider service tags
const CONCERN_TO_SERVICE = {
  cold_flu:            "urgent",
  skin:                "urgent",
  prescription:        "refills",
  general:             "routine",
  other:               "routine",
  urgent:              "urgent",
  routine:             "routine",
  prescription_refill: "refills",
};

export default function MatchingScreen() {
  const navigate = useNavigate();
  const params               = new URLSearchParams(window.location.search);
  const concern              = params.get("concern") || "general";
  const preselectedId        = params.get("provider_user_id") || null;

  const service = CONCERN_TO_SERVICE[concern] ?? null;

  // phase: loading | list | slots
  const [phase, setPhase]               = useState(preselectedId ? "loading" : "loading");
  const [providers, setProviders]       = useState([]);
  const [selectedProvider, setSelected] = useState(null);
  const [error, setError]               = useState("");

  // slot picker state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots]               = useState([]);
  const [bookedStarts, setBookedStarts] = useState(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const now = new Date();

  // Load provider list (also used when preselectedId needs to be resolved)
  useEffect(() => {
    listBookableProviders({ service })
      .then((data) => {
        setProviders(data);
        if (preselectedId) {
          const found = data.find((p) => p.provider_user_id === preselectedId);
          if (found) {
            setSelected(found);
            setPhase("slots");
          } else {
            setPhase("list");
          }
        } else {
          setPhase("list");
        }
      })
      .catch((err) => {
        setError(String(err.message || err));
        setPhase("list");
      });
  }, [service, preselectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload slots when provider or date changes
  useEffect(() => {
    if (!selectedProvider || !selectedDate) return;
    const dateStr     = format(selectedDate, "yyyy-MM-dd");
    const windowStart = new Date(`${dateStr}T00:00:00Z`);
    const windowEnd   = new Date(`${dateStr}T23:59:59Z`);

    setLoadingSlots(true);
    setSelectedSlot(null);

    const generated = generateSlots(dateStr, selectedProvider);

    listProviderBookedTimes(selectedProvider.provider_user_id, windowStart, windowEnd)
      .then((bookedTimes) => {
        const disabled = getBookedSlotStarts(
          generated,
          bookedTimes,
          selectedProvider.slot_duration_minutes ?? 15,
        );
        setSlots(generated);
        setBookedStarts(disabled);
      })
      .catch(() => {
        setSlots(generated);
        setBookedStarts(new Set());
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedProvider, selectedDate]);

  const handleSelectProvider = (p) => {
    setSelected(p);
    setSelectedDate(new Date());
    setSelectedSlot(null);
    setPhase("slots");
  };

  const handleContinue = () => {
    const p = new URLSearchParams({
      provider_user_id: selectedProvider.provider_user_id,
      provider:         selectedProvider.provider_name || "",
      credentials:      "NP",
      specialty:        selectedProvider.specialty || "",
      years:            String(selectedProvider.years_experience ?? ""),
      rating:           "4.8",
      fee:              "$59.99",
      starts_at:        selectedSlot.toISOString(),
      concern,
    });
    navigate(createPageUrl("PaymentScreen") + "&" + p.toString());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1 flex flex-col">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <X className="w-4 h-4" /> Cancel
        </button>

        <AnimatePresence mode="wait">

          {/* Loading */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-24"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-[#2A7F7F]/10 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-[#2A7F7F]/20 animate-ping" style={{ animationDelay: "0.3s" }} />
                <div className="relative w-20 h-20 rounded-full bg-[#2A7F7F] flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-[#1F2937] mb-2">Finding available providers…</h2>
              <p className="text-sm text-slate-500">Matching you with the best available care for your concern.</p>
            </motion.div>
          )}

          {/* Provider list */}
          {phase === "list" && (
            <motion.div key="list" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-lg font-semibold text-[#1F2937] mb-1">Available Providers</h2>
              <p className="text-sm text-slate-500 mb-5">Select a provider to view appointment slots.</p>

              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

              {providers.length === 0 && !error && (
                <div className="text-center py-16 text-slate-400">
                  <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No providers available right now.</p>
                  <p className="text-xs mt-1">Please try again later or select a different concern.</p>
                </div>
              )}

              <div className="space-y-3">
                {providers.map((p) => (
                  <ProviderCard key={p.provider_user_id} provider={p} onSelect={handleSelectProvider} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Slot picker */}
          {phase === "slots" && selectedProvider && (
            <motion.div key="slots" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
              <button
                onClick={() => setPhase("list")}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to providers
              </button>

              {/* Provider summary */}
              <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2A7F7F]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#2A7F7F] font-bold text-base">
                      {selectedProvider.provider_name?.[0] ?? "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F2937] text-sm">
                      {selectedProvider.provider_name}, NP
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedProvider.specialty || "General Care"} · {selectedProvider.years_experience ?? "—"} yrs exp.
                    </p>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3 mb-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  disabled={(d) => isBefore(startOfDay(d), startOfDay(now))}
                  fromDate={now}
                  toDate={addDays(now, 30)}
                />
              </div>

              {/* Time slots */}
              <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  {format(selectedDate, "EEEE, MMMM d")}
                </p>

                {loadingSlots ? (
                  <p className="text-sm text-slate-400 text-center py-4">Loading slots…</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No availability on this day — try another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot) => {
                      const isoStr    = slot.toISOString();
                      const isPast    = isBefore(slot, now);
                      const isBooked  = bookedStarts.has(isoStr);
                      const isChosen  = selectedSlot?.toISOString() === isoStr;
                      const disabled  = isPast || isBooked;

                      return (
                        <button
                          key={isoStr}
                          disabled={disabled}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${
                            isChosen
                              ? "bg-[#2A7F7F] text-white border-[#2A7F7F]"
                              : disabled
                              ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                              : "bg-white text-slate-700 border-slate-200 hover:border-[#2A7F7F] hover:text-[#2A7F7F]"
                          }`}
                        >
                          {formatSlotTime(slot, selectedProvider.time_zone)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 text-center mb-4">
                $10 fee if canceled within 10 minutes of your scheduled visit.
              </p>

              <Button
                disabled={!selectedSlot}
                onClick={handleContinue}
                className="w-full bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-xl py-5 text-sm font-semibold group disabled:opacity-40"
              >
                Continue to Payment — $59.99
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function ProviderCard({ provider, onSelect }) {
  const available  = isAvailableNow(provider);
  const nextAvail  = available ? null : getNextAvailable(provider);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#2A7F7F]/10 flex items-center justify-center shrink-0">
            <span className="text-[#2A7F7F] font-bold text-base">
              {provider.provider_name?.[0] ?? "?"}
            </span>
          </div>
          <div>
            <p className="font-semibold text-[#1F2937] text-sm">
              {provider.provider_name}, NP
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {provider.specialty || "General Care"} · {provider.years_experience ?? "—"} yrs exp.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg shrink-0">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-xs font-semibold text-amber-700">4.8</span>
        </div>
      </div>

      <div className="mb-4">
        {available ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
            <Wifi className="w-3 h-3" /> Available now
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3 h-3" /> {nextAvail}
          </span>
        )}
      </div>

      <Button
        onClick={() => onSelect(provider)}
        size="sm"
        className="w-full bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-xl"
      >
        Select &amp; Book — $59.99
      </Button>
    </div>
  );
}
