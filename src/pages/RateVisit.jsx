import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Star, ArrowRight, SkipForward } from "lucide-react";

export default function RateVisit() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider") || "Jane Smith";
  const credentials = params.get("credentials") || "NP";

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate(createPageUrl("PatientDashboard")), 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-emerald-600 fill-emerald-600" strokeWidth={1.5} />
          </div>
          <p className="text-base font-semibold text-[#1F2937]">Thank you for your feedback</p>
          <p className="text-sm text-slate-500 mt-1">Returning to dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-start sm:items-center justify-center px-4 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8">
          <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1">Rate Your Experience</h1>
          <p className="text-sm text-slate-500 mb-6">
            How was your visit with <span className="font-medium text-[#1F2937]">{provider}, {credentials}</span>?
          </p>

          {/* Star rating */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(n)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    n <= (hovered || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 fill-slate-100"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
              <p className="text-xs font-medium text-slate-500 mb-1.5">
                Additional feedback <span className="font-normal">(optional)</span>
              </p>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us about your experience…"
                className="resize-none h-24 text-sm border-slate-200 rounded-xl"
              />
            </motion.div>
          )}

          <Button
            disabled={rating === 0}
            onClick={handleSubmit}
            className="w-full bg-[#2A7F7F] hover:bg-[#236969] text-white rounded-xl py-4 text-sm font-semibold disabled:opacity-40 group"
          >
            Submit Review
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          <button
            onClick={() => navigate(createPageUrl("PatientDashboard"))}
            className="w-full mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Skip for now
          </button>
        </div>
      </motion.div>
    </div>
  );
}