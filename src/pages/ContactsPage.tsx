import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { contacts } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users } from "lucide-react";

function formatCurrency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Contacts" description="Your CRM contact directory" action={
          <Button size="sm"><Users className="h-3.5 w-3.5 mr-1.5" />Add Contact</Button>
        } />

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-[180px]">Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Deals</TableHead>
                    <TableHead>Won Revenue</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.id} className="cursor-pointer">
                      <TableCell>
                        <Link to={`/contacts/${c.id}`} className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium hover:text-primary transition-colors">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">{c.company}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.position}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{c.lifecycleStage}</Badge></TableCell>
                      <TableCell><PlatformBadge platform={c.source} /></TableCell>
                      <TableCell className="text-sm font-medium">{c.totalDeals}</TableCell>
                      <TableCell className="text-sm font-medium text-success">{c.wonRevenue > 0 ? formatCurrency(c.wonRevenue) : '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{c.owner}</TableCell>
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
