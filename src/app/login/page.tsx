"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "@/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    startTransition(async () => {
      const result = await signIn(new FormData(form));
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" aria-hidden="true" />

      <div className="auth-card glass animate-fade-in">
        {/* Logo */}
        <Link href="/" className="auth-logo">
          <div className="logo-icon">
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span className="logo-text">TaskFlow</span>
        </Link>

        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to your workspace</p>

        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <div className="input-icon-wrap">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
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
            id="login-submit"
            type="submit"
            disabled={isPending}
            className="btn-primary btn-full"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="auth-link">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
