import { getTasks } from "@/actions/tasks";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import TaskBoard from "@/components/TaskBoard";
import DashboardStats from "@/components/DashboardStats";

export const metadata: Metadata = {
  title: "Dashboard — TaskFlow",
  description: "Manage your tasks from your personal dashboard.",
};

export default async function DashboardPage() {
  // Sequential: get user first (cheap — reads session cookie),
  // then fetch tasks. Avoids the Promise.all anti-pattern where
  // an unawaited createClient() result was destructured alongside
  // getTasks(), causing type inference to believe tasks could be null.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // getTasks() returns Task[] | null from Supabase; use ?? [] to guarantee
  // that downstream components always receive a proper array.
  const tasks = (await getTasks()) ?? [];

  const name =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-heading">
          Good morning, {name} 👋
        </h1>
        <p className="dashboard-sub">
          {tasks.length === 0
            ? "You have no tasks yet. Create your first one below."
            : `You have ${tasks.filter((t) => t.status !== "done").length} active task${tasks.filter((t) => t.status !== "done").length !== 1 ? "s" : ""}.`}
        </p>
      </div>

      {/* Stats */}
      <DashboardStats tasks={tasks} />

      {/* Task board */}
      <TaskBoard initialTasks={tasks} />
    </div>
  );
}
