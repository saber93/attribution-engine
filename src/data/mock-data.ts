// ==================== TYPES ====================
export type Platform = 'google' | 'meta' | 'tiktok' | 'linkedin' | 'snapchat';
export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';
export type DealStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType = 'call' | 'follow-up' | 'meeting' | 'email' | 'whatsapp' | 'review';
export type ActivityType = 'call' | 'email' | 'whatsapp' | 'meeting' | 'note' | 'system';

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  objective: string;
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  deals: number;
  revenue: number;
  startDate: string;
  endDate: string;
  ctr: number;
  cpc: number;
  roas: number;
  dailyBudget: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyId: string;
  source: Platform;
  campaignId: string;
  campaignName: string;
  adGroup: string;
  ad: string;
  landingPage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  clickId: string;
  status: LeadStatus;
  score: number;
  owner: string;
  ownerId: string;
  createdAt: string;
  lastActivity: string;
  nextTask: string;
  tags: string[];
  avatar?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyId: string;
  position: string;
  lifecycleStage: string;
  owner: string;
  ownerId: string;
  source: Platform;
  totalDeals: number;
  wonRevenue: number;
  createdAt: string;
  lastActivity: string;
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  size: string;
  contactsCount: number;
  activeDeals: number;
  wonRevenue: number;
  owner: string;
  ownerId: string;
  sourceMix: { platform: Platform; percentage: number }[];
  createdAt: string;
  logo?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  contactId: string;
  contactName: string;
  companyId: string;
  companyName: string;
  owner: string;
  ownerId: string;
  source: Platform;
  campaignId: string;
  campaignName: string;
  expectedCloseDate: string;
  createdAt: string;
  lastActivity: string;
  hasOverdueTask: boolean;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  owner: string;
  ownerId: string;
  relatedType: 'lead' | 'contact' | 'deal' | 'company';
  relatedId: string;
  relatedName: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  owner: string;
  ownerId: string;
  relatedType: 'lead' | 'contact' | 'deal' | 'company';
  relatedId: string;
  relatedName: string;
  timestamp: string;
  duration?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

// ==================== TEAM ====================
export const teamMembers: TeamMember[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Sales Manager', avatar: 'SC' },
  { id: 'u2', name: 'Marcus Johnson', email: 'marcus@company.com', role: 'Account Executive', avatar: 'MJ' },
  { id: 'u3', name: 'Emily Rodriguez', email: 'emily@company.com', role: 'SDR', avatar: 'ER' },
  { id: 'u4', name: 'David Kim', email: 'david@company.com', role: 'Marketing Lead', avatar: 'DK' },
  { id: 'u5', name: 'Lisa Wang', email: 'lisa@company.com', role: 'Account Executive', avatar: 'LW' },
];

