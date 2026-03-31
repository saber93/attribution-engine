import type { Database, Json } from "@/integrations/supabase/types";

export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type LeadPlatform = Database["public"]["Enums"]["ad_platform"];
export type ActivityType = Database["public"]["Enums"]["activity_type"];
export type TaskPriority = Database["public"]["Enums"]["task_priority"];
export type TaskStatus = Database["public"]["Enums"]["task_status"];
export type TaskType = Database["public"]["Enums"]["task_type"];
export type DealStage = Database["public"]["Enums"]["deal_stage"];

export interface LeadListItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyId: string | null;
  companyName: string | null;
  campaignId: string | null;
  campaignName: string | null;
  platform: LeadPlatform;
  status: LeadStatus;
  score: number | null;
  ownerLabel: string;
  nextTaskTitle: string | null;
  tags: string[];
  createdAt: string;
}

export interface LeadDetailItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyId: string | null;
  companyName: string | null;
  campaignId: string | null;
  campaignName: string | null;
  platform: LeadPlatform;
  source: string;
  status: LeadStatus;
  score: number | null;
  ownerLabel: string;
  adGroupId: string | null;
  adId: string | null;
  landingPageUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  clickId: string | null;
  tags: string[];
  qualifiedAt: string | null;
  convertedAt: string | null;
  disqualifiedAt: string | null;
  disqualificationReason: string | null;
  createdAt: string;
}

export interface LeadActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  actorLabel: string;
  occurredAt: string;
  durationMinutes: number | null;
}

export interface LeadTaskItem {
  id: string;
  title: string;
  description: string | null;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  dueAt: string | null;
  completedAt: string | null;
  assigneeLabel: string;
}

export interface LeadRelatedDealItem {
  id: string;
  title: string;
  amount: number;
  stage: DealStage;
  companyName: string | null;
  createdAt: string;
}

export const UNASSIGNED_LABEL = "Unassigned";
export const SYSTEM_LABEL = "System";

export function readMetadataTags(metadata: Json): string[] {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return [];
  }

  const tags = metadata.tags;
  return Array.isArray(tags) ? tags.filter((tag): tag is string => typeof tag === "string") : [];
}
