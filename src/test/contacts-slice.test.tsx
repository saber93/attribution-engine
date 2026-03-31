import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactsPage from "@/pages/ContactsPage";
import ContactDetailPage from "@/pages/ContactDetailPage";
import { getContacts } from "@/features/contacts/api";
import type { ContactDealItem, ContactDetailItem, ContactListItem } from "@/features/contacts/types";

const queryHooks = vi.hoisted(() => ({
  useContactsQuery: vi.fn(),
  useContactByIdQuery: vi.fn(),
  useContactDealsQuery: vi.fn(),
}));

const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/contacts/queries", () => queryHooks);

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

const sampleContacts: ContactListItem[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    name: "Priya Patel",
    email: "priya@cloudnine.io",
    phone: "+91 98765 43210",
    companyName: "CloudNine Tech",
    jobTitle: "Founder & CEO",
    lifecycleStage: "customer",
    sourceLeadName: "Priya Patel",
    totalDeals: 1,
    wonRevenue: 67800,
    createdAt: "2026-04-21T09:30:00Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    name: "Alex Thompson",
    email: "alex.t@techcorp.io",
    phone: "+1 (555) 234-5678",
    companyName: "TechCorp Solutions",
    jobTitle: "VP of Engineering",
    lifecycleStage: "opportunity",
    sourceLeadName: null,
    totalDeals: 1,
    wonRevenue: 0,
    createdAt: "2026-04-18T10:30:00Z",
  },
];

const sampleContactDetail: ContactDetailItem = {
  id: "20000000-0000-4000-8000-000000000001",
  name: "Priya Patel",
  email: "priya@cloudnine.io",
  phone: "+91 98765 43210",
  companyId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4",
  companyName: "CloudNine Tech",
  sourceLeadId: "10000000-0000-4000-8000-000000000004",
  sourceLeadName: "Priya Patel",
  jobTitle: "Founder & CEO",
  lifecycleStage: "customer",
  totalDeals: 1,
  wonRevenue: 67800,
  createdAt: "2026-04-21T09:30:00Z",
};

const sampleContactDeals: ContactDealItem[] = [
  {
    id: "30000000-0000-4000-8000-000000000002",
    title: "CloudNine Migration Project",
    companyName: "CloudNine Tech",
    stage: "won",
    amount: 67800,
    currency: "USD",
    createdAt: "2026-04-21T10:00:00Z",
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
    in: vi.fn(() => builder),
  };

  return builder;
}

function renderContactsPage() {
  return render(
    <MemoryRouter>
      <ContactsPage />
    </MemoryRouter>,
  );
}

function renderContactDetailPage(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/contacts/:id" element={<ContactDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  queryHooks.useContactsQuery.mockReturnValue(queryState<ContactListItem[]>({ data: [] }));
  queryHooks.useContactByIdQuery.mockReturnValue(queryState<ContactDetailItem | null>({ data: null }));
  queryHooks.useContactDealsQuery.mockReturnValue(queryState<ContactDealItem[]>({ data: [] }));
});

