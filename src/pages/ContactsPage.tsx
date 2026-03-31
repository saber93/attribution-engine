import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { StateCard } from "@/components/dashboard/StateCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContactsQuery } from "@/features/contacts/queries";
import { CONTACT_STAGE_LABELS } from "@/features/contacts/types";
import { getInitials } from "@/lib/display";
import { formatCompactCurrency } from "@/lib/formatters";
import { Search, Inbox, SearchX, AlertTriangle } from "lucide-react";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const contactsQuery = useContactsQuery();
  const contacts = contactsQuery.data ?? [];

  const filteredContacts = contacts.filter((contact) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    return (
      contact.name.toLowerCase().includes(query) ||
      (contact.companyName ?? "").toLowerCase().includes(query) ||
      (contact.email ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader
          title="Contacts"
          description="Browse live CRM contacts and the deal relationships tied to them."
        />

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts by name, company, or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-9"
          />
        </div>

        {contactsQuery.isPending ? (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="space-y-3 p-4" data-testid="contacts-loading-state">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-7 gap-3">
                    <Skeleton className="h-10 col-span-2" />
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
        ) : contactsQuery.isError ? (
          <StateCard
            icon={<AlertTriangle className="h-8 w-8 text-destructive" />}
            title="Unable to load contacts"
            description="We couldn't fetch live contact data from Supabase. Try refreshing the page again."
            className="py-24"
          />
        ) : contacts.length === 0 ? (
          <StateCard
            icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
            title="No contacts yet"
            description="Seed the development database or convert a lead into a contact to populate this workspace."
            className="py-24"
          />
        ) : filteredContacts.length === 0 ? (
          <StateCard
            icon={<SearchX className="h-8 w-8 text-muted-foreground" />}
            title="No matching contacts"
            description="Try a different search term or clear the current query."
            className="py-24"
          />
        ) : (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-[200px]">Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Lifecycle Stage</TableHead>
                      <TableHead>Source Lead</TableHead>
                      <TableHead>Deals</TableHead>
                      <TableHead>Won Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <Link to={`/contacts/${contact.id}`} className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                              {getInitials(contact.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium hover:text-primary transition-colors">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.email ?? "—"}</p>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">{contact.companyName ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{contact.jobTitle ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {CONTACT_STAGE_LABELS[contact.lifecycleStage]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{contact.sourceLeadName ?? "—"}</TableCell>
                        <TableCell className="text-sm font-medium">{contact.totalDeals}</TableCell>
                        <TableCell className="text-sm font-medium text-success">
                          {formatCompactCurrency(contact.wonRevenue)}
                        </TableCell>
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
