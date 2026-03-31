import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CompaniesPage from "@/pages/CompaniesPage";
import CompanyDetailPage from "@/pages/CompanyDetailPage";
import { getCompanies } from "@/features/companies/api";
import type {
  CompanyContactItem,
  CompanyDealItem,
  CompanyDetailItem,
  CompanyLeadItem,
  CompanyListItem,
} from "@/features/companies/types";

const queryHooks = vi.hoisted(() => ({
  useCompaniesQuery: vi.fn(),
  useCompanyByIdQuery: vi.fn(),
  useCompanyContactsQuery: vi.fn(),
  useCompanyLeadsQuery: vi.fn(),
  useCompanyDealsQuery: vi.fn(),
}));

const fromMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/companies/queries", () => queryHooks);

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

const sampleCompanies: CompanyListItem[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    name: "TechCorp Solutions",
    industry: "SaaS",
    sizeBand: "201-500",
    websiteUrl: "https://techcorp.example",
    domain: "techcorp.example",
    contactsCount: 1,
    linkedLeads: 1,
    activeDeals: 1,
    wonRevenue: 0,
    openPipeline: 125000,
    createdAt: "2026-04-16T09:00:00Z",
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4",
    name: "CloudNine Tech",
    industry: "Cloud Infrastructure",
    sizeBand: "51-200",
    websiteUrl: "https://cloudnine.example",
    domain: "cloudnine.example",
    contactsCount: 1,
    linkedLeads: 1,
    activeDeals: 0,
    wonRevenue: 67800,
    openPipeline: 0,
    createdAt: "2026-04-21T09:30:00Z",
  },
];

const sampleCompanyDetail: CompanyDetailItem = {
  id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
  name: "TechCorp Solutions",
  industry: "SaaS",
  sizeBand: "201-500",
  websiteUrl: "https://techcorp.example",
  domain: "techcorp.example",
  contactsCount: 1,
  linkedLeads: 1,
  linkedDeals: 1,
  activeDeals: 1,
  wonDeals: 0,
  wonRevenue: 0,
  openPipeline: 125000,
  createdAt: "2026-04-16T09:00:00Z",
};

const sampleCompanyContacts: CompanyContactItem[] = [
  {
    id: "20000000-0000-4000-8000-000000000002",
    name: "Alex Thompson",
    email: "alex.t@techcorp.example",
    phone: "+1 (555) 234-5678",
    jobTitle: "VP of Engineering",
    lifecycleStage: "opportunity",
    createdAt: "2026-04-18T10:30:00Z",
  },
];

const sampleCompanyLeads: CompanyLeadItem[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Alex Thompson",
    status: "qualified",
    score: 82,
    createdAt: "2026-04-16T09:15:00Z",
  },
];

const sampleCompanyDeals: CompanyDealItem[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    title: "TechCorp Enterprise License",
    primaryContactName: "Alex Thompson",
    stage: "negotiation",
    amount: 125000,
    currency: "USD",
    createdAt: "2026-04-20T11:45:00Z",
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

function renderCompaniesPage() {
  return render(
    <MemoryRouter>
      <CompaniesPage />
    </MemoryRouter>,
  );
}

function renderCompanyDetailPage(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/companies/:id" element={<CompanyDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();

  queryHooks.useCompaniesQuery.mockReturnValue(queryState<CompanyListItem[]>({ data: [] }));
  queryHooks.useCompanyByIdQuery.mockReturnValue(queryState<CompanyDetailItem | null>({ data: null }));
  queryHooks.useCompanyContactsQuery.mockReturnValue(queryState<CompanyContactItem[]>({ data: [] }));
  queryHooks.useCompanyLeadsQuery.mockReturnValue(queryState<CompanyLeadItem[]>({ data: [] }));
  queryHooks.useCompanyDealsQuery.mockReturnValue(queryState<CompanyDealItem[]>({ data: [] }));
});

