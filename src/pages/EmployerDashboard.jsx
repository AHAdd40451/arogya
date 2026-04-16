import React from "react";
import { motion } from "framer-motion";
import { Users, BarChart3, DollarSign, Activity, Lock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DashboardCard from "@/components/dashboard/DashboardCard";

const mockEmployees = [
  { id: 1, name: "John Doe", visits: 3, cost: "$179.97" },
  { id: 2, name: "Emily Davis", visits: 1, cost: "$59.99" },
  { id: 3, name: "Michael Brown", visits: 2, cost: "$119.98" },
];

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function EmployerDashboard() {
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8">
        {/* Admin badge */}
        <motion.div {...fadeIn} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl w-fit mb-6 text-sm font-medium">
          <Lock className="w-4 h-4 text-slate-400" />
          Internal Admin Dashboard — Not visible to public users
        </motion.div>

        <motion.div {...fadeIn} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Employer Dashboard</h1>
          <p className="text-slate-500 mt-1">Analytics and usage overview</p>
        </motion.div>

        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Total Employees" value="12" icon={Users} color="blue" />
          <StatCard label="Monthly Cost" value="$359.94" icon={DollarSign} color="teal" />
          <StatCard label="Visits This Month" value="6" icon={Activity} color="purple" />
          <StatCard label="Avg Cost / Employee" value="$29.99" icon={BarChart3} color="amber" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
            <DashboardCard title="Employee Usage" icon={Users}>
              <div className="space-y-3">
                {mockEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                        {emp.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.visits} visits this month</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-teal-700">{emp.cost}</span>
                  </div>
                ))}
                <p className="text-xs text-slate-400 text-center">+ 9 more employees</p>
              </div>
            </DashboardCard>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <DashboardCard title="Monthly Analytics" icon={BarChart3}>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-700">6</p>
                  <p className="text-xs text-blue-600">Visits/Month</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-teal-700">$359.94</p>
                  <p className="text-xs text-teal-600">Total Spend</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-purple-700">94%</p>
                  <p className="text-xs text-purple-600">Satisfaction</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-emerald-700">2</p>
                  <p className="text-xs text-emerald-600">Sick Days Avoided</p>
                </div>
              </div>
            </DashboardCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}