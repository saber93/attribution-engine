import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { companies, contacts, deals, activities } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Users, Handshake, DollarSign } from "lucide-react";

function formatCurrency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export default function CompanyDetailPage() {
  const { id } = useParams();
  const company = companies.find(c => c.id === id) || companies[0];
  const companyContacts = contacts.filter(c => c.companyId === company.id);
  const companyDeals = deals.filter(d => d.companyId === company.id);
  const companyActivities = activities.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/companies"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-xl font-bold">Company Profile</h1>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{company.name}</h2>
                <p className="text-sm text-muted-foreground">{company.industry} • {company.size} employees</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />{company.website}
                </div>
                <div className="flex gap-1.5 mt-2">
                  {company.sourceMix.map(s => <PlatformBadge key={s.platform} platform={s.platform} />)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{company.contactsCount}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Contacts</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{company.activeDeals}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Active Deals</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-success">{formatCurrency(company.wonRevenue)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Won Revenue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Contacts ({companyContacts.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {companyContacts.map(c => (
                <Link to={`/contacts/${c.id}`} key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.position}</p>
                  </div>
                </Link>
              ))}
              {companyContacts.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No contacts linked</p>}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Deals ({companyDeals.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {companyDeals.map(d => (
                <Link to={`/deals/${d.id}`} key={d.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.contactName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${d.value.toLocaleString()}</p>
                    <StatusBadge status={d.stage} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <ActivityTimeline activities={companyActivities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