// ==================== CAMPAIGNS ====================
export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Brand Awareness Q1 2026', platform: 'google', status: 'active', objective: 'Brand Awareness', spend: 45200, impressions: 2340000, clicks: 67800, leads: 342, qualifiedLeads: 156, deals: 28, revenue: 186400, startDate: '2026-01-01', endDate: '2026-03-31', ctr: 2.9, cpc: 0.67, roas: 4.12, dailyBudget: 500 },
  { id: 'c2', name: 'Lead Gen - Enterprise SaaS', platform: 'meta', status: 'active', objective: 'Lead Generation', spend: 32100, impressions: 1890000, clicks: 45200, leads: 567, qualifiedLeads: 234, deals: 42, revenue: 312800, startDate: '2026-01-15', endDate: '2026-03-31', ctr: 2.4, cpc: 0.71, roas: 9.74, dailyBudget: 420 },
  { id: 'c3', name: 'Product Launch - AI Features', platform: 'linkedin', status: 'active', objective: 'Conversions', spend: 28900, impressions: 890000, clicks: 23400, leads: 189, qualifiedLeads: 98, deals: 15, revenue: 145200, startDate: '2026-02-01', endDate: '2026-03-31', ctr: 2.6, cpc: 1.24, roas: 5.02, dailyBudget: 480 },
  { id: 'c4', name: 'Retargeting - Website Visitors', platform: 'google', status: 'active', objective: 'Conversions', spend: 18400, impressions: 1560000, clicks: 42100, leads: 234, qualifiedLeads: 145, deals: 35, revenue: 267300, startDate: '2026-01-01', endDate: '2026-03-31', ctr: 2.7, cpc: 0.44, roas: 14.53, dailyBudget: 200 },
  { id: 'c5', name: 'SMB Growth Campaign', platform: 'meta', status: 'paused', objective: 'Lead Generation', spend: 12800, impressions: 980000, clicks: 28900, leads: 178, qualifiedLeads: 67, deals: 8, revenue: 42100, startDate: '2026-01-01', endDate: '2026-02-28', ctr: 2.9, cpc: 0.44, roas: 3.29, dailyBudget: 220 },
  { id: 'c6', name: 'Video Ads - Platform Demo', platform: 'tiktok', status: 'active', objective: 'Video Views', spend: 8900, impressions: 3400000, clicks: 89000, leads: 123, qualifiedLeads: 45, deals: 6, revenue: 34500, startDate: '2026-02-15', endDate: '2026-03-31', ctr: 2.6, cpc: 0.10, roas: 3.88, dailyBudget: 200 },
  { id: 'c7', name: 'Competitor Targeting', platform: 'google', status: 'active', objective: 'Conversions', spend: 22300, impressions: 1200000, clicks: 34500, leads: 267, qualifiedLeads: 134, deals: 22, revenue: 178900, startDate: '2026-01-15', endDate: '2026-03-31', ctr: 2.9, cpc: 0.65, roas: 8.02, dailyBudget: 300 },
  { id: 'c8', name: 'Snapchat Gen Z Outreach', platform: 'snapchat', status: 'active', objective: 'Lead Generation', spend: 6200, impressions: 2100000, clicks: 56000, leads: 89, qualifiedLeads: 23, deals: 3, revenue: 12400, startDate: '2026-03-01', endDate: '2026-03-31', ctr: 2.7, cpc: 0.11, roas: 2.0, dailyBudget: 200 },
  { id: 'c9', name: 'LinkedIn Decision Makers', platform: 'linkedin', status: 'completed', objective: 'Lead Generation', spend: 35600, impressions: 670000, clicks: 18900, leads: 145, qualifiedLeads: 89, deals: 18, revenue: 234500, startDate: '2025-10-01', endDate: '2025-12-31', ctr: 2.8, cpc: 1.88, roas: 6.59, dailyBudget: 390 },
  { id: 'c10', name: 'Holiday Promo Campaign', platform: 'meta', status: 'completed', objective: 'Conversions', spend: 41200, impressions: 2800000, clicks: 78000, leads: 456, qualifiedLeads: 198, deals: 45, revenue: 389200, startDate: '2025-11-01', endDate: '2025-12-31', ctr: 2.8, cpc: 0.53, roas: 9.45, dailyBudget: 670 },
];

