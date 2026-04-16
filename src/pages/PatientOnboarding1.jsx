import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function PatientOnboarding1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", dob: "", gender: "", phone: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(createPageUrl("PatientOnboarding2"));
  };

  return (
    <OnboardingLayout step={1} totalSteps={4} title="Welcome to Arogya" subtitle="Let's get you set up to receive care quickly." role="patient">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Full Name</Label>
          <Input placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" required />
        </div>
        <div>
          <Label>Date of Birth</Label>
          <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="mt-1.5" required />
        </div>
        <div>
          <Label>Gender</Label>
          <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="nonbinary">Non-binary</SelectItem>
              <SelectItem value="prefer_not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" required />
        </div>
        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2">
          Continue →
        </Button>
      </form>
    </OnboardingLayout>
  );
}