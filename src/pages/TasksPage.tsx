import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { tasks, type TaskType, type TaskPriority } from "@/data/mock-data";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckSquare, Phone, Mail, MessageCircle, Users, FileText, Clock, AlertTriangle } from "lucide-react";

const typeIcons: Record<TaskType, React.ComponentType<{ className?: string }>> = {
  call: Phone, 'follow-up': Clock, meeting: Users, email: Mail, whatsapp: MessageCircle, review: FileText,
};

export default function TasksPage() {
  const [view, setView] = useState<'list' | 'board'>('list');

  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date());
  const todayTasks = tasks.filter(t => !t.completed && t.dueDate === '2026-03-31');
  const upcomingTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) > new Date());
  const completedTasks = tasks.filter(t => t.completed);

  const renderTask = (task: typeof tasks[0]) => {
    const Icon = typeIcons[task.type];
    const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
    return (
      <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
        <Checkbox checked={task.completed} className="mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <PriorityBadge priority={task.priority} />
            <span className="text-xs text-muted-foreground">{task.owner}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{task.relatedName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isOverdue && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
          <span className={`text-xs font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            {task.dueDate}
          </span>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Tasks" description={`${tasks.filter(t => !t.completed).length} open • ${overdueTasks.length} overdue`} action={
          <Button size="sm"><CheckSquare className="h-3.5 w-3.5 mr-1.5" />Add Task</Button>
        } />

        <div className="space-y-4">
          {overdueTasks.length > 0 && (
            <Card className="rounded-2xl border-destructive/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />Overdue ({overdueTasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {overdueTasks.map(renderTask)}
              </CardContent>
            </Card>
          )}

          {todayTasks.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Due Today ({todayTasks.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {todayTasks.map(renderTask)}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Upcoming ({upcomingTasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {upcomingTasks.map(renderTask)}
            </CardContent>
          </Card>

          {completedTasks.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground">Completed ({completedTasks.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {completedTasks.map(renderTask)}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
