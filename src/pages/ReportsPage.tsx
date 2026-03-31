import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Handshake, Globe, Target, FileBarChart, GitCompare } from "lucide-react";

const reports = [
  { id: 'platform', title: 'Platform Performance', description: 'Compare spend, leads, and revenue across all ad platforms', icon: Globe, color: 'text-primary' },
  { id: 'campaign-revenue', title: 'Campaign to Revenue', description: 'Track campaign performance from spend to closed revenue', icon: TrendingUp, color: 'text-success' },
  { id: 'lead-source', title: 'Lead Source Analysis', description: 'Analyze lead quality and volume by source and campaign', icon: Users, color: 'text-info' },
  { id: 'funnel', title: 'Sales Funnel', description: 'Conversion rates through each stage of the pipeline', icon: BarChart3, color: 'text-warning' },
  { id: 'owner', title: 'Owner Performance', description: 'Compare sales performance by team member', icon: Users, color: 'text-primary' },
  { id: 'win-loss', title: 'Deal Win/Loss Analysis', description: 'Analyze patterns in won and lost deals', icon: Handshake, color: 'text-success' },
  { id: 'landing-page', title: 'Landing Page Performance', description: 'Conversion rates and lead quality by landing page', icon: FileBarChart, color: 'text-info' },
  { id: 'attribution', title: 'Attribution Comparison', description: 'Compare first-touch, last-touch, and platform attribution', icon: GitCompare, color: 'text-warning', link: '/reports/attribution' },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Reports" description="Advanced analytics and intelligence reports" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reports.map(report => (
            <Link to={report.link || `/reports/${report.id}`} key={report.id}>
              <Card className="rounded-2xl hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl bg-muted p-2.5 ${report.color}`}>
                      <report.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{report.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
