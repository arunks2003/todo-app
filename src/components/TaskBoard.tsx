"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Filter } from "lucide-react";
import type { Task, TaskStatus, TaskPriority } from "@/types";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { deleteTask, updateTask } from "@/actions/tasks";

interface Props {
  initialTasks: Task[];
}

const STATUS_COLUMNS: { key: TaskStatus; label: string; colorClass: string }[] = [
  { key: "todo", label: "To Do", colorClass: "col-dot--todo" },
  { key: "in_progress", label: "In Progress", colorClass: "col-dot--progress" },
  { key: "done", label: "Done", colorClass: "col-dot--done" },
];

export default function TaskBoard({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [, startTransition] = useTransition();

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
    setTasks((prev) => prev.filter((t) => t.id !== id));
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
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
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
    <div className="board-wrap">
      {/* Toolbar */}
      <div className="board-toolbar">
        {/* Search */}
        <div className="search-wrap">
          <Search size={15} className="search-icon" aria-hidden="true" />
          <input
            id="task-search"
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="toolbar-right">
          {/* Priority filter */}
          <div className="filter-wrap">
            <Filter size={13} className="filter-icon" aria-hidden="true" />
            <select
              id="priority-filter"
              value={filterPriority}
              onChange={(e) =>
                setFilterPriority(e.target.value as TaskPriority | "all")
              }
              className="filter-select"
            >
              <option value="all">All</option>
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
            className="btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="kanban-grid">
        {STATUS_COLUMNS.map((col) => {
          const colTasks = filtered.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              id={`column-${col.key}`}
              className="kanban-col"
            >
              {/* Column header */}
              <div className="kanban-col-header">
                <div className="kanban-col-title">
                  <span className={`col-dot ${col.colorClass}`} />
                  <span>{col.label}</span>
                </div>
                <span className="kanban-col-count">{colTasks.length}</span>
              </div>

              {/* Task list */}
              <div className="kanban-col-body">
                {colTasks.length === 0 ? (
                  <div className="kanban-empty">
                    <span>No tasks here</span>
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
