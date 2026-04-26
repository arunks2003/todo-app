"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Filter } from "lucide-react";
import type { Task, TaskStatus, TaskPriority } from "@/types";
// import TaskCard from "@/components/TaskCard";
// import TaskModal from "@/components/TaskModal";
import { deleteTask, updateTask } from "@/actions/tasks";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

interface Props {
  initialTasks: Task[];
}

const STATUS_COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: "todo", label: "To Do", color: "var(--warning)" },
  { key: "in_progress", label: "In Progress", color: "var(--info)" },
  { key: "done", label: "Done", color: "var(--success)" },
];

export default function TaskBoard({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [, startTransition] = useTransition();

  // Optimistically update tasks when created/updated
  function handleTaskSaved(task: Task, isNew: boolean) {
    setTasks((prev) =>
      isNew ? [task, ...prev] : prev.map((t) => (t.id === task.id ? task : t))
    );
    setShowModal(false);
    setEditingTask(null);
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setShowModal(true);
  }

  function handleDelete(id: string) {
    // Always remove from local state immediately (optimistic)
    setTasks((prev) => prev.filter((t) => t.id !== id));
    // Skip the server call if this is a temp ID — it was never persisted
    if (id.startsWith("temp-")) return;
    startTransition(async () => {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    });
  }

  function handleStatusChange(id: string, status: TaskStatus) {
    // Always update local state immediately (optimistic)
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    // Skip the server call if this is a temp ID — it was never persisted
    if (id.startsWith("temp-")) return;
    startTransition(async () => {
      try {
        await updateTask(id, { status });
      } catch (err) {
        console.error("Status update failed:", err);
      }
    });
  }

  const filtered = tasks.filter((t) => {
    const matchesSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesPriority =
      filterPriority === "all" || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            id="task-search"
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 36px",
              borderRadius: "10px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Priority filter */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Filter
            size={14}
            style={{
              position: "absolute",
              left: "12px",
              color: "var(--text-muted)",
            }}
          />
          <select
            id="priority-filter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as TaskPriority | "all")}
            style={{
              padding: "10px 32px 10px 32px",
              borderRadius: "10px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* New task button */}
        <button
          id="new-task-btn"
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 18px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))",
            color: "#fff",
            fontWeight: 600,
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 14px rgba(92,124,250,0.3)",
          }}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Kanban columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {STATUS_COLUMNS.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              id={`column-${col.key}`}
              style={{
                borderRadius: "16px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                overflow: "hidden",
              }}
            >
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: col.color,
                    }}
                  />
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>
                    {col.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "100px",
                    background: "var(--bg-overlay)",
                    color: "var(--text-muted)",
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div
                style={{
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  minHeight: "100px",
                }}
              >
                {colTasks.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "var(--text-muted)",
                      fontSize: "13px",
                    }}
                  >
                    No tasks here
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={handleTaskSaved}
        />
      )}
    </div>
  );
}
