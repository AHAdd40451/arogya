import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function PatientOnboarding2() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ symptoms: "", conditions: "", medications: "", allergies: "", pcp: "" });

  return (
    <OnboardingLayout step={2} totalSteps={4} title="Health Profile" subtitle="Help your provider understand your current health." role="patient">
      <div className="space-y-4">
        <div>
          <Label>Current Symptoms</Label>
          <Textarea placeholder="Describe what you're experiencing..." value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} className="mt-1.5 resize-none h-24" />
        </div>
        <div>
          <Label>Existing Conditions</Label>
          <Input placeholder="e.g. Hypertension, Asthma" value={form.conditions} onChange={(e) => setForm({ ...form, conditions: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Current Medications</Label>
          <Input placeholder="e.g. Lisinopril 10mg" value={form.medications} onChange={(e) => setForm({ ...form, medications: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Allergies</Label>
          <Input placeholder="e.g. Penicillin, Sulfa" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Primary Care Physician <span className="text-slate-400 font-normal">(optional)</span></Label>
          <Input placeholder="Dr. Smith" value={form.pcp} onChange={(e) => setForm({ ...form, pcp: e.target.value })} className="mt-1.5" />
        </div>
        <Button onClick={() => navigate(createPageUrl("PatientOnboarding3"))} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}