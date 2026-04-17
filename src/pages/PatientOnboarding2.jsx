import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { useAuth } from "@/hooks/useAuth";
import { markOnboardingStepCompleted, setMyRoleIfUnset, upsertPatientProfile } from "@/services/profile";

export default function PatientOnboarding2() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ symptoms: "", conditions: "", medications: "", allergies: "", pcp: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (loading) return;
    if (!user) navigate(`${createPageUrl("Signup")}?role=patient`, { replace: true });
  }, [loading, user, navigate]);

  const submit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await setMyRoleIfUnset("patient");
      await upsertPatientProfile({
        current_symptoms: form.symptoms,
        existing_conditions: form.conditions,
        current_medications: form.medications,
        allergies: form.allergies,
        primary_care_physician: form.pcp,
      });
      await markOnboardingStepCompleted({ step: 2 });
      navigate(createPageUrl("PatientOnboarding3"));
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout step={2} totalSteps={4} title="Health Profile" subtitle="Help your provider understand your current health." role="patient">
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div>
          <Label>Current Symptoms</Label>
          <Textarea
            placeholder="Describe what you're experiencing..."
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            className="mt-1.5 resize-none h-24"
          />
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
          <Label>
            Primary Care Physician <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Input placeholder="Dr. Smith" value={form.pcp} onChange={(e) => setForm({ ...form, pcp: e.target.value })} className="mt-1.5" />
        </div>
        <Button onClick={submit} disabled={submitting} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2 disabled:opacity-60">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}