// ==================== LEADS ====================
export const leads: Lead[] = [
  { id: 'l1', name: 'Alex Thompson', email: 'alex.t@techcorp.io', phone: '+1 (555) 234-5678', company: 'TechCorp Solutions', companyId: 'co1', source: 'google', campaignId: 'c1', campaignName: 'Brand Awareness Q1 2026', adGroup: 'Enterprise Keywords', ad: 'Transform Your Business', landingPage: '/enterprise-demo', utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'brand-q1-2026', clickId: 'gclid_abc123', status: 'qualified', score: 85, owner: 'Sarah Chen', ownerId: 'u1', createdAt: '2026-03-28T10:30:00Z', lastActivity: '2026-03-30T14:20:00Z', nextTask: 'Schedule demo call', tags: ['enterprise', 'high-value'] },
  { id: 'l2', name: 'Maria Garcia', email: 'maria@innovate.co', phone: '+1 (555) 345-6789', company: 'Innovate Co', companyId: 'co2', source: 'meta', campaignId: 'c2', campaignName: 'Lead Gen - Enterprise SaaS', adGroup: 'Lookalike Audience', ad: 'Scale Your Operations', landingPage: '/free-trial', utmSource: 'facebook', utmMedium: 'paid', utmCampaign: 'leadgen-enterprise', clickId: 'fbclid_def456', status: 'new', score: 72, owner: 'Marcus Johnson', ownerId: 'u2', createdAt: '2026-03-30T08:15:00Z', lastActivity: '2026-03-30T08:15:00Z', nextTask: 'Initial outreach', tags: ['mid-market'] },
  { id: 'l3', name: 'James Wilson', email: 'j.wilson@globalfin.com', phone: '+1 (555) 456-7890', company: 'Global Finance Ltd', companyId: 'co3', source: 'linkedin', campaignId: 'c3', campaignName: 'Product Launch - AI Features', adGroup: 'C-Suite Targeting', ad: 'AI-Powered Analytics', landingPage: '/ai-features', utmSource: 'linkedin', utmMedium: 'sponsored', utmCampaign: 'ai-launch', clickId: 'li_ghi789', status: 'contacted', score: 91, owner: 'Sarah Chen', ownerId: 'u1', createdAt: '2026-03-25T16:45:00Z', lastActivity: '2026-03-29T11:30:00Z', nextTask: 'Follow up on proposal', tags: ['enterprise', 'finance', 'high-value'] },
  { id: 'l4', name: 'Sophie Laurent', email: 'sophie@designhub.fr', phone: '+33 6 12 34 56 78', company: 'DesignHub Europe', companyId: 'co4', source: 'meta', campaignId: 'c2', campaignName: 'Lead Gen - Enterprise SaaS', adGroup: 'Interest Targeting', ad: 'Design at Scale', landingPage: '/demo', utmSource: 'instagram', utmMedium: 'paid', utmCampaign: 'leadgen-enterprise', clickId: 'fbclid_jkl012', status: 'qualified', score: 78, owner: 'Emily Rodriguez', ownerId: 'u3', createdAt: '2026-03-22T09:00:00Z', lastActivity: '2026-03-28T16:10:00Z', nextTask: 'Send pricing deck', tags: ['design', 'europe'] },
  { id: 'l5', name: 'Ryan O\'Brien', email: 'ryan@startupx.io', phone: '+1 (555) 567-8901', company: 'StartupX', companyId: 'co5', source: 'tiktok', campaignId: 'c6', campaignName: 'Video Ads - Platform Demo', adGroup: 'Startup Founders', ad: 'See It In Action', landingPage: '/watch-demo', utmSource: 'tiktok', utmMedium: 'paid', utmCampaign: 'video-demo', clickId: 'ttclid_mno345', status: 'new', score: 45, owner: 'Marcus Johnson', ownerId: 'u2', createdAt: '2026-03-30T12:00:00Z', lastActivity: '2026-03-30T12:00:00Z', nextTask: 'Qualify lead', tags: ['startup', 'smb'] },
  { id: 'l6', name: 'Chen Wei', email: 'chen.w@megacorp.cn', phone: '+86 138 0000 0001', company: 'MegaCorp International', companyId: 'co6', source: 'google', campaignId: 'c7', campaignName: 'Competitor Targeting', adGroup: 'Competitor Keywords', ad: 'Switch to Better', landingPage: '/compare', utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'competitor', clickId: 'gclid_pqr678', status: 'qualified', score: 93, owner: 'Lisa Wang', ownerId: 'u5', createdAt: '2026-03-18T07:30:00Z', lastActivity: '2026-03-30T09:45:00Z', nextTask: 'Executive meeting', tags: ['enterprise', 'apac', 'high-value'] },
  { id: 'l7', name: 'Priya Patel', email: 'priya@cloudnine.in', phone: '+91 98765 43210', company: 'CloudNine Tech', companyId: 'co7', source: 'linkedin', campaignId: 'c3', campaignName: 'Product Launch - AI Features', adGroup: 'Tech Leaders', ad: 'Next-Gen Platform', landingPage: '/ai-features', utmSource: 'linkedin', utmMedium: 'sponsored', utmCampaign: 'ai-launch', clickId: 'li_stu901', status: 'converted', score: 88, owner: 'Sarah Chen', ownerId: 'u1', createdAt: '2026-03-10T14:20:00Z', lastActivity: '2026-03-29T17:00:00Z', nextTask: '', tags: ['tech', 'converted'] },
  { id: 'l8', name: 'Tom Baker', email: 'tom@retailplus.com', phone: '+1 (555) 678-9012', company: 'RetailPlus', companyId: 'co8', source: 'google', campaignId: 'c4', campaignName: 'Retargeting - Website Visitors', adGroup: 'Cart Abandoners', ad: 'Come Back & Save', landingPage: '/special-offer', utmSource: 'google', utmMedium: 'display', utmCampaign: 'retargeting', clickId: 'gclid_vwx234', status: 'lost', score: 32, owner: 'Emily Rodriguez', ownerId: 'u3', createdAt: '2026-02-15T11:00:00Z', lastActivity: '2026-03-15T09:30:00Z', nextTask: '', tags: ['retail', 'lost'] },
  { id: 'l9', name: 'Hannah Schmidt', email: 'hannah@automate.de', phone: '+49 170 1234567', company: 'Automate GmbH', companyId: 'co9', source: 'meta', campaignId: 'c10', campaignName: 'Holiday Promo Campaign', adGroup: 'EU Business', ad: 'End of Year Deal', landingPage: '/promo', utmSource: 'facebook', utmMedium: 'paid', utmCampaign: 'holiday-promo', clickId: 'fbclid_yza567', status: 'contacted', score: 65, owner: 'Marcus Johnson', ownerId: 'u2', createdAt: '2026-03-20T13:45:00Z', lastActivity: '2026-03-27T10:20:00Z', nextTask: 'Send case study', tags: ['europe', 'automation'] },
  { id: 'l10', name: 'Kevin Park', email: 'kevin@nexgen.kr', phone: '+82 10 9876 5432', company: 'NexGen Solutions', companyId: 'co10', source: 'snapchat', campaignId: 'c8', campaignName: 'Snapchat Gen Z Outreach', adGroup: 'Young Entrepreneurs', ad: 'Build Your Future', landingPage: '/start', utmSource: 'snapchat', utmMedium: 'paid', utmCampaign: 'genz-outreach', clickId: 'scclid_bcd890', status: 'new', score: 38, owner: 'Emily Rodriguez', ownerId: 'u3', createdAt: '2026-03-30T15:30:00Z', lastActivity: '2026-03-30T15:30:00Z', nextTask: 'Initial contact', tags: ['startup', 'apac'] },
];

