"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Zap, LogOut, LayoutDashboard, Loader2, Menu, X } from "lucide-react";
import { signOut } from "@/actions/auth";
import type { User } from "@supabase/supabase-js";

interface Props {
  user: User;
}

export default function DashboardNav({ user }: Props) {
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const name =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <header className="nav-header">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/dashboard" className="nav-logo">
          <div className="logo-icon logo-icon--sm">
            <Zap size={15} color="#fff" fill="#fff" />
          </div>
          <span className="logo-text">TaskFlow</span>
        </Link>

        {/* Desktop nav (hidden on mobile) */}
        <nav className="nav-links">
          <Link href="/dashboard" className="nav-link">
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
        </nav>

        {/* Desktop user section */}
        <div className="nav-user">
          <div className="nav-avatar" title={name}>
            {initials}
          </div>
          <button
            id="signout-btn"
            onClick={handleSignOut}
            disabled={isPending}
            className="btn-ghost btn-sm"
          >
            {isPending ? (
              <Loader2 size={14} className="spin" />
            ) : (
              <LogOut size={14} />
            )}
            <span className="nav-signout-label">Sign out</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="nav-drawer">
          <div className="nav-drawer-user">
            <div className="nav-avatar nav-avatar--lg">{initials}</div>
            <div>
              <div className="nav-drawer-name">{name}</div>
              <div className="nav-drawer-email">{user.email}</div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="nav-drawer-link"
            onClick={() => setMobileOpen(false)}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>

          <button
            onClick={() => {
              setMobileOpen(false);
              handleSignOut();
            }}
            disabled={isPending}
            className="nav-drawer-signout"
          >
            {isPending ? <Loader2 size={16} className="spin" /> : <LogOut size={16} />}
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
