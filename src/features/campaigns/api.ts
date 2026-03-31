import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { CampaignDealItem, CampaignDetailItem, CampaignLeadItem, CampaignListItem } from "./types";

type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];
type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];

type CampaignListRow = Pick<
  CampaignRow,
  | "id"
  | "name"
  | "platform"
  | "status"
  | "objective"
  | "currency"
  | "spend_amount"
  | "impressions"
  | "clicks"
  | "start_date"
  | "end_date"
>;

type CampaignDetailRow = Pick<
  CampaignRow,
  | "id"
  | "name"
  | "platform"
  | "status"
  | "objective"
  | "currency"
  | "spend_amount"
  | "impressions"
  | "clicks"
  | "start_date"
  | "end_date"
  | "daily_budget"
  | "total_budget"
>;

type CampaignLeadSummaryRow = Pick<LeadRow, "campaign_id" | "status" | "qualified_at">;
type CampaignDealSummaryRow = Pick<DealRow, "campaign_id" | "stage" | "amount">;

type CampaignLeadListRow = Pick<LeadRow, "id" | "full_name" | "status" | "score" | "created_at"> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
};

type CampaignDealListRow = Pick<DealRow, "id" | "title" | "stage" | "amount" | "currency" | "created_at"> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
  primaryContact: Pick<ContactRow, "id" | "full_name"> | null;
};

interface CampaignMetrics {
  linkedLeads: number;
  qualifiedLeads: number;
  linkedDeals: number;
  wonDeals: number;
  wonRevenue: number;
  openPipeline: number;
}

function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return numerator / denominator;
}

function isQualifiedLead(lead: Pick<LeadRow, "qualified_at" | "status">) {
  if (lead.qualified_at) return true;
  return lead.status === "qualified" || lead.status === "converted";
}

function emptyMetrics(): CampaignMetrics {
  return {
    linkedLeads: 0,
    qualifiedLeads: 0,
    linkedDeals: 0,
    wonDeals: 0,
    wonRevenue: 0,
    openPipeline: 0,
  };
}

function buildMetricsByCampaign(
  leads: CampaignLeadSummaryRow[],
  deals: CampaignDealSummaryRow[],
): Map<string, CampaignMetrics> {
  const metricsByCampaign = new Map<string, CampaignMetrics>();

  for (const lead of leads) {
    if (!lead.campaign_id) continue;

    const metrics = metricsByCampaign.get(lead.campaign_id) ?? emptyMetrics();
    metrics.linkedLeads += 1;
    if (isQualifiedLead(lead)) {
      metrics.qualifiedLeads += 1;
    }
    metricsByCampaign.set(lead.campaign_id, metrics);
  }

  for (const deal of deals) {
    if (!deal.campaign_id) continue;

    const metrics = metricsByCampaign.get(deal.campaign_id) ?? emptyMetrics();
    metrics.linkedDeals += 1;

    if (deal.stage === "won") {
      metrics.wonDeals += 1;
      metrics.wonRevenue += deal.amount;
    }

    if (deal.stage !== "won" && deal.stage !== "lost") {
      metrics.openPipeline += deal.amount;
    }

    metricsByCampaign.set(deal.campaign_id, metrics);
  }

  return metricsByCampaign;
}

function mapCampaignListItem(campaign: CampaignListRow, metrics: CampaignMetrics): CampaignListItem {
  return {
    id: campaign.id,
    name: campaign.name,
    platform: campaign.platform ?? "other",
    status: campaign.status,
    objective: campaign.objective,
    currency: campaign.currency,
    spendAmount: campaign.spend_amount,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    ctr: safeDivide(campaign.clicks, campaign.impressions),
    cpc: safeDivide(campaign.spend_amount, campaign.clicks),
    linkedLeads: metrics.linkedLeads,
    qualifiedLeads: metrics.qualifiedLeads,
    linkedDeals: metrics.linkedDeals,
    wonRevenue: metrics.wonRevenue,
    roas: safeDivide(metrics.wonRevenue, campaign.spend_amount),
    startDate: campaign.start_date,
    endDate: campaign.end_date,
  };
}

