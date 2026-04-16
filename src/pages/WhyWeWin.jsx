import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Layers, MapPin, Repeat, BarChart3, TrendingUp, Users } from "lucide-react";

const differentiators = [
  {
    icon: Layers,
    title: "Multi-Sided Platform",
    description: "Like Uber for healthcare — we connect individuals, employers, and providers on a single marketplace with dynamic matching and real-time availability.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Serves Everyone",
    description: "Built for individuals, self-employed professionals, small businesses, and groups. No matter your situation, CareLink has a plan that fits your life and budget.",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: MapPin,
    title: "Local Provider Network",
    description: "We build hyper-local networks of NPs, MDs, and DOs so your team can see providers who know the community and are minutes away.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Repeat,
    title: "On-Demand + Subscription",
    description: "Flexible access models that fit any budget — choose flat-rate memberships for predictable costs or pay-per-visit for maximum flexibility.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Employer Analytics Dashboard",
    description: "Real-time visibility into usage, costs, and health outcomes. Track ROI, reduce sick days, and demonstrate the value of your healthcare investment.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Surge Pricing & Revenue Simulation",
    description: "Dynamic pricing ensures provider availability during peak demand while our revenue simulator helps employers forecast costs with precision.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function WhyWeWin() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge className="bg-teal-100 text-teal-700 mb-4">Why We Win</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
            Our Competitive Edge
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            What makes CareLink different from every other healthcare platform on the market.
          </p>
        </motion.div>

        <div className="space-y-6">
          {differentiators.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}