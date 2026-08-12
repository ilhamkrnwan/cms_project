import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api-client";

export const Route = createFileRoute("/(main)/auth/forgot-password")({
  component: ForgotPasswordPage,
});

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await authApi.forgotPassword({ email: data.email });
      if (res.success) {
        setSuccessMessage(res.message || "Password reset link sent! Check your inbox.");
      } else {
        setErrorMessage(res.message || "Failed to send password reset email.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your registered email address and we will send you a password reset link.
          </p>
        </div>

        {successMessage ? (
          <div className="space-y-4 text-center">
            <div className="rounded-md bg-emerald-500/15 p-4 text-sm text-emerald-600 font-medium border border-emerald-500/20">
              {successMessage}
            </div>
            <p className="text-xs text-muted-foreground">
              Didn't receive an email? Check Mailpit UI at <a href="http://localhost:8025" target="_blank" rel="noreferrer" className="underline text-primary">localhost:8025</a>.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/login">Back to Login</Link>
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20">
                {errorMessage}
              </div>
            )}

            <FieldGroup className="gap-4">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-email">Email Address</FieldLabel>
                    <Input
                      {...field}
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm">
              <Link to="/auth/login" className="text-muted-foreground hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
