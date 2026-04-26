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
  { label: string; colorClass: string }
> = {
  high: { label: "HIGH", colorClass: "badge--high" },
  medium: { label: "MED", colorClass: "badge--medium" },
  low: { label: "LOW", colorClass: "badge--low" },
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

  // Close menus on outside click
  function closeMenus() {
    setMenuOpen(false);
    setStatusOpen(false);
  }

  return (
    <div
      className="task-card animate-fade-in"
      onClick={() => {
        if (menuOpen || statusOpen) closeMenus();
      }}
    >
      {/* Top row: priority badge + menu */}
      <div className="task-card-top">
        <span className={`task-badge ${priority.colorClass}`}>
          {priority.label}
        </span>

        <div className="task-menu-wrap">
          <button
            id={`task-menu-${task.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
              setStatusOpen(false);
            }}
            className="task-menu-btn"
            aria-label="Task options"
            aria-expanded={menuOpen}
          >
            <MoreHorizontal size={16} />
          </button>

          {menuOpen && (
            <div className="dropdown" role="menu">
              <button
                id={`edit-task-${task.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="dropdown-item"
                role="menuitem"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                id={`delete-task-${task.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(task.id);
                }}
                className="dropdown-item dropdown-item--danger"
                role="menuitem"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`task-title ${task.status === "done" ? "task-title--done" : ""}`}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {/* Footer */}
      <div className="task-footer">
        {formattedDate ? (
          <div className={`task-date ${isOverdue ? "task-date--overdue" : ""}`}>
            <Calendar size={11} />
            {formattedDate}
            {isOverdue && " · Overdue"}
          </div>
        ) : (
          <span />
        )}

        {/* Status move button */}
        <div className="task-menu-wrap">
          <button
            id={`status-picker-${task.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setStatusOpen((v) => !v);
              setMenuOpen(false);
            }}
            className="task-move-btn"
            aria-label="Move task"
            aria-expanded={statusOpen}
          >
            Move <ChevronDown size={10} />
          </button>

          {statusOpen && (
            <div className="dropdown dropdown--up" role="menu">
              {STATUS_OPTIONS.filter((s) => s.value !== task.status).map((s) => (
                <button
                  key={s.value}
                  id={`move-${task.id}-${s.value}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusOpen(false);
                    onStatusChange(task.id, s.value);
                  }}
                  className="dropdown-item"
                  role="menuitem"
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
