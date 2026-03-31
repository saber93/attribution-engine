import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type {
  CompanyContactItem,
  CompanyDealItem,
  CompanyDetailItem,
  CompanyLeadItem,
  CompanyListItem,
} from "./types";

type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];
type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];

type CompanyListRow = Pick<
  CompanyRow,
  "id" | "name" | "industry" | "size_band" | "website_url" | "domain" | "created_at"
>;

type CompanyDetailRow = Pick<
  CompanyRow,
  "id" | "name" | "industry" | "size_band" | "website_url" | "domain" | "created_at"
>;

type CompanyContactSummaryRow = Pick<ContactRow, "company_id">;
type CompanyLeadSummaryRow = Pick<LeadRow, "company_id">;
type CompanyDealSummaryRow = Pick<DealRow, "company_id" | "stage" | "amount">;

type CompanyContactRow = Pick<
  ContactRow,
  "id" | "full_name" | "email" | "phone" | "job_title" | "lifecycle_stage" | "created_at"
>;

type CompanyLeadRow = Pick<LeadRow, "id" | "full_name" | "status" | "score" | "created_at">;

type CompanyDealRow = Pick<DealRow, "id" | "title" | "stage" | "amount" | "currency" | "created_at"> & {
  primaryContact: Pick<ContactRow, "id" | "full_name"> | null;
};

interface CompanyMetrics {
  contactsCount: number;
  linkedLeads: number;
  linkedDeals: number;
  activeDeals: number;
  wonDeals: number;
  wonRevenue: number;
  openPipeline: number;
}

function emptyMetrics(): CompanyMetrics {
  return {
    contactsCount: 0,
    linkedLeads: 0,
    linkedDeals: 0,
    activeDeals: 0,
    wonDeals: 0,
    wonRevenue: 0,
    openPipeline: 0,
  };
}

function buildMetricsByCompany(
  contacts: CompanyContactSummaryRow[],
  leads: CompanyLeadSummaryRow[],
  deals: CompanyDealSummaryRow[],
): Map<string, CompanyMetrics> {
  const metricsByCompany = new Map<string, CompanyMetrics>();

  for (const contact of contacts) {
    if (!contact.company_id) continue;

    const metrics = metricsByCompany.get(contact.company_id) ?? emptyMetrics();
    metrics.contactsCount += 1;
    metricsByCompany.set(contact.company_id, metrics);
  }

  for (const lead of leads) {
    if (!lead.company_id) continue;

    const metrics = metricsByCompany.get(lead.company_id) ?? emptyMetrics();
    metrics.linkedLeads += 1;
    metricsByCompany.set(lead.company_id, metrics);
  }

  for (const deal of deals) {
    if (!deal.company_id) continue;

    const metrics = metricsByCompany.get(deal.company_id) ?? emptyMetrics();
    metrics.linkedDeals += 1;

    if (deal.stage !== "won" && deal.stage !== "lost") {
      metrics.activeDeals += 1;
      metrics.openPipeline += deal.amount;
    }

    if (deal.stage === "won") {
      metrics.wonDeals += 1;
      metrics.wonRevenue += deal.amount;
    }

    metricsByCompany.set(deal.company_id, metrics);
  }

  return metricsByCompany;
}

function mapCompanyListItem(company: CompanyListRow, metrics: CompanyMetrics): CompanyListItem {
  return {
    id: company.id,
    name: company.name,
    industry: company.industry,
    sizeBand: company.size_band,
    websiteUrl: company.website_url,
    domain: company.domain,
    contactsCount: metrics.contactsCount,
    linkedLeads: metrics.linkedLeads,
    activeDeals: metrics.activeDeals,
    wonRevenue: metrics.wonRevenue,
    openPipeline: metrics.openPipeline,
    createdAt: company.created_at,
  };
}

function mapCompanyDetailItem(company: CompanyDetailRow, metrics: CompanyMetrics): CompanyDetailItem {
  return {
    id: company.id,
    name: company.name,
    industry: company.industry,
    sizeBand: company.size_band,
    websiteUrl: company.website_url,
    domain: company.domain,
    contactsCount: metrics.contactsCount,
    linkedLeads: metrics.linkedLeads,
    linkedDeals: metrics.linkedDeals,
    activeDeals: metrics.activeDeals,
    wonDeals: metrics.wonDeals,
    wonRevenue: metrics.wonRevenue,
    openPipeline: metrics.openPipeline,
    createdAt: company.created_at,
  };
}

