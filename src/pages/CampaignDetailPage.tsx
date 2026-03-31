import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCampaignByIdQuery, useCampaignDealsQuery, useCampaignLeadsQuery } from "@/features/campaigns/queries";
import { getInitials } from "@/lib/display";
import {
  formatCompactCurrency,
  formatDate,
  formatDetailedCurrency,
  formatMultiplier,
  formatNumber,
  formatPercentFromRatio,
} from "@/lib/formatters";
import { isUuid } from "@/lib/route-params";
import {
  ArrowLeft,
  DollarSign,
  Eye,
  MousePointer,
  Users,
  BriefcaseBusiness,
  Inbox,
  AlertTriangle,
  FileSearch,
} from "lucide-react";

function CampaignDetailShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Campaign Details</h1>
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function CampaignDetailPage() {
  const { id } = useParams();
  const hasValidCampaignId = Boolean(id && isUuid(id));
  const campaignQuery = useCampaignByIdQuery(id, hasValidCampaignId);
  const campaign = campaignQuery.data ?? null;
  const shouldFetchRelated = hasValidCampaignId && Boolean(campaign);
  const leadsQuery = useCampaignLeadsQuery(id, shouldFetchRelated);
  const dealsQuery = useCampaignDealsQuery(id, shouldFetchRelated);

  if (!hasValidCampaignId) {
    return (
      <CampaignDetailShell>
        <StateCard
          icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
          title="Campaign not found"
          description="The campaign link is invalid or incomplete. Return to the Campaigns page and open a valid campaign record."
          className="py-24"
        />
      </CampaignDetailShell>
    );
  }

  if (campaignQuery.isPending) {
    return (
      <CampaignDetailShell>
        <div className="space-y-4" data-testid="campaign-detail-loading-state">
          <Card className="rounded-2xl">
            <CardContent className="p-5 space-y-4">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-80" />
              <Skeleton className="h-4 w-72" />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </CampaignDetailShell>
    );
  }

  if (campaignQuery.isError) {
    return (
      <CampaignDetailShell>
        <StateCard
          icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
          title="Unable to load campaign"
          description="We hit an error while fetching this campaign from Supabase. Try refreshing and loading the record again."
          className="py-24"
        />
      </CampaignDetailShell>
    );
  }

  if (!campaign) {
    return (
      <CampaignDetailShell>
        <StateCard
          icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          title="Campaign not found"
          description="This campaign ID is valid, but there is no matching campaign record in the database."
          className="py-24"
        />
      </CampaignDetailShell>
    );
  }

  const campaignLeads = leadsQuery.data ?? [];
  const campaignDeals = dealsQuery.data ?? [];

  return (
    <CampaignDetailShell>
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{campaign.name}</h2>
                <PlatformBadge platform={campaign.platform} />
                <StatusBadge status={campaign.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {campaign.objective ?? "No objective set"} • {formatDate(campaign.startDate)} to {formatDate(campaign.endDate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <KpiCard title="Spend" value={formatCompactCurrency(campaign.spendAmount, campaign.currency)} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard title="Impressions" value={formatNumber(campaign.impressions)} icon={<Eye className="h-4 w-4" />} />
        <KpiCard title="Clicks" value={formatNumber(campaign.clicks)} icon={<MousePointer className="h-4 w-4" />} />
        <KpiCard title="Linked Leads" value={campaign.linkedLeads.toString()} icon={<Users className="h-4 w-4" />} />
        <KpiCard title="Qualified Leads" value={campaign.qualifiedLeads.toString()} icon={<Users className="h-4 w-4" />} />
        <KpiCard title="Linked Deals" value={campaign.linkedDeals.toString()} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <KpiCard title="Won Deals" value={campaign.wonDeals.toString()} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <KpiCard title="Won Revenue" value={formatCompactCurrency(campaign.wonRevenue, campaign.currency)} icon={<DollarSign className="h-4 w-4" />} gradient />
        <KpiCard title="Open Pipeline" value={formatCompactCurrency(campaign.openPipeline, campaign.currency)} icon={<DollarSign className="h-4 w-4" />} gradient />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads ({campaignLeads.length})</TabsTrigger>
          <TabsTrigger value="deals">Deals ({campaignDeals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Campaign Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Objective", value: campaign.objective ?? "—" },
                  { label: "Status", value: campaign.status[0].toUpperCase() + campaign.status.slice(1) },
                  { label: "Currency", value: campaign.currency },
                  { label: "Start Date", value: formatDate(campaign.startDate) },
                  { label: "End Date", value: formatDate(campaign.endDate) },
                  { label: "Daily Budget", value: formatDetailedCurrency(campaign.dailyBudget, campaign.currency) },
                  { label: "Total Budget", value: formatDetailedCurrency(campaign.totalBudget, campaign.currency) },
                  { label: "Spend", value: formatDetailedCurrency(campaign.spendAmount, campaign.currency) },
                  { label: "Impressions", value: formatNumber(campaign.impressions) },
                  { label: "Clicks", value: formatNumber(campaign.clicks) },
                  { label: "CTR", value: formatPercentFromRatio(campaign.ctr) },
                  { label: "CPC", value: formatDetailedCurrency(campaign.cpc, campaign.currency) },
                  { label: "ROAS", value: formatMultiplier(campaign.roas) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-1.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">CRM Outcomes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Linked Leads", value: campaign.linkedLeads.toString() },
                  { label: "Qualified Leads", value: campaign.qualifiedLeads.toString() },
                  { label: "Linked Deals", value: campaign.linkedDeals.toString() },
                  { label: "Won Deals", value: campaign.wonDeals.toString() },
                  { label: "Won Revenue", value: formatDetailedCurrency(campaign.wonRevenue, campaign.currency) },
                  { label: "Open Pipeline", value: formatDetailedCurrency(campaign.openPipeline, campaign.currency) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 py-1.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-right">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              {leadsQuery.isPending ? (
                <div className="space-y-3" data-testid="campaign-leads-loading-state">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : leadsQuery.isError ? (
                <EmptyState
                  icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                  title="Unable to load campaign leads"
                  description="We couldn't fetch the linked leads for this campaign right now."
                  className="py-10"
                />
              ) : campaignLeads.length === 0 ? (
                <EmptyState
                  title="No leads from this campaign yet."
                  description="Linked leads will show up here as this campaign starts generating pipeline."
                  className="py-10"
                />
              ) : (
                <div className="space-y-2">
                  {campaignLeads.map((lead) => (
                    <Link
                      to={`/leads/${lead.id}`}
                      key={lead.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {lead.companyName ?? "—"} • Score: {lead.score ?? "—"} • {formatDate(lead.createdAt)}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={lead.status} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="mt-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              {dealsQuery.isPending ? (
                <div className="space-y-3" data-testid="campaign-deals-loading-state">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : dealsQuery.isError ? (
                <EmptyState
                  icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                  title="Unable to load campaign deals"
                  description="We couldn't fetch the linked deals for this campaign right now."
                  className="py-10"
                />
              ) : campaignDeals.length === 0 ? (
                <EmptyState
                  title="No deals from this campaign yet."
                  description="Linked opportunities will show up here once this campaign starts creating revenue pipeline."
                  className="py-10"
                />
              ) : (
                <div className="space-y-2">
                  {campaignDeals.map((deal) => (
                    <Link
                      to={`/deals/${deal.id}`}
                      key={deal.id}
                      className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{deal.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {deal.companyName ?? "—"} • {deal.primaryContactName ?? "No contact"} • {formatDate(deal.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-semibold">{formatCompactCurrency(deal.amount, deal.currency)}</span>
                        <Badge variant="secondary" className="px-0 py-0 bg-transparent">
                          <StatusBadge status={deal.stage} />
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </CampaignDetailShell>
  );
}
