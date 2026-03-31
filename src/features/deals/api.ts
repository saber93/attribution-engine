import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  SYSTEM_LABEL,
  type DealActivityItem,
  type DealDetailItem,
  type DealListItem,
  type DealPlatform,
  UNASSIGNED_LABEL,
} from "./types";

type DealRow = Database["public"]["Tables"]["deals"]["Row"];
type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];
type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];

type DealListRow = Pick<
  DealRow,
  | "id"
  | "title"
  | "amount"
  | "currency"
  | "stage"
  | "probability"
  | "platform"
  | "expected_close_date"
  | "created_at"
> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
  primaryContact: Pick<ContactRow, "id" | "full_name"> | null;
  campaign: Pick<CampaignRow, "id" | "name"> | null;
};

type DealDetailRow = Pick<
  DealRow,
  | "id"
  | "title"
  | "amount"
  | "currency"
  | "stage"
  | "probability"
  | "platform"
  | "source"
  | "expected_close_date"
  | "created_at"
  | "stage_changed_at"
  | "closed_at"
  | "won_at"
  | "lost_at"
  | "lost_reason"
  | "ad_group_id"
  | "ad_id"
  | "landing_page_url"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_content"
  | "utm_term"
  | "gclid"
  | "fbclid"
  | "external_click_id"
> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
  primaryContact: Pick<ContactRow, "id" | "full_name"> | null;
  sourceLead: Pick<LeadRow, "id" | "full_name"> | null;
  campaign: Pick<CampaignRow, "id" | "name"> | null;
};

function resolvePlatform(platform: DealRow["platform"]): DealPlatform {
  return platform ?? "other";
}

function resolveClickId(deal: Pick<DealRow, "gclid" | "fbclid" | "external_click_id">): string | null {
  if (deal.gclid) return deal.gclid;
  if (deal.fbclid) return deal.fbclid;
  if (deal.external_click_id) return deal.external_click_id;
  return null;
}

function isOpenTask(task: Pick<TaskRow, "status">) {
  return task.status !== "completed" && task.status !== "canceled";
}

function isOverdueTask(task: Pick<TaskRow, "status" | "due_at">) {
  return Boolean(task.due_at) && isOpenTask(task) && new Date(task.due_at!).getTime() < Date.now();
}

export async function getDeals(): Promise<DealListItem[]> {
  const { data, error } = await supabase
    .from("deals")
    .select(`
      id,
      title,
      amount,
      currency,
      stage,
      probability,
      platform,
      expected_close_date,
      created_at,
      company:companies!deals_company_id_fkey (
        id,
        name
      ),
      primaryContact:contacts!deals_primary_contact_id_fkey (
        id,
        full_name
      ),
      campaign:campaigns!deals_campaign_id_fkey (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const dealRows = (data ?? []) as DealListRow[];
  const dealIds = dealRows.map((deal) => deal.id);

  const tasks =
    dealIds.length === 0
      ? ([] as Pick<TaskRow, "deal_id" | "status" | "due_at">[])
      : await supabase
          .from("tasks")
          .select("deal_id, status, due_at")
          .in("deal_id", dealIds)
          .then(({ data: taskData, error: taskError }) => {
            if (taskError) throw taskError;
            return (taskData ?? []) as Pick<TaskRow, "deal_id" | "status" | "due_at">[];
          });

  const overdueDealIds = new Set(
    tasks
      .filter((task): task is Pick<TaskRow, "deal_id" | "status" | "due_at"> & { deal_id: string } => Boolean(task.deal_id))
      .filter(isOverdueTask)
      .map((task) => task.deal_id),
  );

  return dealRows.map((deal) => ({
    id: deal.id,
    title: deal.title,
    amount: deal.amount,
    currency: deal.currency,
    stage: deal.stage,
    probability: deal.probability,
    platform: resolvePlatform(deal.platform),
    companyName: deal.company?.name ?? "—",
    primaryContactName: deal.primaryContact?.full_name ?? null,
    campaignName: deal.campaign?.name ?? null,
    ownerLabel: UNASSIGNED_LABEL,
    expectedCloseDate: deal.expected_close_date,
    createdAt: deal.created_at,
    hasOverdueTask: overdueDealIds.has(deal.id),
  }));
}

export async function getDealById(dealId: string): Promise<DealDetailItem | null> {
  const { data, error } = await supabase
    .from("deals")
    .select(`
      id,
      title,
      amount,
      currency,
      stage,
      probability,
      platform,
      source,
      expected_close_date,
      created_at,
      stage_changed_at,
      closed_at,
      won_at,
      lost_at,
      lost_reason,
      ad_group_id,
      ad_id,
      landing_page_url,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      gclid,
      fbclid,
      external_click_id,
      company:companies!deals_company_id_fkey (
        id,
        name
      ),
      primaryContact:contacts!deals_primary_contact_id_fkey (
        id,
        full_name
      ),
      sourceLead:leads!deals_source_lead_id_fkey (
        id,
        full_name
      ),
      campaign:campaigns!deals_campaign_id_fkey (
        id,
        name
      )
    `)
    .eq("id", dealId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const deal = data as DealDetailRow;

  return {
    id: deal.id,
    title: deal.title,
    amount: deal.amount,
    currency: deal.currency,
    stage: deal.stage,
    probability: deal.probability,
    platform: resolvePlatform(deal.platform),
    source: deal.source,
    companyName: deal.company?.name ?? "—",
    primaryContactName: deal.primaryContact?.full_name ?? null,
    sourceLeadName: deal.sourceLead?.full_name ?? null,
    campaignName: deal.campaign?.name ?? null,
    ownerLabel: UNASSIGNED_LABEL,
    expectedCloseDate: deal.expected_close_date,
    createdAt: deal.created_at,
    stageChangedAt: deal.stage_changed_at,
    closedAt: deal.closed_at,
    wonAt: deal.won_at,
    lostAt: deal.lost_at,
    lostReason: deal.lost_reason,
    adGroupId: deal.ad_group_id,
    adId: deal.ad_id,
    landingPageUrl: deal.landing_page_url,
    utmSource: deal.utm_source,
    utmMedium: deal.utm_medium,
    utmCampaign: deal.utm_campaign,
    utmContent: deal.utm_content,
    utmTerm: deal.utm_term,
    clickId: resolveClickId(deal),
  };
}

export async function getDealActivities(dealId: string): Promise<DealActivityItem[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("id, type, title, description, occurred_at, duration_minutes, actor_user_id")
    .eq("deal_id", dealId)
    .order("occurred_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((activity: ActivityRow) => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    actorLabel: activity.type === "system" && !activity.actor_user_id ? SYSTEM_LABEL : UNASSIGNED_LABEL,
    occurredAt: activity.occurred_at,
    durationMinutes: activity.duration_minutes,
  }));
}
