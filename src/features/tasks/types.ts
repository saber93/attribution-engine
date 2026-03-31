import type { Database } from "@/integrations/supabase/types";

export type TaskPriority = Database["public"]["Enums"]["task_priority"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];
export type TaskType = Database["public"]["Enums"]["task_type"];
export type TaskRelatedType = "lead" | "deal";
export type TaskBucket = "overdue" | "due_today" | "upcoming" | "completed" | "canceled";

export const TASK_BUCKET_ORDER: TaskBucket[] = ["overdue", "due_today", "upcoming", "completed", "canceled"];

export const TASK_BUCKET_LABELS: Record<TaskBucket, string> = {
  overdue: "Overdue",
  due_today: "Due Today",
  upcoming: "Upcoming",
  completed: "Completed",
  canceled: "Canceled",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  canceled: "Canceled",
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  call: "Call",
  follow_up: "Follow-up",
  meeting: "Meeting",
  email: "Email",
  whatsapp: "WhatsApp",
  review: "Review",
  other: "Other",
};

export interface TaskListItem {
  id: string;
  title: string;
  description: string | null;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
  assigneeLabel: string;
  relatedType: TaskRelatedType;
  relatedLabel: string;
  relatedHref: string | null;
  bucket: TaskBucket;
  isOverdue: boolean;
}

export const UNASSIGNED_LABEL = "Unassigned";
