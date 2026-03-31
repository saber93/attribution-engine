import type { Database } from "@/integrations/supabase/types";

export type DealStage = Database["public"]["Enums"]["deal_stage"];
export type DealPlatform = Database["public"]["Enums"]["ad_platform"];
export type ActivityType = Database["public"]["Enums"]["activity_type"];

export const DEAL_STAGE_ORDER: DealStage[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export interface DealListItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  stage: DealStage;
  probability: number | null;
  platform: DealPlatform;
  companyName: string;
  primaryContactName: string | null;
  campaignName: string | null;
  ownerLabel: string;
  expectedCloseDate: string | null;
  createdAt: string;
  hasOverdueTask: boolean;
}

export interface DealDetailItem {
  id: string;
  title: string;
  amount: number;
  currency: string;
  stage: DealStage;
  probability: number | null;
  platform: DealPlatform;
  source: string | null;
  companyName: string;
  primaryContactName: string | null;
  sourceLeadName: string | null;
  campaignName: string | null;
  ownerLabel: string;
  expectedCloseDate: string | null;
  createdAt: string;
  stageChangedAt: string;
  closedAt: string | null;
  wonAt: string | null;
  lostAt: string | null;
  lostReason: string | null;
  adGroupId: string | null;
  adId: string | null;
  landingPageUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  clickId: string | null;
}

export interface DealActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  actorLabel: string;
  occurredAt: string;
  durationMinutes: number | null;
}

export const UNASSIGNED_LABEL = "Unassigned";
export const SYSTEM_LABEL = "System";
