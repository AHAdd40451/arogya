import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createPageUrl } from "@/utils";
import { exchangeCodeForSessionIfPresent, getReadableAuthErrorMessage, updatePassword } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

const schema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  React.useEffect(() => {
    exchangeCodeForSessionIfPresent().catch(() => {
      // ignore; user will see "not signed in" prompt below
    });
  }, []);

  const onSubmit = async ({ password }) => {
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await updatePassword({ password });
      setSuccess("Password updated. Redirecting to login…");
      setTimeout(() => navigate(createPageUrl("Login"), { replace: true }), 800);
    } catch (e) {
      setError(getReadableAuthErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password to protect your account."
    >
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          {success}
        </div>
      ) : null}

      {!loading && !user ? (
        <div className="text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3">
          Open the secure reset link from your email to continue.
        </div>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Create a new password" autoComplete="new-password" {...field} />
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
            disabled={submitting || (!loading && !user)}
            className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 disabled:opacity-60"
          >
            Update password
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}