// ==================== CONTACTS ====================
export const contacts: Contact[] = [
  { id: 'ct1', name: 'Alex Thompson', email: 'alex.t@techcorp.io', phone: '+1 (555) 234-5678', company: 'TechCorp Solutions', companyId: 'co1', position: 'VP of Engineering', lifecycleStage: 'Customer', owner: 'Sarah Chen', ownerId: 'u1', source: 'google', totalDeals: 2, wonRevenue: 86400, createdAt: '2026-01-15T10:30:00Z', lastActivity: '2026-03-30T14:20:00Z' },
  { id: 'ct2', name: 'Maria Garcia', email: 'maria@innovate.co', phone: '+1 (555) 345-6789', company: 'Innovate Co', companyId: 'co2', position: 'CEO', lifecycleStage: 'Lead', owner: 'Marcus Johnson', ownerId: 'u2', source: 'meta', totalDeals: 0, wonRevenue: 0, createdAt: '2026-03-30T08:15:00Z', lastActivity: '2026-03-30T08:15:00Z' },
  { id: 'ct3', name: 'James Wilson', email: 'j.wilson@globalfin.com', phone: '+1 (555) 456-7890', company: 'Global Finance Ltd', companyId: 'co3', position: 'CTO', lifecycleStage: 'Opportunity', owner: 'Sarah Chen', ownerId: 'u1', source: 'linkedin', totalDeals: 1, wonRevenue: 0, createdAt: '2026-02-01T16:45:00Z', lastActivity: '2026-03-29T11:30:00Z' },
  { id: 'ct4', name: 'Sophie Laurent', email: 'sophie@designhub.fr', phone: '+33 6 12 34 56 78', company: 'DesignHub Europe', companyId: 'co4', position: 'Head of Product', lifecycleStage: 'Opportunity', owner: 'Emily Rodriguez', ownerId: 'u3', source: 'meta', totalDeals: 1, wonRevenue: 0, createdAt: '2026-02-22T09:00:00Z', lastActivity: '2026-03-28T16:10:00Z' },
  { id: 'ct5', name: 'Chen Wei', email: 'chen.w@megacorp.cn', phone: '+86 138 0000 0001', company: 'MegaCorp International', companyId: 'co6', position: 'Director of Operations', lifecycleStage: 'Customer', owner: 'Lisa Wang', ownerId: 'u5', source: 'google', totalDeals: 3, wonRevenue: 245000, createdAt: '2025-11-01T07:30:00Z', lastActivity: '2026-03-30T09:45:00Z' },
  { id: 'ct6', name: 'Priya Patel', email: 'priya@cloudnine.in', phone: '+91 98765 43210', company: 'CloudNine Tech', companyId: 'co7', position: 'Founder & CEO', lifecycleStage: 'Customer', owner: 'Sarah Chen', ownerId: 'u1', source: 'linkedin', totalDeals: 1, wonRevenue: 67800, createdAt: '2026-01-10T14:20:00Z', lastActivity: '2026-03-29T17:00:00Z' },
];

