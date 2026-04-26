"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp } from "@/actions/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    startTransition(async () => {
      const result = await signUp(new FormData(form));
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-bg auth-bg--bottom" aria-hidden="true" />

      <div className="auth-card glass animate-fade-in">
        {/* Logo */}
        <Link href="/" className="auth-logo">
          <div className="logo-icon">
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span className="logo-text">TaskFlow</span>
        </Link>

        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Free forever. No credit card required.</p>

        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-fullname" className="form-label">
              Full name
            </label>
            <input
              id="signup-fullname"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">
              Email address
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">
              Password
            </label>
            <div className="input-icon-wrap">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="input-icon-btn"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={isPending}
            className="btn-primary btn-full"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
