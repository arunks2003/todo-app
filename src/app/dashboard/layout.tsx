import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-base)",
      }}
    >
      <DashboardNav user={user} />
      <main
        style={{
          flex: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "2rem 1.5rem",
        }}
      >
        {children}
      </main>
    </div>
  );
}
