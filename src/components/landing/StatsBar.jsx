import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Providers" },
  { value: "2,000+", label: "Businesses" },
  { value: "15 min", label: "Avg Wait Time" },
  { value: "98%", label: "Satisfaction" },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}