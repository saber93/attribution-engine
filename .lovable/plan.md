

# Paid Campaign Analytics + CRM Dashboard

## Overview
A premium multi-page SaaS dashboard combining paid ads analytics across Google, Meta, TikTok, LinkedIn, and Snap with a full CRM (leads, contacts, companies, deals, tasks, activities) and source-to-revenue attribution.

## Design System
- Dark/light mode with premium B2B aesthetic
- Rounded-2xl cards, subtle shadows, refined borders, soft gradients for hero stats
- Consistent badge system for statuses (new/active/paused/won/lost/overdue), platforms, priorities
- Reusable components: KPI cards, chart cards, data tables, filter bars, pipeline kanban, detail drawers, activity timelines, skeleton loaders, empty states

## Navigation
- **Sidebar**: Grouped sections — Overview, Campaigns, Leads, Contacts, Companies, Deals, Tasks, Activities, Reports, Settings. Collapsible with icon-only mode.
- **Topbar**: Global search (command palette), date range picker, platform filter, team filter, notifications, quick-create button, profile menu, dark/light toggle

## Pages & Routes

### 1. Overview Dashboard (`/`)
KPI row (Spend, Impressions, Clicks, Leads, Qualified, Deals, Won Revenue, ROAS) with trend indicators. Charts: Spend vs Revenue, Leads funnel, Platform donut, Pipeline bar. Tables: Top campaigns, underperforming campaigns, recent leads, tasks needing attention. Source-to-Revenue funnel visualization. Quick Insights panel.

### 2. Campaigns List (`/campaigns`)
Advanced filter bar, platform tabs, status/objective filters, saved views. Sortable table with Campaign, Platform, Status, Objective, Spend, Impressions, Clicks, CTR, CPC, Leads, Qualified, Deals, Revenue, ROAS. Row selection, bulk actions, export.

### 3. Campaign Details (`/campaigns/:id`)
Header with platform badge/status, KPI strip, performance chart, attribution summary. Tabs: Overview, Ads/Ad Groups, Leads, Deals, Timeline, Attribution. Shows generated leads and won revenue.

### 4. Leads Inbox (`/leads`)
List/table toggle, filters (source, status, owner, score, platform, date), quick segments (unassigned, new today, hot leads, no follow-up). Quick actions: assign, change status, convert, create deal, add note.

### 5. Lead Details (`/leads/:id`)
Left: summary, qualification, notes, activity timeline, tasks, related deal. Right sidebar: source attribution, campaign/ad/UTM data, landing page, metadata, tags. Tabs: Activity, Notes, Tasks, Attribution, History.

### 6. Contacts (`/contacts`)
Table/grid toggle, search, filters, lifecycle stage, owner, source, total deals/revenue.

### 7. Contact Details (`/contacts/:id`)
360° profile: contact info, linked company, deals, lead origin, timeline, notes, tasks, revenue summary.

### 8. Companies (`/companies`)
B2B accounts list: name, industry, contacts count, active deals, won revenue, owner, source mix.

### 9. Company Details (`/companies/:id`)
Company summary, linked contacts, deals, timeline, notes, revenue, source attribution.

### 10. Deals Pipeline (`/deals`)
Kanban view (New → Contacted → Qualified → Proposal → Negotiation → Won → Lost) with drag-and-drop. Cards show value, owner avatar, platform badge, overdue indicator. Column totals, win rate. Toggle to table view. Filters by owner, stage, source, value.

### 11. Deal Details (`/deals/:id`)
Title, contact/company, stage, owner, close date, value, probability, source campaign. Timeline, notes, tasks, attribution, stage history, won/lost controls.

### 12. Tasks (`/tasks`)
List, board, and calendar-lite views. Filters by owner, type, due date, priority. Overdue/due-today sections. Types: call, follow-up, meeting, email, WhatsApp, review.

### 13. Activities (`/activities`)
Unified log: calls, WhatsApp, emails, meetings, notes, system events. Filter chips, timeline layout, related entity links.

### 14. Reports (`/reports`)
Report cards: Platform Performance, Campaign to Revenue, Lead Source, Sales Funnel, Owner Performance, Win/Loss, Landing Page, Attribution Comparison. Each opens a detailed view.

### 15. Attribution Report (`/reports/attribution`)
Side-by-side: platform-reported vs first-party vs CRM qualified vs won revenue. First-touch/last-touch/linear. Funnel chart, comparison cards, breakdown tables, discrepancy indicators.

### 16. Settings (`/settings`)
Integration cards (Google Ads, Meta, TikTok, LinkedIn, Snap, GA, Webhooks) with status/sync/health. Tabs: Users & Roles, Pipelines, Custom Fields, Tags, Attribution Model, Notifications.

## Mock Data
Realistic interconnected entities: platforms, ad accounts, campaigns, ad groups, ads, landing pages, leads (with full attribution: UTMs, gclid, source, campaign, score, owner), contacts, companies, deals, tasks, notes, calls, WhatsApp/email activities. Every entity links back through the attribution chain.

## Responsive Behavior
- **Desktop**: Full sidebar, rich tables, multi-column, detail panels
- **Tablet**: Compressed sidebar, reduced columns, stacked cards
- **Mobile**: Drawer nav, card-based layouts, optimized detail pages

## Interactions & Polish
Hover elevation, smooth transitions, animated counters, chart tooltips, kanban drag states, skeleton loaders, empty states with CTAs, command palette search, breadcrumbs, sticky KPI bars, slide-over detail panels.

