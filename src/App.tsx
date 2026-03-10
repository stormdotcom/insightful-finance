import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import DebtManager from "./pages/DebtManager";
import Investments from "./pages/Investments";
import BudgetPlanner from "./pages/BudgetPlanner";
import AIAdvisor from "./pages/AIAdvisor";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import CrisisPlanning from "./pages/CrisisPlanning";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/debt" element={<DebtManager />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/budget" element={<BudgetPlanner />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/crisis" element={<CrisisPlanning />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
