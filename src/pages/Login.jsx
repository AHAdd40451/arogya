import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createPageUrl } from "@/utils";
import { signInWithEmail, signInWithGoogle, getReadableAuthErrorMessage } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";
import { getNextOnboardingPage, getRoleDashboardPage } from "@/services/profile";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function Login() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [roleChoice, setRoleChoice] = React.useState(searchParams.get("role") === "provider" ? "provider" : "patient");
  const [authError, setAuthError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  React.useEffect(() => {
    if (loading || profileLoading) return;
    if (!user || !profile || profile?.__error) return;
    if (!profile.role) {
      navigate(createPageUrl("AuthCallback"), { replace: true });
      return;
    }
    if (!profile.onboarding_completed_at) {
      navigate(
        createPageUrl(getNextOnboardingPage({ role: profile.role, onboardingStep: profile.onboarding_step ?? 0 })),
        { replace: true }
      );
      return;
    }
    navigate(createPageUrl(getRoleDashboardPage(profile.role)), { replace: true });
  }, [loading, profileLoading, user, profile, navigate]);

  const onSubmit = async (values) => {
    setAuthError("");
    setSubmitting(true);
    try {
      await signInWithEmail(values);
      try {
        localStorage.setItem("arogya_intended_role", roleChoice);
      } catch {
        // ignore
      }
      // Role choice is a UX hint only; actual routing uses DB profile.role.
      navigate(createPageUrl("AuthCallback"), { replace: true, state: { roleChoice } });
    } catch (e) {
      setAuthError(getReadableAuthErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={roleChoice === "provider" ? "Provider Login" : "Patient Login"}
      subtitle="Sign in to continue."
      footer={
        <p className="text-xs text-slate-500 text-center">
          Don’t have an account?{" "}
          <Link className="text-teal-700 font-semibold hover:underline" to={`${createPageUrl("Signup")}?role=${roleChoice}`}>
            Create one
          </Link>
        </p>
      }
    >
      {authError ? <p className="text-sm text-red-600">{authError}</p> : null}

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setRoleChoice("patient")}
          className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            roleChoice === "patient"
              ? "bg-teal-50 border-teal-200 text-teal-800"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Patient
        </button>
        <button
          type="button"
          onClick={() => setRoleChoice("provider")}
          className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            roleChoice === "provider"
              ? "bg-teal-50 border-teal-200 text-teal-800"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Provider
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@email.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link className="text-xs text-teal-700 font-semibold hover:underline" to={createPageUrl("ForgotPassword")}>
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 disabled:opacity-60"
          >
            Sign in
          </Button>
        </form>
      </Form>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-slate-400">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={submitting}
        className="w-full rounded-xl border-slate-200"
        onClick={async () => {
          setAuthError("");
          try {
            try {
              localStorage.setItem("arogya_intended_role", roleChoice);
            } catch {
              // ignore
            }
            await signInWithGoogle();
          } catch (e) {
            setAuthError(getReadableAuthErrorMessage(e));
          }
        }}
      >
        Continue with Google
      </Button>
    </AuthLayout>
  );
}
