import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { SYSTEM_LABEL, type ActivityListItem, UNASSIGNED_LABEL } from "./types";

type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];
type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];

type ActivityQueryRow = Pick<
  ActivityRow,
  "id" | "type" | "title" | "description" | "occurred_at" | "duration_minutes" | "actor_user_id" | "lead_id" | "deal_id"
> & {
  lead: Pick<LeadRow, "id" | "full_name"> | null;
  deal: Pick<DealRow, "id" | "title"> | null;
};

function resolveActorLabel(activity: Pick<ActivityRow, "type" | "actor_user_id">) {
  if (activity.type === "system" && !activity.actor_user_id) {
    return SYSTEM_LABEL;
  }

  return UNASSIGNED_LABEL;
}

export async function getActivities(): Promise<ActivityListItem[]> {
  const { data, error } = await supabase
    .from("activities")
    .select(`
      id,
      type,
      title,
      description,
      occurred_at,
      duration_minutes,
      actor_user_id,
      lead_id,
      deal_id,
      lead:leads!activities_lead_id_fkey (
        id,
        full_name
      ),
      deal:deals!activities_deal_id_fkey (
        id,
        title
      )
    `)
    .or("lead_id.not.is.null,deal_id.not.is.null")
    .order("occurred_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as ActivityQueryRow[]).map((activity) => {
    const relatedType = activity.lead_id ? "lead" : "deal";
    const relatedJoin = activity.lead_id ? activity.lead : activity.deal;
    const relatedLabel = activity.lead_id
      ? activity.lead?.full_name ?? "Linked lead"
      : activity.deal?.title ?? "Linked deal";
    const relatedHref = relatedJoin ? `/${relatedType}s/${relatedJoin.id}` : null;

    return {
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      occurredAt: activity.occurred_at,
      durationMinutes: activity.duration_minutes,
      actorLabel: resolveActorLabel(activity),
      relatedType,
      relatedLabel,
      relatedHref,
    };
  });
}