describe("CompaniesPage", () => {
  it("renders a loading state while the companies query is pending", () => {
    queryHooks.useCompaniesQuery.mockReturnValue(queryState<CompanyListItem[]>({ data: [], isPending: true }));

    renderCompaniesPage();

    expect(screen.getByTestId("companies-loading-state")).toBeInTheDocument();
  });

  it("renders a generic error state when the companies query fails", () => {
    queryHooks.useCompaniesQuery.mockReturnValue(queryState<CompanyListItem[]>({ data: [], isError: true }));

    renderCompaniesPage();

    expect(screen.getByText("Unable to load companies")).toBeInTheDocument();
  });

  it("renders an empty state when no companies are returned", () => {
    renderCompaniesPage();

    expect(screen.getByText("No companies yet")).toBeInTheDocument();
  });

  it("renders a filtered no-results state when search removes all companies", () => {
    queryHooks.useCompaniesQuery.mockReturnValue(queryState<CompanyListItem[]>({ data: sampleCompanies }));

    renderCompaniesPage();
    fireEvent.change(screen.getByPlaceholderText("Search companies by name, website, or domain..."), {
      target: { value: "nonexistent company" },
    });

    expect(screen.getByText("No matching companies")).toBeInTheDocument();
  });

  it("renders live rows from mapped company summary data", () => {
    queryHooks.useCompaniesQuery.mockReturnValue(queryState<CompanyListItem[]>({ data: sampleCompanies }));

    renderCompaniesPage();

    expect(screen.getByRole("link", { name: /TechCorp Solutions/i })).toHaveAttribute(
      "href",
      `/companies/${sampleCompanies[0].id}`,
    );
    expect(screen.getByText("Cloud Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("$67.8K")).toBeInTheDocument();
    expect(screen.getByText("$125.0K")).toBeInTheDocument();
  });
});

describe("CompanyDetailPage", () => {
  it("treats an invalid UUID route param as immediate not-found", () => {
    renderCompanyDetailPage("/companies/not-a-valid-uuid");

    expect(screen.getByText("Company not found")).toBeInTheDocument();
    expect(queryHooks.useCompanyByIdQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useCompanyContactsQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useCompanyLeadsQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
    expect(queryHooks.useCompanyDealsQuery).toHaveBeenCalledWith("not-a-valid-uuid", false);
  });

  it("treats a valid UUID with no returned row as not-found after the query", () => {
    queryHooks.useCompanyByIdQuery.mockReturnValue(queryState<CompanyDetailItem | null>({ data: null }));

    renderCompanyDetailPage(`/companies/${sampleCompanyDetail.id}`);

    expect(
      screen.getByText("This company ID is valid, but there is no matching company record in the database."),
    ).toBeInTheDocument();
    expect(queryHooks.useCompanyByIdQuery).toHaveBeenCalledWith(sampleCompanyDetail.id, true);
    expect(queryHooks.useCompanyContactsQuery).toHaveBeenCalledWith(sampleCompanyDetail.id, false);
    expect(queryHooks.useCompanyLeadsQuery).toHaveBeenCalledWith(sampleCompanyDetail.id, false);
    expect(queryHooks.useCompanyDealsQuery).toHaveBeenCalledWith(sampleCompanyDetail.id, false);
  });

  it("renders a generic error state when the main company query fails", () => {
    queryHooks.useCompanyByIdQuery.mockReturnValue(
      queryState<CompanyDetailItem | null>({ data: null, isError: true }),
    );

    renderCompanyDetailPage(`/companies/${sampleCompanyDetail.id}`);

    expect(screen.getByText("Unable to load company")).toBeInTheDocument();
  });

  it("enables related queries only after a valid company row exists and renders linked tabs", () => {
    queryHooks.useCompanyByIdQuery.mockReturnValue(queryState<CompanyDetailItem | null>({ data: sampleCompanyDetail }));
    queryHooks.useCompanyContactsQuery.mockReturnValue(queryState<CompanyContactItem[]>({ data: sampleCompanyContacts }));
    queryHooks.useCompanyLeadsQuery.mockReturnValue(queryState<CompanyLeadItem[]>({ data: sampleCompanyLeads }));
    queryHooks.useCompanyDealsQuery.mockReturnValue(queryState<CompanyDealItem[]>({ data: sampleCompanyDeals }));

    renderCompanyDetailPage(`/companies/${sampleCompanyDetail.id}`);

    expect(queryHooks.useCompanyContactsQuery).toHaveBeenCalledWith(sampleCompanyDetail.id, true);
    expect(queryHooks.useCompanyLeadsQuery).toHaveBeenCalledWith(sampleCompanyDetail.id, true);
    expect(queryHooks.useCompanyDealsQuery).toHaveBeenCalledWith(sampleCompanyDetail.id, true);
    expect(screen.getByRole("heading", { name: sampleCompanyDetail.name })).toBeInTheDocument();
    expect(screen.queryByText("Recent Activity")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Contacts (1)" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Leads (1)" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Deals (1)" })).toBeInTheDocument();
  });
});

describe("getCompanies", () => {
  it("maps FK-backed company summary metrics from contacts, leads, and deals only", async () => {
    const companiesBuilder = makeBuilder({
      data: [
        {
          id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
          name: "TechCorp Solutions",
          industry: "SaaS",
          size_band: "201-500",
          website_url: "https://techcorp.example",
          domain: "techcorp.example",
          created_at: "2026-04-16T09:00:00Z",
        },
      ],
    });

    const contactsBuilder = makeBuilder({
      data: [{ company_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1" }],
    });

    const leadsBuilder = makeBuilder({
      data: [{ company_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1" }],
    });

    const dealsBuilder = makeBuilder({
      data: [
        { company_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1", stage: "negotiation", amount: 125000 },
        { company_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1", stage: "won", amount: 67800 },
      ],
    });

    fromMock
      .mockImplementationOnce(() => companiesBuilder)
      .mockImplementationOnce(() => contactsBuilder)
      .mockImplementationOnce(() => leadsBuilder)
      .mockImplementationOnce(() => dealsBuilder);

    const companies = await getCompanies();

    expect(companiesBuilder.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(contactsBuilder.not).toHaveBeenCalledWith("company_id", "is", null);
    expect(leadsBuilder.not).toHaveBeenCalledWith("company_id", "is", null);
    expect(dealsBuilder.not).toHaveBeenCalledWith("company_id", "is", null);
    expect(companies).toEqual([
      expect.objectContaining({
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
        contactsCount: 1,
        linkedLeads: 1,
        activeDeals: 1,
        wonRevenue: 67800,
        openPipeline: 125000,
      }),
    ]);
  });
});
