import type { Database } from "@/integrations/supabase/types";

export type ContactLifecycleStage = Database["public"]["Enums"]["contact_lifecycle_stage"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type DealStage = Database["public"]["Enums"]["deal_stage"];

export interface CompanyListItem {
  id: string;
  name: string;
  industry: string | null;
  sizeBand: string | null;
  websiteUrl: string | null;
  domain: string | null;
  contactsCount: number;
  linkedLeads: number;
  activeDeals: number;
  wonRevenue: number;
  openPipeline: number;
  createdAt: string;
}

export interface CompanyDetailItem {
  id: string;
  name: string;
  industry: string | null;
  sizeBand: string | null;
  websiteUrl: string | null;
  domain: string | null;
  contactsCount: number;
  linkedLeads: number;
  linkedDeals: number;
  activeDeals: number;
  wonDeals: number;
  wonRevenue: number;
  openPipeline: number;
  createdAt: string;
}

export interface CompanyContactItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  lifecycleStage: ContactLifecycleStage;
  createdAt: string;
}

export interface CompanyLeadItem {
  id: string;
  name: string;
  status: LeadStatus;
  score: number | null;
  createdAt: string;
}

export interface CompanyDealItem {
  id: string;
  title: string;
  primaryContactName: string | null;
  stage: DealStage;
  amount: number;
  currency: string;
  createdAt: string;
}
