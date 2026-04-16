import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Calculator, ArrowLeft, DollarSign, Users, Activity } from "lucide-react";

export default function RevenueSimulator() {
  const [users, setUsers] = useState(100);
  const [visitsPerMonth, setVisitsPerMonth] = useState(1);
  const pricePerVisit = 75;
  const commissionRate = 0.2;

  const grossRevenue = users * pricePerVisit * visitsPerMonth;
  const platformRevenue = grossRevenue * commissionRate;
  const providerRevenue = grossRevenue - platformRevenue;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex gap-4 mb-6">
          <Link to={createPageUrl("EmployeeDashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-4 h-4" /> Employee Dashboard
          </Link>
          <span className="text-slate-300">|</span>
          <Link to={createPageUrl("EmployerDashboard")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
            Employer Dashboard
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">Revenue Simulator</h1>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto">
            Estimate your potential revenue and costs based on your team size and usage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold text-slate-900">Number of Users</Label>
                  <span className="text-2xl font-bold text-teal-600">{users}</span>
                </div>
                <Slider
                  value={[users]}
                  onValueChange={([v]) => setUsers(v)}
                  min={1}
                  max={500}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1</span>
                  <span>500</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base font-semibold text-slate-900">Avg Visits per Month</Label>
                  <span className="text-2xl font-bold text-teal-600">{visitsPerMonth}</span>
                </div>
                <Slider
                  value={[visitsPerMonth]}
                  onValueChange={([v]) => setVisitsPerMonth(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Visit Rate</p>
                <p className="text-xl font-bold text-slate-900">${pricePerVisit}/visit</p>
                <p className="text-xs text-slate-400 mt-1">Platform takes {commissionRate * 100}% commission</p>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Revenue Breakdown</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Gross Revenue</p>
                      <p className="text-xs text-slate-400">{users} users × ${pricePerVisit}/visit × {visitsPerMonth}/mo</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">${grossRevenue.toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Platform Revenue (20%)</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-teal-700">${platformRevenue.toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Provider Earnings (80%)</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">${providerRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl text-center">
                <p className="text-sm text-slate-400">Annual Platform Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">${(platformRevenue * 12).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}