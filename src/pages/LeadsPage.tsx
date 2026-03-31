import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLeadsQuery } from "@/features/leads/queries";
import { getInitials } from "@/lib/display";
import { Search, UserPlus, Inbox, SearchX, AlertTriangle } from "lucide-react";

const leadSegments = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Converted", value: "converted" },
  { label: "Unqualified", value: "unqualified" },
] as const;

function getScoreClasses(score: number | null) {
  if (score == null) return "bg-muted text-muted-foreground";
  if (score >= 80) return "bg-success/10 text-success";
  if (score >= 50) return "bg-warning/10 text-warning";
  return "bg-muted text-muted-foreground";
}

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const leadsQuery = useLeadsQuery();
  const leads = leadsQuery.data ?? [];

  const segments = leadSegments.map((segment) => ({
    ...segment,
    count:
      segment.value === "all"
        ? leads.length
        : leads.filter((lead) => lead.status === segment.value).length,
  }));

  const filtered = leads
    .filter((lead) => statusFilter === "all" || lead.status === statusFilter)
    .filter((lead) => {
      const query = search.trim().toLowerCase();
      if (!query) return true;

      return (
        lead.name.toLowerCase().includes(query) ||
        (lead.companyName ?? "").toLowerCase().includes(query)
      );
    });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Leads" description="Manage and qualify incoming leads from all campaigns" action={
          <Button size="sm"><UserPlus className="h-3.5 w-3.5 mr-1.5" />Add Lead</Button>
        } />

        <div className="flex flex-wrap gap-2">
          {segments.map(s => (
            <Button key={s.value} variant={statusFilter === s.value ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s.value)} className="text-xs">
              {s.label} <Badge variant="secondary" className="ml-1.5 text-[10px]">{s.count}</Badge>
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search leads by name or company..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {leadsQuery.isPending ? (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="space-y-3 p-4" data-testid="leads-loading-state">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-8 gap-3">
                    <Skeleton className="h-10 col-span-2" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : leadsQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load leads"
            description="We couldn't fetch live lead data from Supabase. Try refreshing the page again."
            className="py-20"
          />
        ) : leads.length === 0 ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No leads yet"
            description="Seed the development database or capture your first lead to populate this workspace."
            className="py-20"
          />
        ) : filtered.length === 0 ? (
          <StateCard
            icon={<SearchX className="h-8 w-8 text-muted-foreground" />}
            title="No matching leads"
            description="Try a different search term or clear the current status filter."
            className="py-20"
          />
        ) : (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[180px]">Lead</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Next Task</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((lead) => (
                      <TableRow key={lead.id} className="cursor-pointer">
                        <TableCell>
                          <Link to={`/leads/${lead.id}`} className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                              {getInitials(lead.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium hover:text-primary transition-colors">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{lead.email ?? "—"}</p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">{lead.companyName ?? "—"}</TableCell>
                        <TableCell><PlatformBadge platform={lead.platform} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{lead.campaignName ?? "—"}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center justify-center rounded-full h-7 min-w-7 px-2 text-xs font-bold ${getScoreClasses(lead.score)}`}>
                            {lead.score ?? "—"}
                          </div>
                        </TableCell>
                        <TableCell><StatusBadge status={lead.status} /></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{lead.ownerLabel}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{lead.nextTaskTitle ?? "—"}</TableCell>
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
