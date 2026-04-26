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
      showProgress: true,
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <div
          key={stat.id}
          id={stat.id}
          className="stat-card glass animate-fade-in"
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          <div className="stat-card-top">
            <div
              className="stat-icon"
              style={{ background: stat.bg, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
          <div className="stat-label">{stat.label}</div>

          {stat.showProgress && total > 0 && (
            <div className="stat-progress">
              <div className="stat-progress-track">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="stat-progress-label">
                {completionRate}% done
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
