import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Pill } from "lucide-react";

const prescriptions = [
  { id: 1, name: "Amoxicillin 500mg", dosage: "1 capsule 3x daily", refills: 2, prescriber: "NP Jane Smith", date: "March 1, 2025", status: "Active" },
  { id: 2, name: "Metformin 500mg", dosage: "1 tablet 2x daily", refills: 5, prescriber: "Dr. Michael Chen", date: "February 15, 2025", status: "Active" },
  { id: 3, name: "Ibuprofen 400mg", dosage: "As needed for pain", refills: 0, prescriber: "NP Jane Smith", date: "August 2024", status: "Expired" },
];

export default function PrescriptionDetails() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to={createPageUrl("EmployeeDashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Prescriptions</h1>
        <div className="space-y-4">
          {prescriptions.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{rx.name}</p>
                    <p className="text-sm text-slate-500">{rx.dosage}</p>
                    <p className="text-xs text-slate-400 mt-1">Prescribed by {rx.prescriber} · {rx.date}</p>
                    <p className="text-xs text-slate-500 mt-1">{rx.refills} refills remaining</p>
                  </div>
                </div>
                <Badge className={rx.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                  {rx.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}