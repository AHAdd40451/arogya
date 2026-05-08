import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";
import { bookAppointment } from "@/services/booking";
import { getOrCreateConversation, sendTextMessage } from "@/services/chat";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { format, differenceInMinutes } from "date-fns";

const NOW_THRESHOLD_MINUTES = 5;

export default function PaymentScreen() {
  const navigate        = useNavigate();
  const { toast }       = useToast();
  const { profile }     = useAuth();
  const params       = new URLSearchParams(window.location.search);

  const providerUserId = params.get("provider_user_id") || null;
  const provider       = params.get("provider")    || "Provider";
  const credentials    = params.get("credentials") || "NP";
  const type           = params.get("concern")     || params.get("type") || "routine";
  const fee            = params.get("fee")         || "$59.99";
  const specialty      = params.get("specialty")   || "General Care";
  const years          = params.get("years")       || "";
  const rating         = params.get("rating")      || "4.8";
  const startsAtParam  = params.get("starts_at")   || null;

  const startsAt       = startsAtParam ? new Date(startsAtParam) : null;

  const formatStartsAt = () => {
    if (!startsAt) return "Now";
    try { return format(startsAt, "MMM d 'at' h:mm a"); }
    catch { return "Soon"; }
  };

  const [form, setForm]       = useState({ card: "", expiry: "", cvv: "" });
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (providerUserId && startsAt) {
        await bookAppointment({ providerUserId, startsAt, concern: type });
      }

      // Initiate provider↔patient chat after booking (non-blocking)
      if (providerUserId && profile?.user_id) {
        try {
          const convo = await getOrCreateConversation({
            providerUserId,
            patientUserId: profile.user_id,
          });
          await sendTextMessage({
            conversationId: convo.id,
            text: `Hi! I've booked an appointment for ${formatStartsAt()}. Looking forward to our visit.`,
          });
        } catch {
          // Chat creation is non-critical — booking already succeeded
        }
      }

      // Route: if appointment starts within threshold → go to VirtualVisit
      const isNow = !startsAt || differenceInMinutes(startsAt, new Date()) <= NOW_THRESHOLD_MINUTES;

      if (isNow) {
        navigate(
          createPageUrl("VirtualVisit") +
          `&provider=${encodeURIComponent(provider)}&credentials=${encodeURIComponent(credentials)}` +
          `&specialty=${encodeURIComponent(specialty)}&years=${encodeURIComponent(years)}&rating=${encodeURIComponent(rating)}`,
        );
      } else {
        navigate(createPageUrl("PatientDashboard"), { replace: true });
        toast({
          title: "Appointment booked!",
          description: `Your visit with ${provider} is confirmed for ${formatStartsAt()}.`,
        });
      }
    } catch (err) {
      setLoading(false);
      // Postgres exclusion violation (23P01) = double-booking conflict
      const code = err?.code ?? err?.message ?? "";
      if (code.includes("23P01") || code.toLowerCase().includes("exclusion")) {
        toast({
          title: "Slot already booked",
          description: "Someone just took that slot. Please go back and pick another time.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Booking failed",
          description: String(err.message || err),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-start sm:items-center justify-center px-4 py-6 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Confirm Your Visit</h1>
          <p className="text-slate-500 text-sm mb-6">
            {startsAt
              ? "Your appointment will be confirmed after payment."
              : "You'll be connected to your provider right after payment."}
          </p>

          {/* Provider card */}
          <div className="bg-[#F7F9FB] border border-slate-100 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#2A7F7F]/10 flex items-center justify-center">
                <span className="text-[#2A7F7F] font-bold">{provider[0]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{provider}, {credentials}</p>
                <p className="text-xs text-slate-500">
                  {specialty}{years ? ` · ${years} yrs exp.` : ""}{rating ? ` · ${rating} ★` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3">
              <span className="text-slate-500">Appointment</span>
              <span className="font-medium text-[#1F2937]">{formatStartsAt()}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-500">Visit Type</span>
              <span className="font-medium text-[#1F2937] capitalize">{type?.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-slate-500 font-medium text-sm">Flat Fee</span>
              <span className="text-xl font-bold text-[#2A7F7F]">{fee}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4 text-center">$10 fee if canceled within 10 minutes of your visit.</p>

          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <div className="relative mt-1.5">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={form.card}
                  onChange={(e) => setForm({ ...form, card: e.target.value })}
                  className="pl-10"
                  maxLength={19}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Expiration Date</Label>
                <Input placeholder="MM / YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="mt-1.5" required />
              </div>
              <div>
                <Label>CVV</Label>
                <Input placeholder="123" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} className="mt-1.5" maxLength={4} required />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#2A7F7F] hover:bg-[#236969] rounded-xl py-5 text-sm font-semibold mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Pay {fee} &amp; Confirm Visit
                </span>
              )}
            </Button>
          </form>

          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input type="checkbox" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} className="rounded border-slate-300" />
            <span className="text-xs text-slate-500">Save card for future visits</span>
          </label>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <Lock className="w-3 h-3" /> Secured by 256-bit encryption
          </div>
        </div>
      </motion.div>
    </div>
  );
}
