import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Info } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$59",
    period: "/person/month",
    description: "Telehealth Only",
    features: [
      "Unlimited telehealth visits",
      "Prescription management",
      "Basic health records",
      "Chat with providers",
      "24/7 availability",
    ],
    color: "border-slate-200",
    buttonClass: "bg-slate-900 hover:bg-slate-800",
    popular: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/person/month",
    description: "Telehealth + Annual Physical",
    features: [
      "Everything in Starter",
      "Annual physical exam",
      "Lab work included",
      "Health analytics dashboard",
      "Priority scheduling",
      "Dedicated account manager",
    ],
    color: "border-teal-500 ring-2 ring-teal-500",
    buttonClass: "bg-teal-600 hover:bg-teal-700",
    popular: true,
  },
  {
    name: "Pro",
    price: "Custom",
    period: "pricing",
    description: "Telehealth + On-Site Health Days / Group Packages",
    features: [
      "Everything in Growth",
      "On-site health day events",
      "Custom wellness programs",
      "Advanced analytics & reporting",
      "White-glove onboarding",
      "Volume discounts",
    ],
    color: "border-slate-200",
    buttonClass: "bg-slate-900 hover:bg-slate-800",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="bg-teal-100 text-teal-700 mb-4">Pricing</Badge>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Choose a plan that works for your team. All plans include access to our provider network.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-2xl border ${plan.color} p-8 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-teal-600 text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl("EmployeeDashboard")}>
                <Button className={`w-full rounded-xl py-5 ${plan.buttonClass}`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Select Plan"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pay Per Visit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-900">Pay-Per-Visit</h3>
              </div>
              <p className="text-slate-500 max-w-md">
                No commitment required. Pay only when you need care.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">$75</p>
                <p className="text-xs text-slate-500">Standard rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">$95</p>
                <p className="text-xs text-slate-500">Surge pricing</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 p-3 bg-blue-50 rounded-xl">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-700">Platform takes 20% commission per visit</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}