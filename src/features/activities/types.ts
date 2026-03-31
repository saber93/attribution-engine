import type { Database } from "@/integrations/supabase/types";

export type ActivityType = Database["public"]["Enums"]["activity_type"];
export type ActivityRelatedType = "lead" | "deal";

export interface ActivityListItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  occurredAt: string;
  durationMinutes: number | null;
  actorLabel: string;
  relatedType: ActivityRelatedType;
  relatedLabel: string;
  relatedHref: string | null;
}

export const SYSTEM_LABEL = "System";
export const UNASSIGNED_LABEL = "Unassigned";
