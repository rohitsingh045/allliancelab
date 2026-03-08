import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UploadPrescription from "./pages/UploadPrescription.jsx";
import MyReports from "./pages/MyReports.jsx";
import HealthConditionDetail from "./pages/HealthConditionDetail.jsx";
import NotFound from "./pages/NotFound.jsx";
import DownloadReport from "./pages/DownloadReport.jsx";
import HomeCollection from "./pages/HomeCollection.jsx";
import CentreVisit from "./pages/CentreVisit.jsx";
import ComparePackages from "./pages/ComparePackages.jsx";
import CreatePackage from "./pages/CreatePackage.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import KnowledgeHub from "./pages/KnowledgeHub.jsx";
import Blogs from "./pages/Blogs.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/upload-prescription" element={<UploadPrescription />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/download-report" element={<DownloadReport />} />
              <Route path="/home-collection" element={<HomeCollection />} />
              <Route path="/centre-visit" element={<CentreVisit />} />
              <Route path="/compare-packages" element={<ComparePackages />} />
              <Route path="/create-package" element={<CreatePackage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/knowledge-hub" element={<KnowledgeHub />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/health-conditions/:slug" element={<HealthConditionDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
