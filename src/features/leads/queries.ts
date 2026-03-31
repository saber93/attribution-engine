import { useQuery } from "@tanstack/react-query";
import {
  getLeadActivities,
  getLeadById,
  getLeadRelatedDeal,
  getLeads,
  getLeadTasks,
} from "./api";

export const leadQueryKeys = {
  all: ["leads"] as const,
  list: () => [...leadQueryKeys.all, "list"] as const,
  detail: (leadId?: string) => [...leadQueryKeys.all, "detail", leadId] as const,
  activities: (leadId?: string) => [...leadQueryKeys.all, "activities", leadId] as const,
  tasks: (leadId?: string) => [...leadQueryKeys.all, "tasks", leadId] as const,
  relatedDeal: (leadId?: string) => [...leadQueryKeys.all, "related-deal", leadId] as const,
};

export function useLeadsQuery() {
  return useQuery({
    queryKey: leadQueryKeys.list(),
    queryFn: getLeads,
  });
}

export function useLeadByIdQuery(leadId?: string, enabled = true) {
  return useQuery({
    queryKey: leadQueryKeys.detail(leadId),
    queryFn: () => getLeadById(leadId!),
    enabled: enabled && Boolean(leadId),
  });
}

export function useLeadActivitiesQuery(leadId?: string, enabled = true) {
  return useQuery({
    queryKey: leadQueryKeys.activities(leadId),
    queryFn: () => getLeadActivities(leadId!),
    enabled: enabled && Boolean(leadId),
  });
}

export function useLeadTasksQuery(leadId?: string, enabled = true) {
  return useQuery({
    queryKey: leadQueryKeys.tasks(leadId),
    queryFn: () => getLeadTasks(leadId!),
    enabled: enabled && Boolean(leadId),
  });
}

export function useLeadRelatedDealQuery(leadId?: string, enabled = true) {
  return useQuery({
    queryKey: leadQueryKeys.relatedDeal(leadId),
    queryFn: () => getLeadRelatedDeal(leadId!),
    enabled: enabled && Boolean(leadId),
  });
}
