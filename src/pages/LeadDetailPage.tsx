import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { leads, activities, deals } from "@/data/mock-data";
import { PlatformBadge } from "@/components/dashboard/PlatformBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Building2, MapPin, Globe, Tag, ExternalLink } from "lucide-react";

export default function LeadDetailPage() {
  const { id } = useParams();
  const lead = leads.find(l => l.id === id) || leads[0];
  const relatedActivities = activities.filter(a => a.relatedId === lead.id || a.relatedName === lead.name).slice(0, 5);
  const relatedDeal = deals.find(d => d.contactName === lead.name);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link to="/leads"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-xl font-bold">Lead Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header Card */}
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold">{lead.name}</h2>
                      <StatusBadge status={lead.status} />
                      <PlatformBadge platform={lead.source} />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{lead.email}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{lead.phone}</span>
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{lead.company}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${lead.score >= 80 ? 'bg-success/10 text-success' : lead.score >= 50 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                        Score: {lead.score}
                      </div>
                      <span className="text-xs text-muted-foreground">Owner: {lead.owner}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {lead.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px]"><Tag className="h-2.5 w-2.5 mr-1" />{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm">Convert to Contact</Button>
                  <Button size="sm" variant="outline">Create Deal</Button>
                  <Button size="sm" variant="outline">Add Note</Button>
                  <Button size="sm" variant="outline">Schedule Task</Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="attribution">Attribution</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4">
                    {relatedActivities.length > 0 ? (
                      <ActivityTimeline activities={relatedActivities} />
                    ) : (
                      <p className="text-sm text-muted-foreground py-8 text-center">No activities yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground py-8 text-center">No notes yet. Add your first note above.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4">
                    {lead.nextTask ? (
                      <div className="p-3 rounded-lg bg-accent">
                        <p className="text-sm font-medium">{lead.nextTask}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Assigned to {lead.owner}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-8 text-center">No tasks assigned</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attribution" className="mt-4">
                <Card className="rounded-2xl">
                  <CardContent className="p-4 space-y-3">
                    {[
                      { label: 'Campaign', value: lead.campaignName },
                      { label: 'Ad Group', value: lead.adGroup },
                      { label: 'Ad', value: lead.ad },
                      { label: 'Landing Page', value: lead.landingPage },
                      { label: 'UTM Source', value: lead.utmSource },
                      { label: 'UTM Medium', value: lead.utmMedium },
                      { label: 'UTM Campaign', value: lead.utmCampaign },
                      { label: 'Click ID', value: lead.clickId },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <span className="text-xs font-medium">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Related Deal */}
            {relatedDeal && (
              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Related Deal</CardTitle></CardHeader>
                <CardContent>
                  <Link to={`/deals/${relatedDeal.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div>
                      <p className="text-sm font-medium">{relatedDeal.title}</p>
                      <p className="text-xs text-muted-foreground">{relatedDeal.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${relatedDeal.value.toLocaleString()}</p>
                      <StatusBadge status={relatedDeal.stage} />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Source Attribution</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <PlatformBadge platform={lead.source} />
                  <span className="text-sm font-medium">{lead.campaignName}</span>
                </div>
                {[
                  { label: 'Ad Group', value: lead.adGroup },
                  { label: 'Ad Creative', value: lead.ad },
                  { label: 'Landing Page', value: lead.landingPage },
                  { label: 'Click ID', value: lead.clickId },
                  { label: 'Created', value: new Date(lead.createdAt).toLocaleDateString() },
                  { label: 'Last Activity', value: new Date(lead.lastActivity).toLocaleDateString() },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-medium max-w-[150px] truncate">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">UTM Parameters</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'utm_source', value: lead.utmSource },
                  { label: 'utm_medium', value: lead.utmMedium },
                  { label: 'utm_campaign', value: lead.utmCampaign },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5">
                    <code className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">{item.label}</code>
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
