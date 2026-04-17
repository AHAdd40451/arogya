import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { useAuth } from "@/hooks/useAuth";
import { markOnboardingStepCompleted, setMyRoleIfUnset, upsertPatientProfile } from "@/services/profile";

export default function PatientOnboarding4() {
  const navigate = useNavigate();
  const { user, loading, refreshProfile } = useAuth();
  const [consents, setConsents] = useState({ telehealth: false, emergency: false, terms: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const allChecked = consents.telehealth && consents.emergency && consents.terms;
  const toggle = (key) => setConsents((prev) => ({ ...prev, [key]: !prev[key] }));

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
        consent_telehealth: consents.telehealth,
        consent_emergency_ack: consents.emergency,
        consent_terms: consents.terms,
        consented_at: new Date().toISOString(),
      });
      await markOnboardingStepCompleted({ step: 4, completedAt: new Date().toISOString() });
      await refreshProfile();
      navigate(createPageUrl("PatientDashboard"));
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout step={4} totalSteps={4} title="Consent & Agreements" subtitle="Please review and agree to the following before continuing." role="patient">
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {[
          { key: "telehealth", label: "I consent to telehealth services provided through Arogya." },
          { key: "emergency", label: "I acknowledge this platform is not intended for emergencies. In an emergency, please call 911." },
          { key: "terms", label: "I agree to Arogya's Terms of Service and Privacy Policy." },
        ].map(({ key, label }) => (
          <label
            key={key}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
              consents[key] ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Checkbox checked={consents[key]} onCheckedChange={() => toggle(key)} className="mt-0.5" />
            <span className="text-sm text-slate-700 leading-relaxed">{label}</span>
          </label>
        ))}

        <Button
          disabled={!allChecked || submitting}
          onClick={submit}
          className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2 disabled:opacity-40"
        >
          Complete Setup → Patient Dashboard
        </Button>
      </div>
    </OnboardingLayout>
  );
}

