import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReportsPage from "@/pages/ReportsPage";
import ReportDetailPage from "@/pages/ReportDetailPage";
import { getCampaignRevenueReport, getReportsCatalog } from "@/features/reports/api";
import type { CampaignRevenueReportData, ReportsCatalogData } from "@/features/reports/types";

const queryHooks = vi.hoisted(() => ({
  useReportsCatalogQuery: vi.fn(),
  useCampaignRevenueReportQuery: vi.fn(),
}));

const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/reports/queries", () => queryHooks);

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

const sampleCatalog: ReportsCatalogData = {
  hasData: true,
  cards: [
    {
      id: "campaign-revenue",
      title: "Campaign to Revenue",
      description: "Track campaign performance from spend to closed revenue.",
      href: "/reports/campaign-revenue",
      metrics: [
        { label: "Won Revenue", format: "currency", value: 67800 },
        { label: "Open Pipeline", format: "currency", value: 465000 },
        { label: "Blended ROAS", format: "multiplier", value: 4.54 },
      ],
    },
    {
      id: "platform-performance",
      title: "Platform Performance",
      description: "Compare platform-level spend, pipeline, and revenue snapshots.",
      href: null,
      metrics: [
        { label: "Active Platforms", format: "count", value: 3 },
        { label: "Top Platform", format: "text", value: "LinkedIn Ads" },
        { label: "Won Revenue", format: "currency", value: 67800 },
      ],
    },
    {
      id: "lead-source-analysis",
      title: "Lead Source Analysis",
      description: "Review lead volume and qualification by live source attribution.",
      href: null,
      metrics: [
        { label: "Distinct Sources", format: "count", value: 4 },
        { label: "Top Source", format: "text", value: "Linkedin Ads" },
        { label: "Qualified Leads", format: "count", value: 3 },
      ],
    },
    {
      id: "sales-funnel",
      title: "Sales Funnel",
      description: "Track progression from leads to won deals using CRM-linked records.",
      href: null,
      metrics: [
        { label: "Total Leads", format: "count", value: 5 },
        { label: "Qualified Leads", format: "count", value: 3 },
        { label: "Lead-to-Win Rate", format: "percent", value: 0.2 },
      ],
    },
  ],
};

const sampleCampaignRevenueReport: CampaignRevenueReportData = {
  reportId: "campaign-revenue",
  title: "Campaign to Revenue",
  description: "Trustworthy campaign performance from spend through closed-won revenue.",
  totals: {
    currency: "USD",
    totalSpend: 23870,
    totalImpressions: 2602000,
    totalClicks: 59660,
    totalLinkedLeads: 5,
    totalQualifiedLeads: 3,
    totalLinkedDeals: 4,
    totalWonDeals: 1,
    totalWonRevenue: 67800,
    totalOpenPipeline: 465000,
    blendedCtr: 0.022928516525749424,
    blendedCpc: 0.4001005698960778,
    blendedRoas: 2.8403854208629994,
  },
  rows: [
    {
      id: "33333333-3333-4333-8333-333333333333",
      name: "AI Features Product Launch",
      platform: "linkedin",
      status: "active",
      currency: "USD",
      spend: 9340,
      impressions: 455000,
      clicks: 11820,
      ctr: 0.02597802197802198,
      cpc: 0.7901861252115059,
      linkedLeads: 2,
      qualifiedLeads: 2,
      linkedDeals: 2,
      wonDeals: 1,
      wonRevenue: 67800,
      openPipeline: 340000,
      roas: 7.259100642398286,
    },
    {
      id: "11111111-1111-4111-8111-111111111111",
      name: "Brand Awareness Q2 2026",
      platform: "google",
      status: "active",
      currency: "USD",
      spend: 8420,
      impressions: 1245000,
      clicks: 28640,
      ctr: 0.023004016064257027,
      cpc: 0.29399441340782123,
      linkedLeads: 2,
      qualifiedLeads: 1,
      linkedDeals: 2,
      wonDeals: 0,
      wonRevenue: 0,
      openPipeline: 125000,
      roas: 0,
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      name: "Lead Gen Enterprise SaaS",
      platform: "meta",
      status: "active",
      currency: "USD",
      spend: 6110,
      impressions: 902000,
      clicks: 19200,
      ctr: 0.021286031042128603,
      cpc: 0.3182291666666667,
      linkedLeads: 1,
      qualifiedLeads: 0,
      linkedDeals: 0,
      wonDeals: 0,
      wonRevenue: 0,
      openPipeline: 0,
      roas: 0,
    },
  ],
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

function makeBuilder(result: { data?: unknown; error?: unknown }) {
  const builder = {
    data: result.data ?? null,
    error: result.error ?? null,
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
  };

  return builder;
}

function renderReportsPage() {
  return render(
    <MemoryRouter>
      <ReportsPage />
    </MemoryRouter>,
  );
}

function renderReportDetailPage(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/reports/:reportId" element={<ReportDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  queryHooks.useReportsCatalogQuery.mockReturnValue(queryState<ReportsCatalogData | undefined>({ data: sampleCatalog }));
  queryHooks.useCampaignRevenueReportQuery.mockReturnValue(
    queryState<CampaignRevenueReportData | undefined>({ data: sampleCampaignRevenueReport }),
  );
});

