import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { useAuth } from "@/hooks/useAuth";
import { markOnboardingStepCompleted, setMyRoleIfUnset, updateMyProfile, upsertProviderProfile } from "@/services/profile";

export default function ProviderOnboarding1() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`${createPageUrl("Signup")}?role=provider`, { replace: true });
      return;
    }
    setForm((prev) => ({ ...prev, email: user.email ?? prev.email }));
  }, [loading, user, navigate]);

  const submit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await setMyRoleIfUnset("provider");
      await updateMyProfile({ full_name: form.name, phone: form.phone });
      await upsertProviderProfile({ application_status: "pending" });
      await markOnboardingStepCompleted({ step: 1 });
      navigate(createPageUrl("ProviderOnboarding2"));
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout step={1} totalSteps={5} title="Become an Arogya Provider" subtitle="Join our network of licensed Nurse Practitioners." role="provider">
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div>
          <Label>Full Name</Label>
          <Input placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="jane@email.com" value={form.email} className="mt-1.5" required disabled />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" required />
        </div>
        <Button onClick={submit} disabled={submitting} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2 disabled:opacity-60">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}

