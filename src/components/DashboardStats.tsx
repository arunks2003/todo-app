import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";
import type { Task } from "@/types";

interface Props {
  tasks: Task[];
}

export default function DashboardStats({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const stats = [
    {
      id: "stat-total",
      label: "Total Tasks",
      value: total,
      icon: <ListTodo size={18} />,
      color: "var(--brand-400)",
      bg: "rgba(92,124,250,0.1)",
    },
    {
      id: "stat-todo",
      label: "To Do",
      value: todo,
      icon: <Clock size={18} />,
      color: "var(--warning)",
      bg: "var(--warning-bg)",
    },
    {
      id: "stat-inprogress",
      label: "In Progress",
      value: inProgress,
      icon: <TrendingUp size={18} />,
      color: "var(--info)",
      bg: "var(--info-bg)",
    },
    {
      id: "stat-done",
      label: "Completed",
      value: done,
      icon: <CheckCircle2 size={18} />,
      color: "var(--success)",
      bg: "var(--success-bg)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={stat.id}
          id={stat.id}
          className="glass animate-fade-in"
          style={{
            padding: "20px",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            animationDelay: `${i * 0.07}s`,
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: stat.bg,
              color: stat.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stat.icon}
          </div>
          <div>
            <div
              style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.1 }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {stat.label}
            </div>
          </div>

          {/* Progress bar for completion rate on last card */}
          {stat.label === "Completed" && total > 0 && (
            <div>
              <div
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  background: "var(--bg-overlay)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${completionRate}%`,
                    background: "var(--success)",
                    borderRadius: "2px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                {completionRate}% completion rate
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
