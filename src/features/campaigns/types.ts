import type { Database } from "@/integrations/supabase/types";

export type CampaignStatus = Database["public"]["Enums"]["campaign_status"];
export type CampaignPlatform = Database["public"]["Enums"]["ad_platform"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type DealStage = Database["public"]["Enums"]["deal_stage"];

export interface CampaignListItem {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  objective: string | null;
  currency: string;
  spendAmount: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  linkedLeads: number;
  qualifiedLeads: number;
  linkedDeals: number;
  wonRevenue: number;
  roas: number | null;
  startDate: string | null;
  endDate: string | null;
}

export interface CampaignDetailItem {
  id: string;
  name: string;
  platform: CampaignPlatform;
  status: CampaignStatus;
  objective: string | null;
  currency: string;
  spendAmount: number;
  impressions: number;
  clicks: number;
  ctr: number | null;
  cpc: number | null;
  roas: number | null;
  startDate: string | null;
  endDate: string | null;
  dailyBudget: number | null;
  totalBudget: number | null;
  linkedLeads: number;
  qualifiedLeads: number;
  linkedDeals: number;
  wonDeals: number;
  wonRevenue: number;
  openPipeline: number;
}

export interface CampaignLeadItem {
  id: string;
  name: string;
  companyName: string | null;
  status: LeadStatus;
  score: number | null;
  createdAt: string;
}

export interface CampaignDealItem {
  id: string;
  title: string;
  companyName: string | null;
  primaryContactName: string | null;
  stage: DealStage;
  amount: number;
  currency: string;
  createdAt: string;
}
