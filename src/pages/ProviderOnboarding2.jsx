import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { markOnboardingStepCompleted, setMyRoleIfUnset, upsertProviderProfile } from "@/services/profile";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export default function ProviderOnboarding2() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ license: "", state: "", years: "", specialty: "" });
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
        np_license_number: form.license,
        license_state: form.state,
        years_experience: form.years ? Number(form.years) : null,
        specialty: form.specialty,
      });
      await markOnboardingStepCompleted({ step: 2 });
      navigate(createPageUrl("ProviderOnboarding3"));
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout step={2} totalSteps={5} title="Professional Credentials" subtitle="Tell us about your NP license and practice area." role="provider">
      <div className="space-y-4">
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div>
          <Label>NP License Number</Label>
          <Input placeholder="NP-123456" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })} className="mt-1.5" required />
        </div>
        <div>
          <Label>State Licensed In</Label>
          <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Years of Experience</Label>
          <Input type="number" placeholder="5" value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} className="mt-1.5" required />
        </div>
        <div>
          <Label>Specialty</Label>
          <Select value={form.specialty} onValueChange={(v) => setForm({ ...form, specialty: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family">Family Practice</SelectItem>
              <SelectItem value="urgent">Urgent Care</SelectItem>
              <SelectItem value="internal">Internal Medicine</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Upload NP License Document</Label>
          <label className="mt-1.5 flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-300 hover:bg-teal-50/50 transition-colors">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">Click to upload PDF or image</span>
            <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
          </label>
        </div>
        <Button onClick={submit} disabled={submitting} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 mt-2 disabled:opacity-60">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}

