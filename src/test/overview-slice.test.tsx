import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OverviewPage from "@/pages/Index";
import { getOverview } from "@/features/overview/api";
import type { OverviewPageData } from "@/features/overview/types";

const queryHooks = vi.hoisted(() => ({
  useOverviewQuery: vi.fn(),
}));

const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/overview/queries", () => queryHooks);

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: fromMock,
  },
}));

vi.mock("@/components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

const sampleOverviewData: OverviewPageData = {
  kpis: {
    totalLeads: 5,
    qualifiedLeads: 2,
    wonDeals: 1,
    wonRevenue: 67800,
    openPipeline: 465000,
    tasksRequiringAttention: 1,
  },
  recentLeads: [
    {
      id: "10000000-0000-4000-8000-000000000002",
      name: "Maria Garcia",
      companyName: "Innovate Co",
      campaignName: "Lead Gen Enterprise SaaS",
      platform: "meta",
      status: "new",
      createdAt: "2026-04-20T08:15:00Z",
    },
    {
      id: "10000000-0000-4000-8000-000000000001",
      name: "Alex Thompson",
      companyName: "TechCorp Solutions",
      campaignName: "Brand Awareness Q2 2026",
      platform: "google",
      status: "qualified",
      createdAt: "2026-04-16T09:15:00Z",
    },
  ],
  attentionTasks: [
    {
      id: "40000000-0000-4000-8000-000000000005",
      title: "Revise proposal pricing for Global Finance",
      priority: "urgent",
      dueAt: "2026-03-29T12:00:00Z",
      relatedLabel: "Global Finance Platform Rollout",
    },
  ],
  pipelineByStage: [
    { stage: "new", count: 0, amount: 0 },
    { stage: "contacted", count: 0, amount: 0 },
    { stage: "qualified", count: 0, amount: 0 },
    { stage: "proposal", count: 1, amount: 340000 },
    { stage: "negotiation", count: 1, amount: 125000 },
    { stage: "won", count: 1, amount: 67800 },
    { stage: "lost", count: 1, amount: 22000 },
  ],
  platformBreakdown: [
    { platform: "google", count: 2, share: 0.4 },
    { platform: "linkedin", count: 2, share: 0.4 },
    { platform: "meta", count: 1, share: 0.2 },
  ],
  sourceBreakdown: [
    { source: "linkedin_ads", label: "Linkedin Ads", count: 2, share: 0.4 },
    { source: "google_ads", label: "Google Ads", count: 1, share: 0.2 },
    { source: "meta_ads", label: "Meta Ads", count: 1, share: 0.2 },
    { source: "retargeting", label: "Retargeting", count: 1, share: 0.2 },
  ],
};

const emptyOverviewData: OverviewPageData = {
  kpis: {
    totalLeads: 0,
    qualifiedLeads: 0,
    wonDeals: 0,
    wonRevenue: 0,
    openPipeline: 0,
    tasksRequiringAttention: 0,
  },
  recentLeads: [],
  attentionTasks: [],
  pipelineByStage: [
    { stage: "new", count: 0, amount: 0 },
    { stage: "contacted", count: 0, amount: 0 },
    { stage: "qualified", count: 0, amount: 0 },
    { stage: "proposal", count: 0, amount: 0 },
    { stage: "negotiation", count: 0, amount: 0 },
    { stage: "won", count: 0, amount: 0 },
    { stage: "lost", count: 0, amount: 0 },
  ],
  platformBreakdown: [],
  sourceBreakdown: [],
};

function queryState<T>({
  data,
  isPending = false,
  isError = false,
}: {
  data: T;
  isPending?: boolean;
  isError?: boolean;
}) {
  return {
    data,
    isPending,
    isError,
    isSuccess: !isPending && !isError,
  };
}

function makeBuilder(result: { data?: unknown; error?: unknown; count?: number | null }) {
  const builder = {
    data: result.data ?? null,
    error: result.error ?? null,
    count: result.count ?? null,
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    not: vi.fn(() => builder),
    lt: vi.fn(() => builder),
    neq: vi.fn(() => builder),
  };

  return builder;
}

function renderOverviewPage() {
  return render(
    <MemoryRouter>
      <OverviewPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  queryHooks.useOverviewQuery.mockReturnValue(queryState<OverviewPageData | undefined>({ data: sampleOverviewData }));
});

describe("OverviewPage", () => {
  it("renders a loading state while the overview query is pending", () => {
    queryHooks.useOverviewQuery.mockReturnValue(queryState<OverviewPageData | undefined>({ data: undefined, isPending: true }));

    renderOverviewPage();

    expect(screen.getByTestId("overview-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the overview query fails", () => {
    queryHooks.useOverviewQuery.mockReturnValue(queryState<OverviewPageData | undefined>({ data: undefined, isError: true }));

    renderOverviewPage();

    expect(screen.getByText("Unable to load overview")).toBeInTheDocument();
  });

  it("renders a page-level empty state when the overview payload is globally empty", () => {
    queryHooks.useOverviewQuery.mockReturnValue(queryState<OverviewPageData>({ data: emptyOverviewData }));

    renderOverviewPage();

    expect(screen.getByText("No overview data yet")).toBeInTheDocument();
  });

  it("renders live KPI cards and overview panels from mapped data", () => {
    renderOverviewPage();

    expect(screen.getByText("Total Leads")).toBeInTheDocument();
    expect(screen.getByText("Qualified Leads")).toBeInTheDocument();
    expect(screen.getByText("Won Deals")).toBeInTheDocument();
    expect(screen.getByText("Won Revenue")).toBeInTheDocument();
    expect(screen.getByText("Open Pipeline")).toBeInTheDocument();
    expect(screen.getAllByText("Tasks Requiring Attention")).toHaveLength(2);

    expect(screen.getAllByText("$67.8K").length).toBeGreaterThan(0);
    expect(screen.getByText("$465.0K")).toBeInTheDocument();
    expect(screen.getByText("Revise proposal pricing for Global Finance")).toBeInTheDocument();
    expect(screen.getByText("Maria Garcia")).toBeInTheDocument();
    expect(screen.getByText("Lead Attribution Breakdown")).toBeInTheDocument();
    expect(screen.getByTestId("overview-pipeline-stage-proposal")).toBeInTheDocument();
    expect(screen.getByTestId("overview-pipeline-stage-won")).toBeInTheDocument();
  });
});

describe("getOverview", () => {
  it("counts qualified leads using qualified_at first and falls back to qualified/converted status only when the milestone is missing", async () => {
    const builders = [
      makeBuilder({
        data: [
          { status: "qualified", qualified_at: "2026-04-10T08:00:00Z", platform: "google", source: "google_ads" },
          { status: "converted", qualified_at: null, platform: "linkedin", source: "linkedin_ads" },
          { status: "qualified", qualified_at: null, platform: "meta", source: "meta_ads" },
          { status: "contacted", qualified_at: null, platform: "google", source: "retargeting" },
        ],
      }),
      makeBuilder({
        data: [
          {
            id: "lead-1",
            full_name: "Maria Garcia",
            status: "new",
            platform: "meta",
            created_at: "2026-04-20T08:15:00Z",
            company: { id: "company-1", name: "Innovate Co" },
            campaign: { id: "campaign-1", name: "Lead Gen Enterprise SaaS" },
          },
        ],
      }),
      makeBuilder({
        data: [
          { stage: "won", amount: 100000 },
          { stage: "proposal", amount: 80000 },
          { stage: "lost", amount: 25000 },
        ],
      }),
      makeBuilder({ count: 2 }),
      makeBuilder({
        data: [
          {
            id: "task-1",
            title: "Follow up with Global Finance",
            priority: "urgent",
            due_at: "2026-03-29T12:00:00Z",
            lead: null,
            deal: { id: "deal-1", title: "Global Finance Platform Rollout" },
          },
        ],
      }),
    ];

    let callIndex = 0;
    fromMock.mockImplementation(() => builders[callIndex++]);

    const overview = await getOverview();

    expect(overview.kpis.totalLeads).toBe(4);
    expect(overview.kpis.qualifiedLeads).toBe(3);
    expect(overview.kpis.wonDeals).toBe(1);
    expect(overview.kpis.wonRevenue).toBe(100000);
    expect(overview.kpis.openPipeline).toBe(80000);
    expect(overview.kpis.tasksRequiringAttention).toBe(2);
    expect(overview.platformBreakdown[0]).toMatchObject({ platform: "google", count: 2 });
    expect(overview.sourceBreakdown[0]).toMatchObject({ source: "google_ads", count: 1 });
    expect(overview.attentionTasks[0]?.relatedLabel).toBe("Global Finance Platform Rollout");
  });
});
