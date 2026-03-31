import { Link } from "react-router-dom";
import { Phone, Mail, MessageCircle, Users, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const activityIcons = {
  call: Phone,
  email: Mail,
  whatsapp: MessageCircle,
  meeting: Users,
  note: FileText,
  system: Zap,
};

const activityColors = {
  call: 'bg-success/10 text-success',
  email: 'bg-primary/10 text-primary',
  whatsapp: 'bg-success/10 text-success',
  meeting: 'bg-warning/10 text-warning',
  note: 'bg-muted text-muted-foreground',
  system: 'bg-info/10 text-info',
};

export type ActivityTimelineItem = {
  id: string;
  type: keyof typeof activityIcons;
  title: string;
  description?: string | null;
  owner?: string;
  actorLabel?: string;
  timestamp?: string;
  occurredAt?: string;
  duration?: number | null;
  durationMinutes?: number | null;
  relatedLabel?: string | null;
  relatedHref?: string | null;
};

interface ActivityTimelineProps {
  activities: ActivityTimelineItem[];
  className?: string;
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const timestamp = activity.occurredAt ?? activity.timestamp;
        const actorLabel = activity.actorLabel ?? activity.owner ?? "Unassigned";
        const durationMinutes = activity.durationMinutes ?? activity.duration;

        return (
          <div key={activity.id} className="flex gap-3 pb-6 relative">
            {index < activities.length - 1 && (
              <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-border" />
            )}
            <div className={cn("rounded-full p-1.5 shrink-0 z-10", activityColors[activity.type])}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {timestamp ? format(parseISO(timestamp), 'MMM d, h:mm a') : "—"}
                </span>
              </div>
              {activity.description ? (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{activity.description}</p>
              ) : null}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{actorLabel}</span>
                {activity.relatedLabel ? (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    {activity.relatedHref ? (
                      <Link
                        to={activity.relatedHref}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors truncate"
                      >
                        {activity.relatedLabel}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground truncate">{activity.relatedLabel}</span>
                    )}
                  </>
                ) : null}
                {durationMinutes ? (
                  <span className="text-xs text-muted-foreground">• {durationMinutes}min</span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
