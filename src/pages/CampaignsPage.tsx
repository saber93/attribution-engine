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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCampaignsQuery } from "@/features/campaigns/queries";
import type { CampaignListItem } from "@/features/campaigns/types";
import {
  formatCompactCurrency,
  formatMultiplier,
  formatNumber,
  formatPercentFromRatio,
} from "@/lib/formatters";
import { Search, Download, ArrowUpDown, AlertTriangle, Inbox, SearchX } from "lucide-react";

type SortField =
  | "spendAmount"
  | "impressions"
  | "clicks"
  | "linkedLeads"
  | "qualifiedLeads"
  | "linkedDeals"
  | "wonRevenue"
  | "roas";

function formatCpc(value: number | null, currency = "USD"): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function sortValue(campaign: CampaignListItem, field: SortField) {
  const value = campaign[field];
  return value == null ? Number.NEGATIVE_INFINITY : value;
}

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("roas");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const campaignsQuery = useCampaignsQuery();
  const campaigns = campaignsQuery.data ?? [];

  const filteredCampaigns = campaigns
    .filter((campaign) => platformFilter === "all" || campaign.platform === platformFilter)
    .filter((campaign) => campaign.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((left, right) => {
      const leftValue = sortValue(left, sortField);
      const rightValue = sortValue(right, sortField);

      return sortDir === "desc" ? rightValue - leftValue : leftValue - rightValue;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDir("desc");
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader
          title="Campaigns"
          description="Monitor live campaign spend alongside trustworthy CRM outcomes."
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
              <Button size="sm">+ New Campaign</Button>
            </div>
          }
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
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

        {campaignsQuery.isPending ? (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="space-y-3 p-4" data-testid="campaigns-loading-state">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3">
                    <Skeleton className="h-10 col-span-3" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                    <Skeleton className="h-10 col-span-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : campaignsQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load campaigns"
            description="We couldn't fetch live campaign data from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : campaigns.length === 0 ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No campaigns yet"
            description="Create or seed campaigns to populate this workspace."
            className="py-24"
          />
        ) : filteredCampaigns.length === 0 ? (
          <StateCard
            icon={<SearchX className="h-8 w-8 text-muted-foreground" />}
            title="No matching campaigns"
            description="Try a different campaign name or clear the current platform filter."
            className="py-24"
          />
        ) : (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[220px]">Campaign</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("spendAmount")}>
                        <div className="flex items-center gap-1">
                          Spend <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("impressions")}>
                        <div className="flex items-center gap-1">
                          Impr. <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("clicks")}>
                        <div className="flex items-center gap-1">
                          Clicks <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("linkedLeads")}>
                        <div className="flex items-center gap-1">
                          Leads <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("qualifiedLeads")}>
                        <div className="flex items-center gap-1">
                          Qualified <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("linkedDeals")}>
                        <div className="flex items-center gap-1">
                          Deals <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("wonRevenue")}>
                        <div className="flex items-center gap-1">
                          Won Revenue <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("roas")}>
                        <div className="flex items-center gap-1">
                          ROAS <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <Link to={`/campaigns/${campaign.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                            {campaign.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{campaign.objective ?? "No objective set"}</p>
                        </TableCell>
                        <TableCell><PlatformBadge platform={campaign.platform} /></TableCell>
                        <TableCell><StatusBadge status={campaign.status} /></TableCell>
                        <TableCell className="font-medium">{formatCompactCurrency(campaign.spendAmount, campaign.currency)}</TableCell>
                        <TableCell>{formatNumber(campaign.impressions)}</TableCell>
                        <TableCell>{formatNumber(campaign.clicks)}</TableCell>
                        <TableCell>{formatPercentFromRatio(campaign.ctr)}</TableCell>
                        <TableCell>{formatCpc(campaign.cpc, campaign.currency)}</TableCell>
                        <TableCell>{campaign.linkedLeads}</TableCell>
                        <TableCell>{campaign.qualifiedLeads}</TableCell>
                        <TableCell>{campaign.linkedDeals}</TableCell>
                        <TableCell className="font-medium text-success">{formatCompactCurrency(campaign.wonRevenue, campaign.currency)}</TableCell>
                        <TableCell className="font-bold">{formatMultiplier(campaign.roas)}</TableCell>
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
