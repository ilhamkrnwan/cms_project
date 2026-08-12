import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authApi } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authApi.signIn({
        email: data.email,
        password: data.password,
      });

      if (res.success) {
        toast.add({
          title: "Sign in successful",
          description: "Welcome back to Wontent Content Hub!",
        });
        if (res.data?.user) {
          setUser(res.data.user);
        }
        navigate({ to: "/dashboard" });
      } else {
        setErrorMessage(res.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              <FieldLabel htmlFor="login-email">Email Address</FieldLabel>
              <Input
                {...field}
                id="login-email"
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
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <a
                  href="/auth/forgot-password"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="remember"
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id="login-remember"
                name={field.name}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
              />
              <FieldContent>
                <FieldLabel htmlFor="login-remember" className="font-normal">
                  Remember me for 30 days
                </FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}
