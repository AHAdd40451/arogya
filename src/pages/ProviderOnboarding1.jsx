import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function ProviderOnboarding1() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  return (
    <OnboardingLayout step={1} totalSteps={5} title="Become an Arogya Provider" subtitle="Join our network of licensed Nurse Practitioners." role="provider">
      <div className="space-y-4">
        <div>
          <Label>Full Name</Label>
          <Input placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="jane@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" />
        </div>
        <Button onClick={() => navigate(createPageUrl("ProviderOnboarding2"))} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}