// ==================== COMPANIES ====================
export const companies: Company[] = [
  { id: 'co1', name: 'TechCorp Solutions', industry: 'Technology', website: 'techcorp.io', size: '500-1000', contactsCount: 4, activeDeals: 1, wonRevenue: 86400, owner: 'Sarah Chen', ownerId: 'u1', sourceMix: [{ platform: 'google', percentage: 60 }, { platform: 'linkedin', percentage: 40 }], createdAt: '2025-08-15' },
  { id: 'co2', name: 'Innovate Co', industry: 'Software', website: 'innovate.co', size: '50-200', contactsCount: 2, activeDeals: 0, wonRevenue: 0, owner: 'Marcus Johnson', ownerId: 'u2', sourceMix: [{ platform: 'meta', percentage: 100 }], createdAt: '2026-03-30' },
  { id: 'co3', name: 'Global Finance Ltd', industry: 'Financial Services', website: 'globalfin.com', size: '1000-5000', contactsCount: 6, activeDeals: 2, wonRevenue: 0, owner: 'Sarah Chen', ownerId: 'u1', sourceMix: [{ platform: 'linkedin', percentage: 70 }, { platform: 'google', percentage: 30 }], createdAt: '2025-10-01' },
  { id: 'co4', name: 'DesignHub Europe', industry: 'Design', website: 'designhub.fr', size: '200-500', contactsCount: 3, activeDeals: 1, wonRevenue: 0, owner: 'Emily Rodriguez', ownerId: 'u3', sourceMix: [{ platform: 'meta', percentage: 80 }, { platform: 'google', percentage: 20 }], createdAt: '2026-01-22' },
  { id: 'co5', name: 'StartupX', industry: 'Technology', website: 'startupx.io', size: '10-50', contactsCount: 1, activeDeals: 0, wonRevenue: 0, owner: 'Marcus Johnson', ownerId: 'u2', sourceMix: [{ platform: 'tiktok', percentage: 100 }], createdAt: '2026-03-30' },
  { id: 'co6', name: 'MegaCorp International', industry: 'Manufacturing', website: 'megacorp.cn', size: '5000+', contactsCount: 8, activeDeals: 1, wonRevenue: 245000, owner: 'Lisa Wang', ownerId: 'u5', sourceMix: [{ platform: 'google', percentage: 50 }, { platform: 'linkedin', percentage: 50 }], createdAt: '2025-06-01' },
  { id: 'co7', name: 'CloudNine Tech', industry: 'Cloud Services', website: 'cloudnine.in', size: '200-500', contactsCount: 3, activeDeals: 0, wonRevenue: 67800, owner: 'Sarah Chen', ownerId: 'u1', sourceMix: [{ platform: 'linkedin', percentage: 60 }, { platform: 'meta', percentage: 40 }], createdAt: '2025-09-15' },
  { id: 'co8', name: 'RetailPlus', industry: 'Retail', website: 'retailplus.com', size: '1000-5000', contactsCount: 5, activeDeals: 0, wonRevenue: 0, owner: 'Emily Rodriguez', ownerId: 'u3', sourceMix: [{ platform: 'google', percentage: 70 }, { platform: 'meta', percentage: 30 }], createdAt: '2025-12-01' },
];

