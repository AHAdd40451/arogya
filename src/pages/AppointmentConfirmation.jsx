import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Clock, Video, MapPin } from "lucide-react";

export default function AppointmentConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider") || "Jane Smith";
  const credentials = params.get("credentials") || "NP";
  const time = params.get("time") || "2:00 PM";
  const mode = params.get("mode") || "video";
  const type = params.get("type") || "routine";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </motion.div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h1>
          <p className="text-slate-500 mb-8">
            Your visit with {provider}, {credentials} has been scheduled.
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Provider</span>
              <span className="text-sm font-semibold text-slate-900">{provider}, {credentials}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Date & Time</span>
              <span className="text-sm font-semibold text-slate-900">March 10 at {time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Visit Type</span>
              <span className="text-sm font-semibold text-slate-900 capitalize">{type?.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Mode</span>
              <div className="flex items-center gap-1.5">
                {mode === "video" ? <Video className="w-4 h-4 text-teal-600" /> : <MapPin className="w-4 h-4 text-teal-600" />}
                <span className="text-sm font-semibold text-slate-900 capitalize">{mode?.replace("_", "-")}</span>
              </div>
            </div>
          </div>

          {mode === "in_person" && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl mb-6 text-sm text-blue-700">
              <Clock className="w-4 h-4 shrink-0" />
              <span>ETA: 15 min for in-person visit</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {mode === "video" && (
              <Link to={createPageUrl("VirtualVisit") + `?provider=${encodeURIComponent(provider)}&credentials=${encodeURIComponent(credentials)}`}>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5">
                  <Video className="w-4 h-4 mr-2" /> Join Virtual Visit
                </Button>
              </Link>
            )}
            <Link to={createPageUrl("EmployeeDashboard")}>
              <Button variant="outline" className="w-full rounded-xl py-5">
                Back to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}