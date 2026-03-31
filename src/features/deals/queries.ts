import { useQuery } from "@tanstack/react-query";
import { getDealActivities, getDealById, getDeals } from "./api";

export const dealQueryKeys = {
  all: ["deals"] as const,
  list: () => [...dealQueryKeys.all, "list"] as const,
  detail: (dealId?: string) => [...dealQueryKeys.all, "detail", dealId] as const,
  activities: (dealId?: string) => [...dealQueryKeys.all, "activities", dealId] as const,
};

export function useDealsQuery() {
  return useQuery({
    queryKey: dealQueryKeys.list(),
    queryFn: getDeals,
  });
}

export function useDealByIdQuery(dealId?: string, enabled = true) {
  return useQuery({
    queryKey: dealQueryKeys.detail(dealId),
    queryFn: () => getDealById(dealId!),
    enabled: enabled && Boolean(dealId),
  });
}

export function useDealActivitiesQuery(dealId?: string, enabled = true) {
  return useQuery({
    queryKey: dealQueryKeys.activities(dealId),
    queryFn: () => getDealActivities(dealId!),
    enabled: enabled && Boolean(dealId),
  });
}
