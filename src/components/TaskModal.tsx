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

  // Close on Escape key
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
          onSave({ ...task, ...form, updated_at: new Date().toISOString() }, false);
        } else {
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
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? "Edit task" : "Create task"}
    >
      <div className="modal-card">
        {/* Drag handle (mobile bottom-sheet indicator) */}
        <div className="modal-handle" aria-hidden="true" />

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Edit task" : "Create a new task"}
          </h2>
          <button
            id="modal-close"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="modal-title" className="modal-label">
              Title *
            </label>
            <input
              id="modal-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
              autoFocus
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="modal-description" className="modal-label">
              Description
            </label>
            <textarea
              id="modal-description"
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              placeholder="Add details (optional)"
              rows={3}
              className="form-input"
            />
          </div>

          {/* Status + Priority side by side */}
          <div className="modal-row">
            <div className="form-group">
              <label htmlFor="modal-status" className="modal-label">
                Status
              </label>
              <select
                id="modal-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="modal-priority" className="modal-label">
                Priority
              </label>
              <select
                id="modal-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className="form-group">
            <label htmlFor="modal-due-date" className="modal-label">
              Due date
            </label>
            <input
              id="modal-due-date"
              name="due_date"
              type="date"
              value={form.due_date ?? ""}
              onChange={handleChange}
              className="form-input"
              style={{ colorScheme: "dark" }}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button
              id="modal-save"
              type="submit"
              disabled={isPending}
              className="btn-save"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="spin" />
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
