import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, User, Video, MapPin } from "lucide-react";

const appointments = [
  { id: 1, provider: "NP Jane Smith", date: "March 10, 2025", time: "2:00 PM", type: "Routine", mode: "Video", status: "Upcoming" },
  { id: 2, provider: "Dr. Michael Chen", date: "March 15, 2025", time: "10:00 AM", type: "Urgent", mode: "In-Person", status: "Upcoming" },
  { id: 3, provider: "NP Jane Smith", date: "February 20, 2025", time: "3:00 PM", type: "Prescription Refill", mode: "Video", status: "Completed" },
  { id: 4, provider: "Dr. Sarah Johnson", date: "January 8, 2025", time: "11:00 AM", type: "Routine", mode: "In-Person", status: "Completed" },
];

export default function AppointmentDetails() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to={createPageUrl("EmployeeDashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">All Appointments</h1>
        <div className="space-y-3">
          {appointments.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mt-0.5">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{apt.provider}</p>
                    <p className="text-sm text-slate-500">{apt.date} at {apt.time}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{apt.type}</Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {apt.mode === "Video" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {apt.mode}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge className={apt.status === "Upcoming" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}>
                  {apt.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}