describe("ReportsPage", () => {
  it("renders a loading state while the reports catalog query is pending", () => {
    queryHooks.useReportsCatalogQuery.mockReturnValue(queryState<ReportsCatalogData | undefined>({ data: undefined, isPending: true }));

    renderReportsPage();

    expect(screen.getByTestId("reports-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the reports catalog query fails", () => {
    queryHooks.useReportsCatalogQuery.mockReturnValue(queryState<ReportsCatalogData | undefined>({ data: undefined, isError: true }));

    renderReportsPage();

    expect(screen.getByText("Unable to load reports")).toBeInTheDocument();
  });

  it("renders a page-level empty state when there is no report data", () => {
    queryHooks.useReportsCatalogQuery.mockReturnValue(queryState<ReportsCatalogData>({ data: { hasData: false, cards: [] } }));

    renderReportsPage();

    expect(screen.getByText("No reports data yet")).toBeInTheDocument();
  });

  it("renders only the four live cards and keeps only campaign-revenue navigable", () => {
    renderReportsPage();

    expect(screen.getByText("Campaign to Revenue")).toBeInTheDocument();
    expect(screen.getByText("Platform Performance")).toBeInTheDocument();
    expect(screen.getByText("Lead Source Analysis")).toBeInTheDocument();
    expect(screen.getByText("Sales Funnel")).toBeInTheDocument();

    expect(screen.queryByText("Attribution Comparison")).not.toBeInTheDocument();
    expect(screen.queryByText("Owner Performance")).not.toBeInTheDocument();
    expect(screen.queryByText("Deal Win/Loss Analysis")).not.toBeInTheDocument();
    expect(screen.queryByText("Landing Page Performance")).not.toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/reports/campaign-revenue");
  });
});

describe("ReportDetailPage", () => {
  it("renders immediate not-found for unsupported report slugs", () => {
    renderReportDetailPage("/reports/attribution");

    expect(screen.getByText("Report not found")).toBeInTheDocument();
    expect(queryHooks.useCampaignRevenueReportQuery).toHaveBeenCalledWith(false);
  });

  it("renders a loading state while the campaign-revenue report query is pending", () => {
    queryHooks.useCampaignRevenueReportQuery.mockReturnValue(
      queryState<CampaignRevenueReportData | undefined>({ data: undefined, isPending: true }),
    );

    renderReportDetailPage("/reports/campaign-revenue");

    expect(screen.getByTestId("campaign-revenue-report-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the campaign-revenue query fails", () => {
    queryHooks.useCampaignRevenueReportQuery.mockReturnValue(
      queryState<CampaignRevenueReportData | undefined>({ data: undefined, isError: true }),
    );

    renderReportDetailPage("/reports/campaign-revenue");

    expect(screen.getByText("Unable to load report")).toBeInTheDocument();
  });

  it("renders an empty state when there are zero campaign rows", () => {
    queryHooks.useCampaignRevenueReportQuery.mockReturnValue(
      queryState<CampaignRevenueReportData>({
        data: {
          ...sampleCampaignRevenueReport,
          rows: [],
          totals: {
            ...sampleCampaignRevenueReport.totals,
            totalSpend: 0,
            totalImpressions: 0,
            totalClicks: 0,
            totalLinkedLeads: 0,
            totalQualifiedLeads: 0,
            totalLinkedDeals: 0,
            totalWonDeals: 0,
            totalWonRevenue: 0,
            totalOpenPipeline: 0,
            blendedCtr: null,
            blendedCpc: null,
            blendedRoas: null,
          },
        },
      }),
    );

    renderReportDetailPage("/reports/campaign-revenue");

    expect(screen.getByText("No campaign revenue data yet")).toBeInTheDocument();
  });

  it("renders the campaign-revenue KPI row and trustworthy table", () => {
    renderReportDetailPage("/reports/campaign-revenue");

    expect(screen.getByText("Campaign to Revenue")).toBeInTheDocument();
    expect(screen.getByText("Total Won Revenue")).toBeInTheDocument();
    expect(screen.getByText("Blended ROAS")).toBeInTheDocument();
    expect(screen.getByText("AI Features Product Launch")).toBeInTheDocument();
    expect(screen.getByText("Brand Awareness Q2 2026")).toBeInTheDocument();
    expect(screen.getByText("Lead Gen Enterprise SaaS")).toBeInTheDocument();
    expect(screen.getAllByText("$67.8K").length).toBeGreaterThan(0);

    const tableRows = screen.getAllByRole("row");
    expect(tableRows[1]).toHaveTextContent("AI Features Product Launch");
  });
});

describe("reports API", () => {
  it("builds the reports catalog with only the live report cards", async () => {
    const builders = [
      makeBuilder({
        data: [
          {
            id: "campaign-1",
            name: "Revenue Campaign",
            platform: "linkedin",
            status: "active",
            currency: "USD",
            spend_amount: 5000,
            impressions: 1000,
            clicks: 100,
          },
        ],
      }),
      makeBuilder({
        data: [
          {
            id: "lead-1",
            campaign_id: "campaign-1",
            platform: "linkedin",
            source: "linkedin_ads",
            status: "qualified",
            qualified_at: "2026-04-10T08:00:00Z",
            converted_at: null,
          },
        ],
      }),
      makeBuilder({
        data: [
          {
            campaign_id: "campaign-1",
            platform: "linkedin",
            stage: "won",
            amount: 25000,
            source_lead_id: "lead-1",
          },
        ],
      }),
    ];

    let callIndex = 0;
    fromMock.mockImplementation(() => builders[callIndex++]);

    const catalog = await getReportsCatalog();

    expect(catalog.hasData).toBe(true);
    expect(catalog.cards.map((card) => card.id)).toEqual([
      "campaign-revenue",
      "platform-performance",
      "lead-source-analysis",
      "sales-funnel",
    ]);
    expect(catalog.cards[0].metrics[0].value).toBe(25000);
    expect(catalog.cards[1].metrics[1].value).toBe("LinkedIn Ads");
  });

  it("computes campaign-revenue metrics using qualified fallback and aggregate blended denominators", async () => {
    const builders = [
      makeBuilder({
        data: [
          {
            id: "campaign-1",
            name: "Revenue Campaign",
            platform: "linkedin",
            status: "active",
            currency: "USD",
            spend_amount: 5000,
            impressions: 1000,
            clicks: 100,
          },
          {
            id: "campaign-2",
            name: "Pipeline Campaign",
            platform: "google",
            status: "active",
            currency: "USD",
            spend_amount: 0,
            impressions: 0,
            clicks: 0,
          },
        ],
      }),
      makeBuilder({
        data: [
          {
            id: "lead-1",
            campaign_id: "campaign-1",
            platform: "linkedin",
            source: "linkedin_ads",
            status: "qualified",
            qualified_at: "2026-04-10T08:00:00Z",
            converted_at: null,
          },
          {
            id: "lead-2",
            campaign_id: "campaign-1",
            platform: "linkedin",
            source: "linkedin_ads",
            status: "converted",
            qualified_at: null,
            converted_at: "2026-04-14T08:00:00Z",
          },
          {
            id: "lead-3",
            campaign_id: "campaign-2",
            platform: "google",
            source: "google_ads",
            status: "contacted",
            qualified_at: null,
            converted_at: null,
          },
        ],
      }),
      makeBuilder({
        data: [
          {
            campaign_id: "campaign-1",
            platform: "linkedin",
            stage: "won",
            amount: 25000,
            source_lead_id: "lead-1",
          },
          {
            campaign_id: "campaign-1",
            platform: "linkedin",
            stage: "proposal",
            amount: 10000,
            source_lead_id: "lead-2",
          },
          {
            campaign_id: "campaign-2",
            platform: "google",
            stage: "lost",
            amount: 5000,
            source_lead_id: "lead-3",
          },
        ],
      }),
    ];

    let callIndex = 0;
    fromMock.mockImplementation(() => builders[callIndex++]);

    const report = await getCampaignRevenueReport();

    expect(report.rows[0].name).toBe("Revenue Campaign");
    expect(report.rows[0].qualifiedLeads).toBe(2);
    expect(report.rows[0].wonDeals).toBe(1);
    expect(report.rows[0].wonRevenue).toBe(25000);
    expect(report.rows[0].openPipeline).toBe(10000);
    expect(report.rows[1].ctr).toBeNull();
    expect(report.rows[1].cpc).toBeNull();
    expect(report.rows[1].roas).toBeNull();

    expect(report.totals.totalLinkedLeads).toBe(3);
    expect(report.totals.totalQualifiedLeads).toBe(2);
    expect(report.totals.totalLinkedDeals).toBe(3);
    expect(report.totals.totalWonDeals).toBe(1);
    expect(report.totals.totalWonRevenue).toBe(25000);
    expect(report.totals.totalOpenPipeline).toBe(10000);
    expect(report.totals.blendedCtr).toBe(0.1);
    expect(report.totals.blendedCpc).toBe(50);
    expect(report.totals.blendedRoas).toBe(5);
  });
});
