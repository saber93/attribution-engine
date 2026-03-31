import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LeadsPage from "@/pages/LeadsPage";
import LeadDetailPage from "@/pages/LeadDetailPage";
import type {
  LeadActivityItem,
  LeadDetailItem,
  LeadListItem,
  LeadRelatedDealItem,
  LeadTaskItem,
} from "@/features/leads/types";

const queryHooks = vi.hoisted(() => ({
  useLeadsQuery: vi.fn(),
  useLeadByIdQuery: vi.fn(),
  useLeadActivitiesQuery: vi.fn(),
  useLeadTasksQuery: vi.fn(),
  useLeadRelatedDealQuery: vi.fn(),
}));

vi.mock("@/features/leads/queries", () => queryHooks);

vi.mock("@/components/layout/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

const sampleLeadListItem: LeadListItem = {
  id: "10000000-0000-4000-8000-000000000001",
  name: "Alex Thompson",
  email: "alex@example.com",
  phone: "+1 555 111 2222",
  companyId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
  companyName: "TechCorp Solutions",
  campaignId: "11111111-1111-4111-8111-111111111111",
  campaignName: "Brand Awareness Q2 2026",
  platform: "google",
  status: "qualified",
  score: 88,
  ownerLabel: "Unassigned",
  nextTaskTitle: "Book discovery call",
  tags: ["enterprise"],
  createdAt: "2026-03-30T10:00:00Z",
};

const sampleLeadDetail: LeadDetailItem = {
  id: sampleLeadListItem.id,
  name: sampleLeadListItem.name,
  email: sampleLeadListItem.email,
  phone: sampleLeadListItem.phone,
  companyId: sampleLeadListItem.companyId,
  companyName: sampleLeadListItem.companyName,
  campaignId: sampleLeadListItem.campaignId,
  campaignName: sampleLeadListItem.campaignName,
  platform: sampleLeadListItem.platform,
  source: "paid_search",
  status: sampleLeadListItem.status,
  score: sampleLeadListItem.score,
  ownerLabel: sampleLeadListItem.ownerLabel,
  adGroupId: "ag-123",
  adId: "ad-456",
  landingPageUrl: "https://example.com/demo",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "brand-awareness-q2",
  utmContent: "hero-video",
  utmTerm: "campaign analytics crm",
  clickId: "gclid_123",
  tags: ["enterprise", "high-value"],
  qualifiedAt: "2026-03-31T08:00:00Z",
  convertedAt: null,
  disqualifiedAt: null,
  disqualificationReason: null,
  createdAt: "2026-03-30T10:00:00Z",
};

const sampleActivities: LeadActivityItem[] = [
  {
    id: "activity-1",
    type: "system",
    title: "Lead captured",
    description: "Alex submitted the paid search form.",
    actorLabel: "System",
    occurredAt: "2026-03-31T09:00:00Z",
    durationMinutes: null,
  },
];

const sampleTasks: LeadTaskItem[] = [
  {
    id: "task-1",
    title: "Book discovery call",
    description: "Reach out within one business day.",
    type: "call",
    priority: "high",
    status: "pending",
    dueAt: "2026-04-01T10:00:00Z",
    completedAt: null,
    assigneeLabel: "Unassigned",
  },
];

const sampleDeal: LeadRelatedDealItem = {
  id: "deal-1",
  title: "TechCorp Enterprise License",
  amount: 125000,
  stage: "negotiation",
  companyName: "TechCorp Solutions",
  createdAt: "2026-03-31T11:00:00Z",
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

function renderLeadsPage() {
  return render(
    <MemoryRouter>
      <LeadsPage />
    </MemoryRouter>,
  );
}

function renderLeadDetailPage(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/leads/:id" element={<LeadDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  queryHooks.useLeadsQuery.mockReturnValue(queryState<LeadListItem[]>({ data: [] }));
  queryHooks.useLeadByIdQuery.mockReturnValue(queryState<LeadDetailItem | null>({ data: null }));
  queryHooks.useLeadActivitiesQuery.mockReturnValue(queryState<LeadActivityItem[]>({ data: [] }));
  queryHooks.useLeadTasksQuery.mockReturnValue(queryState<LeadTaskItem[]>({ data: [] }));
  queryHooks.useLeadRelatedDealQuery.mockReturnValue(queryState<LeadRelatedDealItem | null>({ data: null }));
});

describe("LeadsPage", () => {
  it("renders a loading state while the leads query is pending", () => {
    queryHooks.useLeadsQuery.mockReturnValue(queryState<LeadListItem[]>({ data: [], isPending: true }));

    renderLeadsPage();

    expect(screen.getByTestId("leads-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the leads query fails", () => {
    queryHooks.useLeadsQuery.mockReturnValue(queryState<LeadListItem[]>({ data: [], isError: true }));

    renderLeadsPage();

    expect(screen.getByText("Unable to load leads")).toBeInTheDocument();
  });

  it("renders an empty state when no leads are returned", () => {
    renderLeadsPage();

    expect(screen.getByText("No leads yet")).toBeInTheDocument();
  });

  it("renders a filtered no-results state when search removes all rows", () => {
    queryHooks.useLeadsQuery.mockReturnValue(queryState<LeadListItem[]>({ data: [sampleLeadListItem] }));

    renderLeadsPage();
    fireEvent.change(screen.getByPlaceholderText("Search leads by name or company..."), {
      target: { value: "nonexistent company" },
    });

    expect(screen.getByText("No matching leads")).toBeInTheDocument();
  });
});

describe("LeadDetailPage", () => {
  it("treats an invalid UUID route param as immediate not-found", () => {
    renderLeadDetailPage("/leads/not-a-valid-uuid");

    expect(screen.getByText("Lead not found")).toBeInTheDocument();
    expect(queryHooks.useLeadByIdQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useLeadActivitiesQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useLeadTasksQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useLeadRelatedDealQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
  });

  it("treats a valid UUID with no returned row as not-found after the query", () => {
    queryHooks.useLeadByIdQuery.mockReturnValue(queryState<LeadDetailItem | null>({ data: null }));

    renderLeadDetailPage(`/leads/${sampleLeadListItem.id}`);

    expect(screen.getByText("This lead ID is valid, but there is no matching lead record in the database.")).toBeInTheDocument();
    expect(queryHooks.useLeadByIdQuery).toHaveBeenCalledWith(sampleLeadListItem.id, true);
    expect(queryHooks.useLeadActivitiesQuery).toHaveBeenCalledWith(sampleLeadListItem.id, false);
    expect(queryHooks.useLeadTasksQuery).toHaveBeenCalledWith(sampleLeadListItem.id, false);
    expect(queryHooks.useLeadRelatedDealQuery).toHaveBeenCalledWith(sampleLeadListItem.id, false);
  });

  it("renders a generic error state when the main lead query fails", () => {
    queryHooks.useLeadByIdQuery.mockReturnValue(queryState<LeadDetailItem | null>({ data: null, isError: true }));

    renderLeadDetailPage(`/leads/${sampleLeadListItem.id}`);

    expect(screen.getByText("Unable to load lead")).toBeInTheDocument();
  });

  it("enables related queries only after a valid lead row exists", () => {
    queryHooks.useLeadByIdQuery.mockReturnValue(queryState<LeadDetailItem | null>({ data: sampleLeadDetail }));
    queryHooks.useLeadActivitiesQuery.mockReturnValue(queryState<LeadActivityItem[]>({ data: sampleActivities }));
    queryHooks.useLeadTasksQuery.mockReturnValue(queryState<LeadTaskItem[]>({ data: sampleTasks }));
    queryHooks.useLeadRelatedDealQuery.mockReturnValue(queryState<LeadRelatedDealItem | null>({ data: sampleDeal }));

    renderLeadDetailPage(`/leads/${sampleLeadListItem.id}`);

    expect(queryHooks.useLeadActivitiesQuery).toHaveBeenCalledWith(sampleLeadListItem.id, true);
    expect(queryHooks.useLeadTasksQuery).toHaveBeenCalledWith(sampleLeadListItem.id, true);
    expect(queryHooks.useLeadRelatedDealQuery).toHaveBeenCalledWith(sampleLeadListItem.id, true);
    expect(screen.getByText(sampleLeadDetail.name)).toBeInTheDocument();
    expect(screen.getByText(sampleDeal.title)).toBeInTheDocument();
  });
});