describe("ContactsPage", () => {
  it("renders a loading state while the contacts query is pending", () => {
    queryHooks.useContactsQuery.mockReturnValue(queryState<ContactListItem[]>({ data: [], isPending: true }));

    renderContactsPage();

    expect(screen.getByTestId("contacts-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the contacts query fails", () => {
    queryHooks.useContactsQuery.mockReturnValue(queryState<ContactListItem[]>({ data: [], isError: true }));

    renderContactsPage();

    expect(screen.getByText("Unable to load contacts")).toBeInTheDocument();
  });

  it("renders an empty state when no contacts are returned", () => {
    renderContactsPage();

    expect(screen.getByText("No contacts yet")).toBeInTheDocument();
  });

  it("renders a filtered no-results state when search removes all contacts", () => {
    queryHooks.useContactsQuery.mockReturnValue(queryState<ContactListItem[]>({ data: sampleContacts }));

    renderContactsPage();
    fireEvent.change(screen.getByPlaceholderText("Search contacts by name, company, or email..."), {
      target: { value: "nonexistent contact" },
    });

    expect(screen.getByText("No matching contacts")).toBeInTheDocument();
  });

  it("renders live rows from mapped contact data", () => {
    queryHooks.useContactsQuery.mockReturnValue(queryState<ContactListItem[]>({ data: sampleContacts }));

    renderContactsPage();

    expect(screen.getByRole("link", { name: /Priya Patel/i })).toHaveAttribute(
      "href",
      `/contacts/${sampleContacts[0].id}`,
    );
    expect(screen.getByText("Founder & CEO")).toBeInTheDocument();
    expect(screen.getByText("Source Lead")).toBeInTheDocument();
    expect(screen.getByText("$67.8K")).toBeInTheDocument();
  });
});

describe("ContactDetailPage", () => {
  it("treats an invalid UUID route param as immediate not-found", () => {
    renderContactDetailPage("/contacts/not-a-valid-uuid");

    expect(screen.getByText("Contact not found")).toBeInTheDocument();
    expect(queryHooks.useContactByIdQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useContactDealsQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
  });

  it("treats a valid UUID with no returned row as not-found after the query", () => {
    queryHooks.useContactByIdQuery.mockReturnValue(queryState<ContactDetailItem | null>({ data: null }));

    renderContactDetailPage(`/contacts/${sampleContactDetail.id}`);

    expect(screen.getByText("This contact ID is valid, but there is no matching contact record in the database.")).toBeInTheDocument();
    expect(queryHooks.useContactByIdQuery).toHaveBeenCalledWith(sampleContactDetail.id, true);
    expect(queryHooks.useContactDealsQuery).toHaveBeenCalledWith(sampleContactDetail.id, false);
  });

  it("renders a generic error state when the main contact query fails", () => {
    queryHooks.useContactByIdQuery.mockReturnValue(queryState<ContactDetailItem | null>({ data: null, isError: true }));

    renderContactDetailPage(`/contacts/${sampleContactDetail.id}`);

    expect(screen.getByText("Unable to load contact")).toBeInTheDocument();
  });

  it("enables linked deals only after a valid contact row exists and removes the old activity section", () => {
    queryHooks.useContactByIdQuery.mockReturnValue(queryState<ContactDetailItem | null>({ data: sampleContactDetail }));
    queryHooks.useContactDealsQuery.mockReturnValue(queryState<ContactDealItem[]>({ data: sampleContactDeals }));

    renderContactDetailPage(`/contacts/${sampleContactDetail.id}`);

    expect(queryHooks.useContactDealsQuery).toHaveBeenCalledWith(sampleContactDetail.id, true);
    expect(screen.getByRole("heading", { name: sampleContactDetail.name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: sampleContactDetail.sourceLeadName! })).toHaveAttribute(
      "href",
      `/leads/${sampleContactDetail.sourceLeadId}`,
    );
    expect(screen.getByRole("link", { name: /CloudNine Migration Project/i })).toHaveAttribute(
      "href",
      `/deals/${sampleContactDeals[0].id}`,
    );
    expect(screen.queryByText("Activity")).not.toBeInTheDocument();
  });
});

describe("getContacts", () => {
  it("maps live contact rows with FK-backed company/source-lead data and primary-contact deal summaries", async () => {
    const contactsBuilder = makeBuilder({
      data: [
        {
          id: "20000000-0000-4000-8000-000000000001",
          full_name: "Priya Patel",
          email: "priya@cloudnine.io",
          phone: "+91 98765 43210",
          job_title: "Founder & CEO",
          lifecycle_stage: "customer",
          created_at: "2026-04-21T09:30:00Z",
          company: { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4", name: "CloudNine Tech" },
          sourceLead: { id: "10000000-0000-4000-8000-000000000004", full_name: "Priya Patel" },
        },
      ],
    });

    const dealsBuilder = makeBuilder({
      data: [
        {
          primary_contact_id: "20000000-0000-4000-8000-000000000001",
          stage: "won",
          amount: 67800,
        },
        {
          primary_contact_id: "20000000-0000-4000-8000-000000000001",
          stage: "proposal",
          amount: 120000,
        },
      ],
    });

    fromMock.mockImplementation((table: string) => {
      if (table === "contacts") return contactsBuilder;
      if (table === "deals") return dealsBuilder;
      throw new Error(`Unexpected table: ${table}`);
    });

    const result = await getContacts();

    expect(result).toEqual([
      {
        id: "20000000-0000-4000-8000-000000000001",
        name: "Priya Patel",
        email: "priya@cloudnine.io",
        phone: "+91 98765 43210",
        companyName: "CloudNine Tech",
        jobTitle: "Founder & CEO",
        lifecycleStage: "customer",
        sourceLeadName: "Priya Patel",
        totalDeals: 2,
        wonRevenue: 67800,
        createdAt: "2026-04-21T09:30:00Z",
      },
    ]);
    expect(dealsBuilder.in).toHaveBeenCalledWith("primary_contact_id", [
      "20000000-0000-4000-8000-000000000001",
    ]);
  });
});
