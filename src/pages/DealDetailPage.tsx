import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { deals, activities } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Building2, User, Calendar, DollarSign, Target, Megaphone } from "lucide-react";

function formatCurrency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export default function DealDetailPage() {
  const { id } = useParams();
  const deal = deals.find(d => d.id === id) || deals[0];
  const dealActivities = activities.filter(a => a.relatedId === deal.id).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/deals"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-xl font-bold">Deal Details</h1>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{deal.title}</h2>
                  <StatusBadge status={deal.stage} />
                  <PlatformBadge platform={deal.source} />
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{deal.companyName}</span>
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{deal.contactName}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Close: {deal.expectedCloseDate}</span>
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />Owner: {deal.owner}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${deal.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{deal.probability}% probability</p>
                <div className="w-32 mt-2">
                  <Progress value={deal.probability} className="h-1.5" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {deal.stage !== 'won' && deal.stage !== 'lost' && (
                <>
                  <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">Mark as Won</Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30">Mark as Lost</Button>
                </>
              )}
              <Button size="sm" variant="outline">Add Note</Button>
              <Button size="sm" variant="outline">Schedule Task</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Activity Timeline</CardTitle></CardHeader>
              <CardContent>
                {dealActivities.length > 0 ? (
                  <ActivityTimeline activities={dealActivities} />
                ) : (
                  <p className="text-sm text-muted-foreground py-8 text-center">No activity yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Source Attribution</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{deal.campaignName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={deal.source} />
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">Contact</span>
                  <Link to={`/contacts`} className="text-xs font-medium text-primary hover:underline">{deal.contactName}</Link>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-xs text-muted-foreground">Company</span>
                  <Link to={`/companies/${deal.companyId}`} className="text-xs font-medium text-primary hover:underline">{deal.companyName}</Link>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Deal Info</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Created', value: deal.createdAt },
                  { label: 'Expected Close', value: deal.expectedCloseDate },
                  { label: 'Probability', value: `${deal.probability}%` },
                  { label: 'Last Activity', value: new Date(deal.lastActivity).toLocaleDateString() },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
