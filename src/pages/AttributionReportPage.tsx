import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { funnelData, platformSpendData } from "@/data/mock-data";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const attributionComparisonData = [
  { platform: 'Google Ads', platformReported: 312, firstParty: 267, crmQualified: 134, wonRevenue: 632600 },
  { platform: 'Meta Ads', platformReported: 445, firstParty: 389, crmQualified: 189, wonRevenue: 354900 },
  { platform: 'LinkedIn Ads', platformReported: 198, firstParty: 145, crmQualified: 98, wonRevenue: 379700 },
  { platform: 'TikTok Ads', platformReported: 156, firstParty: 123, crmQualified: 45, wonRevenue: 34500 },
  { platform: 'Snap Ads', platformReported: 112, firstParty: 89, crmQualified: 23, wonRevenue: 12400 },
];

export default function AttributionReportPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/reports"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <SectionHeader title="Attribution Report" description="Compare platform-reported vs. CRM-verified conversions" />
        </div>

        {/* Funnel */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Full Funnel: Source to Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-2 py-6">
              {[
                { label: 'Impressions', value: funnelData.impressions },
                { label: 'Clicks', value: funnelData.clicks },
                { label: 'Leads', value: funnelData.leads },
                { label: 'Qualified', value: funnelData.qualified },
                { label: 'Deals', value: funnelData.deals },
                { label: 'Won', value: funnelData.won },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="text-center px-5 py-4 rounded-xl bg-gradient-to-b from-primary/5 to-primary/15 border border-primary/10 min-w-[110px]">
                    <p className="text-xl font-bold">{formatNumber(step.value)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-0.5">{step.label}</p>
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

        {/* Attribution Comparison Chart */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Platform-Reported vs First-Party vs CRM Qualified</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attributionComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="platform" tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="platformReported" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Platform Reported" />
                  <Bar dataKey="firstParty" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="First-Party" />
                  <Bar dataKey="crmQualified" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="CRM Qualified" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Discrepancy Table */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Attribution Discrepancy Analysis</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-muted-foreground">Platform</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">Platform Reported</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">First-Party Leads</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">Discrepancy</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">CRM Qualified</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">Qual. Rate</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">Won Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {attributionComparisonData.map(row => {
                    const discrepancy = ((row.platformReported - row.firstParty) / row.platformReported * 100);
                    const qualRate = (row.crmQualified / row.firstParty * 100);
                    return (
                      <tr key={row.platform} className="border-b last:border-0 hover:bg-accent/50 transition-colors">
                        <td className="py-3 font-medium">{row.platform}</td>
                        <td className="py-3 text-right">{row.platformReported}</td>
                        <td className="py-3 text-right">{row.firstParty}</td>
                        <td className="py-3 text-right">
                          <span className="text-destructive font-medium">-{discrepancy.toFixed(1)}%</span>
                        </td>
                        <td className="py-3 text-right">{row.crmQualified}</td>
                        <td className="py-3 text-right">{qualRate.toFixed(1)}%</td>
                        <td className="py-3 text-right font-medium text-success">${(row.wonRevenue / 1000).toFixed(1)}K</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
