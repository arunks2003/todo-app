import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow — Smart Task Management",
  description:
    "A production-ready task manager SaaS built with Next.js and Supabase. Manage your work with ease.",
  keywords: ["task manager", "productivity", "saas", "project management"],
  authors: [{ name: "TaskFlow" }],
  openGraph: {
    title: "TaskFlow — Smart Task Management",
    description: "Manage your tasks with clarity and focus.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
