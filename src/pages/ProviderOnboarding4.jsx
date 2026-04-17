import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { markOnboardingStepCompleted, setMyRoleIfUnset, upsertProviderProfile } from "@/services/profile";

export default function ProviderOnboarding4() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ workHistory: "", education: "" });
  const [bgConsent, setBgConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (loading) return;
    if (!user) navigate(`${createPageUrl("Signup")}?role=provider`, { replace: true });
  }, [loading, user, navigate]);

  const submit = async () => {
    setError("");
    setSubmitting(true);
    try {
      await setMyRoleIfUnset("provider");
      await upsertProviderProfile({
        work_history: form.workHistory,
        education: form.education,
        background_check_consent: !!bgConsent,
      });
      await markOnboardingStepCompleted({ step: 4 });
      navigate(createPageUrl("ProviderOnboarding5"));
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout step={4} totalSteps={5} title="Background & Compliance" subtitle="Help us verify your qualifications and ensure patient safety." role="provider">
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div>
          <Label>Work History</Label>
          <Textarea
            placeholder="Previous roles and employers..."
            value={form.workHistory}
            onChange={(e) => setForm({ ...form, workHistory: e.target.value })}
            className="mt-1.5 resize-none h-20"
          />
        </div>
        <div>
          <Label>Education</Label>
          <Input placeholder="e.g. MSN, University of Michigan, 2018" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Upload Government ID</Label>
          <label className="mt-1.5 flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-300 hover:bg-teal-50/50 transition-colors">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">Driver's license or passport</span>
            <input type="file" className="hidden" />
          </label>
        </div>
        <div>
          <Label>Upload Resume / CV</Label>
          <label className="mt-1.5 flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-300 hover:bg-teal-50/50 transition-colors">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">PDF preferred</span>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
          </label>
        </div>
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            bgConsent ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <Checkbox checked={bgConsent} onCheckedChange={setBgConsent} className="mt-0.5" />
          <span className="text-sm text-slate-700">
            I consent to a background check as part of the Arogya provider verification process.
          </span>
        </label>
        <Button disabled={!bgConsent || submitting} onClick={submit} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 disabled:opacity-40">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}

