import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivitiesQuery } from "@/features/activities/queries";
import type { ActivityType } from "@/features/activities/types";
import { AlertTriangle, Inbox, SearchX } from "lucide-react";

const filters: { label: string; value: ActivityType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Calls", value: "call" },
  { label: "Emails", value: "email" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Meetings", value: "meeting" },
  { label: "Notes", value: "note" },
  { label: "System", value: "system" },
];

export default function ActivitiesPage() {
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const activitiesQuery = useActivitiesQuery();
  const activities = activitiesQuery.data ?? [];

  const filteredActivities =
    filter === "all" ? activities : activities.filter((activity) => activity.type === filter);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Activities" description="Unified activity log across live lead and deal records" />

        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <Button
              key={filterOption.value}
              variant={filter === filterOption.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(filterOption.value)}
              className="text-xs"
            >
              {filterOption.label}
              <Badge variant="secondary" className="ml-1.5 text-[10px]">
                {filterOption.value === "all"
                  ? activities.length
                  : activities.filter((activity) => activity.type === filterOption.value).length}
              </Badge>
            </Button>
          ))}
        </div>

        {activitiesQuery.isPending ? (
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="space-y-4" data-testid="activities-loading-state">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : activitiesQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load activities"
            description="We couldn't fetch the live activity log from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : activities.length === 0 ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No activities yet"
            description="Seed the development database or log your first lead or deal activity to populate this timeline."
            className="py-24"
          />
        ) : filteredActivities.length === 0 ? (
          <StateCard
            icon={<SearchX className="h-8 w-8 text-muted-foreground" />}
            title="No matching activities"
            description="There are no live activities for the selected type yet."
            className="py-24"
          />
        ) : (
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <ActivityTimeline activities={filteredActivities} />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
