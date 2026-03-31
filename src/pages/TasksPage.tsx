import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasksQuery } from "@/features/tasks/queries";
import {
  TASK_BUCKET_LABELS,
  TASK_BUCKET_ORDER,
  TASK_STATUS_LABELS,
  type TaskBucket,
  type TaskListItem,
  type TaskStatus,
  type TaskType,
} from "@/features/tasks/types";
import { formatDateTime } from "@/lib/formatters";
import {
  CheckSquare,
  Phone,
  Mail,
  MessageCircle,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  Inbox,
} from "lucide-react";

const typeIcons: Record<TaskType, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  follow_up: Clock,
  meeting: Users,
  email: Mail,
  whatsapp: MessageCircle,
  review: FileText,
  other: CheckSquare,
};

function formatDueAt(value: string | null) {
  return formatDateTime(value, "No due date");
}

function getBucketTitleClasses(bucket: TaskBucket) {
  if (bucket === "overdue") return "text-destructive";
  if (bucket === "completed" || bucket === "canceled") return "text-muted-foreground";
  return "";
}

function getStatusBadgeClasses(status: TaskStatus) {
  switch (status) {
    case "in_progress":
      return "bg-warning/10 text-warning";
    case "completed":
      return "bg-success/10 text-success";
    case "canceled":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-info/10 text-info";
  }
}

function renderRelatedLabel(task: TaskListItem) {
  if (!task.relatedHref) {
    return <span className="text-xs text-muted-foreground">{task.relatedLabel}</span>;
  }

  return (
    <Link to={task.relatedHref} className="text-xs text-muted-foreground hover:text-primary transition-colors">
      {task.relatedLabel}
    </Link>
  );
}

function TaskRow({ task }: { task: TaskListItem }) {
  const Icon = typeIcons[task.type];
  const isCompleted = task.status === "completed";
  const isCanceled = task.status === "canceled";

  return (
    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
      <Checkbox checked={isCompleted} disabled className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <p
            className={`text-sm font-medium ${
              isCompleted ? "line-through text-muted-foreground" : isCanceled ? "text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </p>
        </div>
        {task.description ? (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <PriorityBadge priority={task.priority} />
          <Badge variant="secondary" className={getStatusBadgeClasses(task.status)}>
            {TASK_STATUS_LABELS[task.status]}
          </Badge>
          <span className="text-xs text-muted-foreground">{task.assigneeLabel}</span>
          <span className="text-xs text-muted-foreground">•</span>
          {renderRelatedLabel(task)}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {task.isOverdue ? <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> : null}
        <span className={`text-xs font-medium ${task.isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
          {formatDueAt(task.dueAt)}
        </span>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const tasksQuery = useTasksQuery();
  const tasks = tasksQuery.data ?? [];
  const groupedTasks = TASK_BUCKET_ORDER.reduce<Record<TaskBucket, TaskListItem[]>>(
    (groups, bucket) => ({ ...groups, [bucket]: tasks.filter((task) => task.bucket === bucket) }),
    {
      overdue: [],
      due_today: [],
      upcoming: [],
      completed: [],
      canceled: [],
    },
  );

  const openCount = tasks.filter((task) => task.status === "pending" || task.status === "in_progress").length;
  const overdueCount = groupedTasks.overdue.length;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader
          title="Tasks"
          description={`${openCount} open • ${overdueCount} overdue`}
          action={
            <Button size="sm">
              <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
              Add Task
            </Button>
          }
        />

        {tasksQuery.isPending ? (
          <div className="space-y-3" data-testid="tasks-loading-state">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="rounded-2xl">
                <CardContent className="p-4 grid grid-cols-1 gap-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tasksQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load tasks"
            description="We couldn't fetch live task data from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : tasks.length === 0 ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No tasks yet"
            description="Seed the development database or create your first lead or deal task to populate this workspace."
            className="py-24"
          />
        ) : (
          <div className="space-y-4">
            {TASK_BUCKET_ORDER.filter((bucket) => groupedTasks[bucket].length > 0).map((bucket) => (
              <Card
                key={bucket}
                className={`rounded-2xl ${bucket === "overdue" ? "border-destructive/20" : ""}`}
                data-testid={`tasks-bucket-${bucket}`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm font-semibold flex items-center gap-2 ${getBucketTitleClasses(bucket)}`}>
                    {bucket === "overdue" ? <AlertTriangle className="h-4 w-4" /> : null}
                    {TASK_BUCKET_LABELS[bucket]} ({groupedTasks[bucket].length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {groupedTasks[bucket].map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
