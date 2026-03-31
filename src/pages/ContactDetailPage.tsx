import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { contacts, deals, activities } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Building2 } from "lucide-react";

export default function ContactDetailPage() {
  const { id } = useParams();
  const contact = contacts.find(c => c.id === id) || contacts[0];
  const contactDeals = deals.filter(d => d.contactName === contact.name);
  const contactActivities = activities.filter(a => a.relatedName === contact.name).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/contacts"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-xl font-bold">Contact Profile</h1>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold">{contact.name}</h2>
                  <Badge variant="secondary">{contact.lifecycleStage}</Badge>
                  <PlatformBadge platform={contact.source} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{contact.position} at {contact.company}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{contact.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{contact.phone}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-2xl font-bold text-success">${contact.wonRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Won Revenue • {contact.totalDeals} deals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Deals</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {contactDeals.map(d => (
                <Link to={`/deals/${d.id}`} key={d.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground">{d.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${d.value.toLocaleString()}</p>
                    <StatusBadge status={d.stage} />
                  </div>
                </Link>
              ))}
              {contactDeals.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No deals</p>}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Activity</CardTitle></CardHeader>
            <CardContent>
              {contactActivities.length > 0 ? (
                <ActivityTimeline activities={contactActivities} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