export async function getCompanies(): Promise<CompanyListItem[]> {
  const [companyResponse, contactResponse, leadResponse, dealResponse] = await Promise.all([
    supabase
      .from("companies")
      .select("id, name, industry, size_band, website_url, domain, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("contacts").select("company_id").not("company_id", "is", null),
    supabase.from("leads").select("company_id").not("company_id", "is", null),
    supabase.from("deals").select("company_id, stage, amount").not("company_id", "is", null),
  ]);

  if (companyResponse.error) throw companyResponse.error;
  if (contactResponse.error) throw contactResponse.error;
  if (leadResponse.error) throw leadResponse.error;
  if (dealResponse.error) throw dealResponse.error;

  const metricsByCompany = buildMetricsByCompany(
    (contactResponse.data ?? []) as CompanyContactSummaryRow[],
    (leadResponse.data ?? []) as CompanyLeadSummaryRow[],
    (dealResponse.data ?? []) as CompanyDealSummaryRow[],
  );

  return ((companyResponse.data ?? []) as CompanyListRow[]).map((company) =>
    mapCompanyListItem(company, metricsByCompany.get(company.id) ?? emptyMetrics()),
  );
}

export async function getCompanyById(companyId: string): Promise<CompanyDetailItem | null> {
  const [companyResponse, contactResponse, leadResponse, dealResponse] = await Promise.all([
    supabase
      .from("companies")
      .select("id, name, industry, size_band, website_url, domain, created_at")
      .eq("id", companyId)
      .maybeSingle(),
    supabase.from("contacts").select("company_id").eq("company_id", companyId),
    supabase.from("leads").select("company_id").eq("company_id", companyId),
    supabase.from("deals").select("company_id, stage, amount").eq("company_id", companyId),
  ]);

  if (companyResponse.error) throw companyResponse.error;
  if (contactResponse.error) throw contactResponse.error;
  if (leadResponse.error) throw leadResponse.error;
  if (dealResponse.error) throw dealResponse.error;
  if (!companyResponse.data) return null;

  const metrics =
    buildMetricsByCompany(
      (contactResponse.data ?? []) as CompanyContactSummaryRow[],
      (leadResponse.data ?? []) as CompanyLeadSummaryRow[],
      (dealResponse.data ?? []) as CompanyDealSummaryRow[],
    ).get(companyId) ?? emptyMetrics();

  return mapCompanyDetailItem(companyResponse.data as CompanyDetailRow, metrics);
}

export async function getCompanyContacts(companyId: string): Promise<CompanyContactItem[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select("id, full_name, email, phone, job_title, lifecycle_stage, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as CompanyContactRow[]).map((contact) => ({
    id: contact.id,
    name: contact.full_name,
    email: contact.email,
    phone: contact.phone,
    jobTitle: contact.job_title,
    lifecycleStage: contact.lifecycle_stage,
    createdAt: contact.created_at,
  }));
}

export async function getCompanyLeads(companyId: string): Promise<CompanyLeadItem[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, status, score, created_at")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as CompanyLeadRow[]).map((lead) => ({
    id: lead.id,
    name: lead.full_name,
    status: lead.status,
    score: lead.score,
    createdAt: lead.created_at,
  }));
}

export async function getCompanyDeals(companyId: string): Promise<CompanyDealItem[]> {
  const { data, error } = await supabase
    .from("deals")
    .select(`
      id,
      title,
      stage,
      amount,
      currency,
      created_at,
      primaryContact:contacts!deals_primary_contact_id_fkey (
        id,
        full_name
      )
    `)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as CompanyDealRow[]).map((deal) => ({
    id: deal.id,
    title: deal.title,
    primaryContactName: deal.primaryContact?.full_name ?? null,
    stage: deal.stage,
    amount: deal.amount,
    currency: deal.currency,
    createdAt: deal.created_at,
  }));
}
