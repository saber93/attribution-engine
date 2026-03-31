import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { deals, type DealStage } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LayoutGrid, List, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const stages: DealStage[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
const stageLabels: Record<DealStage, string> = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', won: 'Won', lost: 'Lost' };

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export default function DealsPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');

  const totalPipeline = deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);
  const wonTotal = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Deals Pipeline" description={`Pipeline: ${formatCurrency(totalPipeline)} • Won: ${formatCurrency(wonTotal)}`} action={
          <div className="flex gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <Button variant={view === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => setView('kanban')} className="rounded-none"><LayoutGrid className="h-3.5 w-3.5" /></Button>
              <Button variant={view === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setView('table')} className="rounded-none"><List className="h-3.5 w-3.5" /></Button>
            </div>
            <Button size="sm">+ New Deal</Button>
          </div>
        } />

        {view === 'kanban' ? (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
            {stages.map(stage => {
              const stageDeals = deals.filter(d => d.stage === stage);
              const stageTotal = stageDeals.reduce((s, d) => s + d.value, 0);
              return (
                <div key={stage} className="min-w-[280px] flex-shrink-0">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={stage} />
                      <span className="text-xs text-muted-foreground font-medium">{stageDeals.length}</span>
                    </div>
                    <span className="text-xs font-semibold">{formatCurrency(stageTotal)}</span>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map(deal => (
                      <Link to={`/deals/${deal.id}`} key={deal.id}>
                        <Card className={cn("rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5", deal.hasOverdueTask && "border-destructive/30")}>
                          <CardContent className="p-3.5">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold line-clamp-2">{deal.title}</p>
                              {deal.hasOverdueTask && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{deal.companyName}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-sm font-bold">{formatCurrency(deal.value)}</span>
                              <PlatformBadge platform={deal.source} />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5">
                                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-semibold text-primary">
                                  {deal.owner.split(' ').map(n => n[0]).join('')}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{deal.owner}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground">{deal.probability}%</span>
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
                    {deals.map(d => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <Link to={`/deals/${d.id}`} className="text-sm font-medium hover:text-primary transition-colors">{d.title}</Link>
                        </TableCell>
                        <TableCell className="text-sm">{d.companyName}</TableCell>
                        <TableCell><StatusBadge status={d.stage} /></TableCell>
                        <TableCell className="text-sm font-bold">{formatCurrency(d.value)}</TableCell>
                        <TableCell className="text-sm">{d.probability}%</TableCell>
                        <TableCell><PlatformBadge platform={d.source} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{d.owner}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{d.expectedCloseDate}</TableCell>
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
