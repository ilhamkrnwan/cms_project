import { useEffect, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api-client";

const searchSchema = z.object({
  token: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/(main)/auth/verify-email")({
  validateSearch: searchSchema,
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const search = useSearch({ from: "/(main)/auth/verify-email" });
  const token = search.token || "";

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setIsSuccess(false);
      setMessage("No verification token provided.");
      return;
    }

    authApi.verifyEmail({ token })
      .then((res) => {
        setIsSuccess(res.success);
        setMessage(res.message || (res.success ? "Email verified successfully!" : "Verification failed."));
      })
      .catch((err) => {
        setIsSuccess(false);
        setMessage(err.message || "Failed to verify email.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px] text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Email Verification</h1>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Verifying your email address...</p>
        ) : isSuccess ? (
          <div className="space-y-4">
            <div className="rounded-md bg-emerald-500/15 p-4 text-sm text-emerald-600 font-medium border border-emerald-500/20">
              {message}
            </div>
            <Button asChild className="w-full">
              <Link to="/auth/login">Proceed to Login</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive font-medium border border-destructive/20">
              {message}
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/login">Back to Login</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
