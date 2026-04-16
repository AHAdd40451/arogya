import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Pill, Calendar, FileText, ArrowRight } from "lucide-react";

export default function PostVisitSummary() {
  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider") || "Jane Smith";
  const credentials = params.get("credentials") || "NP";
  const navigate = useNavigate();

  const handleRebook = () => {
    const p = new URLSearchParams({ provider, credentials });
    navigate(createPageUrl("PaymentScreen") + "&" + p.toString());
  };

  const handleRate = () => {
    const p = new URLSearchParams({ provider, credentials });
    navigate(createPageUrl("RateVisit") + "&" + p.toString());
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-start sm:items-center justify-center px-4 py-6 sm:py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </motion.div>

          <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Visit Complete</h1>
          <p className="text-slate-500 text-center text-sm mb-8">
            Your visit with {provider}, {credentials} has ended.
          </p>

          {/* Provider Notes */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <p className="text-sm font-semibold text-slate-900">Provider Notes</p>
              </div>
              <p className="text-sm text-slate-600">
                Patient presents with pharyngitis with mild fever. Throat appears erythematous. Prescribed antibiotics for 7-day course.
                Advised rest and adequate hydration.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-4 h-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-900">Prescription Sent</p>
              </div>
              <p className="text-sm text-emerald-700 font-medium">Amoxicillin 500mg — 7-day supply</p>
              <p className="text-xs text-emerald-600 mt-1">Sent to your preferred pharmacy</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-blue-900">Follow-Up Recommendation</p>
              </div>
              <p className="text-sm text-blue-700">Follow up in 7–10 days if symptoms do not improve or worsen.</p>
            </div>
          </div>

          <Button onClick={handleRate} className="w-full bg-[#2A7F7F] hover:bg-[#236969] rounded-xl py-4 text-sm font-semibold group mb-3">
            Rate Your Experience
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          <Button onClick={handleRebook} variant="outline" className="w-full rounded-xl py-4 text-sm font-semibold border-slate-200 mb-3">
            Book Again with {provider}
          </Button>

          <Link to={createPageUrl("PatientDashboard")}>
            <Button variant="ghost" className="w-full rounded-xl py-4 text-sm text-slate-500 hover:text-[#1F2937]">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}