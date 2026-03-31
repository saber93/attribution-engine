import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useReportsCatalogQuery } from "@/features/reports/queries";
import type { ReportCatalogCard, ReportMetric } from "@/features/reports/types";
import {
  formatCompactCount,
  formatCompactCurrency,
  formatMultiplier,
  formatPercentFromRatio,
} from "@/lib/formatters";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  FileSearch,
  GitCompare,
  Inbox,
  TrendingUp,
  Users,
} from "lucide-react";

const cardMeta: Record<ReportCatalogCard["id"], { icon: ComponentType<{ className?: string }>; color: string }> = {
  "campaign-revenue": { icon: TrendingUp, color: "text-success" },
  "platform-performance": { icon: BarChart3, color: "text-primary" },
  "lead-source-analysis": { icon: Users, color: "text-info" },
  "sales-funnel": { icon: GitCompare, color: "text-warning" },
};

function formatMetric(metric: ReportMetric) {
  if (metric.format === "currency") {
    return formatCompactCurrency(typeof metric.value === "number" ? metric.value : 0);
  }

  if (metric.format === "count") {
    return formatCompactCount(typeof metric.value === "number" ? metric.value : 0);
  }

  if (metric.format === "percent") {
    return formatPercentFromRatio(typeof metric.value === "number" ? metric.value : null);
  }

  if (metric.format === "multiplier") {
    return formatMultiplier(typeof metric.value === "number" ? metric.value : null);
  }

  return typeof metric.value === "string" ? metric.value : "—";
}

function ReportCard({ card }: { card: ReportCatalogCard }) {
  const meta = cardMeta[card.id];
  const Icon = meta.icon;
  const content = (
    <Card
      className={`rounded-2xl h-full transition-all duration-200 ${card.href ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""}`}
      data-testid={`report-card-${card.id}`}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`rounded-xl bg-muted p-2.5 ${meta.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </div>
          </div>
          {card.href ? <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" /> : null}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {card.metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <span className="text-sm font-medium text-right">{formatMetric(metric)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!card.href) {
    return content;
  }

  return <Link to={card.href}>{content}</Link>;
}

export default function ReportsPage() {
  const reportsQuery = useReportsCatalogQuery();
  const reports = reportsQuery.data?.cards ?? [];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Reports" description="Trustworthy reporting built from live CRM and campaign data." />

        {reportsQuery.isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="reports-loading-state">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reportsQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load reports"
            description="We couldn't fetch the live reporting catalog from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : !reportsQuery.data?.hasData ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No reports data yet"
            description="Reports will appear once campaigns, leads, or deals exist in the live workspace."
            className="py-24"
          />
        ) : reports.length === 0 ? (
          <StateCard
            icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
            title="No reports available"
            description="There are no live reports configured for this workspace yet."
            className="py-24"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reports.map((card) => (
              <ReportCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
