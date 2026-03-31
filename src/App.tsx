import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index.tsx";
import CampaignsPage from "./pages/CampaignsPage.tsx";
import CampaignDetailPage from "./pages/CampaignDetailPage.tsx";
import LeadsPage from "./pages/LeadsPage.tsx";
import LeadDetailPage from "./pages/LeadDetailPage.tsx";
import ContactsPage from "./pages/ContactsPage.tsx";
import ContactDetailPage from "./pages/ContactDetailPage.tsx";
import CompaniesPage from "./pages/CompaniesPage.tsx";
import CompanyDetailPage from "./pages/CompanyDetailPage.tsx";
import DealsPage from "./pages/DealsPage.tsx";
import DealDetailPage from "./pages/DealDetailPage.tsx";
import TasksPage from "./pages/TasksPage.tsx";
import ActivitiesPage from "./pages/ActivitiesPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import ReportDetailPage from "./pages/ReportDetailPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/leads/:id" element={<LeadDetailPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/:id" element={<ContactDetailPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/deals/:id" element={<DealDetailPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:reportId" element={<ReportDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
