"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Task, TaskInsert, TaskUpdate } from "@/types";

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // After the error guard, Supabase guarantees tasks is non-null
  return tasks ?? [];
}

export async function createTask(task: TaskInsert): Promise<Task> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // .select().single() returns the actual persisted row with its real UUID
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...task, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  return data as Task;
}

export async function updateTask(id: string, updates: TaskUpdate) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id); // Extra safety — RLS already handles this

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
