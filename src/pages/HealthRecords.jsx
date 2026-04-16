import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Activity } from "lucide-react";

const records = [
  { id: 1, name: "Annual Physical", date: "January 2025", details: ["Blood Pressure: 120/80", "Heart Rate: 72 bpm", "BMI: 24.3", "Cholesterol: Normal"] },
  { id: 2, name: "Flu Vaccination", date: "October 2024", details: ["Influenza Quadrivalent", "Administered: Left arm", "No adverse reactions"] },
  { id: 3, name: "Routine Visit", date: "August 2024", details: ["Chief Complaint: Headaches", "Prescribed: Ibuprofen 400mg", "Follow-up: 2 weeks"] },
];

export default function HealthRecords() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to={createPageUrl("EmployeeDashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Health Records</h1>
        <div className="space-y-4">
          {records.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-100 p-5"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{rec.name}</p>
                  <p className="text-sm text-slate-500">{rec.date}</p>
                </div>
              </div>
              <div className="ml-13 space-y-1.5">
                {rec.details.map((d, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-slate-600">
                    <Activity className="w-3 h-3 text-teal-500 shrink-0" />
                    {d}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}