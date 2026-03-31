import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { campaigns, platformNames, type Platform, type CampaignStatus } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("roas");
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = campaigns
    .filter(c => platformFilter === 'all' || c.platform === platformFilter)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortField as keyof typeof a] as number;
      const bv = b[sortField as keyof typeof b] as number;
      return sortDir === 'desc' ? bv - av : av - bv;
    });

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Campaigns" description="Monitor and manage all paid campaigns across platforms" action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
            <Button size="sm">+ New Campaign</Button>
          </div>
        } />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Tabs value={platformFilter} onValueChange={setPlatformFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="meta">Meta</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok</TabsTrigger>
              <TabsTrigger value="snapchat">Snap</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[200px]">Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('spend')}>
                      <div className="flex items-center gap-1">Spend <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('impressions')}>
                      <div className="flex items-center gap-1">Impr. <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('clicks')}>
                      <div className="flex items-center gap-1">Clicks <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>CPC</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('leads')}>
                      <div className="flex items-center gap-1">Leads <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead>Qualified</TableHead>
                    <TableHead>Deals</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('revenue')}>
                      <div className="flex items-center gap-1">Revenue <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('roas')}>
                      <div className="flex items-center gap-1">ROAS <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.id} className="cursor-pointer">
                      <TableCell>
                        <Link to={`/campaigns/${c.id}`} className="font-medium text-sm hover:text-primary transition-colors">{c.name}</Link>
                        <p className="text-xs text-muted-foreground">{c.objective}</p>
                      </TableCell>
                      <TableCell><PlatformBadge platform={c.platform} /></TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell className="font-medium">{formatCurrency(c.spend)}</TableCell>
                      <TableCell>{formatNumber(c.impressions)}</TableCell>
                      <TableCell>{formatNumber(c.clicks)}</TableCell>
                      <TableCell>{c.ctr}%</TableCell>
                      <TableCell>${c.cpc.toFixed(2)}</TableCell>
                      <TableCell>{c.leads}</TableCell>
                      <TableCell>{c.qualifiedLeads}</TableCell>
                      <TableCell>{c.deals}</TableCell>
                      <TableCell className="font-medium text-success">{formatCurrency(c.revenue)}</TableCell>
                      <TableCell className="font-bold">{c.roas.toFixed(1)}x</TableCell>
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
