import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CampaignsPage from "@/pages/CampaignsPage";
import CampaignDetailPage from "@/pages/CampaignDetailPage";
import { getCampaigns } from "@/features/campaigns/api";
import type {
  CampaignDealItem,
  CampaignDetailItem,
  CampaignLeadItem,
  CampaignListItem,
} from "@/features/campaigns/types";

const queryHooks = vi.hoisted(() => ({
  useCampaignsQuery: vi.fn(),
  useCampaignByIdQuery: vi.fn(),
  useCampaignLeadsQuery: vi.fn(),
  useCampaignDealsQuery: vi.fn(),
}));

const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/campaigns/queries", () => queryHooks);

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

const sampleCampaigns: CampaignListItem[] = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "AI Features Product Launch",
    platform: "linkedin",
    status: "active",
    objective: "Pipeline acceleration",
    currency: "USD",
    spendAmount: 9340,
    impressions: 455000,
    clicks: 11820,
    ctr: 0.02597802197802198,
    cpc: 0.7901861252115059,
    linkedLeads: 2,
    qualifiedLeads: 2,
    linkedDeals: 2,
    wonRevenue: 67800,
    roas: 7.259100642398286,
    startDate: "2026-03-01",
    endDate: "2026-06-30",
  },
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Brand Awareness Q2 2026",
    platform: "google",
    status: "active",
    objective: "Brand awareness",
    currency: "USD",
    spendAmount: 8420,
    impressions: 1245000,
    clicks: 28640,
    ctr: 0.023004016064257027,
    cpc: 0.29399441340782123,
    linkedLeads: 2,
    qualifiedLeads: 1,
    linkedDeals: 2,
    wonRevenue: 0,
    roas: 0,
    startDate: "2026-04-01",
    endDate: "2026-06-30",
  },
];

const sampleCampaignDetail: CampaignDetailItem = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "Lead Gen Enterprise SaaS",
  platform: "meta",
  status: "active",
  objective: "Lead generation",
  currency: "USD",
  spendAmount: 6110,
  impressions: 902000,
  clicks: 19200,
  ctr: 0.021286031042128603,
  cpc: 0.3182291666666667,
  roas: null,
  startDate: "2026-04-05",
  endDate: "2026-06-15",
  dailyBudget: 300,
  totalBudget: 12000,
  linkedLeads: 1,
  qualifiedLeads: 0,
  linkedDeals: 0,
  wonDeals: 0,
  wonRevenue: 0,
  openPipeline: 0,
};

const sampleCampaignLeads: CampaignLeadItem[] = [
  {
    id: "10000000-0000-4000-8000-000000000002",
    name: "Maria Garcia",
    companyName: "Innovate Co",
    status: "new",
    score: 58,
    createdAt: "2026-04-20T08:15:00Z",
  },
];

const sampleCampaignDeals: CampaignDealItem[] = [
  {
    id: "30000000-0000-4000-8000-000000000003",
    title: "Global Finance Platform Rollout",
    companyName: "Global Finance Ltd",
    primaryContactName: "James Wilson",
    stage: "proposal",
    amount: 340000,
    currency: "USD",
    createdAt: "2026-04-20T12:15:00Z",
  },
];

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
    eq: vi.fn(() => builder),
    maybeSingle: vi.fn(() => builder),
    not: vi.fn(() => builder),
  };

  return builder;
}

function renderCampaignsPage() {
  return render(
    <MemoryRouter>
      <CampaignsPage />
    </MemoryRouter>,
  );
}

function renderCampaignDetailPage(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  queryHooks.useCampaignsQuery.mockReturnValue(queryState<CampaignListItem[]>({ data: [] }));
  queryHooks.useCampaignByIdQuery.mockReturnValue(queryState<CampaignDetailItem | null>({ data: null }));
  queryHooks.useCampaignLeadsQuery.mockReturnValue(queryState<CampaignLeadItem[]>({ data: [] }));
  queryHooks.useCampaignDealsQuery.mockReturnValue(queryState<CampaignDealItem[]>({ data: [] }));
});

