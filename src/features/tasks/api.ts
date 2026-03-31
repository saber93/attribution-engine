import { compareAsc, isBefore, isSameDay, parseISO, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  TASK_BUCKET_ORDER,
  type TaskBucket,
  type TaskListItem,
  type TaskPriority,
  UNASSIGNED_LABEL,
} from "./types";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];

type TaskQueryRow = Pick<
  TaskRow,
  | "id"
  | "title"
  | "description"
  | "type"
  | "priority"
  | "status"
  | "due_at"
  | "completed_at"
  | "created_at"
  | "updated_at"
  | "assigned_user_id"
  | "lead_id"
  | "deal_id"
> & {
  lead: Pick<LeadRow, "id" | "full_name"> | null;
  deal: Pick<DealRow, "id" | "title"> | null;
};

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function isOpenStatus(status: TaskRow["status"]) {
  return status === "pending" || status === "in_progress";
}

function getBucket(row: Pick<TaskRow, "status" | "due_at">, now = new Date()): TaskBucket {
  if (row.status === "completed") return "completed";
  if (row.status === "canceled") return "canceled";
  if (!row.due_at) return "upcoming";

  const dueAt = parseISO(row.due_at);
  const todayStart = startOfDay(now);

  if (isBefore(startOfDay(dueAt), todayStart)) return "overdue";
  if (isSameDay(dueAt, now)) return "due_today";
  return "upcoming";
}

function compareNullableDatesAsc(left: string | null, right: string | null) {
  if (left && right) return compareAsc(parseISO(left), parseISO(right));
  if (left) return -1;
  if (right) return 1;
  return 0;
}

function compareNullableDatesDesc(left: string | null, right: string | null) {
  return compareNullableDatesAsc(right, left);
}

function compareTasks(left: TaskQueryRow, right: TaskQueryRow, now = new Date()) {
  const leftBucket = getBucket(left, now);
  const rightBucket = getBucket(right, now);
  const bucketDiff = TASK_BUCKET_ORDER.indexOf(leftBucket) - TASK_BUCKET_ORDER.indexOf(rightBucket);

  if (bucketDiff !== 0) return bucketDiff;

  switch (leftBucket) {
    case "overdue":
    case "due_today": {
      const dueDiff = compareNullableDatesAsc(left.due_at, right.due_at);
      if (dueDiff !== 0) return dueDiff;
      return PRIORITY_WEIGHT[left.priority] - PRIORITY_WEIGHT[right.priority];
    }
    case "upcoming": {
      const dueDiff = compareNullableDatesAsc(left.due_at, right.due_at);
      if (dueDiff !== 0) return dueDiff;
      return PRIORITY_WEIGHT[left.priority] - PRIORITY_WEIGHT[right.priority];
    }
    case "completed": {
      const terminalDiff = compareNullableDatesDesc(left.completed_at, right.completed_at);
      if (terminalDiff !== 0) return terminalDiff;
      return compareNullableDatesDesc(left.updated_at, right.updated_at);
    }
    case "canceled": {
      const updatedDiff = compareNullableDatesDesc(left.updated_at, right.updated_at);
      if (updatedDiff !== 0) return updatedDiff;
      return compareNullableDatesDesc(left.created_at, right.created_at);
    }
  }
}

export async function getTasks(): Promise<TaskListItem[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      type,
      priority,
      status,
      due_at,
      completed_at,
      created_at,
      updated_at,
      assigned_user_id,
      lead_id,
      deal_id,
      lead:leads!tasks_lead_id_fkey (
        id,
        full_name
      ),
      deal:deals!tasks_deal_id_fkey (
        id,
        title
      )
    `)
    .or("lead_id.not.is.null,deal_id.not.is.null")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const now = new Date();
  const rows = ((data ?? []) as TaskQueryRow[]).sort((left, right) => compareTasks(left, right, now));

  return rows.map((row) => {
    const relatedType = row.lead_id ? "lead" : "deal";
    const relatedJoin = row.lead_id ? row.lead : row.deal;
    const relatedLabel = row.lead_id ? row.lead?.full_name ?? "Linked lead" : row.deal?.title ?? "Linked deal";
    const relatedHref = relatedJoin ? `/${relatedType}s/${relatedJoin.id}` : null;
    const bucket = getBucket(row, now);

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      priority: row.priority,
      status: row.status,
      dueAt: row.due_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      assigneeLabel: UNASSIGNED_LABEL,
      relatedType,
      relatedLabel,
      relatedHref,
      bucket,
      isOverdue: bucket === "overdue" && isOpenStatus(row.status),
    };
  });
}
