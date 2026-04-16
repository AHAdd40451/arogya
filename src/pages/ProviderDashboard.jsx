import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Star, Clock, Check, X, Settings, Users, Wifi, WifiOff } from "lucide-react";
import NotificationBanner from "@/components/NotificationBanner";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";

const mockRequests = [
  { id: 1, patient: "John Doe", type: "Routine", time: "2:00 PM", status: "pending" },
  { id: 2, patient: "Emily Davis", type: "Urgent", time: "2:30 PM", status: "pending" },
];

const mockAppointments = [
  { id: 1, patient: "Sarah Lee", type: "Prescription Refill", time: "3:00 PM" },
  { id: 2, patient: "Mike Brown", type: "Routine Consultation", time: "4:00 PM" },
];

const mockEarnings = [
  { date: "Today", visits: 3, gross: 179.97, commission: 36.00, net: 143.97 },
  { date: "Yesterday", visits: 4, gross: 239.96, commission: 48.00, net: 191.96 },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(mockRequests);
  const [online, setOnline] = useState(true);
  const [notification, setNotification] = useState(null);

  const handleRequest = (id, action) => {
    setRequests(requests.map((r) => r.id === id ? { ...r, status: action } : r));
    if (action === "accepted") {
      navigate(createPageUrl("VirtualVisit") + "&provider=Jane%20Smith&credentials=NP");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <NotificationBanner notification={notification} onDismiss={() => setNotification(null)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8">
        <motion.div {...fadeIn} className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">Provider Dashboard</h1>
            <p className="text-slate-500 mt-0.5 text-sm">Welcome back, Jane Smith, NP</p>
          </div>
          <button
            onClick={() => {
              setOnline(!online);
              setNotification({ type: 'visit', message: `You are now ${online ? 'offline' : 'online'} and ${online ? 'not accepting' : 'accepting'} new patients.` });
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              online
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {online ? <Wifi className="w-4 h-4" strokeWidth={1.5} /> : <WifiOff className="w-4 h-4" strokeWidth={1.5} />}
            {online ? 'Online — Accepting Patients' : 'Offline'}
          </button>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Today's Visits" value="5" icon={Calendar} color="teal" />
          <StatCard label="Today's Earnings" value="$239.95" icon={DollarSign} color="emerald" trend="+$47.99 per visit" />
          <StatCard label="Rating" value="4.9 ★" icon={Star} color="amber" />
          <StatCard label="Pending" value={requests.filter((r) => r.status === "pending").length.toString()} icon={Clock} color="blue" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Requests */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <DashboardCard title="Incoming Requests" icon={Clock}>
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className={`p-4 rounded-xl border transition-all ${
                    req.status === "accepted" ? "bg-emerald-50 border-emerald-200" :
                    req.status === "declined" ? "bg-red-50 border-red-200 opacity-60" : "bg-slate-50 border-slate-100"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{req.patient}</p>
                        <p className="text-xs text-slate-500">{req.type} · {req.time} · Video Visit</p>
                      </div>
                      {req.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRequest(req.id, "accepted")} className="bg-emerald-600 hover:bg-emerald-700 rounded-lg h-8 px-3">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRequest(req.id, "declined")} className="rounded-lg h-8 px-3 text-red-600 border-red-200 hover:bg-red-50">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge className={req.status === "accepted" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                          {req.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <DashboardCard title="Today's Appointments" icon={Calendar}>
              <div className="space-y-3">
                {mockAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{apt.patient}</p>
                        <p className="text-xs text-slate-500">{apt.type} · {apt.time}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Video</Badge>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Earnings */}
          <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
            <DashboardCard title="Earnings Tracker" icon={DollarSign}>
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-sm">
                  <div className="flex justify-between mb-1"><span className="text-slate-600">Visit Fee</span><span className="font-semibold">$59.99</span></div>
                  <div className="flex justify-between mb-1"><span className="text-slate-600">Platform Fee (20%)</span><span className="text-red-600">−$12.00</span></div>
                  <div className="flex justify-between font-bold text-base border-t border-teal-200 pt-2 mt-2"><span className="text-teal-800">You Earn</span><span className="text-teal-700">$47.99</span></div>
                </div>
                {mockEarnings.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{e.date}</p>
                      <p className="text-xs text-slate-500">{e.visits} visits · ${e.gross.toFixed(2)} gross</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">+${e.net.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">−${e.commission.toFixed(2)} fee</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </motion.div>

          {/* Availability */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <DashboardCard title="Availability Settings" icon={Settings}>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-medium text-slate-500 mb-2">CURRENT HOURS</p>
                  <p className="text-sm font-semibold text-slate-900">9:00 AM – 5:00 PM · Mon – Fri</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Start Time</Label>
                    <Input defaultValue="9:00 AM" className="mt-1 h-9 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">End Time</Label>
                    <Input defaultValue="5:00 PM" className="mt-1 h-9 text-sm" />
                  </div>
                </div>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl" size="sm">
                  Update Availability
                </Button>
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}