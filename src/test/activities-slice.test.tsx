import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ActivitiesPage from "@/pages/ActivitiesPage";
import { getActivities } from "@/features/activities/api";
import type { ActivityListItem } from "@/features/activities/types";

const queryHooks = vi.hoisted(() => ({
  useActivitiesQuery: vi.fn(),
}));

const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/activities/queries", () => queryHooks);

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

const sampleActivities: ActivityListItem[] = [
  {
    id: "activity-system",
    type: "system",
    title: "New lead captured",
    description: "Alex Thompson submitted the enterprise demo form.",
    occurredAt: "2026-04-16T09:15:00Z",
    durationMinutes: null,
    actorLabel: "System",
    relatedType: "lead",
    relatedLabel: "Alex Thompson",
    relatedHref: "/leads/10000000-0000-4000-8000-000000000001",
  },
  {
    id: "activity-email",
    type: "email",
    title: "Security checklist sent to TechCorp",
    description: "Shared the security questionnaire ahead of the contract review.",
    occurredAt: "2026-04-20T18:15:00Z",
    durationMinutes: null,
    actorLabel: "Unassigned",
    relatedType: "deal",
    relatedLabel: "TechCorp Enterprise License",
    relatedHref: "/deals/30000000-0000-4000-8000-000000000001",
  },
  {
    id: "activity-call",
    type: "call",
    title: "Discovery call with Alex",
    description: "Reviewed security requirements and rollout timing for the enterprise plan.",
    occurredAt: "2026-04-20T16:30:00Z",
    durationMinutes: 35,
    actorLabel: "Unassigned",
    relatedType: "lead",
    relatedLabel: "Alex Thompson",
    relatedHref: "/leads/10000000-0000-4000-8000-000000000001",
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
    or: vi.fn(() => builder),
    order: vi.fn(() => builder),
  };

  return builder;
}

function renderActivitiesPage() {
  return render(
    <MemoryRouter>
      <ActivitiesPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  queryHooks.useActivitiesQuery.mockReturnValue(queryState<ActivityListItem[]>({ data: [] }));
});

describe("ActivitiesPage", () => {
  it("renders a loading state while the activities query is pending", () => {
    queryHooks.useActivitiesQuery.mockReturnValue(queryState<ActivityListItem[]>({ data: [], isPending: true }));

    renderActivitiesPage();

    expect(screen.getByTestId("activities-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the activities query fails", () => {
    queryHooks.useActivitiesQuery.mockReturnValue(queryState<ActivityListItem[]>({ data: [], isError: true }));

    renderActivitiesPage();

    expect(screen.getByText("Unable to load activities")).toBeInTheDocument();
  });

  it("renders an empty state when no activities are returned", () => {
    renderActivitiesPage();

    expect(screen.getByText("No activities yet")).toBeInTheDocument();
  });

  it("renders live timeline activities and supports filtered no-results", () => {
    queryHooks.useActivitiesQuery.mockReturnValue(queryState<ActivityListItem[]>({ data: sampleActivities }));

    renderActivitiesPage();

    expect(screen.getByText("Discovery call with Alex")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "TechCorp Enterprise License" })).toHaveAttribute(
      "href",
      sampleActivities[1].relatedHref,
    );

    fireEvent.click(screen.getByRole("button", { name: /WhatsApp/i }));

    expect(screen.getByText("No matching activities")).toBeInTheDocument();
  });
});

describe("getActivities", () => {
  it("maps FK-backed related labels safely and applies actor fallbacks", async () => {
    const builder = makeBuilder({
      data: [
        {
          id: "activity-system",
          type: "system",
          title: "New lead captured",
          description: "Alex Thompson submitted the enterprise demo form.",
          occurred_at: "2026-04-16T09:15:00Z",
          duration_minutes: null,
          actor_user_id: null,
          lead_id: "10000000-0000-4000-8000-000000000001",
          deal_id: null,
          lead: { id: "10000000-0000-4000-8000-000000000001", full_name: "Alex Thompson" },
          deal: null,
        },
        {
          id: "activity-note",
          type: "note",
          title: "Deal marked as lost",
          description: "RetailPlus paused the pilot after finance rejected the spend request.",
          occurred_at: "2026-04-18T15:45:00Z",
          duration_minutes: null,
          actor_user_id: null,
          lead_id: null,
          deal_id: "30000000-0000-4000-8000-000000000004",
          lead: null,
          deal: null,
        },
      ],
    });

    fromMock.mockImplementation(() => builder);

    const activities = await getActivities();

    expect(builder.or).toHaveBeenCalledWith("lead_id.not.is.null,deal_id.not.is.null");
    expect(builder.order).toHaveBeenCalledWith("occurred_at", { ascending: false });
    expect(activities[0]).toMatchObject({
      actorLabel: "System",
      relatedType: "lead",
      relatedLabel: "Alex Thompson",
      relatedHref: "/leads/10000000-0000-4000-8000-000000000001",
    });
    expect(activities[1]).toMatchObject({
      actorLabel: "Unassigned",
      relatedType: "deal",
      relatedLabel: "Linked deal",
      relatedHref: null,
    });
  });
});
