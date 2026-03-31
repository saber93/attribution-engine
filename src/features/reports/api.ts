import type { CampaignPlatform, CampaignStatus, DealStage, LeadStatus } from "@/features/campaigns/types";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type {
  CampaignRevenueReportData,
  CampaignRevenueReportRow,
  CampaignRevenueReportTotals,
  LeadSourceSummary,
  PlatformPerformanceSummary,
  ReportCatalogCard,
  ReportsCatalogData,
  SalesFunnelSummary,
} from "./types";
import { isConvertedLead, isOpenPipelineDeal, isQualifiedLead, isWonDeal } from "./types";

type CampaignRow = Pick<
  Database["public"]["Tables"]["campaigns"]["Row"],
  "id" | "name" | "platform" | "status" | "currency" | "spend_amount" | "impressions" | "clicks"
>;
type LeadRow = Pick<
  Database["public"]["Tables"]["leads"]["Row"],
  "id" | "campaign_id" | "platform" | "source" | "status" | "qualified_at" | "converted_at"
>;
type DealRow = Pick<
  Database["public"]["Tables"]["deals"]["Row"],
  "campaign_id" | "platform" | "stage" | "amount" | "source_lead_id"
>;

interface CampaignRollup {
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

function emptyCampaignRollup(): CampaignRollup {
  return {
    linkedLeads: 0,
    qualifiedLeads: 0,
    linkedDeals: 0,
    wonDeals: 0,
    wonRevenue: 0,
    openPipeline: 0,
  };
}

function resolvePlatform(platform: CampaignPlatform | string | null): CampaignPlatform {
  return (platform ?? "other") as CampaignPlatform;
}

function humanizeLabel(value: string | null | undefined) {
  if (!value) return "Unknown";

  return value
    .split(/[_-]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getPlatformLabel(platform: CampaignPlatform | string | null) {
  switch (platform) {
    case "google":
      return "Google Ads";
    case "meta":
      return "Meta Ads";
    case "linkedin":
      return "LinkedIn Ads";
    case "other":
    case null:
      return "Other";
    default:
      return humanizeLabel(platform);
  }
}

function buildCampaignRollups(leads: LeadRow[], deals: DealRow[]) {
  const metricsByCampaign = new Map<string, CampaignRollup>();

  for (const lead of leads) {
    if (!lead.campaign_id) continue;

    const metrics = metricsByCampaign.get(lead.campaign_id) ?? emptyCampaignRollup();
    metrics.linkedLeads += 1;
    if (isQualifiedLead({ qualified_at: lead.qualified_at, status: lead.status as LeadStatus })) {
      metrics.qualifiedLeads += 1;
    }
    metricsByCampaign.set(lead.campaign_id, metrics);
  }

  for (const deal of deals) {
    if (!deal.campaign_id) continue;

    const metrics = metricsByCampaign.get(deal.campaign_id) ?? emptyCampaignRollup();
    metrics.linkedDeals += 1;

    if (isWonDeal({ stage: deal.stage as DealStage })) {
      metrics.wonDeals += 1;
      metrics.wonRevenue += deal.amount;
    }

    if (isOpenPipelineDeal({ stage: deal.stage as DealStage })) {
      metrics.openPipeline += deal.amount;
    }

    metricsByCampaign.set(deal.campaign_id, metrics);
  }

  return metricsByCampaign;
}

function buildCampaignRevenueRows(campaigns: CampaignRow[], leads: LeadRow[], deals: DealRow[]): CampaignRevenueReportRow[] {
  const rollups = buildCampaignRollups(leads, deals);

  return campaigns
    .map<CampaignRevenueReportRow>((campaign) => {
      const rollup = rollups.get(campaign.id) ?? emptyCampaignRollup();

      return {
        id: campaign.id,
        name: campaign.name,
        platform: resolvePlatform(campaign.platform),
        status: campaign.status as CampaignStatus,
        currency: campaign.currency,
        spend: campaign.spend_amount,
        impressions: campaign.impressions,
        clicks: campaign.clicks,
        ctr: safeDivide(campaign.clicks, campaign.impressions),
        cpc: safeDivide(campaign.spend_amount, campaign.clicks),
        linkedLeads: rollup.linkedLeads,
        qualifiedLeads: rollup.qualifiedLeads,
        linkedDeals: rollup.linkedDeals,
        wonDeals: rollup.wonDeals,
        wonRevenue: rollup.wonRevenue,
        openPipeline: rollup.openPipeline,
        roas: safeDivide(rollup.wonRevenue, campaign.spend_amount),
      };
    })
    .sort((left, right) => right.wonRevenue - left.wonRevenue || right.openPipeline - left.openPipeline || left.name.localeCompare(right.name));
}

function buildCampaignRevenueTotals(rows: CampaignRevenueReportRow[]): CampaignRevenueReportTotals {
  const totals = rows.reduce(
    (accumulator, row) => {
      accumulator.totalSpend += row.spend;
      accumulator.totalImpressions += row.impressions;
      accumulator.totalClicks += row.clicks;
      accumulator.totalLinkedLeads += row.linkedLeads;
      accumulator.totalQualifiedLeads += row.qualifiedLeads;
      accumulator.totalLinkedDeals += row.linkedDeals;
      accumulator.totalWonDeals += row.wonDeals;
      accumulator.totalWonRevenue += row.wonRevenue;
      accumulator.totalOpenPipeline += row.openPipeline;
      return accumulator;
    },
    {
      currency: rows[0]?.currency ?? "USD",
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalLinkedLeads: 0,
      totalQualifiedLeads: 0,
      totalLinkedDeals: 0,
      totalWonDeals: 0,
      totalWonRevenue: 0,
      totalOpenPipeline: 0,
      blendedCtr: null,
      blendedCpc: null,
      blendedRoas: null,
    } as CampaignRevenueReportTotals,
  );

  totals.blendedCtr = safeDivide(totals.totalClicks, totals.totalImpressions);
  totals.blendedCpc = safeDivide(totals.totalSpend, totals.totalClicks);
  totals.blendedRoas = safeDivide(totals.totalWonRevenue, totals.totalSpend);

  return totals;
}

function buildPlatformPerformanceSummary(campaigns: CampaignRow[], leads: LeadRow[], deals: DealRow[]): PlatformPerformanceSummary {
  const activePlatforms = new Set([
    ...campaigns.map((campaign) => resolvePlatform(campaign.platform)),
    ...leads.map((lead) => resolvePlatform(lead.platform)),
    ...deals.map((deal) => resolvePlatform(deal.platform)),
  ]).size;
  const wonRevenueByPlatform = new Map<string, number>();

  for (const deal of deals) {
    if (!isWonDeal({ stage: deal.stage as DealStage })) continue;
    const platform = resolvePlatform(deal.platform);
    wonRevenueByPlatform.set(platform, (wonRevenueByPlatform.get(platform) ?? 0) + deal.amount);
  }

  const topPlatformEntry = [...wonRevenueByPlatform.entries()].sort((left, right) => right[1] - left[1])[0];

  return {
    activePlatforms,
    topPlatformLabel: topPlatformEntry ? getPlatformLabel(topPlatformEntry[0]) : null,
    totalWonRevenue: deals
      .filter((deal) => isWonDeal({ stage: deal.stage as DealStage }))
      .reduce((total, deal) => total + deal.amount, 0),
  };
}

function buildLeadSourceSummary(leads: LeadRow[], deals: DealRow[]): LeadSourceSummary[] {
  const sourceByLeadId = new Map(leads.map((lead) => [lead.id, lead.source?.trim() || "unknown"]));
  const sourceSummary = new Map<string, LeadSourceSummary>();

  for (const lead of leads) {
    const source = lead.source?.trim() || "unknown";
    const current = sourceSummary.get(source) ?? {
      source,
      label: humanizeLabel(source),
      totalLeads: 0,
      qualifiedLeads: 0,
      linkedDeals: 0,
      wonDeals: 0,
      wonRevenue: 0,
    };

    current.totalLeads += 1;
    if (isQualifiedLead({ qualified_at: lead.qualified_at, status: lead.status as LeadStatus })) {
      current.qualifiedLeads += 1;
    }
    sourceSummary.set(source, current);
  }

  for (const deal of deals) {
    if (!deal.source_lead_id) continue;

    const source = sourceByLeadId.get(deal.source_lead_id);
    if (!source) continue;

    const current = sourceSummary.get(source);
    if (!current) continue;

    current.linkedDeals += 1;
    if (isWonDeal({ stage: deal.stage as DealStage })) {
      current.wonDeals += 1;
      current.wonRevenue += deal.amount;
    }
  }

  return [...sourceSummary.values()].sort(
    (left, right) => right.totalLeads - left.totalLeads || right.qualifiedLeads - left.qualifiedLeads || left.label.localeCompare(right.label),
  );
}

function buildSalesFunnelSummary(leads: LeadRow[], deals: DealRow[]): SalesFunnelSummary {
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter((lead) => isQualifiedLead({ qualified_at: lead.qualified_at, status: lead.status as LeadStatus })).length;
  const convertedLeads = leads.filter((lead) => isConvertedLead({ converted_at: lead.converted_at, status: lead.status as LeadStatus })).length;
  const linkedDeals = deals.filter((deal) => Boolean(deal.source_lead_id)).length;
  const wonDeals = deals.filter((deal) => Boolean(deal.source_lead_id) && isWonDeal({ stage: deal.stage as DealStage })).length;

  return {
    totalLeads,
    qualifiedLeads,
    convertedLeads,
    linkedDeals,
    wonDeals,
    leadToWinRate: safeDivide(wonDeals, totalLeads),
  };
}

function buildCatalogCards(campaigns: CampaignRow[], leads: LeadRow[], deals: DealRow[]): ReportCatalogCard[] {
  const campaignRevenueRows = buildCampaignRevenueRows(campaigns, leads, deals);
  const campaignRevenueTotals = buildCampaignRevenueTotals(campaignRevenueRows);
  const platformPerformance = buildPlatformPerformanceSummary(campaigns, leads, deals);
  const sourceSummary = buildLeadSourceSummary(leads, deals);
  const funnelSummary = buildSalesFunnelSummary(leads, deals);

  return [
    {
      id: "campaign-revenue",
      title: "Campaign to Revenue",
      description: "Track campaign performance from spend to closed revenue.",
      href: "/reports/campaign-revenue",
      metrics: [
        { label: "Won Revenue", format: "currency", value: campaignRevenueTotals.totalWonRevenue },
        { label: "Open Pipeline", format: "currency", value: campaignRevenueTotals.totalOpenPipeline },
        { label: "Blended ROAS", format: "multiplier", value: campaignRevenueTotals.blendedRoas },
      ],
    },
    {
      id: "platform-performance",
      title: "Platform Performance",
      description: "Compare platform-level spend, pipeline, and revenue snapshots.",
      href: null,
      metrics: [
        { label: "Active Platforms", format: "count", value: platformPerformance.activePlatforms },
        { label: "Top Platform", format: "text", value: platformPerformance.topPlatformLabel ?? "—" },
        { label: "Won Revenue", format: "currency", value: platformPerformance.totalWonRevenue },
      ],
    },
    {
      id: "lead-source-analysis",
      title: "Lead Source Analysis",
      description: "Review lead volume and qualification by live source attribution.",
      href: null,
      metrics: [
        { label: "Distinct Sources", format: "count", value: sourceSummary.length },
        { label: "Top Source", format: "text", value: sourceSummary[0]?.label ?? "—" },
        {
          label: "Qualified Leads",
          format: "count",
          value: sourceSummary.reduce((total, source) => total + source.qualifiedLeads, 0),
        },
      ],
    },
    {
      id: "sales-funnel",
      title: "Sales Funnel",
      description: "Track progression from leads to won deals using CRM-linked records.",
      href: null,
      metrics: [
        { label: "Total Leads", format: "count", value: funnelSummary.totalLeads },
        { label: "Qualified Leads", format: "count", value: funnelSummary.qualifiedLeads },
        { label: "Lead-to-Win Rate", format: "percent", value: funnelSummary.leadToWinRate },
      ],
    },
  ];
}

async function getReportsBaseData() {
  const [campaignsResponse, leadsResponse, dealsResponse] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id, name, platform, status, currency, spend_amount, impressions, clicks")
      .order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select("id, campaign_id, platform, source, status, qualified_at, converted_at"),
    supabase
      .from("deals")
      .select("campaign_id, platform, stage, amount, source_lead_id"),
  ]);

  if (campaignsResponse.error) throw campaignsResponse.error;
  if (leadsResponse.error) throw leadsResponse.error;
  if (dealsResponse.error) throw dealsResponse.error;

  return {
    campaigns: (campaignsResponse.data ?? []) as CampaignRow[],
    leads: (leadsResponse.data ?? []) as LeadRow[],
    deals: (dealsResponse.data ?? []) as DealRow[],
  };
}

export async function getReportsCatalog(): Promise<ReportsCatalogData> {
  const { campaigns, leads, deals } = await getReportsBaseData();

  return {
    hasData: campaigns.length > 0 || leads.length > 0 || deals.length > 0,
    cards: buildCatalogCards(campaigns, leads, deals),
  };
}

export async function getCampaignRevenueReport(): Promise<CampaignRevenueReportData> {
  const { campaigns, leads, deals } = await getReportsBaseData();
  const rows = buildCampaignRevenueRows(campaigns, leads, deals);

  return {
    reportId: "campaign-revenue",
    title: "Campaign to Revenue",
    description: "Trustworthy campaign performance from spend through closed-won revenue.",
    totals: buildCampaignRevenueTotals(rows),
    rows,
  };
}
