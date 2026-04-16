import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Upload, Shield } from "lucide-react";

export default function ProviderOnboarding3() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ insurer: "", policy: "", expiry: "" });
  const [confirmed, setConfirmed] = useState(false);

  return (
    <OnboardingLayout step={3} totalSteps={5} title="Malpractice Insurance" subtitle="You must carry your own malpractice insurance to practice on Arogya." role="provider">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">Arogya requires all providers to maintain active malpractice insurance. This protects both you and your patients.</p>
        </div>
        <div>
          <Label>Insurance Provider Name</Label>
          <Input placeholder="e.g. NSO, CM&F" value={form.insurer} onChange={(e) => setForm({ ...form, insurer: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Policy Number</Label>
          <Input placeholder="POL-123456" value={form.policy} onChange={(e) => setForm({ ...form, policy: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Policy Expiration Date</Label>
          <Input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Upload Insurance Certificate</Label>
          <label className="mt-1.5 flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-300 hover:bg-teal-50/50 transition-colors">
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500">Click to upload PDF or image</span>
            <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
          </label>
        </div>
        <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${confirmed ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
          <Checkbox checked={confirmed} onCheckedChange={setConfirmed} className="mt-0.5" />
          <span className="text-sm text-slate-700">I confirm I have active malpractice coverage as required by Arogya.</span>
        </label>
        <Button disabled={!confirmed} onClick={() => navigate(createPageUrl("ProviderOnboarding4"))} className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 disabled:opacity-40">
          Continue →
        </Button>
      </div>
    </OnboardingLayout>
  );
}