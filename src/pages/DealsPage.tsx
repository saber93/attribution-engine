import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDealsQuery } from "@/features/deals/queries";
import { DEAL_STAGE_ORDER } from "@/features/deals/types";
import { formatCompactCurrency, formatDate } from "@/lib/formatters";
import { LayoutGrid, List, AlertTriangle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DealsPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const dealsQuery = useDealsQuery();
  const deals = dealsQuery.data ?? [];

  const totalPipeline = deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const wonTotal = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Deals Pipeline" description={`Pipeline: ${formatCompactCurrency(totalPipeline)} • Won: ${formatCompactCurrency(wonTotal)}`} action={
          <div className="flex gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <Button aria-label="Kanban view" variant={view === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => setView('kanban')} className="rounded-none"><LayoutGrid className="h-3.5 w-3.5" /></Button>
              <Button aria-label="Table view" variant={view === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setView('table')} className="rounded-none"><List className="h-3.5 w-3.5" /></Button>
            </div>
            <Button size="sm">+ New Deal</Button>
          </div>
        } />

        {dealsQuery.isPending ? (
          <div className="space-y-3" data-testid="deals-loading-state">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="rounded-2xl">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-7 gap-3">
                  <Skeleton className="h-10 md:col-span-2" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : dealsQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load deals"
            description="We couldn't fetch live deal data from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : deals.length === 0 ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No deals yet"
            description="Seed the development database or create your first opportunity to populate the pipeline."
            className="py-24"
          />
        ) : view === 'kanban' ? (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
            {DEAL_STAGE_ORDER.map((stage) => {
              const stageDeals = deals.filter((deal) => deal.stage === stage);
              const stageTotal = stageDeals.reduce((sum, deal) => sum + deal.amount, 0);

              return (
                <div
                  key={stage}
                  className="min-w-[280px] flex-shrink-0"
                  data-testid={`deal-stage-column-${stage}`}
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={stage} />
                      <span className="text-xs text-muted-foreground font-medium">{stageDeals.length}</span>
                    </div>
                    <span className="text-xs font-semibold">{formatCompactCurrency(stageTotal)}</span>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map((deal) => (
                      <Link to={`/deals/${deal.id}`} key={deal.id}>
                        <Card className={cn("rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5", deal.hasOverdueTask && "border-destructive/30")}>
                          <CardContent className="p-3.5">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold line-clamp-2">{deal.title}</p>
                              {deal.hasOverdueTask ? (
                                <AlertTriangle
                                  className="h-3.5 w-3.5 text-destructive shrink-0"
                                  data-testid={`deal-overdue-indicator-${deal.id}`}
                                />
                              ) : null}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{deal.companyName}</p>
                            {deal.primaryContactName ? (
                              <p className="text-[10px] text-muted-foreground mt-1">Contact: {deal.primaryContactName}</p>
                            ) : null}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm font-bold">{formatCompactCurrency(deal.amount)}</span>
                              <PlatformBadge platform={deal.platform} />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] text-muted-foreground">{deal.ownerLabel}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {deal.probability != null ? `${deal.probability}%` : "—"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[200px]">Deal</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Probability</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Close Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deals.map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {deal.hasOverdueTask ? (
                              <AlertTriangle
                                className="h-3.5 w-3.5 text-destructive shrink-0"
                                data-testid={`deal-overdue-indicator-${deal.id}`}
                              />
                            ) : null}
                            <Link to={`/deals/${deal.id}`} className="text-sm font-medium hover:text-primary transition-colors">
                              {deal.title}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{deal.companyName}</TableCell>
                        <TableCell><StatusBadge status={deal.stage} /></TableCell>
                        <TableCell className="text-sm font-bold">{formatCompactCurrency(deal.amount)}</TableCell>
                        <TableCell className="text-sm">{deal.probability != null ? `${deal.probability}%` : "—"}</TableCell>
                        <TableCell><PlatformBadge platform={deal.platform} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{deal.ownerLabel}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{formatDate(deal.expectedCloseDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