// ==================== DEALS ====================
export const deals: Deal[] = [
  { id: 'd1', title: 'TechCorp Enterprise License', value: 125000, stage: 'negotiation', probability: 75, contactId: 'ct1', contactName: 'Alex Thompson', companyId: 'co1', companyName: 'TechCorp Solutions', owner: 'Sarah Chen', ownerId: 'u1', source: 'google', campaignId: 'c1', campaignName: 'Brand Awareness Q1 2026', expectedCloseDate: '2026-04-15', createdAt: '2026-02-15', lastActivity: '2026-03-30T14:20:00Z', hasOverdueTask: false },
  { id: 'd2', title: 'Global Finance Platform Deal', value: 340000, stage: 'proposal', probability: 50, contactId: 'ct3', contactName: 'James Wilson', companyId: 'co3', companyName: 'Global Finance Ltd', owner: 'Sarah Chen', ownerId: 'u1', source: 'linkedin', campaignId: 'c3', campaignName: 'Product Launch - AI Features', expectedCloseDate: '2026-05-01', createdAt: '2026-03-01', lastActivity: '2026-03-29T11:30:00Z', hasOverdueTask: true },
  { id: 'd3', title: 'DesignHub Annual Plan', value: 48000, stage: 'qualified', probability: 40, contactId: 'ct4', contactName: 'Sophie Laurent', companyId: 'co4', companyName: 'DesignHub Europe', owner: 'Emily Rodriguez', ownerId: 'u3', source: 'meta', campaignId: 'c2', campaignName: 'Lead Gen - Enterprise SaaS', expectedCloseDate: '2026-04-30', createdAt: '2026-03-10', lastActivity: '2026-03-28T16:10:00Z', hasOverdueTask: false },
  { id: 'd4', title: 'MegaCorp Expansion', value: 520000, stage: 'negotiation', probability: 80, contactId: 'ct5', contactName: 'Chen Wei', companyId: 'co6', companyName: 'MegaCorp International', owner: 'Lisa Wang', ownerId: 'u5', source: 'google', campaignId: 'c7', campaignName: 'Competitor Targeting', expectedCloseDate: '2026-04-10', createdAt: '2026-02-01', lastActivity: '2026-03-30T09:45:00Z', hasOverdueTask: false },
  { id: 'd5', title: 'CloudNine Migration Project', value: 67800, stage: 'won', probability: 100, contactId: 'ct6', contactName: 'Priya Patel', companyId: 'co7', companyName: 'CloudNine Tech', owner: 'Sarah Chen', ownerId: 'u1', source: 'linkedin', campaignId: 'c3', campaignName: 'Product Launch - AI Features', expectedCloseDate: '2026-03-15', createdAt: '2026-01-20', lastActivity: '2026-03-15T10:00:00Z', hasOverdueTask: false },
  { id: 'd6', title: 'TechCorp Add-on Module', value: 35000, stage: 'won', probability: 100, contactId: 'ct1', contactName: 'Alex Thompson', companyId: 'co1', companyName: 'TechCorp Solutions', owner: 'Sarah Chen', ownerId: 'u1', source: 'google', campaignId: 'c4', campaignName: 'Retargeting - Website Visitors', expectedCloseDate: '2026-02-28', createdAt: '2026-01-10', lastActivity: '2026-02-28T15:00:00Z', hasOverdueTask: false },
  { id: 'd7', title: 'RetailPlus Pilot', value: 22000, stage: 'lost', probability: 0, contactId: 'ct1', contactName: 'Tom Baker', companyId: 'co8', companyName: 'RetailPlus', owner: 'Emily Rodriguez', ownerId: 'u3', source: 'google', campaignId: 'c4', campaignName: 'Retargeting - Website Visitors', expectedCloseDate: '2026-03-01', createdAt: '2026-02-01', lastActivity: '2026-03-15T09:30:00Z', hasOverdueTask: false },
  { id: 'd8', title: 'Innovate Co Starter Plan', value: 18500, stage: 'new', probability: 10, contactId: 'ct2', contactName: 'Maria Garcia', companyId: 'co2', companyName: 'Innovate Co', owner: 'Marcus Johnson', ownerId: 'u2', source: 'meta', campaignId: 'c2', campaignName: 'Lead Gen - Enterprise SaaS', expectedCloseDate: '2026-05-15', createdAt: '2026-03-30', lastActivity: '2026-03-30T08:15:00Z', hasOverdueTask: false },
  { id: 'd9', title: 'MegaCorp Analytics Suite', value: 180000, stage: 'won', probability: 100, contactId: 'ct5', contactName: 'Chen Wei', companyId: 'co6', companyName: 'MegaCorp International', owner: 'Lisa Wang', ownerId: 'u5', source: 'google', campaignId: 'c1', campaignName: 'Brand Awareness Q1 2026', expectedCloseDate: '2026-01-31', createdAt: '2025-11-15', lastActivity: '2026-01-31T12:00:00Z', hasOverdueTask: false },
  { id: 'd10', title: 'Global Finance Phase 2', value: 210000, stage: 'contacted', probability: 20, contactId: 'ct3', contactName: 'James Wilson', companyId: 'co3', companyName: 'Global Finance Ltd', owner: 'Sarah Chen', ownerId: 'u1', source: 'linkedin', campaignId: 'c9', campaignName: 'LinkedIn Decision Makers', expectedCloseDate: '2026-06-01', createdAt: '2026-03-25', lastActivity: '2026-03-29T11:30:00Z', hasOverdueTask: false },
];

// ==================== TASKS ====================
export const tasks: Task[] = [
  { id: 't1', title: 'Schedule demo call with Alex', type: 'call', priority: 'high', dueDate: '2026-03-31', completed: false, owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'deal', relatedId: 'd1', relatedName: 'TechCorp Enterprise License', createdAt: '2026-03-28' },
  { id: 't2', title: 'Send pricing proposal to James', type: 'email', priority: 'urgent', dueDate: '2026-03-30', completed: false, owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'deal', relatedId: 'd2', relatedName: 'Global Finance Platform Deal', createdAt: '2026-03-27' },
  { id: 't3', title: 'Follow up with Maria - initial contact', type: 'follow-up', priority: 'medium', dueDate: '2026-04-01', completed: false, owner: 'Marcus Johnson', ownerId: 'u2', relatedType: 'lead', relatedId: 'l2', relatedName: 'Maria Garcia', createdAt: '2026-03-30' },
  { id: 't4', title: 'Prepare case study for Sophie', type: 'review', priority: 'medium', dueDate: '2026-04-02', completed: false, owner: 'Emily Rodriguez', ownerId: 'u3', relatedType: 'deal', relatedId: 'd3', relatedName: 'DesignHub Annual Plan', createdAt: '2026-03-28' },
  { id: 't5', title: 'Contract review meeting - MegaCorp', type: 'meeting', priority: 'high', dueDate: '2026-03-31', completed: false, owner: 'Lisa Wang', ownerId: 'u5', relatedType: 'deal', relatedId: 'd4', relatedName: 'MegaCorp Expansion', createdAt: '2026-03-29' },
  { id: 't6', title: 'Qualify Ryan from StartupX', type: 'call', priority: 'low', dueDate: '2026-04-01', completed: false, owner: 'Marcus Johnson', ownerId: 'u2', relatedType: 'lead', relatedId: 'l5', relatedName: "Ryan O'Brien", createdAt: '2026-03-30' },
  { id: 't7', title: 'Send WhatsApp intro to Kevin', type: 'whatsapp', priority: 'low', dueDate: '2026-04-02', completed: false, owner: 'Emily Rodriguez', ownerId: 'u3', relatedType: 'lead', relatedId: 'l10', relatedName: 'Kevin Park', createdAt: '2026-03-30' },
  { id: 't8', title: 'Review Q1 campaign performance', type: 'review', priority: 'medium', dueDate: '2026-04-03', completed: false, owner: 'David Kim', ownerId: 'u4', relatedType: 'company', relatedId: 'co1', relatedName: 'TechCorp Solutions', createdAt: '2026-03-30' },
  { id: 't9', title: 'Follow up on sent proposal', type: 'follow-up', priority: 'high', dueDate: '2026-03-29', completed: false, owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'deal', relatedId: 'd2', relatedName: 'Global Finance Platform Deal', createdAt: '2026-03-25' },
  { id: 't10', title: 'Send onboarding docs to Priya', type: 'email', priority: 'medium', dueDate: '2026-03-28', completed: true, owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'deal', relatedId: 'd5', relatedName: 'CloudNine Migration Project', createdAt: '2026-03-15' },
];

