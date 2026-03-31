import { useQuery } from "@tanstack/react-query";
import { getContactById, getContactDeals, getContacts } from "./api";

export const contactQueryKeys = {
  all: ["contacts"] as const,
  list: () => [...contactQueryKeys.all, "list"] as const,
  detail: (contactId?: string) => [...contactQueryKeys.all, "detail", contactId] as const,
  deals: (contactId?: string) => [...contactQueryKeys.all, "deals", contactId] as const,
};

export function useContactsQuery() {
  return useQuery({
    queryKey: contactQueryKeys.list(),
    queryFn: getContacts,
  });
}

export function useContactByIdQuery(contactId?: string, enabled = true) {
  return useQuery({
    queryKey: contactQueryKeys.detail(contactId),
    queryFn: () => getContactById(contactId!),
    enabled: enabled && Boolean(contactId),
  });
}

export function useContactDealsQuery(contactId?: string, enabled = true) {
  return useQuery({
    queryKey: contactQueryKeys.deals(contactId),
    queryFn: () => getContactDeals(contactId!),
    enabled: enabled && Boolean(contactId),
  });
}
