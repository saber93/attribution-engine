import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { activities, type ActivityType } from "@/data/mock-data";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const filters: { label: string; value: ActivityType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Calls', value: 'call' },
  { label: 'Emails', value: 'email' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Meetings', value: 'meeting' },
  { label: 'Notes', value: 'note' },
  { label: 'System', value: 'system' },
];

export default function ActivitiesPage() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filtered = filter === 'all' ? activities : activities.filter(a => a.type === filter);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Activities" description="Unified activity log across all CRM entities" action={
          <Button size="sm">Log Activity</Button>
        } />

        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <Button key={f.value} variant={filter === f.value ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f.value)} className="text-xs">
              {f.label}
              <Badge variant="secondary" className="ml-1.5 text-[10px]">
                {f.value === 'all' ? activities.length : activities.filter(a => a.type === f.value).length}
              </Badge>
            </Button>
          ))}
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <ActivityTimeline activities={filtered} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