function mapCampaignDetailItem(campaign: CampaignDetailRow, metrics: CampaignMetrics): CampaignDetailItem {
  return {
    id: campaign.id,
    name: campaign.name,
    platform: campaign.platform ?? "other",
    status: campaign.status,
    objective: campaign.objective,
    currency: campaign.currency,
    spendAmount: campaign.spend_amount,
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    ctr: safeDivide(campaign.clicks, campaign.impressions),
    cpc: safeDivide(campaign.spend_amount, campaign.clicks),
    roas: safeDivide(metrics.wonRevenue, campaign.spend_amount),
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    dailyBudget: campaign.daily_budget,
    totalBudget: campaign.total_budget,
    linkedLeads: metrics.linkedLeads,
    qualifiedLeads: metrics.qualifiedLeads,
    linkedDeals: metrics.linkedDeals,
    wonDeals: metrics.wonDeals,
    wonRevenue: metrics.wonRevenue,
    openPipeline: metrics.openPipeline,
  };
}

export async function getCampaigns(): Promise<CampaignListItem[]> {
  const [campaignResponse, leadResponse, dealResponse] = await Promise.all([
    supabase
      .from("campaigns")
      .select(
        "id, name, platform, status, objective, currency, spend_amount, impressions, clicks, start_date, end_date",
      )
      .order("created_at", { ascending: false }),
    supabase.from("leads").select("campaign_id, status, qualified_at").not("campaign_id", "is", null),
    supabase.from("deals").select("campaign_id, stage, amount").not("campaign_id", "is", null),
  ]);

  if (campaignResponse.error) throw campaignResponse.error;
  if (leadResponse.error) throw leadResponse.error;
  if (dealResponse.error) throw dealResponse.error;

  const metricsByCampaign = buildMetricsByCampaign(
    (leadResponse.data ?? []) as CampaignLeadSummaryRow[],
    (dealResponse.data ?? []) as CampaignDealSummaryRow[],
  );

  return ((campaignResponse.data ?? []) as CampaignListRow[]).map((campaign) =>
    mapCampaignListItem(campaign, metricsByCampaign.get(campaign.id) ?? emptyMetrics()),
  );
}

export async function getCampaignById(campaignId: string): Promise<CampaignDetailItem | null> {
  const [campaignResponse, leadResponse, dealResponse] = await Promise.all([
    supabase
      .from("campaigns")
      .select(
        "id, name, platform, status, objective, currency, spend_amount, impressions, clicks, start_date, end_date, daily_budget, total_budget",
      )
      .eq("id", campaignId)
      .maybeSingle(),
    supabase.from("leads").select("campaign_id, status, qualified_at").eq("campaign_id", campaignId),
    supabase.from("deals").select("campaign_id, stage, amount").eq("campaign_id", campaignId),
  ]);

  if (campaignResponse.error) throw campaignResponse.error;
  if (leadResponse.error) throw leadResponse.error;
  if (dealResponse.error) throw dealResponse.error;
  if (!campaignResponse.data) return null;

  const metrics = buildMetricsByCampaign(
    (leadResponse.data ?? []) as CampaignLeadSummaryRow[],
    (dealResponse.data ?? []) as CampaignDealSummaryRow[],
  ).get(campaignId) ?? emptyMetrics();

  return mapCampaignDetailItem(campaignResponse.data as CampaignDetailRow, metrics);
}

export async function getCampaignLeads(campaignId: string): Promise<CampaignLeadItem[]> {
  const { data, error } = await supabase
    .from("leads")
    .select(`
      id,
      full_name,
      status,
      score,
      created_at,
      company:companies!leads_company_id_fkey (
        id,
        name
      )
    `)
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as CampaignLeadListRow[]).map((lead) => ({
    id: lead.id,
    name: lead.full_name,
    companyName: lead.company?.name ?? null,
    status: lead.status,
    score: lead.score,
    createdAt: lead.created_at,
  }));
}

export async function getCampaignDeals(campaignId: string): Promise<CampaignDealItem[]> {
  const { data, error } = await supabase
    .from("deals")
    .select(`
      id,
      title,
      stage,
      amount,
      currency,
      created_at,
      company:companies!deals_company_id_fkey (
        id,
        name
      ),
      primaryContact:contacts!deals_primary_contact_id_fkey (
        id,
        full_name
      )
    `)
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as CampaignDealListRow[]).map((deal) => ({
    id: deal.id,
    title: deal.title,
    companyName: deal.company?.name ?? null,
    primaryContactName: deal.primaryContact?.full_name ?? null,
    stage: deal.stage,
    amount: deal.amount,
    currency: deal.currency,
    createdAt: deal.created_at,
  }));
}
