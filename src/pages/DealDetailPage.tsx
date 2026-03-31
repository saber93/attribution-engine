import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { StateCard } from "@/components/dashboard/StateCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDealActivitiesQuery, useDealByIdQuery } from "@/features/deals/queries";
import { formatDate, formatDateTime } from "@/lib/formatters";
import { isUuid } from "@/lib/route-params";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  Megaphone,
  AlertTriangle,
  FileSearch,
  Inbox,
  Link as LinkIcon,
} from "lucide-react";

function DealDetailShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/deals"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-xl font-bold">Deal Details</h1>
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function DealDetailPage() {
  const { id } = useParams();
  const hasValidDealId = Boolean(id && isUuid(id));
  const dealQuery = useDealByIdQuery(id, hasValidDealId);
  const deal = dealQuery.data ?? null;
  const shouldFetchActivities = hasValidDealId && Boolean(deal);
  const activitiesQuery = useDealActivitiesQuery(id, shouldFetchActivities);

  if (!hasValidDealId) {
    return (
      <DealDetailShell>
        <StateCard
          icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
          title="Deal not found"
          description="The deal link is invalid or incomplete. Return to the Deals page and open a valid deal record."
          className="py-24"
        />
      </DealDetailShell>
    );
  }

  if (dealQuery.isPending) {
    return (
      <DealDetailShell>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" data-testid="deal-detail-loading-state">
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-4 w-80" />
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-40" />
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
      </DealDetailShell>
    );
  }

  if (dealQuery.isError) {
    return (
      <DealDetailShell>
        <StateCard
          icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
          title="Unable to load deal"
          description="We hit an error while fetching this deal from Supabase. Try refreshing and loading the record again."
          className="py-24"
        />
      </DealDetailShell>
    );
  }

  if (!deal) {
    return (
      <DealDetailShell>
        <StateCard
          icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          title="Deal not found"
          description="This deal ID is valid, but there is no matching deal record in the database."
          className="py-24"
        />
      </DealDetailShell>
    );
  }

  const lastActivityAt = activitiesQuery.data?.[0]?.occurredAt ?? null;

  return (
    <DealDetailShell>
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{deal.title}</h2>
                <StatusBadge status={deal.stage} />
                <PlatformBadge platform={deal.platform} />
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{deal.companyName}</span>
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{deal.primaryContactName ?? "No primary contact"}</span>
                <span className="flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5" />Source lead: {deal.sourceLeadName ?? "—"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Close: {formatDate(deal.expectedCloseDate)}</span>
                <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />Owner: {deal.ownerLabel}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${deal.amount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {deal.probability != null ? `${deal.probability}% probability` : "No probability set"}
              </p>
              <div className="w-32 mt-2">
                <Progress value={deal.probability ?? 0} className="h-1.5" />
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {deal.stage !== "won" && deal.stage !== "lost" ? (
              <>
                <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">Mark as Won</Button>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/30">Mark as Lost</Button>
              </>
            ) : null}
            <Button size="sm" variant="outline">Add Note</Button>
            <Button size="sm" variant="outline">Schedule Task</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Activity Timeline</CardTitle></CardHeader>
            <CardContent>
              {activitiesQuery.isPending ? (
                <div className="space-y-3" data-testid="deal-activities-loading-state">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : activitiesQuery.isError ? (
                <EmptyState
                  icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                  title="Unable to load activities"
                  description="We couldn't fetch this deal's activity timeline right now."
                  className="py-10"
                />
              ) : (activitiesQuery.data?.length ?? 0) > 0 ? (
                <ActivityTimeline activities={activitiesQuery.data ?? []} />
              ) : (
                <EmptyState
                  title="No activity yet"
                  description="Deal activity will appear here as meetings, emails, and notes are logged."
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
                <Megaphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{deal.campaignName ?? "Direct / Unknown Campaign"}</span>
              </div>
              <div className="flex items-center gap-2">
                <PlatformBadge platform={deal.platform} />
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Contact</span>
                <span className="text-xs font-medium">{deal.primaryContactName ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Company</span>
                <span className="text-xs font-medium">{deal.companyName}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Source Lead</span>
                <span className="text-xs font-medium">{deal.sourceLeadName ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Source</span>
                <span className="text-xs font-medium">{deal.source ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Ad Group ID</span>
                <span className="text-xs font-medium max-w-[150px] truncate">{deal.adGroupId ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Ad ID</span>
                <span className="text-xs font-medium max-w-[150px] truncate">{deal.adId ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Landing Page</span>
                <span className="text-xs font-medium max-w-[150px] truncate">{deal.landingPageUrl ?? "—"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-muted-foreground">Click ID</span>
                <span className="text-xs font-medium max-w-[150px] truncate">{deal.clickId ?? "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Deal Info</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Created", value: formatDateTime(deal.createdAt) },
                { label: "Stage Changed", value: formatDateTime(deal.stageChangedAt) },
                { label: "Expected Close", value: formatDate(deal.expectedCloseDate) },
                { label: "Closed", value: formatDateTime(deal.closedAt) },
                { label: "Won At", value: formatDateTime(deal.wonAt) },
                { label: "Lost At", value: formatDateTime(deal.lostAt) },
                { label: "Probability", value: deal.probability != null ? `${deal.probability}%` : "—" },
                {
                  label: "Last Activity",
                  value: activitiesQuery.isSuccess ? formatDate(lastActivityAt) : activitiesQuery.isPending ? "Loading..." : "—",
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">UTM Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "utm_source", value: deal.utmSource ?? "—" },
                { label: "utm_medium", value: deal.utmMedium ?? "—" },
                { label: "utm_campaign", value: deal.utmCampaign ?? "—" },
                { label: "utm_content", value: deal.utmContent ?? "—" },
                { label: "utm_term", value: deal.utmTerm ?? "—" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-1.5">
                  <code className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{item.label}</code>
                  <span className="text-xs font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {deal.lostReason ? (
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Loss Reason</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{deal.lostReason}</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </DealDetailShell>
  );
}
