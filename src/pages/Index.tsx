import { Link } from "react-router-dom";
import { AlertTriangle, Handshake, Inbox, Target, TrendingUp, UserCheck, UserPlus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverviewQuery } from "@/features/overview/queries";
import type { OverviewPageData } from "@/features/overview/types";
import { getInitials } from "@/lib/display";
import { formatCompactCount, formatCompactCurrency, formatDate } from "@/lib/formatters";

function getPipelineWidth(value: number, maxValue: number) {
  if (value <= 0 || maxValue <= 0) return "0%";
  return `${Math.max(12, (value / maxValue) * 100)}%`;
}

function isOverviewEmpty(data: OverviewPageData) {
  const hasPipelineData = data.pipelineByStage.some((item) => item.count > 0);
  const hasBreakdownData = data.platformBreakdown.length > 0 || data.sourceBreakdown.length > 0;

  return (
    data.kpis.totalLeads === 0 &&
    data.kpis.qualifiedLeads === 0 &&
    data.kpis.wonDeals === 0 &&
    data.kpis.wonRevenue === 0 &&
    data.kpis.openPipeline === 0 &&
    data.kpis.tasksRequiringAttention === 0 &&
    !hasPipelineData &&
    !hasBreakdownData &&
    data.recentLeads.length === 0 &&
    data.attentionTasks.length === 0
  );
}

function OverviewLoadingState() {
  return (
    <div className="space-y-4" data-testid="overview-loading-state">
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-2xl border bg-card p-5 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-2xl">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const overviewQuery = useOverviewQuery();
  const overview = overviewQuery.data;
  const maxPipelineValue = Math.max(...(overview?.pipelineByStage.map((item) => item.amount) ?? [0]));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader
          title="Overview"
          description="A live snapshot of leads, deals, and attention tasks across the CRM."
        />

        {overviewQuery.isPending ? (
          <OverviewLoadingState />
        ) : overviewQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load overview"
            description="We couldn't fetch the live overview summary from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : !overview || isOverviewEmpty(overview) ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No overview data yet"
            description="Seed the development database or start creating leads and deals to populate the dashboard."
            className="py-24"
          />
        ) : (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
              <KpiCard
                title="Total Leads"
                value={formatCompactCount(overview.kpis.totalLeads)}
                icon={<UserPlus className="h-4 w-4" />}
              />
              <KpiCard
                title="Qualified Leads"
                value={formatCompactCount(overview.kpis.qualifiedLeads)}
                icon={<UserCheck className="h-4 w-4" />}
              />
              <KpiCard
                title="Won Deals"
                value={formatCompactCount(overview.kpis.wonDeals)}
                icon={<Handshake className="h-4 w-4" />}
              />
              <KpiCard
                title="Won Revenue"
                value={formatCompactCurrency(overview.kpis.wonRevenue)}
                icon={<TrendingUp className="h-4 w-4" />}
                gradient
              />
              <KpiCard
                title="Open Pipeline"
                value={formatCompactCurrency(overview.kpis.openPipeline)}
                icon={<Target className="h-4 w-4" />}
                gradient
              />
              <KpiCard
                title="Tasks Requiring Attention"
                value={formatCompactCount(overview.kpis.tasksRequiringAttention)}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Pipeline by Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  {overview.pipelineByStage.some((item) => item.count > 0) ? (
                    <div className="space-y-3">
                      {overview.pipelineByStage.map((item) => (
                        <div
                          key={item.stage}
                          className="space-y-1.5"
                          data-testid={`overview-pipeline-stage-${item.stage}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={item.stage} />
                              <span className="text-xs text-muted-foreground">{item.count} deals</span>
                            </div>
                            <span className="text-sm font-semibold">{formatCompactCurrency(item.amount)}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary/70"
                              style={{ width: getPipelineWidth(item.amount, maxPipelineValue) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No deals in the pipeline"
                      description="Won and open pipeline KPIs will start populating as opportunities are created."
                      className="py-12"
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Lead Attribution Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {overview.platformBreakdown.length > 0 || overview.sourceBreakdown.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          By Platform
                        </p>
                        {overview.platformBreakdown.map((item) => (
                          <div key={item.platform} className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <PlatformBadge platform={item.platform} />
                              <span className="text-sm font-medium">
                                {item.count} ({Math.round(item.share * 100)}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary/70"
                                style={{ width: `${item.share * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          By Source
                        </p>
                        {overview.sourceBreakdown.map((item) => (
                          <div key={item.source} className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">{item.label}</span>
                              <span className="text-sm text-muted-foreground">
                                {item.count} ({Math.round(item.share * 100)}%)
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-info/70"
                                style={{ width: `${item.share * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      title="No attribution data yet"
                      description="Platform and source breakdowns will appear once leads start flowing into the CRM."
                      className="py-12"
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Tasks Requiring Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  {overview.attentionTasks.length > 0 ? (
                    <div className="space-y-3">
                      {overview.attentionTasks.map((task) => (
                        <div key={task.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{task.title}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <PriorityBadge priority={task.priority} />
                              <span className="text-xs text-muted-foreground">{task.relatedLabel}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-semibold text-destructive">Overdue</p>
                            <p className="text-xs text-muted-foreground">{formatDate(task.dueAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No overdue tasks"
                      description="This section will surface open tasks whose due dates have already passed."
                      className="py-12"
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Recent Leads</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/leads">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {overview.recentLeads.length > 0 ? (
                    <div className="space-y-2">
                      {overview.recentLeads.map((lead) => (
                        <Link
                          to={`/leads/${lead.id}`}
                          key={lead.id}
                          className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {getInitials(lead.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{lead.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {lead.companyName ?? "Unknown company"}
                                {lead.campaignName ? ` • ${lead.campaignName}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <PlatformBadge platform={lead.platform} />
                            <StatusBadge status={lead.status} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No recent leads"
                      description="New lead captures will appear here as soon as they hit the CRM."
                      className="py-12"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
