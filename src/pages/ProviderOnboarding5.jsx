import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
const SERVICES = [
  { id: "urgent", label: "Urgent Care" },
  { id: "routine", label: "Routine Visits" },
  { id: "refills", label: "Prescription Refills" },
];

export default function ProviderOnboarding5() {
  const navigate = useNavigate();
  const [days, setDays] = useState([]);
  const [startHour, setStartHour] = useState("9:00 AM");
  const [endHour, setEndHour] = useState("5:00 PM");
  const [services, setServices] = useState([]);

  const toggleDay = (d) => setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  const toggleService = (id) => setServices((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <OnboardingLayout step={5} totalSteps={5} title="Availability & Services" subtitle="Let patients know when and how you're available." role="provider">
      <div className="space-y-5">
        <div>
          <Label className="text-base font-semibold">Available Days</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  days.includes(d) ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Time</Label>
            <select value={startHour} onChange={(e) => setStartHour(e.target.value)} className="mt-1.5 w-full border border-input rounded-md px-3 py-2 text-sm bg-white">
              {HOURS.map((h) => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <Label>End Time</Label>
            <select value={endHour} onChange={(e) => setEndHour(e.target.value)} className="mt-1.5 w-full border border-input rounded-md px-3 py-2 text-sm bg-white">
              {HOURS.map((h) => <option key={h}>{h}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold">Services Offered</Label>
          <div className="space-y-2 mt-2">
            {SERVICES.map(({ id, label }) => (
              <label key={id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${services.includes(id) ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                <Checkbox checked={services.includes(id)} onCheckedChange={() => toggleService(id)} />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <Button
          disabled={days.length === 0 || services.length === 0}
          onClick={() => navigate(createPageUrl("ProviderDashboard"))}
          className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 disabled:opacity-40"
        >
          Complete Setup → Provider Dashboard
        </Button>
      </div>
    </OnboardingLayout>
  );
}