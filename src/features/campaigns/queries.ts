import { useQuery } from "@tanstack/react-query";
import { getCampaignById, getCampaignDeals, getCampaignLeads, getCampaigns } from "./api";

export const campaignQueryKeys = {
  all: ["campaigns"] as const,
  list: () => [...campaignQueryKeys.all, "list"] as const,
  detail: (campaignId?: string) => [...campaignQueryKeys.all, "detail", campaignId] as const,
  leads: (campaignId?: string) => [...campaignQueryKeys.all, "leads", campaignId] as const,
  deals: (campaignId?: string) => [...campaignQueryKeys.all, "deals", campaignId] as const,
};

export function useCampaignsQuery() {
  return useQuery({
    queryKey: campaignQueryKeys.list(),
    queryFn: getCampaigns,
  });
}

export function useCampaignByIdQuery(campaignId?: string, enabled = true) {
  return useQuery({
    queryKey: campaignQueryKeys.detail(campaignId),
    queryFn: () => getCampaignById(campaignId!),
    enabled: enabled && Boolean(campaignId),
  });
}

export function useCampaignLeadsQuery(campaignId?: string, enabled = true) {
  return useQuery({
    queryKey: campaignQueryKeys.leads(campaignId),
    queryFn: () => getCampaignLeads(campaignId!),
    enabled: enabled && Boolean(campaignId),
  });
}

export function useCampaignDealsQuery(campaignId?: string, enabled = true) {
  return useQuery({
    queryKey: campaignQueryKeys.deals(campaignId),
    queryFn: () => getCampaignDeals(campaignId!),
    enabled: enabled && Boolean(campaignId),
  });
}
