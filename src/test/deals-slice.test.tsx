import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DealsPage from "@/pages/DealsPage";
import DealDetailPage from "@/pages/DealDetailPage";
import type { DealActivityItem, DealDetailItem, DealListItem } from "@/features/deals/types";

const queryHooks = vi.hoisted(() => ({
  useDealsQuery: vi.fn(),
  useDealByIdQuery: vi.fn(),
  useDealActivitiesQuery: vi.fn(),
}));

vi.mock("@/features/deals/queries", () => queryHooks);

vi.mock("@/components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

const sampleDealListItems: DealListItem[] = [
  {
    id: "30000000-0000-4000-8000-000000000003",
    title: "Global Finance Platform Rollout",
    amount: 340000,
    currency: "USD",
    stage: "proposal",
    probability: 55,
    platform: "linkedin",
    companyName: "Global Finance Ltd",
    primaryContactName: "James Wilson",
    campaignName: "AI Features Product Launch",
    ownerLabel: "Unassigned",
    expectedCloseDate: "2026-05-20",
    createdAt: "2026-04-20T12:15:00Z",
    hasOverdueTask: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    title: "CloudNine Migration Project",
    amount: 67800,
    currency: "USD",
    stage: "won",
    probability: 100,
    platform: "linkedin",
    companyName: "CloudNine Tech",
    primaryContactName: "Priya Patel",
    campaignName: "AI Features Product Launch",
    ownerLabel: "Unassigned",
    expectedCloseDate: "2026-04-22",
    createdAt: "2026-04-21T10:00:00Z",
    hasOverdueTask: false,
  },
];

const sampleDealDetail: DealDetailItem = {
  id: "30000000-0000-4000-8000-000000000004",
  title: "RetailPlus Pilot Program",
  amount: 22000,
  currency: "USD",
  stage: "lost",
  probability: 0,
  platform: "google",
  source: "retargeting",
  companyName: "RetailPlus",
  primaryContactName: "Tom Baker",
  sourceLeadName: "Tom Baker",
  campaignName: "Brand Awareness Q2 2026",
  ownerLabel: "Unassigned",
  expectedCloseDate: "2026-04-18",
  createdAt: "2026-04-17T10:00:00Z",
  stageChangedAt: "2026-04-18T15:45:00Z",
  closedAt: "2026-04-18T15:45:00Z",
  wonAt: null,
  lostAt: "2026-04-18T15:45:00Z",
  lostReason: "Budget not approved for this quarter",
  adGroupId: "cart-abandoners",
  adId: "creative-come-back-save",
  landingPageUrl: "https://campaign-ai.app/special-offer",
  utmSource: "google",
  utmMedium: "display",
  utmCampaign: "retargeting-q2",
  utmContent: "promo-banner",
  utmTerm: "retail reporting",
  clickId: "gclid_retail_005",
};

const sampleActivities: DealActivityItem[] = [
  {
    id: "activity-1",
    type: "note",
    title: "Deal marked as lost",
    description: "RetailPlus paused the pilot after finance rejected the spend request.",
    actorLabel: "Unassigned",
    occurredAt: "2026-04-18T15:45:00Z",
    durationMinutes: null,
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

function renderDealsPage() {
  return render(
    <MemoryRouter>
      <DealsPage />
    </MemoryRouter>,
  );
}

function renderDealDetailPage(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/deals/:id" element={<DealDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  queryHooks.useDealsQuery.mockReturnValue(queryState<DealListItem[]>({ data: [] }));
  queryHooks.useDealByIdQuery.mockReturnValue(queryState<DealDetailItem | null>({ data: null }));
  queryHooks.useDealActivitiesQuery.mockReturnValue(queryState<DealActivityItem[]>({ data: [] }));
});

describe("DealsPage", () => {
  it("renders a loading state while the deals query is pending", () => {
    queryHooks.useDealsQuery.mockReturnValue(queryState<DealListItem[]>({ data: [], isPending: true }));

    renderDealsPage();

    expect(screen.getByTestId("deals-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the deals query fails", () => {
    queryHooks.useDealsQuery.mockReturnValue(queryState<DealListItem[]>({ data: [], isError: true }));

    renderDealsPage();

    expect(screen.getByText("Unable to load deals")).toBeInTheDocument();
  });

  it("renders an empty state when no deals are returned", () => {
    renderDealsPage();

    expect(screen.getByText("No deals yet")).toBeInTheDocument();
  });

  it("renders all real stage columns in order and shows overdue indicators from live data", () => {
    queryHooks.useDealsQuery.mockReturnValue(queryState<DealListItem[]>({ data: sampleDealListItems }));
    const { container } = renderDealsPage();

    const stageColumns = [...container.querySelectorAll('[data-testid^="deal-stage-column-"]')].map((element) =>
      element.getAttribute("data-testid"),
    );

    expect(stageColumns).toEqual([
      "deal-stage-column-new",
      "deal-stage-column-contacted",
      "deal-stage-column-qualified",
      "deal-stage-column-proposal",
      "deal-stage-column-negotiation",
      "deal-stage-column-won",
      "deal-stage-column-lost",
    ]);
    expect(screen.getByTestId(`deal-overdue-indicator-${sampleDealListItems[0].id}`)).toBeInTheDocument();
  });

  it("renders the table view from mapped live rows", () => {
    queryHooks.useDealsQuery.mockReturnValue(queryState<DealListItem[]>({ data: sampleDealListItems }));

    renderDealsPage();
    fireEvent.click(screen.getByRole("button", { name: "Table view" }));

    expect(screen.getByText("Global Finance Ltd")).toBeInTheDocument();
    expect(screen.getByText("May 20, 2026")).toBeInTheDocument();
  });
});

describe("DealDetailPage", () => {
  it("treats an invalid UUID route param as immediate not-found", () => {
    renderDealDetailPage("/deals/not-a-valid-uuid");

    expect(screen.getByText("Deal not found")).toBeInTheDocument();
    expect(queryHooks.useDealByIdQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useDealActivitiesQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
  });

  it("treats a valid UUID with no returned row as not-found after the query", () => {
    queryHooks.useDealByIdQuery.mockReturnValue(queryState<DealDetailItem | null>({ data: null }));

    renderDealDetailPage(`/deals/${sampleDealDetail.id}`);

    expect(screen.getByText("This deal ID is valid, but there is no matching deal record in the database.")).toBeInTheDocument();
    expect(queryHooks.useDealByIdQuery).toHaveBeenCalledWith(sampleDealDetail.id, true);
    expect(queryHooks.useDealActivitiesQuery).toHaveBeenCalledWith(sampleDealDetail.id, false);
  });

  it("renders a generic error state when the main deal query fails", () => {
    queryHooks.useDealByIdQuery.mockReturnValue(queryState<DealDetailItem | null>({ data: null, isError: true }));

    renderDealDetailPage(`/deals/${sampleDealDetail.id}`);

    expect(screen.getByText("Unable to load deal")).toBeInTheDocument();
  });

  it("enables activity queries only after a valid deal row exists and maps lost-state fields", () => {
    queryHooks.useDealByIdQuery.mockReturnValue(queryState<DealDetailItem | null>({ data: sampleDealDetail }));
    queryHooks.useDealActivitiesQuery.mockReturnValue(queryState<DealActivityItem[]>({ data: sampleActivities }));

    renderDealDetailPage(`/deals/${sampleDealDetail.id}`);

    expect(queryHooks.useDealActivitiesQuery).toHaveBeenCalledWith(sampleDealDetail.id, true);
    expect(screen.getByText(sampleDealDetail.title)).toBeInTheDocument();
    expect(screen.getByText(sampleDealDetail.lostReason!)).toBeInTheDocument();
    expect(screen.getByText("gclid_retail_005")).toBeInTheDocument();
    expect(screen.getByText(sampleActivities[0].title)).toBeInTheDocument();
  });
});
