import Link from "next/link";
import { CheckCircle, Zap, Shield, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Zap size={20} />,
    title: "Lightning Fast",
    desc: "Built on Next.js App Router for instant server-side rendering.",
  },
  {
    icon: <Shield size={20} />,
    title: "Secure by Default",
    desc: "Row-level security ensures data isolation per user.",
  },
  {
    icon: <CheckCircle size={20} />,
    title: "Full CRUD",
    desc: "Create, update, delete, and filter tasks with priorities.",
  },
];

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background:
            "radial-gradient(ellipse, rgba(92,124,250,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="animate-fade-in"
        style={{ maxWidth: "700px", width: "100%", textAlign: "center", zIndex: 1 }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "100px",
            background: "rgba(92,124,250,0.12)",
            border: "1px solid rgba(92,124,250,0.3)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--brand-400)",
            marginBottom: "2rem",
            letterSpacing: "0.05em",
          }}
        >
          <Zap size={12} fill="currentColor" />
          PRODUCTION READY SaaS
        </div>

        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
          }}
        >
          Manage tasks with{" "}
          <span className="gradient-text">precision and speed</span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            maxWidth: "500px",
            margin: "0 auto 2.5rem",
          }}
        >
          TaskFlow is a full-stack SaaS built with Next.js, Supabase Auth, and
          Row-Level Security — fully deployed on Vercel.
        </p>

        {/* CTAs */}
        <div
          style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            href="/signup"
            id="cta-signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
              color: "#fff",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 24px rgba(92, 124, 250, 0.35)",
            }}
          >
            Get started free <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            id="cta-login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              borderRadius: "12px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Feature cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "16px",
            marginTop: "5rem",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="glass animate-fade-in"
              style={{
                padding: "24px",
                borderRadius: "16px",
                textAlign: "left",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "rgba(92,124,250,0.15)",
                  color: "var(--brand-400)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: "6px", fontSize: "14px" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
