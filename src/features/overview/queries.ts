import { useQuery } from "@tanstack/react-query";
import { getOverview } from "./api";

export const overviewQueryKeys = {
  all: ["overview"] as const,
  summary: () => [...overviewQueryKeys.all, "summary"] as const,
};

export function useOverviewQuery() {
  return useQuery({
    queryKey: overviewQueryKeys.summary(),
    queryFn: getOverview,
  });
}
