import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCampaignRevenueReportQuery } from "@/features/reports/queries";
import { isSupportedReportId } from "@/features/reports/types";
import {
  formatCompactCount,
  formatCompactCurrency,
  formatDetailedCurrency,
  formatMultiplier,
  formatNumber,
  formatPercentFromRatio,
} from "@/lib/formatters";
import { AlertTriangle, ArrowLeft, DollarSign, FileSearch, Inbox, Megaphone, Users, BriefcaseBusiness } from "lucide-react";

function ReportDetailShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const isCampaignRevenueReport = isSupportedReportId(reportId);
  const reportQuery = useCampaignRevenueReportQuery(isCampaignRevenueReport);
  const report = reportQuery.data;

  if (!isCampaignRevenueReport) {
    return (
      <ReportDetailShell>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <SectionHeader title="Report Details" description="Open a supported live report from the Reports catalog." />
        </div>

        <StateCard
          icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
          title="Report not found"
          description="This report slug is not supported yet. Return to the Reports page and open a live report."
          className="py-24"
        />
      </ReportDetailShell>
    );
  }

  if (reportQuery.isPending) {
    return (
      <ReportDetailShell>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <SectionHeader title="Campaign to Revenue" description="Loading live campaign-to-revenue performance." />
        </div>

        <div className="space-y-4" data-testid="campaign-revenue-report-loading-state">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Card className="rounded-2xl">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </ReportDetailShell>
    );
  }

  if (reportQuery.isError) {
    return (
      <ReportDetailShell>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <SectionHeader title="Campaign to Revenue" description="Trustworthy campaign performance from spend through closed-won revenue." />
        </div>

        <StateCard
          icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
          title="Unable to load report"
          description="We couldn't fetch the live campaign revenue report from Supabase. Try refreshing the page again."
          className="py-24"
        />
      </ReportDetailShell>
    );
  }

  if (!report || report.rows.length === 0) {
    return (
      <ReportDetailShell>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <SectionHeader title="Campaign to Revenue" description="Trustworthy campaign performance from spend through closed-won revenue." />
        </div>

        <StateCard
          icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          title="No campaign revenue data yet"
          description="This report needs live campaign rows before there is anything meaningful to render."
          className="py-24"
        />
      </ReportDetailShell>
    );
  }

  return (
    <ReportDetailShell>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/reports">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <SectionHeader title={report.title} description={report.description} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <KpiCard title="Total Spend" value={formatCompactCurrency(report.totals.totalSpend, report.totals.currency)} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard title="Total Linked Leads" value={formatCompactCount(report.totals.totalLinkedLeads)} icon={<Users className="h-4 w-4" />} />
        <KpiCard title="Total Qualified Leads" value={formatCompactCount(report.totals.totalQualifiedLeads)} icon={<Users className="h-4 w-4" />} />
        <KpiCard title="Total Linked Deals" value={formatCompactCount(report.totals.totalLinkedDeals)} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <KpiCard title="Total Won Deals" value={formatCompactCount(report.totals.totalWonDeals)} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <KpiCard title="Total Won Revenue" value={formatCompactCurrency(report.totals.totalWonRevenue, report.totals.currency)} icon={<DollarSign className="h-4 w-4" />} gradient />
        <KpiCard title="Total Open Pipeline" value={formatCompactCurrency(report.totals.totalOpenPipeline, report.totals.currency)} icon={<DollarSign className="h-4 w-4" />} gradient />
        <KpiCard title="Blended ROAS" value={formatMultiplier(report.totals.blendedRoas)} icon={<Megaphone className="h-4 w-4" />} />
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[220px]">Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>CPC</TableHead>
                  <TableHead>Linked Leads</TableHead>
                  <TableHead>Qualified Leads</TableHead>
                  <TableHead>Linked Deals</TableHead>
                  <TableHead>Won Deals</TableHead>
                  <TableHead>Won Revenue</TableHead>
                  <TableHead>Open Pipeline</TableHead>
                  <TableHead>ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell><PlatformBadge platform={row.platform} /></TableCell>
                    <TableCell><StatusBadge status={row.status} /></TableCell>
                    <TableCell className="font-medium">{formatCompactCurrency(row.spend, row.currency)}</TableCell>
                    <TableCell>{formatNumber(row.impressions)}</TableCell>
                    <TableCell>{formatNumber(row.clicks)}</TableCell>
                    <TableCell>{formatPercentFromRatio(row.ctr)}</TableCell>
                    <TableCell>{formatDetailedCurrency(row.cpc, row.currency)}</TableCell>
                    <TableCell>{formatCompactCount(row.linkedLeads)}</TableCell>
                    <TableCell>{formatCompactCount(row.qualifiedLeads)}</TableCell>
                    <TableCell>{formatCompactCount(row.linkedDeals)}</TableCell>
                    <TableCell>{formatCompactCount(row.wonDeals)}</TableCell>
                    <TableCell className="font-medium text-success">{formatCompactCurrency(row.wonRevenue, row.currency)}</TableCell>
                    <TableCell>{formatCompactCurrency(row.openPipeline, row.currency)}</TableCell>
                    <TableCell className="font-bold">{formatMultiplier(row.roas)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </ReportDetailShell>
  );
}
