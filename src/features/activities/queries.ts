import { useQuery } from "@tanstack/react-query";
import { getActivities } from "./api";

export const activityQueryKeys = {
  all: ["activities"] as const,
  list: () => [...activityQueryKeys.all, "list"] as const,
};

export function useActivitiesQuery() {
  return useQuery({
    queryKey: activityQueryKeys.list(),
    queryFn: getActivities,
  });
}
