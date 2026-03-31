import type { CampaignPlatform, CampaignStatus, DealStage, LeadStatus } from "@/features/campaigns/types";

export type SupportedReportId = "campaign-revenue";
export type ReportCatalogId =
  | SupportedReportId
  | "platform-performance"
  | "lead-source-analysis"
  | "sales-funnel";

export type ReportMetricFormat = "currency" | "count" | "percent" | "multiplier" | "text";

export interface ReportMetric {
  label: string;
  format: ReportMetricFormat;
  value: number | string | null;
}

export interface ReportCatalogCard {
  id: ReportCatalogId;
  title: string;
  description: string;
  href: string | null;
  metrics: ReportMetric[];
}

export interface ReportsCatalogData {
  hasData: boolean;
  cards: ReportCatalogCard[];
}

export interface CampaignRevenueReportRow {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  currency: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  linkedLeads: number;
  qualifiedLeads: number;
  linkedDeals: number;
  wonDeals: number;
  wonRevenue: number;
  openPipeline: number;
  roas: number | null;
}

export interface CampaignRevenueReportTotals {
  currency: string;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalLinkedLeads: number;
  totalQualifiedLeads: number;
  totalLinkedDeals: number;
  totalWonDeals: number;
  totalWonRevenue: number;
  totalOpenPipeline: number;
  blendedCtr: number | null;
  blendedCpc: number | null;
  blendedRoas: number | null;
}

export interface CampaignRevenueReportData {
  reportId: SupportedReportId;
  title: string;
  description: string;
  totals: CampaignRevenueReportTotals;
  rows: CampaignRevenueReportRow[];
}

export interface LeadSourceSummary {
  source: string;
  label: string;
  totalLeads: number;
  qualifiedLeads: number;
  linkedDeals: number;
  wonDeals: number;
  wonRevenue: number;
}

export interface SalesFunnelSummary {
  totalLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  linkedDeals: number;
  wonDeals: number;
  leadToWinRate: number | null;
}

export interface PlatformPerformanceSummary {
  activePlatforms: number;
  topPlatformLabel: string | null;
  totalWonRevenue: number;
}

export function isSupportedReportId(value?: string | null): value is SupportedReportId {
  return value === "campaign-revenue";
}

export function isQualifiedLead(lead: Pick<{ qualified_at: string | null; status: LeadStatus }, "qualified_at" | "status">) {
  if (lead.qualified_at) return true;
  return lead.status === "qualified" || lead.status === "converted";
}

export function isConvertedLead(lead: Pick<{ converted_at: string | null; status: LeadStatus }, "converted_at" | "status">) {
  if (lead.converted_at) return true;
  return lead.status === "converted";
}

export function isWonDeal(deal: Pick<{ stage: DealStage }, "stage">) {
  return deal.stage === "won";
}

export function isOpenPipelineDeal(deal: Pick<{ stage: DealStage }, "stage">) {
  return deal.stage !== "won" && deal.stage !== "lost";
}
