import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { useAuth } from "@/hooks/useAuth";
import { markOnboardingStepCompleted, setMyRoleIfUnset, updateMyProfile, upsertPatientProfile } from "@/services/profile";

export default function PatientOnboarding1() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: "", dob: "", gender: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`${createPageUrl("Signup")}?role=patient`, { replace: true });
      return;
    }
    setForm((prev) => ({ ...prev, email: user.email ?? prev.email }));
  }, [loading, user, navigate]);

  const submit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await setMyRoleIfUnset("patient");
      await updateMyProfile({ full_name: form.name, phone: form.phone });
      await upsertPatientProfile({ date_of_birth: form.dob, gender: form.gender });
      await markOnboardingStepCompleted({ step: 1 });
      navigate(createPageUrl("PatientOnboarding2"));
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout step={1} totalSteps={4} title="Welcome to Arogya" subtitle="Let's get you set up to receive care quickly." role="patient">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-4"
      >
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
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
          <Input type="email" placeholder="you@email.com" value={form.email} className="mt-1.5" required disabled />
        </div>
        <Button type="submit" disabled={submitting} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2 disabled:opacity-60">
          Continue →
        </Button>
      </form>
    </OnboardingLayout>
  );
}

