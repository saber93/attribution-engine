import type { Database } from "@/integrations/supabase/types";
import type { DealStage } from "@/features/deals/types";

export type LeadPlatform = Database["public"]["Enums"]["ad_platform"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type TaskPriority = Database["public"]["Enums"]["task_priority"];

export interface OverviewKpiSummary {
  totalLeads: number;
  qualifiedLeads: number;
  wonDeals: number;
  wonRevenue: number;
  openPipeline: number;
  tasksRequiringAttention: number;
}

export interface OverviewRecentLeadItem {
  id: string;
  name: string;
  companyName: string | null;
  campaignName: string | null;
  platform: LeadPlatform;
  status: LeadStatus;
  createdAt: string;
}

export interface OverviewAttentionTaskItem {
  id: string;
  title: string;
  priority: TaskPriority;
  dueAt: string;
  relatedLabel: string;
}

export interface OverviewPipelineStageItem {
  stage: DealStage;
  count: number;
  amount: number;
}

export interface OverviewPlatformBreakdownItem {
  platform: LeadPlatform;
  count: number;
  share: number;
}

export interface OverviewSourceBreakdownItem {
  source: string;
  label: string;
  count: number;
  share: number;
}

export interface OverviewPageData {
  kpis: OverviewKpiSummary;
  recentLeads: OverviewRecentLeadItem[];
  attentionTasks: OverviewAttentionTaskItem[];
  pipelineByStage: OverviewPipelineStageItem[];
  platformBreakdown: OverviewPlatformBreakdownItem[];
  sourceBreakdown: OverviewSourceBreakdownItem[];
}
