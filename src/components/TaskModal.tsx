"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import type { Task, TaskInsert } from "@/types";
import { createTask, updateTask } from "@/actions/tasks";

interface Props {
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Task, isNew: boolean) => void;
}

const defaultForm: TaskInsert = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  due_date: null,
};

export default function TaskModal({ task, onClose, onSave }: Props) {
  const [form, setForm] = useState<TaskInsert>(
    task
      ? {
          title: task.title,
          description: task.description ?? "",
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
        }
      : defaultForm
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const overlayRef = useRef<HTMLDivElement>(null);

  const isEditing = !!task;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    // Only fields that are genuinely nullable in the DB schema should become
    // null when cleared. Setting null on a required string field (e.g. title)
    // causes React to see value={null} → "controlled input → uncontrolled" warning.
    const nullableFields = ["description", "due_date"];
    const coerced = nullableFields.includes(name) && value === "" ? null : value;
    setForm((prev) => ({ ...prev, [name]: coerced }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing && task) {
          await updateTask(task.id, form);
          onSave(
            {
              ...task,
              ...form,
              updated_at: new Date().toISOString(),
            },
            false
          );
        } else {
          // createTask() now returns the real DB row with a proper UUID —
          // no more temp IDs that would crash Supabase UUID validation.
          const newTask = await createTask(form);
          onSave(newTask, true);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="glass animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "20px",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            {isEditing ? "Edit task" : "Create a new task"}
          </h2>
          <button
            id="modal-close"
            onClick={onClose}
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
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "var(--danger-bg)",
              border: "1px solid rgba(240,68,56,0.3)",
              color: "var(--danger)",
              fontSize: "13px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              id="modal-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              id="modal-description"
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              placeholder="Add details (optional)"
              rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            />
          </div>

          {/* Row: Status + Priority */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select
                id="modal-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                id="modal-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label style={labelStyle}>Due date</label>
            <input
              id="modal-due-date"
              name="due_date"
              type="date"
              value={form.due_date ?? ""}
              onChange={handleChange}
              style={{ ...inputStyle, colorScheme: "dark" }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: "10px",
                background: "var(--bg-overlay)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              id="modal-save"
              type="submit"
              disabled={isPending}
              style={{
                flex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "11px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : isEditing ? (
                "Save changes"
              ) : (
                "Create task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 500,
  color: "var(--text-secondary)",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "var(--bg-overlay)",
  border: "1px solid var(--border-default)",
  color: "var(--text-primary)",
  fontSize: "14px",
  outline: "none",
};
