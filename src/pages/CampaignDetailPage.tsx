import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { campaigns, leads, deals, activities } from "@/data/mock-data";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Eye, MousePointer, UserPlus, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

const performanceData = [
  { day: 'Mar 1', spend: 1200, clicks: 890, leads: 12 },
  { day: 'Mar 5', spend: 1400, clicks: 1020, leads: 15 },
  { day: 'Mar 10', spend: 1100, clicks: 780, leads: 9 },
  { day: 'Mar 15', spend: 1600, clicks: 1200, leads: 18 },
  { day: 'Mar 20', spend: 1800, clicks: 1340, leads: 22 },
  { day: 'Mar 25', spend: 1500, clicks: 1100, leads: 16 },
  { day: 'Mar 30', spend: 1700, clicks: 1250, leads: 20 },
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const campaign = campaigns.find(c => c.id === id) || campaigns[0];
  const campaignLeads = leads.filter(l => l.campaignId === campaign.id);
  const campaignDeals = deals.filter(d => d.campaignId === campaign.id);
  const campaignActivities = activities.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/campaigns"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{campaign.name}</h1>
              <PlatformBadge platform={campaign.platform} />
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-sm text-muted-foreground">{campaign.objective} • {campaign.startDate} to {campaign.endDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <KpiCard title="Spend" value={formatCurrency(campaign.spend)} icon={<DollarSign className="h-4 w-4" />} />
          <KpiCard title="Impressions" value={campaign.impressions.toLocaleString()} icon={<Eye className="h-4 w-4" />} />
          <KpiCard title="Clicks" value={campaign.clicks.toLocaleString()} icon={<MousePointer className="h-4 w-4" />} />
          <KpiCard title="Leads" value={campaign.leads.toString()} icon={<UserPlus className="h-4 w-4" />} />
          <KpiCard title="Revenue" value={formatCurrency(campaign.revenue)} icon={<DollarSign className="h-4 w-4" />} gradient />
          <KpiCard title="ROAS" value={`${campaign.roas.toFixed(1)}x`} icon={<Target className="h-4 w-4" />} gradient />
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads ({campaignLeads.length})</TabsTrigger>
            <TabsTrigger value="deals">Deals ({campaignDeals.length})</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Performance Over Time</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="spend" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} name="Spend ($)" />
                      <Line type="monotone" dataKey="leads" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Leads" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="mt-4">
            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                {campaignLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No leads from this campaign yet.</p>
                ) : campaignLeads.map(l => (
                  <Link to={`/leads/${l.id}`} key={l.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {l.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{l.name}</p>
                        <p className="text-xs text-muted-foreground">{l.company} • Score: {l.score}</p>
                      </div>
                    </div>
                    <StatusBadge status={l.status} />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="mt-4">
            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-2">
                {campaignDeals.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">No deals from this campaign yet.</p>
                ) : campaignDeals.map(d => (
                  <Link to={`/deals/${d.id}`} key={d.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div>
                      <p className="text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-muted-foreground">{d.companyName} • {d.contactName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(d.value)}</p>
                      <StatusBadge status={d.stage} />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <ActivityTimeline activities={campaignActivities} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
