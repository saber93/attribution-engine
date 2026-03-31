import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StateCard } from "@/components/dashboard/StateCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactByIdQuery, useContactDealsQuery } from "@/features/contacts/queries";
import { CONTACT_STAGE_LABELS } from "@/features/contacts/types";
import { getInitials } from "@/lib/display";
import { formatCompactCurrency, formatDate, formatDetailedCurrency } from "@/lib/formatters";
import { isUuid } from "@/lib/route-params";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  AlertTriangle,
  Inbox,
  FileSearch,
  GitBranch,
} from "lucide-react";

function ContactDetailShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/contacts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Contact Profile</h1>
        </div>
        {children}
      </div>
    </DashboardLayout>
  );
}

export default function ContactDetailPage() {
  const { id } = useParams();
  const hasValidContactId = Boolean(id && isUuid(id));
  const contactQuery = useContactByIdQuery(id, hasValidContactId);
  const contact = contactQuery.data ?? null;
  const shouldFetchRelated = hasValidContactId && Boolean(contact);
  const dealsQuery = useContactDealsQuery(id, shouldFetchRelated);

  if (!hasValidContactId) {
    return (
      <ContactDetailShell>
        <StateCard
          icon={<FileSearch className="h-8 w-8 text-muted-foreground" />}
          title="Contact not found"
          description="The contact link is invalid or incomplete. Return to the Contacts page and open a valid contact record."
          className="py-24"
        />
      </ContactDetailShell>
    );
  }

  if (contactQuery.isPending) {
    return (
      <ContactDetailShell>
        <div className="space-y-4" data-testid="contact-detail-loading-state">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-4 w-60" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>
      </ContactDetailShell>
    );
  }

  if (contactQuery.isError) {
    return (
      <ContactDetailShell>
        <StateCard
          icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
          title="Unable to load contact"
          description="We hit an error while fetching this contact from Supabase. Try refreshing and loading the record again."
          className="py-24"
        />
      </ContactDetailShell>
    );
  }

  if (!contact) {
    return (
      <ContactDetailShell>
        <StateCard
          icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
          title="Contact not found"
          description="This contact ID is valid, but there is no matching contact record in the database."
          className="py-24"
        />
      </ContactDetailShell>
    );
  }

  return (
    <ContactDetailShell>
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
              {getInitials(contact.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold">{contact.name}</h2>
                <Badge variant="secondary">{CONTACT_STAGE_LABELS[contact.lifecycleStage]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {contact.jobTitle ?? "No job title set"}{contact.companyName ? ` at ${contact.companyName}` : ""}
              </p>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {contact.email ?? "—"}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {contact.phone ?? "—"}
                </span>
              </div>
            </div>
            <div className="text-right space-y-1 shrink-0">
              <p className="text-2xl font-bold text-success">{formatCompactCurrency(contact.wonRevenue)}</p>
              <p className="text-xs text-muted-foreground">
                Won Revenue • {contact.totalDeals} linked {contact.totalDeals === 1 ? "deal" : "deals"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Relationships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4 py-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Company
              </span>
              <span className="text-sm font-medium text-right">{contact.companyName ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" />
                Source Lead
              </span>
              {contact.sourceLeadId && contact.sourceLeadName ? (
                <Link
                  to={`/leads/${contact.sourceLeadId}`}
                  className="text-sm font-medium text-primary hover:underline text-right"
                >
                  {contact.sourceLeadName}
                </Link>
              ) : (
                <span className="text-sm font-medium text-right">—</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4 py-1">
              <span className="text-xs text-muted-foreground">Job Title</span>
              <span className="text-sm font-medium text-right">{contact.jobTitle ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Created
              </span>
              <span className="text-sm font-medium text-right">{formatDate(contact.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Linked Deals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {dealsQuery.isPending ? (
              <div className="space-y-3" data-testid="contact-deals-loading-state">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : dealsQuery.isError ? (
              <EmptyState
                icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
                title="Unable to load linked deals"
                description="We couldn't fetch this contact's deal relationships right now."
                className="py-10"
              />
            ) : (dealsQuery.data?.length ?? 0) === 0 ? (
              <EmptyState
                title="No linked deals"
                description="Deals connected through this contact will appear here once a deal uses this contact as its primary contact."
                className="py-10"
              />
            ) : (
              (dealsQuery.data ?? []).map((deal) => (
                <Link
                  to={`/deals/${deal.id}`}
                  key={deal.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{deal.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {deal.companyName ?? "—"} • Created {formatDate(deal.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatDetailedCurrency(deal.amount, deal.currency)}</p>
                    <StatusBadge status={deal.stage} />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ContactDetailShell>
  );
}
