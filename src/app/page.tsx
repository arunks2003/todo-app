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
    <main className="landing-page">
      {/* Background glow */}
      <div className="landing-glow" aria-hidden="true" />

      <div className="landing-content animate-fade-in">
        {/* Badge */}
        <div className="landing-badge">
          <Zap size={11} fill="currentColor" />
          PRODUCTION READY SaaS
        </div>

        <h1 className="landing-title">
          Manage tasks with{" "}
          <span className="gradient-text">precision and speed</span>
        </h1>

        <p className="landing-desc">
          TaskFlow is a full-stack SaaS built with Next.js, Supabase Auth, and
          Row-Level Security — fully deployed on Vercel.
        </p>

        {/* CTAs */}
        <div className="landing-ctas">
          <Link href="/signup" id="cta-signup" className="btn-primary btn-lg">
            Get started free <ArrowRight size={16} />
          </Link>
          <Link href="/login" id="cta-login" className="btn-secondary btn-lg">
            Sign in
          </Link>
        </div>

        {/* Feature cards */}
        <div className="feature-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card glass animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-icon">
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
