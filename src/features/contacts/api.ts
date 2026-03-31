import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ContactDealItem, ContactDetailItem, ContactListItem } from "./types";

type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];
type DealRow = Database["public"]["Tables"]["deals"]["Row"];
type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];
type LeadRow = Database["public"]["Tables"]["leads"]["Row"];

type ContactListRow = Pick<
  ContactRow,
  "id" | "full_name" | "email" | "phone" | "job_title" | "lifecycle_stage" | "created_at"
> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
  sourceLead: Pick<LeadRow, "id" | "full_name"> | null;
};

type ContactDetailRow = Pick<
  ContactRow,
  "id" | "company_id" | "source_lead_id" | "full_name" | "email" | "phone" | "job_title" | "lifecycle_stage" | "created_at"
> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
  sourceLead: Pick<LeadRow, "id" | "full_name"> | null;
};

type ContactDealSummaryRow = Pick<DealRow, "primary_contact_id" | "stage" | "amount">;

type ContactDealRow = Pick<DealRow, "id" | "title" | "stage" | "amount" | "currency" | "created_at"> & {
  company: Pick<CompanyRow, "id" | "name"> | null;
};

interface ContactDealSummary {
  totalDeals: number;
  wonRevenue: number;
}

function emptyDealSummary(): ContactDealSummary {
  return {
    totalDeals: 0,
    wonRevenue: 0,
  };
}

function buildDealSummaryByContact(deals: ContactDealSummaryRow[]): Map<string, ContactDealSummary> {
  const summaries = new Map<string, ContactDealSummary>();

  for (const deal of deals) {
    if (!deal.primary_contact_id) continue;

    const summary = summaries.get(deal.primary_contact_id) ?? emptyDealSummary();
    summary.totalDeals += 1;

    if (deal.stage === "won") {
      summary.wonRevenue += deal.amount;
    }

    summaries.set(deal.primary_contact_id, summary);
  }

  return summaries;
}

function mapContactListItem(contact: ContactListRow, summary: ContactDealSummary): ContactListItem {
  return {
    id: contact.id,
    name: contact.full_name,
    email: contact.email,
    phone: contact.phone,
    companyName: contact.company?.name ?? null,
    jobTitle: contact.job_title,
    lifecycleStage: contact.lifecycle_stage,
    sourceLeadName: contact.sourceLead?.full_name ?? null,
    totalDeals: summary.totalDeals,
    wonRevenue: summary.wonRevenue,
    createdAt: contact.created_at,
  };
}

export async function getContacts(): Promise<ContactListItem[]> {
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select(`
      id,
      full_name,
      email,
      phone,
      job_title,
      lifecycle_stage,
      created_at,
      company:companies!contacts_company_id_fkey (
        id,
        name
      ),
      sourceLead:leads!contacts_source_lead_id_fkey (
        id,
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const contactRows = (contacts ?? []) as ContactListRow[];
  const contactIds = contactRows.map((contact) => contact.id);

  let deals: ContactDealSummaryRow[] = [];

  if (contactIds.length > 0) {
    const { data: dealData, error: dealError } = await supabase
      .from("deals")
      .select("primary_contact_id, stage, amount")
      .in("primary_contact_id", contactIds);

    if (dealError) throw dealError;
    deals = (dealData ?? []) as ContactDealSummaryRow[];
  }

  const dealSummaryByContact = buildDealSummaryByContact(deals);

  return contactRows.map((contact) =>
    mapContactListItem(contact, dealSummaryByContact.get(contact.id) ?? emptyDealSummary()),
  );
}

export async function getContactById(contactId: string): Promise<ContactDetailItem | null> {
  const { data, error } = await supabase
    .from("contacts")
    .select(`
      id,
      company_id,
      source_lead_id,
      full_name,
      email,
      phone,
      job_title,
      lifecycle_stage,
      created_at,
      company:companies!contacts_company_id_fkey (
        id,
        name
      ),
      sourceLead:leads!contacts_source_lead_id_fkey (
        id,
        full_name
      )
    `)
    .eq("id", contactId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { data: deals, error: dealError } = await supabase
    .from("deals")
    .select("primary_contact_id, stage, amount")
    .eq("primary_contact_id", contactId);

  if (dealError) throw dealError;

  const summary = buildDealSummaryByContact((deals ?? []) as ContactDealSummaryRow[]).get(contactId) ?? emptyDealSummary();
  const contact = data as ContactDetailRow;

  return {
    id: contact.id,
    name: contact.full_name,
    email: contact.email,
    phone: contact.phone,
    companyId: contact.company_id,
    companyName: contact.company?.name ?? null,
    sourceLeadId: contact.source_lead_id,
    sourceLeadName: contact.sourceLead?.full_name ?? null,
    jobTitle: contact.job_title,
    lifecycleStage: contact.lifecycle_stage,
    totalDeals: summary.totalDeals,
    wonRevenue: summary.wonRevenue,
    createdAt: contact.created_at,
  };
}

export async function getContactDeals(contactId: string): Promise<ContactDealItem[]> {
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
      )
    `)
    .eq("primary_contact_id", contactId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as ContactDealRow[]).map((deal) => ({
    id: deal.id,
    title: deal.title,
    companyName: deal.company?.name ?? null,
    stage: deal.stage,
    amount: deal.amount,
    currency: deal.currency,
    createdAt: deal.created_at,
  }));
}
