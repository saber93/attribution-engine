import { useQuery } from "@tanstack/react-query";
import {
  getCompanies,
  getCompanyById,
  getCompanyContacts,
  getCompanyDeals,
  getCompanyLeads,
} from "./api";

export const companyQueryKeys = {
  all: ["companies"] as const,
  list: () => [...companyQueryKeys.all, "list"] as const,
  detail: (companyId?: string) => [...companyQueryKeys.all, "detail", companyId] as const,
  contacts: (companyId?: string) => [...companyQueryKeys.all, "contacts", companyId] as const,
  leads: (companyId?: string) => [...companyQueryKeys.all, "leads", companyId] as const,
  deals: (companyId?: string) => [...companyQueryKeys.all, "deals", companyId] as const,
};

export function useCompaniesQuery() {
  return useQuery({
    queryKey: companyQueryKeys.list(),
    queryFn: getCompanies,
  });
}

export function useCompanyByIdQuery(companyId?: string, enabled = true) {
  return useQuery({
    queryKey: companyQueryKeys.detail(companyId),
    queryFn: () => getCompanyById(companyId!),
    enabled: enabled && Boolean(companyId),
  });
}

export function useCompanyContactsQuery(companyId?: string, enabled = true) {
  return useQuery({
    queryKey: companyQueryKeys.contacts(companyId),
    queryFn: () => getCompanyContacts(companyId!),
    enabled: enabled && Boolean(companyId),
  });
}

export function useCompanyLeadsQuery(companyId?: string, enabled = true) {
  return useQuery({
    queryKey: companyQueryKeys.leads(companyId),
    queryFn: () => getCompanyLeads(companyId!),
    enabled: enabled && Boolean(companyId),
  });
}

export function useCompanyDealsQuery(companyId?: string, enabled = true) {
  return useQuery({
    queryKey: companyQueryKeys.deals(companyId),
    queryFn: () => getCompanyDeals(companyId!),
    enabled: enabled && Boolean(companyId),
  });
}
