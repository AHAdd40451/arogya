import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  CalendarPlus, Calendar, FileText, Pill, FlaskConical,
  Shield, ArrowRight, User
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";

const mockAppointments = [
  { id: 1, provider: "NP Jane Smith", date: "3/10", time: "2:00 PM", type: "Routine", mode: "Video" },
  { id: 2, provider: "Dr. Michael Chen", date: "3/15", time: "10:00 AM", type: "Urgent", mode: "In-Person" },
];

const mockRecords = [
  { id: 1, name: "Annual Physical", year: "2025", detail: "Blood Pressure 120/80" },
  { id: 2, name: "Flu Vaccination", year: "2025", detail: "Influenza Quadrivalent" },
];

const mockPrescriptions = [
  { id: 1, name: "Amoxicillin 500mg", refills: 2, status: "Active" },
  { id: 2, name: "Metformin 500mg", refills: 5, status: "Active" },
];

const mockLabs = [
  { id: 1, name: "CBC", status: "Results Ready", date: "2/28/2025" },
  { id: 2, name: "CMP", status: "Pending", date: "3/5/2025" },
  { id: 3, name: "Lipid Panel", status: "Pending", date: "3/5/2025" },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div {...fadeIn} className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Employee Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, John Doe</p>
          </div>
          <Link to={createPageUrl("RequestVisit")}>
            <Button className="bg-teal-600 hover:bg-teal-700 rounded-xl px-6 py-5 text-base shadow-lg shadow-teal-200/50 group">
              <CalendarPlus className="w-5 h-5 mr-2" />
              Request a Visit
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Membership" value="Active" icon={Shield} color="emerald" />
          <StatCard label="Upcoming" value="2 visits" icon={Calendar} color="blue" />
          <StatCard label="Prescriptions" value="2 active" icon={Pill} color="purple" />
          <StatCard label="Lab Orders" value="3 pending" icon={FlaskConical} color="amber" />
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Appointments */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <DashboardCard
              title="Upcoming Appointments"
              icon={Calendar}
              action={
                <Link to={createPageUrl("AppointmentDetails")}>
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {mockAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{apt.provider}</p>
                        <p className="text-xs text-slate-500">{apt.date} at {apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{apt.mode}</Badge>
                      <Badge className={apt.type === "Urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}>
                        {apt.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Health Records */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <DashboardCard
              title="Health Records"
              icon={FileText}
              action={
                <Link to={createPageUrl("HealthRecords")}>
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {mockRecords.map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rec.name} – {rec.year}</p>
                      <p className="text-xs text-slate-500">{rec.detail}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">View</Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Prescriptions */}
          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <DashboardCard
              title="Prescriptions"
              icon={Pill}
              action={
                <Link to={createPageUrl("PrescriptionDetails")}>
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {mockPrescriptions.map((rx) => (
                  <div key={rx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rx.name}</p>
                      <p className="text-xs text-slate-500">{rx.refills} refills remaining</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">{rx.status}</Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Lab Orders */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <DashboardCard
              title="Lab Orders"
              icon={FlaskConical}
              action={
                <Link to={createPageUrl("LabOrders")}>
                  <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {mockLabs.map((lab) => (
                  <div key={lab.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{lab.name}</p>
                      <p className="text-xs text-slate-500">{lab.date}</p>
                    </div>
                    <Badge className={lab.status === "Results Ready" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                      {lab.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}