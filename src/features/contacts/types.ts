import type { Database } from "@/integrations/supabase/types";

export type ContactLifecycleStage = Database["public"]["Enums"]["contact_lifecycle_stage"];
export type DealStage = Database["public"]["Enums"]["deal_stage"];

export interface ContactListItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  jobTitle: string | null;
  lifecycleStage: ContactLifecycleStage;
  sourceLeadName: string | null;
  totalDeals: number;
  wonRevenue: number;
  createdAt: string;
}

export interface ContactDetailItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  companyId: string | null;
  companyName: string | null;
  sourceLeadId: string | null;
  sourceLeadName: string | null;
  jobTitle: string | null;
  lifecycleStage: ContactLifecycleStage;
  totalDeals: number;
  wonRevenue: number;
  createdAt: string;
}

export interface ContactDealItem {
  id: string;
  title: string;
  companyName: string | null;
  stage: DealStage;
  amount: number;
  currency: string;
  createdAt: string;
}

export const CONTACT_STAGE_LABELS: Record<ContactLifecycleStage, string> = {
  lead: "Lead",
  marketing_qualified: "Marketing Qualified",
  sales_qualified: "Sales Qualified",
  opportunity: "Opportunity",
  customer: "Customer",
  inactive: "Inactive",
};
