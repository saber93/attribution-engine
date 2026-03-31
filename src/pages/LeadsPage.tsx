import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { leads } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Filter } from "lucide-react";

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const segments = [
    { label: 'All', value: 'all', count: leads.length },
    { label: 'New', value: 'new', count: leads.filter(l => l.status === 'new').length },
    { label: 'Qualified', value: 'qualified', count: leads.filter(l => l.status === 'qualified').length },
    { label: 'Contacted', value: 'contacted', count: leads.filter(l => l.status === 'contacted').length },
    { label: 'Converted', value: 'converted', count: leads.filter(l => l.status === 'converted').length },
    { label: 'Lost', value: 'lost', count: leads.filter(l => l.status === 'lost').length },
  ];

  const filtered = leads
    .filter(l => statusFilter === 'all' || l.status === statusFilter)
    .filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()));

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
                  {filtered.map(l => (
                    <TableRow key={l.id} className="cursor-pointer">
                      <TableCell>
                        <Link to={`/leads/${l.id}`} className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                            {l.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium hover:text-primary transition-colors">{l.name}</p>
                            <p className="text-xs text-muted-foreground">{l.email}</p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{l.company}</TableCell>
                      <TableCell><PlatformBadge platform={l.source} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{l.campaignName}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center justify-center rounded-full h-7 w-7 text-xs font-bold ${l.score >= 80 ? 'bg-success/10 text-success' : l.score >= 50 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                          {l.score}
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={l.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{l.owner}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{l.nextTask || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
