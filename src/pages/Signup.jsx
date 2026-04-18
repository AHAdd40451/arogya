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
import { getReadableAuthErrorMessage, signInWithGoogle, signUpWithEmail } from "@/services/auth";
import { getRoleOnboardingStartPage, setMyRoleIfUnset, updateMyProfile } from "@/services/profile";
import { useAuth } from "@/hooks/useAuth";

const schema = z
  .object({
    email: z.string().email("Enter a valid email."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [roleChoice, setRoleChoice] = React.useState(searchParams.get("role") === "provider" ? "provider" : "patient");
  const [authError, setAuthError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  React.useEffect(() => {
    if (loading || profileLoading) return;
    if (!user || !profile || profile?.__error) return;
    navigate(createPageUrl("AuthCallback"), { replace: true });
  }, [loading, profileLoading, user, profile, navigate]);

  const onSubmit = async ({ email, password }) => {
    setAuthError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const data = await signUpWithEmail({ email, password, roleHint: roleChoice });

      if (!data.session) {
        setSuccess("Account created. Please check your email to confirm, then sign in.");
        return;
      }

      await setMyRoleIfUnset(roleChoice);
      await updateMyProfile({ onboarding_step: 0 });
      navigate(createPageUrl(getRoleOnboardingStartPage(roleChoice)), { replace: true });
    } catch (e) {
      setAuthError(getReadableAuthErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={roleChoice === "provider" ? "Create Provider Account" : "Create Patient Account"}
      subtitle="Start with email and password, then complete onboarding."
      footer={
        <p className="text-xs text-slate-500 text-center">
          Already have an account?{" "}
          <Link className="text-teal-700 font-semibold hover:underline" to={`${createPageUrl("Login")}?role=${roleChoice}`}>
            Sign in
          </Link>
        </p>
      }
    >
      {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
      {success ? (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          {success}
        </div>
      ) : null}

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
                  <Input type="password" placeholder="Create a password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Re-enter password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 disabled:opacity-60"
          >
            Create account
          </Button>
        </form>
      </Form>

      {/* <div className="relative py-2">
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
            await signInWithGoogle();
          } catch (e) {
            setAuthError(getReadableAuthErrorMessage(e));
          }
        }}
      >
        Continue with Google
      </Button> */}
    </AuthLayout>
  );
}

