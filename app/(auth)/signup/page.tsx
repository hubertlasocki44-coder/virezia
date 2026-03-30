"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { signUp } from "@/lib/actions/auth";
import FormInput from "@/components/forms/FormInput";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    setError("");
    const result = await signUp({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
    });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(result.success);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <h1 className="font-serif text-[36px] font-light">Check Your Email</h1>
        <p className="mt-4 font-sans text-sm text-text-secondary">
          {success}
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block font-sans text-sm text-accent-gold transition-colors hover:text-accent-gold-light"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-[36px] font-light">Create Account</h1>
      <p className="mt-2 font-sans text-sm text-text-secondary">
        Join VIREZIA. Applications reviewed individually.
      </p>

      {error && (
        <div className="mt-6 border border-red-500/30 bg-red-500/5 px-4 py-3">
          <p className="font-sans text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormInput
          label="Full Name"
          placeholder="Your full name"
          {...register("full_name")}
          error={errors.full_name?.message}
        />
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
          placeholder="Minimum 8 characters"
          {...register("password")}
          error={errors.password?.message}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          {...register("confirm_password")}
          error={errors.confirm_password?.message}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-gold px-8 py-3 font-sans text-[13px] uppercase tracking-[0.1em] text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center font-sans text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-accent-gold transition-colors hover:text-accent-gold-light"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
