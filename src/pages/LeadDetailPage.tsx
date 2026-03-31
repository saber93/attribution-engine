import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { StateCard } from "@/components/dashboard/StateCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLeadActivitiesQuery,
  useLeadByIdQuery,
  useLeadRelatedDealQuery,
  useLeadTasksQuery,
} from "@/features/leads/queries";
import { TASK_STATUS_LABELS, TASK_TYPE_LABELS } from "@/features/tasks/types";
import { getInitials } from "@/lib/display";
import { formatDate, formatDateTime } from "@/lib/formatters";
import { isUuid } from "@/lib/route-params";
import { ArrowLeft, Mail, Phone, Building2, Tag, ExternalLink, AlertTriangle, Inbox, FileSearch } from "lucide-react";

function getScoreClasses(score: number | null) {
  if (score == null) return "bg-muted text-muted-foreground";
  if (score >= 80) return "bg-success/10 text-success";
  if (score >= 50) return "bg-warning/10 text-warning";
  return "bg-muted text-muted-foreground";
}

function LeadDetailShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/leads"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-xl font-bold">Lead Details</h1>
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const hasValidLeadId = Boolean(id && isUuid(id));
  const leadQuery = useLeadByIdQuery(id, hasValidLeadId);
  const lead = leadQuery.data ?? null;
  const shouldFetchRelated = hasValidLeadId && Boolean(lead);
  const activitiesQuery = useLeadActivitiesQuery(id, shouldFetchRelated);
  const tasksQuery = useLeadTasksQuery(id, shouldFetchRelated);
  const relatedDealQuery = useLeadRelatedDealQuery(id, shouldFetchRelated);

  if (!hasValidLeadId) {
    return (
      <LeadDetailShell>
        <StateCard
          icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
          title="Lead not found"
          description="The lead link is invalid or incomplete. Return to the Leads page and open a valid lead record."
          className="py-24"
        />
      </LeadDetailShell>
    );
  }

  if (leadQuery.isPending) {
    return (
      <LeadDetailShell>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-testid="lead-detail-loading-state">
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </LeadDetailShell>
    );
  }

  if (leadQuery.isError) {
    return (
      <LeadDetailShell>
        <StateCard
          icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
          title="Unable to load lead"
          description="We hit an error while fetching this lead from Supabase. Try refreshing and loading the record again."
          className="py-24"
        />
      </LeadDetailShell>
    );
  }

  if (!lead) {
    return (
      <LeadDetailShell>
        <StateCard
          icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          title="Lead not found"
          description="This lead ID is valid, but there is no matching lead record in the database."
          className="py-24"
        />
      </LeadDetailShell>
    );
  }

  const lastActivityAt = activitiesQuery.data?.[0]?.occurredAt ?? null;

  return (
    <LeadDetailShell>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                    {getInitials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold">{lead.name}</h2>
                      <StatusBadge status={lead.status} />
                      <PlatformBadge platform={lead.platform} />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{lead.email ?? "—"}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{lead.phone ?? "—"}</span>
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{lead.companyName ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getScoreClasses(lead.score)}`}>
                        Score: {lead.score ?? "—"}
                      </div>
                      <span className="text-xs text-muted-foreground">Owner: {lead.ownerLabel}</span>
                    </div>
                    {lead.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {lead.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px]"><Tag className="h-2.5 w-2.5 mr-1" />{tag}</Badge>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">Convert to Contact</Button>
                  <Button size="sm" variant="outline">Create Deal</Button>
                  <Button size="sm" variant="outline">Add Note</Button>
                  <Button size="sm" variant="outline">Schedule Task</Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="attribution">Attribution</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4">
                    {activitiesQuery.isPending ? (
                      <div className="space-y-3" data-testid="lead-activities-loading-state">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : activitiesQuery.isError ? (
                      <EmptyState
                        icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                        title="Unable to load activities"
                        description="We couldn't fetch this lead's activity timeline right now."
                        className="py-10"
                      />
                    ) : (activitiesQuery.data?.length ?? 0) > 0 ? (
                      <ActivityTimeline activities={activitiesQuery.data ?? []} />
                    ) : (
                      <EmptyState
                        title="No activities yet"
                        description="Lead activity will appear here as calls, emails, meetings, and system events are logged."
                        className="py-10"
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground py-8 text-center">No notes yet. Add your first note above.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4">
                    {tasksQuery.isPending ? (
                      <div className="space-y-3" data-testid="lead-tasks-loading-state">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : tasksQuery.isError ? (
                      <EmptyState
                        icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                        title="Unable to load tasks"
                        description="We couldn't fetch the tasks linked to this lead right now."
                        className="py-10"
                      />
                    ) : (tasksQuery.data?.length ?? 0) > 0 ? (
                      <div className="space-y-3">
                        {(tasksQuery.data ?? []).map((task) => (
                          <div key={task.id} className="rounded-xl border border-border p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-medium">{task.title}</p>
                                {task.description ? (
                                  <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                                ) : null}
                              </div>
                              <Badge variant="outline" className="shrink-0">{TASK_STATUS_LABELS[task.status]}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                              <span>Type: {TASK_TYPE_LABELS[task.type]}</span>
                              <span>Priority: {task.priority}</span>
                              <span>Assignee: {task.assigneeLabel}</span>
                              <span>Due: {formatDateTime(task.dueAt)}</span>
                              {task.completedAt ? <span>Completed: {formatDateTime(task.completedAt)}</span> : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No tasks assigned"
                        description="This lead does not have any linked tasks yet."
                        className="py-10"
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attribution" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4 space-y-3">
                    {[
                      { label: 'Source', value: lead.source },
                      { label: 'Campaign', value: lead.campaignName ?? "—" },
                      { label: 'Ad Group ID', value: lead.adGroupId ?? "—" },
                      { label: 'Ad ID', value: lead.adId ?? "—" },
                      { label: 'Landing Page', value: lead.landingPageUrl ?? "—" },
                      { label: 'UTM Source', value: lead.utmSource ?? "—" },
                      { label: 'UTM Medium', value: lead.utmMedium ?? "—" },
                      { label: 'UTM Campaign', value: lead.utmCampaign ?? "—" },
                      { label: 'UTM Content', value: lead.utmContent ?? "—" },
                      { label: 'UTM Term', value: lead.utmTerm ?? "—" },
                      { label: 'Click ID', value: lead.clickId ?? "—" },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-medium text-right max-w-[60%] break-all">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Related Deal</CardTitle></CardHeader>
              <CardContent>
                {relatedDealQuery.isPending ? (
                  <div className="space-y-3" data-testid="lead-related-deal-loading-state">
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : relatedDealQuery.isError ? (
                  <EmptyState
                    icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                    title="Unable to load related deal"
                    description="We couldn't fetch the newest deal tied to this lead right now."
                    className="py-10"
                  />
                ) : relatedDealQuery.data ? (
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{relatedDealQuery.data.title}</p>
                      <p className="text-xs text-muted-foreground">{relatedDealQuery.data.companyName ?? "—"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Created {formatDate(relatedDealQuery.data.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${relatedDealQuery.data.amount.toLocaleString()}</p>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <StatusBadge status={relatedDealQuery.data.stage} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No related deal"
                    description="There isn't a deal linked to this lead yet."
                    className="py-10"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Source Attribution</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={lead.platform} />
                  <span className="text-sm font-medium">{lead.campaignName ?? "Direct / Unknown Campaign"}</span>
                </div>
                {[
                  { label: 'Ad Group ID', value: lead.adGroupId ?? "—" },
                  { label: 'Ad Creative ID', value: lead.adId ?? "—" },
                  { label: 'Landing Page', value: lead.landingPageUrl ?? "—" },
                  { label: 'Click ID', value: lead.clickId ?? "—" },
                  { label: 'Created', value: formatDate(lead.createdAt) },
                  { label: 'Qualified', value: formatDate(lead.qualifiedAt) },
                  { label: 'Converted', value: formatDate(lead.convertedAt) },
                  { label: 'Disqualified', value: formatDate(lead.disqualifiedAt) },
                  { label: 'Last Activity', value: activitiesQuery.isSuccess ? formatDate(lastActivityAt) : activitiesQuery.isPending ? "Loading..." : "—" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-medium max-w-[150px] truncate">{item.value}</span>
                  </div>
                ))}
                {lead.landingPageUrl ? (
                  <a
                    href={lead.landingPageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Open landing page
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">UTM Parameters</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'utm_source', value: lead.utmSource ?? "—" },
                  { label: 'utm_medium', value: lead.utmMedium ?? "—" },
                  { label: 'utm_campaign', value: lead.utmCampaign ?? "—" },
                  { label: 'utm_content', value: lead.utmContent ?? "—" },
                  { label: 'utm_term', value: lead.utmTerm ?? "—" },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5">
                    <code className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{item.label}</code>
                    <span className="text-xs font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {lead.disqualificationReason ? (
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Disqualification</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lead.disqualificationReason}</p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
    </LeadDetailShell>
  );
}
