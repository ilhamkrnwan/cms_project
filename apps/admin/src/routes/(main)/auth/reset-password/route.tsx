import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authApi } from "@/lib/api-client";

const searchSchema = z.object({
  token: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/(main)/auth/reset-password")({
  validateSearch: searchSchema,
  component: ResetPasswordPage,
});

const formSchema = z
  .object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/(main)/auth/reset-password" });
  const token = search.token || "";
  const email = search.email || "";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token || !email) {
      setErrorMessage("Missing reset token or email. Please check your reset link.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authApi.resetPassword({
        email,
        token,
        newPassword: data.newPassword,
      });

      if (res.success) {
        toast.add({
          title: "Password reset successful",
          description: "You can now log in with your new password.",
        });
        navigate({ to: "/auth/login" });
      } else {
        setErrorMessage(res.message || "Failed to reset password.");
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
          <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter a new password for account <strong>{email || "your account"}</strong>.
          </p>
        </div>

        {!token || !email ? (
          <div className="space-y-4 text-center">
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20">
              Invalid or missing password reset link token.
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/forgot-password">Request New Reset Link</Link>
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
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-new-password">New Password</FieldLabel>
                    <Input
                      {...field}
                      id="reset-new-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-confirm-password">Confirm Password</FieldLabel>
                    <Input
                      {...field}
                      id="reset-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
