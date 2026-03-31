import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { StateCard } from "@/components/dashboard/StateCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCompanyByIdQuery,
  useCompanyContactsQuery,
  useCompanyDealsQuery,
  useCompanyLeadsQuery,
} from "@/features/companies/queries";
import { CONTACT_STAGE_LABELS } from "@/features/contacts/types";
import { getCompanyDisplayMeta, getInitials } from "@/lib/display";
import { formatCompactCurrency, formatDate, formatDetailedCurrency } from "@/lib/formatters";
import { isUuid } from "@/lib/route-params";
import { ArrowLeft, Users, DollarSign, BriefcaseBusiness, Inbox, AlertTriangle, FileSearch, Globe } from "lucide-react";

function CompanyDetailShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/companies">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Company Profile</h1>
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function CompanyDetailPage() {
  const { id } = useParams();
  const hasValidCompanyId = Boolean(id && isUuid(id));
  const companyQuery = useCompanyByIdQuery(id, hasValidCompanyId);
  const company = companyQuery.data ?? null;
  const shouldFetchRelated = hasValidCompanyId && Boolean(company);
  const contactsQuery = useCompanyContactsQuery(id, shouldFetchRelated);
  const leadsQuery = useCompanyLeadsQuery(id, shouldFetchRelated);
  const dealsQuery = useCompanyDealsQuery(id, shouldFetchRelated);

  if (!hasValidCompanyId) {
    return (
      <CompanyDetailShell>
        <StateCard
          icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
          title="Company not found"
          description="The company link is invalid or incomplete. Return to the Companies page and open a valid company record."
          className="py-24"
        />
      </CompanyDetailShell>
    );
  }

  if (companyQuery.isPending) {
    return (
      <CompanyDetailShell>
        <div className="space-y-4" data-testid="company-detail-loading-state">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-56" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-72" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>
      </CompanyDetailShell>
    );
  }

  if (companyQuery.isError) {
    return (
      <CompanyDetailShell>
        <StateCard
          icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
          title="Unable to load company"
          description="We hit an error while fetching this company from Supabase. Try refreshing and loading the record again."
          className="py-24"
        />
      </CompanyDetailShell>
    );
  }

  if (!company) {
    return (
      <CompanyDetailShell>
        <StateCard
          icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          title="Company not found"
          description="This company ID is valid, but there is no matching company record in the database."
          className="py-24"
        />
      </CompanyDetailShell>
    );
  }

  const contacts = contactsQuery.data ?? [];
  const leads = leadsQuery.data ?? [];
  const deals = dealsQuery.data ?? [];

  return (
    <CompanyDetailShell>
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {getInitials(company.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">{company.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {[company.industry, company.sizeBand].filter(Boolean).join(" • ") || "No company profile details set"}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                {getCompanyDisplayMeta(company)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <KpiCard title="Contacts" value={company.contactsCount.toString()} icon={<Users className="h-4 w-4" />} />
        <KpiCard title="Linked Leads" value={company.linkedLeads.toString()} icon={<Users className="h-4 w-4" />} />
        <KpiCard title="Linked Deals" value={company.linkedDeals.toString()} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <KpiCard title="Active Deals" value={company.activeDeals.toString()} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <KpiCard title="Won Deals" value={company.wonDeals.toString()} icon={<BriefcaseBusiness className="h-4 w-4" />} />
        <KpiCard title="Won Revenue" value={formatCompactCurrency(company.wonRevenue)} icon={<DollarSign className="h-4 w-4" />} gradient />
        <KpiCard title="Open Pipeline" value={formatCompactCurrency(company.openPipeline)} icon={<DollarSign className="h-4 w-4" />} gradient />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
          <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="deals">Deals ({deals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Company Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Name", value: company.name },
                  { label: "Industry", value: company.industry ?? "—" },
                  { label: "Size Band", value: company.sizeBand ?? "—" },
                  { label: "Website", value: company.websiteUrl ?? "—" },
                  { label: "Domain", value: company.domain ?? "—" },
                  { label: "Created", value: formatDate(company.createdAt) },
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
                <CardTitle className="text-sm font-semibold">CRM Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Contacts", value: company.contactsCount.toString() },
                  { label: "Linked Leads", value: company.linkedLeads.toString() },
                  { label: "Linked Deals", value: company.linkedDeals.toString() },
                  { label: "Active Deals", value: company.activeDeals.toString() },
                  { label: "Won Deals", value: company.wonDeals.toString() },
                  { label: "Won Revenue", value: formatDetailedCurrency(company.wonRevenue) },
                  { label: "Open Pipeline", value: formatDetailedCurrency(company.openPipeline) },
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

        <TabsContent value="contacts" className="mt-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              {contactsQuery.isPending ? (
                <div className="space-y-3" data-testid="company-contacts-loading-state">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : contactsQuery.isError ? (
                <EmptyState
                  icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                  title="Unable to load contacts"
                  description="We couldn't fetch this company's linked contacts right now."
                  className="py-10"
                />
              ) : contacts.length === 0 ? (
                <EmptyState
                  title="No linked contacts"
                  description="Contacts linked to this company will appear here once contacts are associated through the company relationship."
                  className="py-10"
                />
              ) : (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <Link
                      to={`/contacts/${contact.id}`}
                      key={contact.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[contact.email ?? contact.phone ?? "—", contact.jobTitle].filter(Boolean).join(" • ")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {CONTACT_STAGE_LABELS[contact.lifecycleStage]}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="mt-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              {leadsQuery.isPending ? (
                <div className="space-y-3" data-testid="company-leads-loading-state">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : leadsQuery.isError ? (
                <EmptyState
                  icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                  title="Unable to load leads"
                  description="We couldn't fetch this company's linked leads right now."
                  className="py-10"
                />
              ) : leads.length === 0 ? (
                <EmptyState
                  title="No linked leads"
                  description="Leads linked to this company will appear here once leads are associated through the company relationship."
                  className="py-10"
                />
              ) : (
                <div className="space-y-2">
                  {leads.map((lead) => (
                    <Link
                      to={`/leads/${lead.id}`}
                      key={lead.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">Created {formatDate(lead.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-[10px]">
                          Score {lead.score ?? "—"}
                        </Badge>
                        <StatusBadge status={lead.status} />
                      </div>
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
                <div className="space-y-3" data-testid="company-deals-loading-state">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : dealsQuery.isError ? (
                <EmptyState
                  icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                  title="Unable to load deals"
                  description="We couldn't fetch this company's linked deals right now."
                  className="py-10"
                />
              ) : deals.length === 0 ? (
                <EmptyState
                  title="No linked deals"
                  description="Deals linked to this company will appear here once a deal is associated through the company relationship."
                  className="py-10"
                />
              ) : (
                <div className="space-y-2">
                  {deals.map((deal) => (
                    <Link
                      to={`/deals/${deal.id}`}
                      key={deal.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{deal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {(deal.primaryContactName ?? "No primary contact")} • Created {formatDate(deal.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">{formatDetailedCurrency(deal.amount, deal.currency)}</p>
                        <StatusBadge status={deal.stage} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </CompanyDetailShell>
  );
}
