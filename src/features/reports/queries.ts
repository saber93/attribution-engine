import { useQuery } from "@tanstack/react-query";
import { getCampaignRevenueReport, getReportsCatalog } from "./api";

export const reportsQueryKeys = {
  all: ["reports"] as const,
  catalog: () => [...reportsQueryKeys.all, "catalog"] as const,
  detail: (reportId?: string) => [...reportsQueryKeys.all, "detail", reportId] as const,
};

export function useReportsCatalogQuery() {
  return useQuery({
    queryKey: reportsQueryKeys.catalog(),
    queryFn: getReportsCatalog,
  });
}

export function useCampaignRevenueReportQuery(enabled = true) {
  return useQuery({
    queryKey: reportsQueryKeys.detail("campaign-revenue"),
    queryFn: getCampaignRevenueReport,
    enabled,
  });
}
