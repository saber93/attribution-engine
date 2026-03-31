import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./api";

export const taskQueryKeys = {
  all: ["tasks"] as const,
  list: () => [...taskQueryKeys.all, "list"] as const,
};

export function useTasksQuery() {
  return useQuery({
    queryKey: taskQueryKeys.list(),
    queryFn: getTasks,
  });
}
