import { DEAL_STAGE_ORDER, type DealStage } from "@/features/deals/types";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type {
  LeadPlatform,
  OverviewAttentionTaskItem,
  OverviewPageData,
  OverviewPipelineStageItem,
  OverviewPlatformBreakdownItem,
  OverviewRecentLeadItem,
  OverviewSourceBreakdownItem,
} from "./types";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];
type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];

type LeadSummaryRow = Pick<LeadRow, "status" | "qualified_at" | "platform" | "source">;
type DealSummaryRow = Pick<DealRow, "stage" | "amount">;
type RecentLeadRow = Pick<LeadRow, "id" | "full_name" | "status" | "platform" | "created_at"> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
  campaign: Pick<CampaignRow, "id" | "name"> | null;
};
type AttentionTaskRow = Pick<TaskRow, "id" | "title" | "priority" | "due_at"> & {
  lead: Pick<LeadRow, "id" | "full_name"> | null;
  deal: Pick<DealRow, "id" | "title"> | null;
};

function resolvePlatform(platform: LeadRow["platform"]): LeadPlatform {
  return platform ?? "other";
}

function humanizeSource(source: string) {
  return source
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sortBreakdownByCount<T extends { count: number }>(left: T, right: T) {
  return right.count - left.count;
}

function isQualifiedLead(lead: LeadSummaryRow) {
  return Boolean(lead.qualified_at) || (!lead.qualified_at && (lead.status === "qualified" || lead.status === "converted"));
}

function buildPlatformBreakdown(leads: LeadSummaryRow[]): OverviewPlatformBreakdownItem[] {
  if (leads.length === 0) return [];

  const counts = new Map<LeadPlatform, number>();

  leads.forEach((lead) => {
    const platform = resolvePlatform(lead.platform);
    counts.set(platform, (counts.get(platform) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([platform, count]) => ({
      platform,
      count,
      share: count / leads.length,
    }))
    .sort((left, right) => sortBreakdownByCount(left, right) || left.platform.localeCompare(right.platform));
}

function buildSourceBreakdown(leads: LeadSummaryRow[]): OverviewSourceBreakdownItem[] {
  if (leads.length === 0) return [];

  const counts = new Map<string, number>();

  leads.forEach((lead) => {
    const source = lead.source?.trim() || "unknown";
    counts.set(source, (counts.get(source) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([source, count]) => ({
      source,
      label: humanizeSource(source),
      count,
      share: count / leads.length,
    }))
    .sort((left, right) => sortBreakdownByCount(left, right) || left.label.localeCompare(right.label));
}

function buildPipelineByStage(deals: DealSummaryRow[]): OverviewPipelineStageItem[] {
  const totals = new Map<DealStage, OverviewPipelineStageItem>(
    DEAL_STAGE_ORDER.map((stage) => [stage, { stage, count: 0, amount: 0 }]),
  );

  deals.forEach((deal) => {
    const stage = totals.get(deal.stage);
    if (!stage) return;

    stage.count += 1;
    stage.amount += deal.amount;
  });

  return DEAL_STAGE_ORDER.map((stage) => totals.get(stage)!);
}

function sortAttentionTasks(left: AttentionTaskRow, right: AttentionTaskRow) {
  const leftDueAt = new Date(left.due_at!).getTime();
  const rightDueAt = new Date(right.due_at!).getTime();

  if (leftDueAt !== rightDueAt) {
    return leftDueAt - rightDueAt;
  }

  const priorityRank: Record<TaskRow["priority"], number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return priorityRank[left.priority] - priorityRank[right.priority];
}

export async function getOverview(): Promise<OverviewPageData> {
  const now = new Date().toISOString();

  const [leadSummaryResult, recentLeadsResult, dealSummaryResult, overdueTaskCountResult, overdueTaskListResult] =
    await Promise.all([
      supabase
        .from("leads")
        .select("status, qualified_at, platform, source")
        .order("created_at", { ascending: false }),
      supabase
        .from("leads")
        .select(`
          id,
          full_name,
          status,
          platform,
          created_at,
          company:companies!leads_company_id_fkey (
            id,
            name
          ),
          campaign:campaigns!leads_campaign_id_fkey (
            id,
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("deals")
        .select("stage, amount"),
      supabase
        .from("tasks")
        .select("id", { count: "exact", head: true })
        .not("due_at", "is", null)
        .lt("due_at", now)
        .neq("status", "completed")
        .neq("status", "canceled"),
      supabase
        .from("tasks")
        .select(`
          id,
          title,
          priority,
          due_at,
          lead:leads!tasks_lead_id_fkey (
            id,
            full_name
          ),
          deal:deals!tasks_deal_id_fkey (
            id,
            title
          )
        `)
        .not("due_at", "is", null)
        .lt("due_at", now)
        .neq("status", "completed")
        .neq("status", "canceled")
        .order("due_at", { ascending: true })
        .limit(5),
    ]);

  if (leadSummaryResult.error) throw leadSummaryResult.error;
  if (recentLeadsResult.error) throw recentLeadsResult.error;
  if (dealSummaryResult.error) throw dealSummaryResult.error;
  if (overdueTaskCountResult.error) throw overdueTaskCountResult.error;
  if (overdueTaskListResult.error) throw overdueTaskListResult.error;

  const leadSummaryRows = (leadSummaryResult.data ?? []) as LeadSummaryRow[];
  const recentLeadRows = (recentLeadsResult.data ?? []) as RecentLeadRow[];
  const dealSummaryRows = (dealSummaryResult.data ?? []) as DealSummaryRow[];
  const overdueTaskRows = ((overdueTaskListResult.data ?? []) as AttentionTaskRow[]).sort(sortAttentionTasks);

  const totalLeads = leadSummaryRows.length;
  const qualifiedLeads = leadSummaryRows.filter(isQualifiedLead).length;
  const wonDeals = dealSummaryRows.filter((deal) => deal.stage === "won").length;
  const wonRevenue = dealSummaryRows
    .filter((deal) => deal.stage === "won")
    .reduce((total, deal) => total + deal.amount, 0);
  const openPipeline = dealSummaryRows
    .filter((deal) => deal.stage !== "won" && deal.stage !== "lost")
    .reduce((total, deal) => total + deal.amount, 0);

  return {
    kpis: {
      totalLeads,
      qualifiedLeads,
      wonDeals,
      wonRevenue,
      openPipeline,
      tasksRequiringAttention: overdueTaskCountResult.count ?? 0,
    },
    recentLeads: recentLeadRows.map<OverviewRecentLeadItem>((lead) => ({
      id: lead.id,
      name: lead.full_name,
      companyName: lead.company?.name ?? null,
      campaignName: lead.campaign?.name ?? null,
      platform: resolvePlatform(lead.platform),
      status: lead.status,
      createdAt: lead.created_at,
    })),
    attentionTasks: overdueTaskRows.map<OverviewAttentionTaskItem>((task) => ({
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueAt: task.due_at!,
      relatedLabel: task.lead?.full_name ?? task.deal?.title ?? "Unlinked task",
    })),
    pipelineByStage: buildPipelineByStage(dealSummaryRows),
    platformBreakdown: buildPlatformBreakdown(leadSummaryRows),
    sourceBreakdown: buildSourceBreakdown(leadSummaryRows),
  };
}
