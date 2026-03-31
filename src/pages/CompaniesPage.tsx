import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCompaniesQuery } from "@/features/companies/queries";
import { getCompanyDisplayMeta, getInitials } from "@/lib/display";
import { formatCompactCurrency } from "@/lib/formatters";
import { Search, Inbox, SearchX, AlertTriangle } from "lucide-react";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const companiesQuery = useCompaniesQuery();
  const companies = companiesQuery.data ?? [];

  const filteredCompanies = companies.filter((company) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      company.name.toLowerCase().includes(query) ||
      (company.websiteUrl ?? "").toLowerCase().includes(query) ||
      (company.domain ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader
          title="Companies"
          description="Browse live CRM accounts and the contacts, leads, and deals linked to them."
        />

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies by name, website, or domain..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        {companiesQuery.isPending ? (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="space-y-3 p-4" data-testid="companies-loading-state">
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
        ) : companiesQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load companies"
            description="We couldn't fetch live company data from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : companies.length === 0 ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No companies yet"
            description="Seed the development database or capture your first account to populate this workspace."
            className="py-24"
          />
        ) : filteredCompanies.length === 0 ? (
          <StateCard
            icon={<SearchX className="h-8 w-8 text-muted-foreground" />}
            title="No matching companies"
            description="Try a different company name, website, or domain."
            className="py-24"
          />
        ) : (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[220px]">Company</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Contacts</TableHead>
                      <TableHead>Leads</TableHead>
                      <TableHead>Active Deals</TableHead>
                      <TableHead>Won Revenue</TableHead>
                      <TableHead>Open Pipeline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <Link to={`/companies/${company.id}`} className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                              {getInitials(company.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium hover:text-primary transition-colors">{company.name}</p>
                              <p className="text-xs text-muted-foreground">{getCompanyDisplayMeta(company)}</p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">{company.industry ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{company.sizeBand ?? "—"}</TableCell>
                        <TableCell className="text-sm font-medium">{company.contactsCount}</TableCell>
                        <TableCell className="text-sm font-medium">{company.linkedLeads}</TableCell>
                        <TableCell className="text-sm font-medium">{company.activeDeals}</TableCell>
                        <TableCell className="text-sm font-medium text-success">{formatCompactCurrency(company.wonRevenue)}</TableCell>
                        <TableCell className="text-sm font-medium">{formatCompactCurrency(company.openPipeline)}</TableCell>
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
