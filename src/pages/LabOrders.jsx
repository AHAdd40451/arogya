import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical } from "lucide-react";

const labs = [
  { id: 1, name: "Complete Blood Count (CBC)", ordered: "March 5, 2025", status: "Results Ready", provider: "NP Jane Smith" },
  { id: 2, name: "Comprehensive Metabolic Panel (CMP)", ordered: "March 5, 2025", status: "Pending", provider: "NP Jane Smith" },
  { id: 3, name: "Lipid Panel", ordered: "March 5, 2025", status: "Pending", provider: "NP Jane Smith" },
  { id: 4, name: "Hemoglobin A1c", ordered: "January 8, 2025", status: "Completed", provider: "Dr. Michael Chen" },
];

export default function LabOrders() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to={createPageUrl("EmployeeDashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Lab Orders</h1>
        <div className="space-y-4">
          {labs.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-100 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{lab.name}</p>
                    <p className="text-sm text-slate-500">Ordered: {lab.ordered}</p>
                    <p className="text-xs text-slate-400 mt-1">Provider: {lab.provider}</p>
                  </div>
                </div>
                <Badge className={
                  lab.status === "Results Ready" ? "bg-emerald-100 text-emerald-700" :
                  lab.status === "Pending" ? "bg-amber-100 text-amber-700" :
                  "bg-blue-100 text-blue-700"
                }>
                  {lab.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}