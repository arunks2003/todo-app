"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Zap, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import { signOut } from "@/actions/auth";
import type { User } from "@supabase/supabase-js";

interface Props {
  user: User;
}

export default function DashboardNav({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,11,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "16px" }}>TaskFlow</span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
              background: "transparent",
              transition: "all 0.2s",
            }}
          >
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        </nav>

        {/* User section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Avatar */}
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--brand-600), var(--brand-800))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {initials}
          </div>

          <button
            id="signout-btn"
            onClick={handleSignOut}
            disabled={isPending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              background: "transparent",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {isPending ? (
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <LogOut size={14} />
            )}
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
