import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import TasksPage from "@/pages/TasksPage";
import { getTasks } from "@/features/tasks/api";
import type { TaskListItem } from "@/features/tasks/types";

const queryHooks = vi.hoisted(() => ({
  useTasksQuery: vi.fn(),
}));

const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/tasks/queries", () => queryHooks);

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

const sampleTasks: TaskListItem[] = [
  {
    id: "task-overdue",
    title: "Revise proposal pricing for Global Finance",
    description: "Update the discount scenario before procurement review.",
    type: "review",
    priority: "urgent",
    status: "pending",
    dueAt: "2026-03-29T12:00:00Z",
    completedAt: null,
    createdAt: "2026-03-28T14:00:00Z",
    assigneeLabel: "Unassigned",
    relatedType: "deal",
    relatedLabel: "Global Finance Platform Rollout",
    relatedHref: "/deals/30000000-0000-4000-8000-000000000003",
    bucket: "overdue",
    isOverdue: true,
  },
  {
    id: "task-due-today",
    title: "Call Maria about the trial rollout",
    description: "Clarify onboarding questions and confirm stakeholders.",
    type: "call",
    priority: "high",
    status: "in_progress",
    dueAt: "2026-03-31T12:00:00Z",
    completedAt: null,
    createdAt: "2026-03-31T08:30:00Z",
    assigneeLabel: "Unassigned",
    relatedType: "lead",
    relatedLabel: "Maria Garcia",
    relatedHref: "/leads/10000000-0000-4000-8000-000000000002",
    bucket: "due_today",
    isOverdue: false,
  },
  {
    id: "task-upcoming",
    title: "Confirm security review attendees",
    description: "Lock the attendee list before the negotiation call.",
    type: "follow_up",
    priority: "medium",
    status: "pending",
    dueAt: "2026-04-24T10:30:00Z",
    completedAt: null,
    createdAt: "2026-04-20T18:00:00Z",
    assigneeLabel: "Unassigned",
    relatedType: "deal",
    relatedLabel: "TechCorp Enterprise License",
    relatedHref: "/deals/30000000-0000-4000-8000-000000000001",
    bucket: "upcoming",
    isOverdue: false,
  },
  {
    id: "task-completed",
    title: "Send onboarding checklist",
    description: "Hand off the onboarding checklist after signature.",
    type: "email",
    priority: "low",
    status: "completed",
    dueAt: "2026-04-22T10:00:00Z",
    completedAt: "2026-04-22T10:15:00Z",
    createdAt: "2026-04-22T09:10:00Z",
    assigneeLabel: "Unassigned",
    relatedType: "lead",
    relatedLabel: "Priya Patel",
    relatedHref: "/leads/10000000-0000-4000-8000-000000000004",
    bucket: "completed",
    isOverdue: false,
  },
  {
    id: "task-canceled",
    title: "Follow up on paused evaluation",
    description: "Cancel the follow-up because the opportunity is paused.",
    type: "follow_up",
    priority: "low",
    status: "canceled",
    dueAt: "2026-04-01T15:00:00Z",
    completedAt: null,
    createdAt: "2026-03-31T09:30:00Z",
    assigneeLabel: "Unassigned",
    relatedType: "deal",
    relatedLabel: "RetailPlus Pilot Program",
    relatedHref: "/deals/30000000-0000-4000-8000-000000000004",
    bucket: "canceled",
    isOverdue: false,
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

function renderTasksPage() {
  return render(
    <MemoryRouter>
      <TasksPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-03-31T10:00:00Z"));

  queryHooks.useTasksQuery.mockReturnValue(queryState<TaskListItem[]>({ data: [] }));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TasksPage", () => {
  it("renders a loading state while the tasks query is pending", () => {
    queryHooks.useTasksQuery.mockReturnValue(queryState<TaskListItem[]>({ data: [], isPending: true }));

    renderTasksPage();

    expect(screen.getByTestId("tasks-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the tasks query fails", () => {
    queryHooks.useTasksQuery.mockReturnValue(queryState<TaskListItem[]>({ data: [], isError: true }));

    renderTasksPage();

    expect(screen.getByText("Unable to load tasks")).toBeInTheDocument();
  });

  it("renders an empty state when no tasks are returned", () => {
    renderTasksPage();

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
  });

  it("renders grouped live task buckets from mapped data", () => {
    queryHooks.useTasksQuery.mockReturnValue(queryState<TaskListItem[]>({ data: sampleTasks }));

    renderTasksPage();

    expect(screen.getByTestId("tasks-bucket-overdue")).toBeInTheDocument();
    expect(screen.getByTestId("tasks-bucket-due_today")).toBeInTheDocument();
    expect(screen.getByTestId("tasks-bucket-upcoming")).toBeInTheDocument();
    expect(screen.getByTestId("tasks-bucket-completed")).toBeInTheDocument();
    expect(screen.getByTestId("tasks-bucket-canceled")).toBeInTheDocument();
    expect(screen.getByText("Call Maria about the trial rollout")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Maria Garcia" })).toHaveAttribute(
      "href",
      sampleTasks[1].relatedHref,
    );
  });
});

describe("getTasks", () => {
  it("maps FK-backed labels safely and buckets tasks with terminal precedence plus due-today coverage", async () => {
    const builder = makeBuilder({
      data: [
        {
          id: "task-completed",
          title: "Send onboarding checklist",
          description: "Hand off the onboarding checklist after signature.",
          type: "email",
          priority: "low",
          status: "completed",
          due_at: "2026-04-22T10:00:00Z",
          completed_at: "2026-04-22T10:15:00Z",
          created_at: "2026-04-22T09:10:00Z",
          updated_at: "2026-04-22T10:15:00Z",
          assigned_user_id: null,
          lead_id: "10000000-0000-4000-8000-000000000004",
          deal_id: null,
          lead: { id: "10000000-0000-4000-8000-000000000004", full_name: "Priya Patel" },
          deal: null,
        },
        {
          id: "task-overdue",
          title: "Revise proposal pricing for Global Finance",
          description: "Update the discount scenario before procurement review.",
          type: "review",
          priority: "urgent",
          status: "pending",
          due_at: "2026-03-29T12:00:00Z",
          completed_at: null,
          created_at: "2026-03-28T14:00:00Z",
          updated_at: "2026-03-28T14:00:00Z",
          assigned_user_id: null,
          lead_id: null,
          deal_id: "30000000-0000-4000-8000-000000000003",
          lead: null,
          deal: { id: "30000000-0000-4000-8000-000000000003", title: "Global Finance Platform Rollout" },
        },
        {
          id: "task-due-today",
          title: "Call Maria about the trial rollout",
          description: "Clarify onboarding questions and confirm stakeholders.",
          type: "call",
          priority: "high",
          status: "in_progress",
          due_at: "2026-03-31T12:00:00Z",
          completed_at: null,
          created_at: "2026-03-31T08:30:00Z",
          updated_at: "2026-03-31T09:45:00Z",
          assigned_user_id: null,
          lead_id: "10000000-0000-4000-8000-000000000002",
          deal_id: null,
          lead: { id: "10000000-0000-4000-8000-000000000002", full_name: "Maria Garcia" },
          deal: null,
        },
        {
          id: "task-upcoming-null",
          title: "Research expansion stakeholders",
          description: null,
          type: "other",
          priority: "medium",
          status: "pending",
          due_at: null,
          completed_at: null,
          created_at: "2026-03-31T08:00:00Z",
          updated_at: "2026-03-31T08:00:00Z",
          assigned_user_id: null,
          lead_id: null,
          deal_id: "30000000-0000-4000-8000-000000000004",
          lead: null,
          deal: null,
        },
        {
          id: "task-canceled",
          title: "Follow up on paused evaluation",
          description: "Cancel the follow-up because the opportunity is paused.",
          type: "follow_up",
          priority: "low",
          status: "canceled",
          due_at: "2026-04-01T15:00:00Z",
          completed_at: null,
          created_at: "2026-03-31T09:30:00Z",
          updated_at: "2026-03-31T10:00:00Z",
          assigned_user_id: null,
          lead_id: null,
          deal_id: "30000000-0000-4000-8000-000000000004",
          lead: null,
          deal: { id: "30000000-0000-4000-8000-000000000004", title: "RetailPlus Pilot Program" },
        },
      ],
    });

    fromMock.mockImplementation(() => builder);

    const tasks = await getTasks();

    expect(tasks.find((task) => task.id === "task-overdue")).toMatchObject({
      bucket: "overdue",
      isOverdue: true,
      relatedLabel: "Global Finance Platform Rollout",
      relatedHref: "/deals/30000000-0000-4000-8000-000000000003",
    });
    expect(tasks.find((task) => task.id === "task-due-today")).toMatchObject({
      bucket: "due_today",
      isOverdue: false,
      relatedLabel: "Maria Garcia",
      relatedHref: "/leads/10000000-0000-4000-8000-000000000002",
    });
    expect(tasks.find((task) => task.id === "task-completed")).toMatchObject({ bucket: "completed" });
    expect(tasks.find((task) => task.id === "task-canceled")).toMatchObject({ bucket: "canceled" });
    expect(tasks.find((task) => task.id === "task-upcoming-null")).toMatchObject({
      bucket: "upcoming",
      relatedLabel: "Linked deal",
      relatedHref: null,
    });
    expect(tasks.map((task) => task.id)).toEqual([
      "task-overdue",
      "task-due-today",
      "task-upcoming-null",
      "task-completed",
      "task-canceled",
    ]);
  });
});
