import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createPageUrl } from "@/utils";
import { getReadableAuthErrorMessage, requestPasswordReset } from "@/services/auth";

const schema = z.object({ email: z.string().email("Enter a valid email.") });

export default function ForgotPassword() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await requestPasswordReset({ email });
      setSuccess("Password reset email sent. Check your inbox.");
    } catch (e) {
      setError(getReadableAuthErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll email you a secure link to set a new password."
      footer={
        <p className="text-xs text-slate-500 text-center">
          <Link className="text-teal-700 font-semibold hover:underline" to={createPageUrl("Login")}>
            Back to login
          </Link>
        </p>
      }
    >
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
          {success}
        </div>
      ) : null}

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
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl py-5 disabled:opacity-60"
          >
            Send reset link
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}

