import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, XCircle, RefreshCw, Settings as SettingsIcon, Users, GitBranch, Tag, Target, Bell } from "lucide-react";

const integrations = [
  { name: 'Google Ads', status: 'connected', lastSync: '2 min ago', health: 'healthy', frequency: 'Every 15 min' },
  { name: 'Google Analytics', status: 'connected', lastSync: '5 min ago', health: 'healthy', frequency: 'Every 30 min' },
  { name: 'Meta Ads', status: 'connected', lastSync: '1 min ago', health: 'healthy', frequency: 'Every 15 min' },
  { name: 'TikTok Ads', status: 'connected', lastSync: '10 min ago', health: 'warning', frequency: 'Every 30 min' },
  { name: 'LinkedIn Ads', status: 'connected', lastSync: '3 min ago', health: 'healthy', frequency: 'Every 15 min' },
  { name: 'Snap Ads', status: 'connected', lastSync: '8 min ago', health: 'healthy', frequency: 'Every 30 min' },
  { name: 'Webhooks', status: 'active', lastSync: 'Real-time', health: 'healthy', frequency: 'Real-time' },
  { name: 'CRM Automation', status: 'not_connected', lastSync: '—', health: 'inactive', frequency: '—' },
];

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-fade-in">
        <SectionHeader title="Settings" description="Manage integrations, team, and platform configuration" />

        <Tabs defaultValue="integrations">
          <TabsList>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="fields">Custom Fields</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {integrations.map(int => (
                <Card key={int.name} className="rounded-2xl">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{int.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          {int.health === 'healthy' ? (
                            <CheckCircle className="h-3.5 w-3.5 text-success" />
                          ) : int.health === 'warning' ? (
                            <RefreshCw className="h-3.5 w-3.5 text-warning" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground capitalize">{int.health}</span>
                        </div>
                      </div>
                      <Badge variant={int.status === 'connected' || int.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                        {int.status === 'not_connected' ? 'Not Connected' : 'Connected'}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span className="font-medium">{int.lastSync}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Frequency</span>
                        <span className="font-medium">{int.frequency}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                      {int.status === 'not_connected' ? 'Connect' : 'Configure'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Team Members</h3>
                  <Button size="sm">Invite User</Button>
                </div>
                {['Sarah Chen - Sales Manager - Admin', 'Marcus Johnson - Account Executive - Member', 'Emily Rodriguez - SDR - Member', 'David Kim - Marketing Lead - Member', 'Lisa Wang - Account Executive - Member'].map((user) => {
                  const [name, role, access] = user.split(' - ');
                  return (
                    <div key={name} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-xs text-muted-foreground">{role}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{access}</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="mt-4">
            <Card className="rounded-2xl"><CardContent className="p-5">
              <h3 className="font-semibold mb-4">Pipeline Stages</h3>
              {['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((stage, i) => (
                <div key={stage} className="flex items-center justify-between py-2.5 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono w-6">{i + 1}</span>
                    <span className="text-sm font-medium">{stage}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="fields" className="mt-4">
            <Card className="rounded-2xl"><CardContent className="p-8 text-center text-muted-foreground">
              <SettingsIcon className="h-8 w-8 mx-auto mb-3" />
              <p className="text-sm font-medium">Custom Fields</p>
              <p className="text-xs mt-1">Configure custom fields for leads, contacts, and deals</p>
              <Button size="sm" className="mt-3">Add Custom Field</Button>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="attribution" className="mt-4">
            <Card className="rounded-2xl"><CardContent className="p-5">
              <h3 className="font-semibold mb-4">Attribution Model</h3>
              {['First Touch', 'Last Touch', 'Linear', 'Time Decay', 'Position Based'].map((model) => (
                <div key={model} className="flex items-center justify-between py-2.5 border-b last:border-0">
                  <span className="text-sm font-medium">{model}</span>
                  <Badge variant={model === 'Last Touch' ? 'default' : 'secondary'} className="text-[10px]">
                    {model === 'Last Touch' ? 'Active' : 'Available'}
                  </Badge>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card className="rounded-2xl"><CardContent className="p-5">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              {['New lead assigned', 'Deal stage changed', 'Task overdue', 'Campaign budget alert', 'Weekly report'].map(item => (
                <div key={item} className="flex items-center justify-between py-2.5 border-b last:border-0">
                  <span className="text-sm">{item}</span>
                  <Badge variant="default" className="text-[10px]">Enabled</Badge>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
