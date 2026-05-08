import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Star, Clock, Settings, Users, Wifi, WifiOff, MessageSquare } from "lucide-react";
import NotificationBanner from "@/components/NotificationBanner";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { listMyAppointments } from "@/services/booking";
import { upsertProviderProfile } from "@/services/profile";
import { format, startOfDay, endOfDay } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
];

const mockEarnings = [
  { date: "Today",     visits: 3, gross: 179.97, commission: 36.00, net: 143.97 },
  { date: "Yesterday", visits: 4, gross: 239.96, commission: 48.00, net: 191.96 },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const displayName = profile?.full_name || "Provider";

  const [notification, setNotification] = useState(null);

  // Provider settings
  const [providerRow, setProviderRow]       = useState(null);
  const [online, setOnline]                 = useState(false);
  const [savingOnline, setSavingOnline]     = useState(false);

  // Availability edit form
  const [editDays, setEditDays]             = useState([]);
  const [editStart, setEditStart]           = useState("9:00 AM");
  const [editEnd, setEditEnd]               = useState("5:00 PM");
  const [savingAvail, setSavingAvail]       = useState(false);

  // Appointments
  const [todayAppts, setTodayAppts]         = useState([]);
  const [upcomingAppts, setUpcomingAppts]   = useState([]);
  const [loadingAppts, setLoadingAppts]     = useState(true);

  // Load provider row + appointments on mount
  useEffect(() => {
    if (!profile?.user_id) return;

    supabase
      .from("providers")
      .select("*")
      .eq("user_id", profile.user_id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProviderRow(data);
          setOnline(data.is_online ?? false);
          setEditDays(data.availability_days ?? []);
          setEditStart(data.availability_start ?? "9:00 AM");
          setEditEnd(data.availability_end ?? "5:00 PM");
        }
      });

    const today = new Date();
    Promise.all([
      listMyAppointments({ role: "provider", from: startOfDay(today), to: endOfDay(today) }),
      listMyAppointments({ role: "provider", from: today, status: "scheduled" }),
    ])
      .then(([todays, upcoming]) => {
        setTodayAppts(todays);
        setUpcomingAppts(upcoming);
      })
      .finally(() => setLoadingAppts(false));
  }, [profile?.user_id]);

  const toggleOnline = async () => {
    setSavingOnline(true);
    const newState = !online;
    try {
      await upsertProviderProfile({ is_online: newState });
      setOnline(newState);
      setNotification({
        type: "visit",
        message: `You are now ${newState ? "online" : "offline"} and ${newState ? "accepting" : "not accepting"} new patients.`,
      });
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    } finally {
      setSavingOnline(false);
    }
  };

  const saveAvailability = async () => {
    setSavingAvail(true);
    try {
      await upsertProviderProfile({
        availability_days:  editDays,
        availability_start: editStart,
        availability_end:   editEnd,
      });
      toast({ title: "Availability updated" });
    } catch {
      toast({ title: "Failed to save availability", variant: "destructive" });
    } finally {
      setSavingAvail(false);
    }
  };

  const toggleEditDay = (d) =>
    setEditDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const formatApptTime = (startsAt) => {
    try { return format(new Date(startsAt), "h:mm a"); }
    catch { return "—"; }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <NotificationBanner notification={notification} onDismiss={() => setNotification(null)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <motion.div {...fadeIn} className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F2937]">Provider Dashboard</h1>
            <p className="text-slate-500 mt-0.5 text-sm">Welcome back, {displayName}</p>
            <div className="mt-3">
              <Button variant="outline" className="rounded-xl border-slate-200" onClick={() => navigate(createPageUrl("Chat"))}>
                <MessageSquare className="w-4 h-4 mr-2" /> Messages
              </Button>
            </div>
          </div>
          <button
            onClick={toggleOnline}
            disabled={savingOnline}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all disabled:opacity-60 ${
              online
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
            }`}
          >
            {online ? <Wifi className="w-4 h-4" strokeWidth={1.5} /> : <WifiOff className="w-4 h-4" strokeWidth={1.5} />}
            {online ? "Online — Accepting Patients" : "Offline"}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Today's Visits"   value={loadingAppts ? "…" : String(todayAppts.length)}      icon={Calendar}    color="teal" />
          <StatCard label="Today's Earnings" value={loadingAppts ? "…" : `$${(todayAppts.length * 47.99).toFixed(2)}`} icon={DollarSign} color="emerald" trend="+$47.99 per visit" />
          <StatCard label="Rating"           value="4.9 ★"                                                icon={Star}        color="amber" />
          <StatCard label="Upcoming"         value={loadingAppts ? "…" : String(upcomingAppts.length)}   icon={Clock}       color="blue" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Upcoming Appointments */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <DashboardCard title="Upcoming Requests" icon={Clock}>
              <div className="space-y-3">
                {loadingAppts && <p className="text-sm text-slate-400 text-center py-4">Loading…</p>}
                {!loadingAppts && upcomingAppts.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No upcoming appointments</p>
                )}
                {upcomingAppts.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="p-4 rounded-xl border bg-slate-50 border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{apt.patient_name}</p>
                        <p className="text-xs text-slate-500">
                          {apt.concern || "General"} · {formatApptTime(apt.starts_at)} · Video Visit
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>
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
                {loadingAppts && <p className="text-sm text-slate-400 text-center py-4">Loading…</p>}
                {!loadingAppts && todayAppts.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No appointments today</p>
                )}
                {todayAppts.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{apt.patient_name}</p>
                        <p className="text-xs text-slate-500">{apt.concern || "General"} · {formatApptTime(apt.starts_at)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{apt.status}</Badge>
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

          {/* Availability Settings */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <DashboardCard title="Availability Settings" icon={Settings}>
              <div className="space-y-4">
                {/* Current hours summary */}
                {providerRow && (
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs font-medium text-slate-500 mb-1">CURRENT HOURS</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {providerRow.availability_start || "9:00 AM"} – {providerRow.availability_end || "5:00 PM"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {(providerRow.availability_days ?? []).join(", ") || "No days set"}
                    </p>
                  </div>
                )}

                {/* Days toggles */}
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-2">AVAILABLE DAYS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS.map((d) => (
                      <button
                        key={d}
                        onClick={() => toggleEditDay(d)}
                        type="button"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          editDays.includes(d)
                            ? "bg-teal-600 text-white border-teal-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">START</p>
                    <select
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                      className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-white"
                    >
                      {HOURS.map((h) => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">END</p>
                    <select
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                      className="w-full border border-input rounded-md px-2 py-1.5 text-sm bg-white"
                    >
                      {HOURS.map((h) => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={saveAvailability}
                  disabled={savingAvail}
                  className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl disabled:opacity-60"
                  size="sm"
                >
                  {savingAvail ? "Saving…" : "Update Availability"}
                </Button>
              </div>
            </DashboardCard>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