// ==================== ACTIVITIES ====================
export const activities: Activity[] = [
  { id: 'a1', type: 'call', title: 'Discovery call with Alex Thompson', description: 'Discussed enterprise requirements. Interested in AI features and custom integrations. Budget approved for Q2.', owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'deal', relatedId: 'd1', relatedName: 'TechCorp Enterprise License', timestamp: '2026-03-30T14:20:00Z', duration: 35 },
  { id: 'a2', type: 'email', title: 'Proposal sent to James Wilson', description: 'Sent detailed platform proposal with custom pricing for 500+ seats.', owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'deal', relatedId: 'd2', relatedName: 'Global Finance Platform Deal', timestamp: '2026-03-29T11:30:00Z' },
  { id: 'a3', type: 'system', title: 'New lead captured', description: 'Maria Garcia from Innovate Co submitted demo request via Lead Gen campaign.', owner: 'System', ownerId: '', relatedType: 'lead', relatedId: 'l2', relatedName: 'Maria Garcia', timestamp: '2026-03-30T08:15:00Z' },
  { id: 'a4', type: 'whatsapp', title: 'WhatsApp follow-up with Sophie', description: 'Sent product comparison document. Sophie confirmed interest in annual plan.', owner: 'Emily Rodriguez', ownerId: 'u3', relatedType: 'deal', relatedId: 'd3', relatedName: 'DesignHub Annual Plan', timestamp: '2026-03-28T16:10:00Z' },
  { id: 'a5', type: 'meeting', title: 'Executive meeting with Chen Wei', description: 'Presented expansion proposal to MegaCorp leadership team. Very positive response.', owner: 'Lisa Wang', ownerId: 'u5', relatedType: 'deal', relatedId: 'd4', relatedName: 'MegaCorp Expansion', timestamp: '2026-03-30T09:45:00Z', duration: 60 },
  { id: 'a6', type: 'note', title: 'Deal won - CloudNine Migration', description: 'Contract signed for $67,800. Implementation starts next week.', owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'deal', relatedId: 'd5', relatedName: 'CloudNine Migration Project', timestamp: '2026-03-15T10:00:00Z' },
  { id: 'a7', type: 'system', title: 'Lead status changed to Lost', description: 'Tom Baker from RetailPlus marked as lost. Reason: Budget constraints.', owner: 'System', ownerId: '', relatedType: 'lead', relatedId: 'l8', relatedName: 'Tom Baker', timestamp: '2026-03-15T09:30:00Z' },
  { id: 'a8', type: 'call', title: 'Qualification call with Hannah', description: 'Initial discovery. Looking for automation solution. Follow-up scheduled.', owner: 'Marcus Johnson', ownerId: 'u2', relatedType: 'lead', relatedId: 'l9', relatedName: 'Hannah Schmidt', timestamp: '2026-03-27T10:20:00Z', duration: 20 },
  { id: 'a9', type: 'email', title: 'Case study sent to Hannah Schmidt', description: 'Sent automation industry case study as requested during call.', owner: 'Marcus Johnson', ownerId: 'u2', relatedType: 'lead', relatedId: 'l9', relatedName: 'Hannah Schmidt', timestamp: '2026-03-27T11:00:00Z' },
  { id: 'a10', type: 'system', title: 'New lead captured from TikTok', description: 'Ryan O\'Brien submitted form via Video Ads campaign.', owner: 'System', ownerId: '', relatedType: 'lead', relatedId: 'l5', relatedName: "Ryan O'Brien", timestamp: '2026-03-30T12:00:00Z' },
  { id: 'a11', type: 'meeting', title: 'Product demo with Priya Patel', description: 'Full platform demo. Very impressed with AI analytics features.', owner: 'Sarah Chen', ownerId: 'u1', relatedType: 'contact', relatedId: 'ct6', relatedName: 'Priya Patel', timestamp: '2026-03-05T14:00:00Z', duration: 45 },
  { id: 'a12', type: 'note', title: 'Competitor analysis note', description: 'Chen Wei mentioned they are also evaluating CompetitorX. We need to highlight our AI advantage.', owner: 'Lisa Wang', ownerId: 'u5', relatedType: 'deal', relatedId: 'd4', relatedName: 'MegaCorp Expansion', timestamp: '2026-03-28T11:00:00Z' },
];

