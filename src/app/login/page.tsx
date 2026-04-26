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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
      }}
    >
      {/* Subtle background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at 60% 20%, rgba(92,124,250,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="glass animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "20px",
          padding: "2.5rem",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "18px" }}>TaskFlow</span>
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "6px" }}>
          Welcome back
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "2rem" }}>
          Sign in to your workspace
        </p>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "var(--danger-bg)",
              border: "1px solid rgba(240,68,56,0.3)",
              color: "var(--danger)",
              fontSize: "14px",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={isPending}
            style={primaryButtonStyle}
          >
            {isPending ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "14px", color: "var(--text-secondary)" }}>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            style={{ color: "var(--brand-400)", fontWeight: 600, textDecoration: "none" }}
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  background: "var(--bg-overlay)",
  border: "1px solid var(--border-default)",
  color: "var(--text-primary)",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

const primaryButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
  color: "#fff",
  fontWeight: 600,
  fontSize: "15px",
  border: "none",
  cursor: "pointer",
  marginTop: "4px",
  transition: "opacity 0.2s",
};
