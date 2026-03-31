import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  readMetadataTags,
  SYSTEM_LABEL,
  type LeadActivityItem,
  type LeadDetailItem,
  type LeadListItem,
  type LeadPlatform,
  type LeadRelatedDealItem,
  type LeadTaskItem,
  UNASSIGNED_LABEL,
} from "./types";

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];
type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];

function resolvePlatform(platform: LeadRow["platform"]): LeadPlatform {
  return platform ?? "other";
}

function resolveClickId(lead: LeadRow): string | null {
  if (lead.gclid) return lead.gclid;
  if (lead.fbclid) return lead.fbclid;
  if (lead.external_click_id) return lead.external_click_id;
  return null;
}

function compareTasksByDueDate(a: TaskRow, b: TaskRow) {
  if (!a.due_at && !b.due_at) return 0;
  if (!a.due_at) return 1;
  if (!b.due_at) return -1;
  return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
}

function isOpenTask(task: TaskRow) {
  return task.status !== "completed" && task.status !== "canceled";
}

function dedupe<T>(values: Array<T | null | undefined>): T[] {
  return [...new Set(values.filter((value): value is T => value != null))];
}

function toCompanyMap(companies: CompanyRow[]) {
  return new Map(companies.map((company) => [company.id, company]));
}

function toCampaignMap(campaigns: CampaignRow[]) {
  return new Map(campaigns.map((campaign) => [campaign.id, campaign]));
}

async function getCompaniesByIds(ids: string[]) {
  if (ids.length === 0) return [] as CompanyRow[];

  const { data, error } = await supabase
    .from("companies")
    .select("id, name")
    .in("id", ids);

  if (error) throw error;
  return data ?? [];
}

async function getCampaignsByIds(ids: string[]) {
  if (ids.length === 0) return [] as CampaignRow[];

  const { data, error } = await supabase
    .from("campaigns")
    .select("id, name")
    .in("id", ids);

  if (error) throw error;
  return data ?? [];
}

export async function getLeads(): Promise<LeadListItem[]> {
  const { data: leads, error } = await supabase
    .from("leads")
    .select(`
      id,
      full_name,
      email,
      phone,
      company_id,
      campaign_id,
      platform,
      status,
      score,
      metadata,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const leadRows = leads ?? [];
  const leadIds = leadRows.map((lead) => lead.id);
  const companyIds = dedupe(leadRows.map((lead) => lead.company_id));
  const campaignIds = dedupe(leadRows.map((lead) => lead.campaign_id));

  const [companies, campaigns, tasks] = await Promise.all([
    getCompaniesByIds(companyIds),
    getCampaignsByIds(campaignIds),
    leadIds.length === 0
      ? Promise.resolve([] as TaskRow[])
      : supabase
          .from("tasks")
          .select("id, lead_id, title, status, due_at, completed_at, priority, type, description")
          .in("lead_id", leadIds)
          .then(({ data, error: taskError }) => {
            if (taskError) throw taskError;
            return data ?? [];
          }),
  ]);

  const companyMap = toCompanyMap(companies);
  const campaignMap = toCampaignMap(campaigns);
  const nextTaskByLeadId = new Map<string, string>();

  tasks
    .filter((task): task is TaskRow & { lead_id: string } => Boolean(task.lead_id))
    .filter(isOpenTask)
    .sort(compareTasksByDueDate)
    .forEach((task) => {
      if (!nextTaskByLeadId.has(task.lead_id)) {
        nextTaskByLeadId.set(task.lead_id, task.title);
      }
    });

  return leadRows.map((lead) => ({
    id: lead.id,
    name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    companyId: lead.company_id,
    companyName: lead.company_id ? companyMap.get(lead.company_id)?.name ?? null : null,
    campaignId: lead.campaign_id,
    campaignName: lead.campaign_id ? campaignMap.get(lead.campaign_id)?.name ?? null : null,
    platform: resolvePlatform(lead.platform),
    status: lead.status,
    score: lead.score,
    ownerLabel: UNASSIGNED_LABEL,
    nextTaskTitle: nextTaskByLeadId.get(lead.id) ?? null,
    tags: readMetadataTags(lead.metadata),
    createdAt: lead.created_at,
  }));
}

export async function getLeadById(leadId: string): Promise<LeadDetailItem | null> {
  const { data: lead, error } = await supabase
    .from("leads")
    .select(`
      id,
      full_name,
      email,
      phone,
      company_id,
      campaign_id,
      platform,
      source,
      status,
      score,
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
      metadata,
      qualified_at,
      converted_at,
      disqualified_at,
      disqualification_reason,
      created_at
    `)
    .eq("id", leadId)
    .maybeSingle();

  if (error) throw error;
  if (!lead) return null;

  const [company, campaign] = await Promise.all([
    lead.company_id
      ? supabase.from("companies").select("id, name").eq("id", lead.company_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    lead.campaign_id
      ? supabase.from("campaigns").select("id, name").eq("id", lead.campaign_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (company.error) throw company.error;
  if (campaign.error) throw campaign.error;

  return {
    id: lead.id,
    name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    companyId: lead.company_id,
    companyName: company.data?.name ?? null,
    campaignId: lead.campaign_id,
    campaignName: campaign.data?.name ?? null,
    platform: resolvePlatform(lead.platform),
    source: lead.source,
    status: lead.status,
    score: lead.score,
    ownerLabel: UNASSIGNED_LABEL,
    adGroupId: lead.ad_group_id,
    adId: lead.ad_id,
    landingPageUrl: lead.landing_page_url,
    utmSource: lead.utm_source,
    utmMedium: lead.utm_medium,
    utmCampaign: lead.utm_campaign,
    utmContent: lead.utm_content,
    utmTerm: lead.utm_term,
    clickId: resolveClickId(lead),
    tags: readMetadataTags(lead.metadata),
    qualifiedAt: lead.qualified_at,
    convertedAt: lead.converted_at,
    disqualifiedAt: lead.disqualified_at,
    disqualificationReason: lead.disqualification_reason,
    createdAt: lead.created_at,
  };
}

export async function getLeadActivities(leadId: string): Promise<LeadActivityItem[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("id, type, title, description, occurred_at, duration_minutes, actor_user_id")
    .eq("lead_id", leadId)
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

export async function getLeadTasks(leadId: string): Promise<LeadTaskItem[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, description, type, priority, status, due_at, completed_at, assigned_user_id")
    .eq("lead_id", leadId);

  if (error) throw error;

  const tasks = (data ?? []) as TaskRow[];
  return tasks
    .sort((left, right) => {
      const leftOpen = isOpenTask(left);
      const rightOpen = isOpenTask(right);

      if (leftOpen !== rightOpen) {
        return leftOpen ? -1 : 1;
      }

      return compareTasksByDueDate(left, right);
    })
    .map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      type: task.type,
      priority: task.priority,
      status: task.status,
      dueAt: task.due_at,
      completedAt: task.completed_at,
      assigneeLabel: UNASSIGNED_LABEL,
    }));
}

export async function getLeadRelatedDeal(leadId: string): Promise<LeadRelatedDealItem | null> {
  const { data: deal, error } = await supabase
    .from("deals")
    .select("id, title, amount, stage, company_id, created_at")
    .eq("source_lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!deal) return null;

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name")
    .eq("id", deal.company_id)
    .maybeSingle();

  if (companyError) throw companyError;

  return {
    id: deal.id,
    title: deal.title,
    amount: deal.amount,
    stage: deal.stage,
    companyName: company?.name ?? null,
    createdAt: deal.created_at,
  };
}