// ==================== HELPER DATA ====================
export const platformColors: Record<Platform, string> = {
  google: '217 91% 60%',
  meta: '221 83% 53%',
  tiktok: '0 0% 10%',
  linkedin: '201 100% 35%',
  snapchat: '55 100% 50%',
};

export const platformNames: Record<Platform, string> = {
  google: 'Google Ads',
  meta: 'Meta Ads',
  tiktok: 'TikTok Ads',
  linkedin: 'LinkedIn Ads',
  snapchat: 'Snap Ads',
};

export const leadStatusColors: Record<LeadStatus, string> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  unqualified: 'muted',
  converted: 'primary',
  lost: 'destructive',
};

export const dealStageColors: Record<DealStage, string> = {
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  proposal: 'primary',
  negotiation: 'warning',
  won: 'success',
  lost: 'destructive',
};

export const taskPriorityColors: Record<TaskPriority, string> = {
  low: 'muted',
  medium: 'info',
  high: 'warning',
  urgent: 'destructive',
};

// ==================== CHART DATA ====================
export const spendVsRevenueData = [
  { month: 'Oct', spend: 28000, revenue: 95000 },
  { month: 'Nov', spend: 35000, revenue: 142000 },
  { month: 'Dec', spend: 42000, revenue: 215000 },
  { month: 'Jan', spend: 38000, revenue: 198000 },
  { month: 'Feb', spend: 41000, revenue: 267000 },
  { month: 'Mar', spend: 52000, revenue: 345000 },
];

export const leadsQualifiedWonData = [
  { month: 'Oct', leads: 280, qualified: 112, won: 22 },
  { month: 'Nov', leads: 345, qualified: 148, won: 31 },
  { month: 'Dec', leads: 410, qualified: 186, won: 45 },
  { month: 'Jan', leads: 380, qualified: 165, won: 38 },
  { month: 'Feb', leads: 420, qualified: 198, won: 42 },
  { month: 'Mar', leads: 510, qualified: 245, won: 56 },
];

export const platformSpendData = [
  { name: 'Google Ads', value: 85900, fill: 'hsl(217 91% 60%)' },
  { name: 'Meta Ads', value: 86100, fill: 'hsl(221 83% 53%)' },
  { name: 'LinkedIn Ads', value: 64500, fill: 'hsl(201 100% 35%)' },
  { name: 'TikTok Ads', value: 8900, fill: 'hsl(0 0% 25%)' },
  { name: 'Snap Ads', value: 6200, fill: 'hsl(55 100% 45%)' },
];

export const pipelineStageData = [
  { stage: 'New', value: 18500, count: 1 },
  { stage: 'Contacted', value: 210000, count: 1 },
  { stage: 'Qualified', value: 48000, count: 1 },
  { stage: 'Proposal', value: 340000, count: 1 },
  { stage: 'Negotiation', value: 645000, count: 2 },
  { stage: 'Won', value: 282800, count: 3 },
  { stage: 'Lost', value: 22000, count: 1 },
];

export const funnelData = {
  impressions: 14960000,
  clicks: 405900,
  leads: 2590,
  qualified: 1189,
  deals: 222,
  won: 56,
};

// ==================== KPI SUMMARY ====================
export const kpiSummary = {
  spend: { value: 251600, change: 12.3, trend: 'up' as const },
  impressions: { value: 14960000, change: 8.7, trend: 'up' as const },
  clicks: { value: 405900, change: 15.2, trend: 'up' as const },
  leads: { value: 2590, change: 22.1, trend: 'up' as const },
  qualifiedLeads: { value: 1189, change: 18.4, trend: 'up' as const },
  dealsCreated: { value: 222, change: 14.6, trend: 'up' as const },
  wonRevenue: { value: 1812700, change: 28.9, trend: 'up' as const },
  roas: { value: 7.2, change: 14.8, trend: 'up' as const },
};
