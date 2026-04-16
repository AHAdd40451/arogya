import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Video, Shuffle, Globe, Shield, ArrowRight } from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    title: "Virtual Care for Everyone",
    status: "current",
    icon: Video,
    color: "bg-teal-100 text-teal-600 border-teal-200",
    description: "Launch telehealth platform with on-demand video visits, prescription management, and basic employer dashboards.",
    features: ["Telehealth visits", "Provider matching", "E-prescriptions", "Basic analytics"],
  },
  {
    phase: "Phase 2",
    title: "Hybrid Model",
    status: "next",
    icon: Shuffle,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    description: "Introduce in-person visits with local providers and on-site health days for employers.",
    features: ["In-person visits", "On-site health days", "Lab integrations", "Advanced scheduling"],
  },
  {
    phase: "Phase 3",
    title: "Multi-State Expansion",
    status: "planned",
    icon: Globe,
    color: "bg-purple-100 text-purple-600 border-purple-200",
    description: "Expand provider network across multiple states with compliance and licensing automation.",
    features: ["Multi-state licensing", "Regional provider networks", "Compliance automation", "Enterprise tools"],
  },
  {
    phase: "Phase 4",
    title: "Employer / Group Packages & Insurance Alternatives",
    status: "future",
    icon: Shield,
    color: "bg-amber-100 text-amber-600 border-amber-200",
    description: "Offer group packages and employer plans as a comprehensive alternative to traditional insurance for businesses and individuals.",
    features: ["Group care packages", "Employer plan management", "Insurance alternative models", "Predictive health analytics"],
  },
];

const statusColors = {
  current: "bg-emerald-100 text-emerald-700",
  next: "bg-blue-100 text-blue-700",
  planned: "bg-purple-100 text-purple-700",
  future: "bg-slate-100 text-slate-600",
};

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge className="bg-teal-100 text-teal-700 mb-4">Roadmap</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">Our Journey Forward</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From virtual care to a full insurance replacement — see where we're headed.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden sm:block" />

          <div className="space-y-8">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative sm:pl-20"
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex absolute left-4 top-6 w-8 h-8 rounded-full border-4 border-white shadow-sm items-center justify-center bg-white z-10">
                  <div className={`w-3 h-3 rounded-full ${phase.status === "current" ? "bg-teal-500" : "bg-slate-300"}`} />
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${phase.color} border flex items-center justify-center shrink-0`}>
                      <phase.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-slate-400">{phase.phase}</span>
                        <Badge className={statusColors[phase.status]}>
                          {phase.status === "current" ? "In Progress" : phase.status === "next" ? "Up Next" : phase.status === "planned" ? "Planned" : "Future"}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{phase.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{phase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.features.map((f, j) => (
                          <span key={j} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
                            <ArrowRight className="w-3 h-3 text-teal-500" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}