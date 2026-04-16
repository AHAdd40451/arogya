import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

export default function PatientOnboarding4() {
  const navigate = useNavigate();
  const [consents, setConsents] = useState({ telehealth: false, emergency: false, terms: false });

  const allChecked = consents.telehealth && consents.emergency && consents.terms;

  const toggle = (key) => setConsents((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <OnboardingLayout step={4} totalSteps={4} title="Consent & Agreements" subtitle="Please review and agree to the following before continuing." role="patient">
      <div className="space-y-4">
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
            <Checkbox
              checked={consents[key]}
              onCheckedChange={() => toggle(key)}
              className="mt-0.5"
            />
            <span className="text-sm text-slate-700 leading-relaxed">{label}</span>
          </label>
        ))}

        <Button
          disabled={!allChecked}
          onClick={() => navigate(createPageUrl("PatientDashboard"))}
          className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2 disabled:opacity-40"
        >
          Complete Setup → Patient Dashboard
        </Button>
      </div>
    </OnboardingLayout>
  );
}