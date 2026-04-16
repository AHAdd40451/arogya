import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Stethoscope, ArrowRight } from "lucide-react";

const serviceOptions = [
  { id: "telehealth", label: "Telehealth" },
  { id: "routine", label: "Routine Care" },
  { id: "urgent", label: "Urgent Care" },
  { id: "prescriptions", label: "Prescription Management" },
  { id: "physicals", label: "Annual Physicals" },
];

export default function ProviderSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", credentials: "", availability: "", services: [] });

  const toggleService = (id) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(createPageUrl("ProviderDashboard"));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Become a Provider</h1>
          <p className="text-slate-500 mt-2">Join our network and start seeing patients on your schedule</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-5">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="credentials">Credentials</Label>
            <Select value={form.credentials} onValueChange={(v) => setForm({ ...form, credentials: v })}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select credentials" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NP">Nurse Practitioner (NP)</SelectItem>
                <SelectItem value="MD">Medical Doctor (MD)</SelectItem>
                <SelectItem value="DO">Doctor of Osteopathy (DO)</SelectItem>
                <SelectItem value="PA">Physician Assistant (PA)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Services Offered</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {serviceOptions.map((svc) => (
                <label
                  key={svc.id}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    form.services.includes(svc.id)
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Checkbox
                    checked={form.services.includes(svc.id)}
                    onCheckedChange={() => toggleService(svc.id)}
                  />
                  <span className="text-sm text-slate-700">{svc.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              placeholder="9am–5pm M–F"
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 text-base group">
            Submit Application
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}