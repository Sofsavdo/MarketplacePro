import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Category from "@/pages/category";
import Product from "@/pages/product";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import SellerRegister from "@/pages/seller/register";
import PartnerRegister from "@/pages/partner/register";
import Cart from "@/pages/cart";

// Dashboard pages
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Orders from "@/pages/orders";
import Favorites from "@/pages/favorites";

// Merchant pages
import MerchantDashboard from "@/pages/merchant/dashboard";
import MerchantProducts from "@/pages/merchant/products";
import MerchantOrders from "@/pages/merchant/orders";
import MerchantAnalytics from "@/pages/merchant/analytics";

// Blogger/Affiliate pages
import BloggerDashboard from "@/pages/blogger/dashboard";
import AffiliateLinks from "@/pages/blogger/links";
import AffiliateAnalytics from "@/pages/blogger/analytics";
import AffiliateEarnings from "@/pages/blogger/earnings";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminUsers from "@/pages/admin/users";
import AdminAnalytics from "@/pages/admin/analytics";

// Protected route component
import { ProtectedRoute } from "@/components/auth/protected-route";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/category/:slug" component={Category} />
          <Route path="/product/:slug" component={Product} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/seller/register" component={SellerRegister} />
          <Route path="/partner/register" component={PartnerRegister} />
          <Route path="/cart" component={Cart} />

          {/* Protected customer routes */}
          <Route path="/dashboard">
            <ProtectedRoute roles={["customer"]}>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/profile">
            <ProtectedRoute roles={["customer", "merchant", "blogger", "admin"]}>
              <Profile />
            </ProtectedRoute>
          </Route>
          <Route path="/orders">
            <ProtectedRoute roles={["customer"]}>
              <Orders />
            </ProtectedRoute>
          </Route>
          <Route path="/favorites">
            <ProtectedRoute roles={["customer"]}>
              <Favorites />
            </ProtectedRoute>
          </Route>

          {/* Merchant routes */}
          <Route path="/merchant">
            <ProtectedRoute roles={["merchant", "admin"]}>
              <MerchantDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/merchant/products">
            <ProtectedRoute roles={["merchant", "admin"]}>
              <MerchantProducts />
            </ProtectedRoute>
          </Route>
          <Route path="/merchant/orders">
            <ProtectedRoute roles={["merchant", "admin"]}>
              <MerchantOrders />
            </ProtectedRoute>
          </Route>
          <Route path="/merchant/analytics">
            <ProtectedRoute roles={["merchant", "admin"]}>
              <MerchantAnalytics />
            </ProtectedRoute>
          </Route>

          {/* Blogger/Affiliate routes */}
          <Route path="/blogger">
            <ProtectedRoute roles={["blogger"]}>
              <BloggerDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/blogger/links">
            <ProtectedRoute roles={["blogger"]}>
              <AffiliateLinks />
            </ProtectedRoute>
          </Route>
          <Route path="/blogger/analytics">
            <ProtectedRoute roles={["blogger"]}>
              <AffiliateAnalytics />
            </ProtectedRoute>
          </Route>
          <Route path="/blogger/earnings">
            <ProtectedRoute roles={["blogger"]}>
              <AffiliateEarnings />
            </ProtectedRoute>
          </Route>

          {/* Admin routes */}
          <Route path="/admin">
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/users">
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          </Route>
          <Route path="/admin/analytics">
            <ProtectedRoute roles={["admin"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
