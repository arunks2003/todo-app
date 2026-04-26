"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Calendar, ChevronDown } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "@/types";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; bg: string }
> = {
  high: { label: "High", color: "var(--danger)", bg: "var(--danger-bg)" },
  medium: { label: "Medium", color: "var(--warning)", bg: "var(--warning-bg)" },
  low: { label: "Low", color: "var(--success)", bg: "var(--success-bg)" },
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority];

  const formattedDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const isOverdue =
    task.due_date &&
    task.status !== "done" &&
    new Date(task.due_date) < new Date();

  return (
    <div
      className="animate-fade-in"
      style={{
        padding: "14px",
        borderRadius: "12px",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        transition: "border-color 0.2s, transform 0.15s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--border-default)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--border-subtle)";
      }}
    >
      {/* Priority + Menu row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: "6px",
            color: priority.color,
            background: priority.bg,
            letterSpacing: "0.04em",
          }}
        >
          {priority.label.toUpperCase()}
        </span>

        {/* 3-dot menu */}
        <div style={{ position: "relative" }}>
          <button
            id={`task-menu-${task.id}`}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 4px)",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-default)",
                borderRadius: "10px",
                padding: "4px",
                zIndex: 20,
                minWidth: "140px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <button
                id={`edit-task-${task.id}`}
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(task);
                }}
                style={menuItemStyle}
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                id={`delete-task-${task.id}`}
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task.id);
                }}
                style={{ ...menuItemStyle, color: "var(--danger)" }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "6px",
          lineHeight: 1.4,
          textDecoration: task.status === "done" ? "line-through" : "none",
          color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)",
        }}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            marginBottom: "12px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {task.description}
        </p>
      )}

      {/* Footer: date + status quick-change */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "10px",
          gap: "8px",
        }}
      >
        {formattedDate ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              color: isOverdue ? "var(--danger)" : "var(--text-muted)",
            }}
          >
            <Calendar size={11} />
            {formattedDate}
            {isOverdue && " · Overdue"}
          </div>
        ) : (
          <span />
        )}

        {/* Status picker */}
        <div style={{ position: "relative" }}>
          <button
            id={`status-picker-${task.id}`}
            onClick={() => setStatusOpen(!statusOpen)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              borderRadius: "6px",
              background: "var(--bg-base)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Move <ChevronDown size={10} />
          </button>

          {statusOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: "calc(100% + 4px)",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-default)",
                borderRadius: "10px",
                padding: "4px",
                zIndex: 20,
                minWidth: "130px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {STATUS_OPTIONS.filter((s) => s.value !== task.status).map((s) => (
                <button
                  key={s.value}
                  id={`move-${task.id}-${s.value}`}
                  onClick={() => {
                    setStatusOpen(false);
                    onStatusChange(task.id, s.value);
                  }}
                  style={menuItemStyle}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  padding: "8px 10px",
  borderRadius: "7px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--text-primary)",
  fontSize: "13px",
  fontWeight: 500,
  textAlign: "left",
  transition: "background 0.15s",
};
