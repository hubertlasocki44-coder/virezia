"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { signIn } from "@/lib/actions/auth";
import FormInput from "@/components/forms/FormInput";

function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError("");
    const result = await signIn({ ...data, redirectTo });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-[36px] font-light">Sign In</h1>
      <p className="mt-2 font-sans text-sm text-text-secondary">
        Access your VIREZIA account.
      </p>

      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/5 px-4 py-3">
          <p className="font-sans text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="Your password"
          {...register("password")}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center font-sans text-sm text-text-muted">
        No account?{" "}
        <Link
          href="/signup"
          className="text-accent-gold transition-colors hover:text-accent-gold-light"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