describe("CampaignsPage", () => {
  it("renders a loading state while the campaigns query is pending", () => {
    queryHooks.useCampaignsQuery.mockReturnValue(queryState<CampaignListItem[]>({ data: [], isPending: true }));

    renderCampaignsPage();

    expect(screen.getByTestId("campaigns-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the campaigns query fails", () => {
    queryHooks.useCampaignsQuery.mockReturnValue(queryState<CampaignListItem[]>({ data: [], isError: true }));

    renderCampaignsPage();

    expect(screen.getByText("Unable to load campaigns")).toBeInTheDocument();
  });

  it("renders an empty state when no campaigns are returned", () => {
    renderCampaignsPage();

    expect(screen.getByText("No campaigns yet")).toBeInTheDocument();
  });

  it("renders a filtered no-results state when search removes all campaigns", () => {
    queryHooks.useCampaignsQuery.mockReturnValue(queryState<CampaignListItem[]>({ data: sampleCampaigns }));

    renderCampaignsPage();
    fireEvent.change(screen.getByPlaceholderText("Search campaigns..."), {
      target: { value: "nonexistent campaign" },
    });

    expect(screen.getByText("No matching campaigns")).toBeInTheDocument();
  });

  it("renders live rows and keeps ROAS-desc sorting by default", () => {
    queryHooks.useCampaignsQuery.mockReturnValue(queryState<CampaignListItem[]>({ data: sampleCampaigns }));

    renderCampaignsPage();

    const campaignLinks = screen.getAllByRole("link");
    expect(campaignLinks[0]).toHaveTextContent("AI Features Product Launch");
    expect(screen.getByText("$67.8K")).toBeInTheDocument();
    expect(screen.getByText("7.26x")).toBeInTheDocument();
  });
});

describe("CampaignDetailPage", () => {
  it("treats an invalid UUID route param as immediate not-found", () => {
    renderCampaignDetailPage("/campaigns/not-a-valid-uuid");

    expect(screen.getByText("Campaign not found")).toBeInTheDocument();
    expect(queryHooks.useCampaignByIdQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useCampaignLeadsQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useCampaignDealsQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
  });

  it("treats a valid UUID with no returned row as not-found after the query", () => {
    queryHooks.useCampaignByIdQuery.mockReturnValue(queryState<CampaignDetailItem | null>({ data: null }));

    renderCampaignDetailPage(`/campaigns/${sampleCampaignDetail.id}`);

    expect(
      screen.getByText("This campaign ID is valid, but there is no matching campaign record in the database."),
    ).toBeInTheDocument();
    expect(queryHooks.useCampaignByIdQuery).toHaveBeenCalledWith(sampleCampaignDetail.id, true);
    expect(queryHooks.useCampaignLeadsQuery).toHaveBeenCalledWith(sampleCampaignDetail.id, false);
    expect(queryHooks.useCampaignDealsQuery).toHaveBeenCalledWith(sampleCampaignDetail.id, false);
  });

  it("renders a generic error state when the main campaign query fails", () => {
    queryHooks.useCampaignByIdQuery.mockReturnValue(
      queryState<CampaignDetailItem | null>({ data: null, isError: true }),
    );

    renderCampaignDetailPage(`/campaigns/${sampleCampaignDetail.id}`);

    expect(screen.getByText("Unable to load campaign")).toBeInTheDocument();
  });

  it("enables related queries only after a valid campaign row exists and omits the timeline tab", () => {
    queryHooks.useCampaignByIdQuery.mockReturnValue(queryState<CampaignDetailItem | null>({ data: sampleCampaignDetail }));
    queryHooks.useCampaignLeadsQuery.mockReturnValue(queryState<CampaignLeadItem[]>({ data: sampleCampaignLeads }));
    queryHooks.useCampaignDealsQuery.mockReturnValue(queryState<CampaignDealItem[]>({ data: sampleCampaignDeals }));

    renderCampaignDetailPage(`/campaigns/${sampleCampaignDetail.id}`);

    expect(queryHooks.useCampaignLeadsQuery).toHaveBeenCalledWith(sampleCampaignDetail.id, true);
    expect(queryHooks.useCampaignDealsQuery).toHaveBeenCalledWith(sampleCampaignDetail.id, true);
    expect(screen.getByText(sampleCampaignDetail.name)).toBeInTheDocument();
    expect(screen.getByText("CRM Outcomes")).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Timeline" })).not.toBeInTheDocument();
  });
});

describe("getCampaigns", () => {
  it("counts qualified leads correctly and safely handles zero-denominator derived metrics", async () => {
    const builders = [
      makeBuilder({
        data: [
          {
            id: "campaign-1",
            name: "Zero Spend Campaign",
            platform: "google",
            status: "active",
            objective: "Awareness",
            currency: "USD",
            spend_amount: 0,
            impressions: 0,
            clicks: 0,
            start_date: "2026-03-01",
            end_date: "2026-03-31",
          },
          {
            id: "campaign-2",
            name: "Revenue Campaign",
            platform: "linkedin",
            status: "active",
            objective: "Pipeline",
            currency: "USD",
            spend_amount: 5000,
            impressions: 1000,
            clicks: 100,
            start_date: "2026-04-01",
            end_date: "2026-04-30",
          },
        ],
      }),
      makeBuilder({
        data: [
          { campaign_id: "campaign-2", status: "qualified", qualified_at: "2026-04-10T08:00:00Z" },
          { campaign_id: "campaign-2", status: "converted", qualified_at: null },
          { campaign_id: "campaign-2", status: "qualified", qualified_at: null },
          { campaign_id: "campaign-2", status: "contacted", qualified_at: null },
        ],
      }),
      makeBuilder({
        data: [
          { campaign_id: "campaign-2", stage: "won", amount: 25000 },
          { campaign_id: "campaign-2", stage: "proposal", amount: 12000 },
          { campaign_id: "campaign-2", stage: "lost", amount: 4000 },
        ],
      }),
    ];

    let callIndex = 0;
    fromMock.mockImplementation(() => builders[callIndex++]);

    const campaigns = await getCampaigns();
    const zeroSpendCampaign = campaigns.find((campaign) => campaign.id === "campaign-1");
    const revenueCampaign = campaigns.find((campaign) => campaign.id === "campaign-2");

    expect(zeroSpendCampaign?.ctr).toBeNull();
    expect(zeroSpendCampaign?.cpc).toBeNull();
    expect(zeroSpendCampaign?.roas).toBeNull();
    expect(revenueCampaign?.qualifiedLeads).toBe(3);
    expect(revenueCampaign?.linkedDeals).toBe(3);
    expect(revenueCampaign?.wonRevenue).toBe(25000);
    expect(revenueCampaign?.roas).toBe(5);
  });
});
