import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import FounderStories from "./pages/FounderStories";
import About from "./pages/About";
import StoryDetail from "./pages/StoryDetail";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ArticleEditor from "./pages/ArticleEditor";
import StartupGuide from "./pages/StartupGuide";
import MisaLicenseGuide from "./pages/MisaLicenseGuide";
import BusinessFAQ from "./pages/BusinessFAQ";
import PremiumResidency from "./pages/PremiumResidency";
import RisingFounders from "./pages/RisingFounders";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/stories" element={<FounderStories />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:id" element={<InsightDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/new" element={<ArticleEditor />} />
            <Route path="/admin/edit/:id" element={<ArticleEditor />} />
            <Route path="/startup-guide" element={<StartupGuide />} />
            <Route path="/startup-guide/misa-license" element={<MisaLicenseGuide />} />
            <Route path="/startup-guide/business-faq" element={<BusinessFAQ />} />
            <Route path="/startup-guide/premium-residency" element={<PremiumResidency />} />
            <Route path="/rising-founders" element={<RisingFounders />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
