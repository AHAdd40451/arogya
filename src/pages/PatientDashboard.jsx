import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, Pill, FlaskConical, Clock, ArrowRight, DollarSign, User, Search
} from "lucide-react";
import NotificationBanner from "@/components/NotificationBanner";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";

const mockAppointments = [
  { id: 1, provider: "NP Jane Smith", date: "March 10", time: "2:00 PM", type: "Routine", status: "Upcoming" },
];

const mockPrescriptions = [
  { id: 1, name: "Amoxicillin 500mg", refills: 2, status: "Active" },
  { id: 2, name: "Metformin 500mg", refills: 5, status: "Active" },
];

const mockLabs = [
  { id: 1, name: "CBC", status: "Results Ready" },
  { id: 2, name: "CMP", status: "Pending" },
  { id: 3, name: "Lipid Panel", status: "Pending" },
];

const mockHistory = [
  { id: 1, date: "Feb 20, 2025", provider: "NP Jane Smith", type: "Prescription Refill", fee: "$59.99" },
  { id: 2, date: "Jan 8, 2025", provider: "NP Sarah Lee", type: "Routine Consultation", fee: "$59.99" },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function PatientDashboard() {
  const [notification, setNotification] = React.useState(null);

  React.useEffect(() => {
    const t = setTimeout(() => setNotification({ type: 'visit', message: 'Your upcoming appointment is confirmed for March 10 at 2:00 PM.' }), 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <NotificationBanner notification={notification} onDismiss={() => setNotification(null)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div {...fadeIn} className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Patient Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, Jane Doe</p>
          </div>
          <Link to={createPageUrl("TriageScreen")}>
            <Button className="bg-[#2A7F7F] hover:bg-[#236969] rounded-xl px-5 py-4 text-sm font-semibold shadow-sm group">
              <Search className="w-4 h-4 mr-2" />
              Find Care Now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Price Banner */}
        <motion.div {...fadeIn} transition={{ delay: 0.05 }}
          className="bg-white border border-slate-100 rounded-xl px-5 py-3.5 flex items-center gap-3 mb-8"
        >
          <DollarSign className="w-4 h-4 text-[#2A7F7F] shrink-0" />
          <p className="text-sm text-slate-600">$59.99 per visit — <span className="font-semibold text-[#1F2937]">pay only when you need care.</span> No subscription required.</p>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Upcoming Visits" value="1" icon={Calendar} color="blue" />
          <StatCard label="Prescriptions" value="2 active" icon={Pill} color="purple" />
          <StatCard label="Lab Orders" value="3" icon={FlaskConical} color="amber" />
          <StatCard label="Total Visits" value="2" icon={Clock} color="teal" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Upcoming */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <DashboardCard title="Upcoming Appointments" icon={Calendar}>
              <div className="space-y-3">
                {mockAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{apt.provider}</p>
                        <p className="text-xs text-slate-500">{apt.date} at {apt.time} · {apt.type}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">{apt.status}</Badge>
                  </div>
                ))}
                {mockAppointments.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No upcoming appointments</p>
                )}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Prescriptions */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <DashboardCard
              title="Prescriptions"
              icon={Pill}
              action={
                <Link to={createPageUrl("PrescriptionDetails")}>
                  <Button variant="ghost" size="sm" className="text-teal-600 text-xs">View All</Button>
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
          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <DashboardCard
              title="Lab Orders"
              icon={FlaskConical}
              action={
                <Link to={createPageUrl("LabOrders")}>
                  <Button variant="ghost" size="sm" className="text-teal-600 text-xs">View All</Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {mockLabs.map((lab) => (
                  <div key={lab.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900">{lab.name}</p>
                    <Badge className={lab.status === "Results Ready" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                      {lab.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Visit History */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <DashboardCard title="Visit History" icon={Clock}>
              <div className="space-y-3">
                {mockHistory.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{v.type}</p>
                      <p className="text-xs text-slate-500">{v.date} · {v.provider}</p>
                    </div>
                    <span className="text-sm font-bold text-teal-700">{v.fee}</span>
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