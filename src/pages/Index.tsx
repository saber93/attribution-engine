import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { kpiSummary, spendVsRevenueData, leadsQualifiedWonData, platformSpendData, pipelineStageData, funnelData, campaigns, leads, tasks, activities } from "@/data/mock-data";
import { DollarSign, Eye, MousePointer, UserPlus, UserCheck, Handshake, TrendingUp, Target, ArrowRight, Lightbulb, AlertTriangle, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { Link } from "react-router-dom";

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export default function OverviewPage() {
  const topCampaigns = [...campaigns].sort((a, b) => b.roas - a.roas).slice(0, 5);
  const underperforming = [...campaigns].filter(c => c.status === 'active').sort((a, b) => a.roas - b.roas).slice(0, 3);
  const recentLeads = leads.slice(0, 5);
  const urgentTasks = tasks.filter(t => !t.completed).sort((a, b) => {
    const p = { urgent: 0, high: 1, medium: 2, low: 3 };
    return p[a.priority] - p[b.priority];
  }).slice(0, 5);
  const recentActivities = activities.slice(0, 6);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          <KpiCard title="Spend" value={formatCurrency(kpiSummary.spend.value)} change={kpiSummary.spend.change} trend="up" icon={<DollarSign className="h-4 w-4" />} />
          <KpiCard title="Impressions" value={formatNumber(kpiSummary.impressions.value)} change={kpiSummary.impressions.change} trend="up" icon={<Eye className="h-4 w-4" />} />
          <KpiCard title="Clicks" value={formatNumber(kpiSummary.clicks.value)} change={kpiSummary.clicks.change} trend="up" icon={<MousePointer className="h-4 w-4" />} />
          <KpiCard title="Leads" value={formatNumber(kpiSummary.leads.value)} change={kpiSummary.leads.change} trend="up" icon={<UserPlus className="h-4 w-4" />} />
          <KpiCard title="Qualified" value={formatNumber(kpiSummary.qualifiedLeads.value)} change={kpiSummary.qualifiedLeads.change} trend="up" icon={<UserCheck className="h-4 w-4" />} />
          <KpiCard title="Deals" value={kpiSummary.dealsCreated.value.toString()} change={kpiSummary.dealsCreated.change} trend="up" icon={<Handshake className="h-4 w-4" />} />
          <KpiCard title="Won Revenue" value={formatCurrency(kpiSummary.wonRevenue.value)} change={kpiSummary.wonRevenue.change} trend="up" icon={<TrendingUp className="h-4 w-4" />} gradient />
          <KpiCard title="ROAS" value={`${kpiSummary.roas.value}x`} change={kpiSummary.roas.change} trend="up" icon={<Target className="h-4 w-4" />} gradient />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Spend vs Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendVsRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${v/1000}K`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="spend" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} name="Spend" />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Revenue" />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Leads → Qualified → Won</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadsQualifiedWonData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="leads" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Leads" />
                    <Bar dataKey="qualified" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Qualified" />
                    <Bar dataKey="won" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Won" />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Platform Spend Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={platformSpendData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                      {platformSpendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Pipeline by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineStageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${v/1000}K`} className="text-xs" />
                    <YAxis type="category" dataKey="stage" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" width={80} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} name="Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Source to Revenue Funnel */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Source to Revenue Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-2 py-4">
              {[
                { label: 'Impressions', value: funnelData.impressions },
                { label: 'Clicks', value: funnelData.clicks },
                { label: 'Leads', value: funnelData.leads },
                { label: 'Qualified', value: funnelData.qualified },
                { label: 'Deals', value: funnelData.deals },
                { label: 'Won', value: funnelData.won },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="text-center px-4 py-3 rounded-xl bg-gradient-to-b from-primary/5 to-primary/10 border border-primary/10 min-w-[100px]">
                    <p className="text-lg font-bold">{formatNumber(step.value)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{step.label}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex flex-col items-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground font-medium">
                        {((arr[i + 1].value / step.value) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Top Campaigns */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Top Campaigns by ROAS</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/campaigns">View All</Link></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCampaigns.map((c) => (
                <Link to={`/campaigns/${c.id}`} key={c.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <PlatformBadge platform={c.platform} />
                      <span className="text-xs text-muted-foreground">{formatCurrency(c.spend)} spent</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-success">{c.roas.toFixed(1)}x</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(c.revenue)}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-success/5 border border-success/10">
                <Zap className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Best ROAS Campaign</p>
                  <p className="text-xs text-muted-foreground">Retargeting - Website Visitors at 14.5x ROAS</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-destructive/5 border border-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Highest CPL Campaign</p>
                  <p className="text-xs text-muted-foreground">LinkedIn Decision Makers at $245/lead</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-warning/5 border border-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">3 leads with no follow-up</p>
                  <p className="text-xs text-muted-foreground">Maria Garcia, Ryan O'Brien, Kevin Park</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-info/5 border border-info/10">
                <TrendingUp className="h-4 w-4 text-info mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Revenue concentration</p>
                  <p className="text-xs text-muted-foreground">67% of won revenue from Google & LinkedIn</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-warning/5 border border-warning/10">
                <Handshake className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Stage bottleneck</p>
                  <p className="text-xs text-muted-foreground">$645K stuck in Negotiation stage (2 deals)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Tasks Requiring Attention</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/tasks">View All</Link></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {urgentTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <PriorityBadge priority={t.priority} />
                      <span className="text-xs text-muted-foreground">{t.owner}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${new Date(t.dueDate) < new Date() ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {t.dueDate}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Recent Leads</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/leads">View All</Link></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentLeads.map((l) => (
                <Link to={`/leads/${l.id}`} key={l.id} className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                      {l.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{l.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{l.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PlatformBadge platform={l.source} />
                    <StatusBadge status={l.status} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" asChild><Link to="/activities">View All</Link></Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={recentActivities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
