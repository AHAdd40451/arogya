import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function PatientOnboarding3() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ surgeries: "", chronic: "", family: "", smoking: "", alcohol: "" });

  return (
    <OnboardingLayout step={3} totalSteps={4} title="Medical History" subtitle="This helps your provider give you the best care." role="patient">
      <div className="space-y-4">
        <div>
          <Label>Past Surgeries</Label>
          <Input placeholder="e.g. Appendectomy 2015" value={form.surgeries} onChange={(e) => setForm({ ...form, surgeries: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Chronic Conditions</Label>
          <Input placeholder="e.g. Diabetes, Hypertension" value={form.chronic} onChange={(e) => setForm({ ...form, chronic: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Family Medical History <span className="text-slate-400 font-normal">(optional)</span></Label>
          <Input placeholder="e.g. Heart disease, Cancer" value={form.family} onChange={(e) => setForm({ ...form, family: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Smoking Status</Label>
          <Select value={form.smoking} onValueChange={(v) => setForm({ ...form, smoking: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="former">Former smoker</SelectItem>
              <SelectItem value="current">Current smoker</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Alcohol Use</Label>
          <Select value={form.alcohol} onValueChange={(v) => setForm({ ...form, alcohol: v })}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="occasional">Occasional</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => navigate(createPageUrl("PatientOnboarding4"))} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}