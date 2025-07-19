import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Pages
import HomePage from '@/pages/HomePage';
import MarketplacePage from '@/pages/MarketplacePage';
import ProductPage from '@/pages/ProductPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import SellerOnboardingPage from '@/pages/SellerOnboardingPage';
import SellerDashboardPage from '@/pages/SellerDashboardPage';
import AffiliateOnboardingPage from '@/pages/AffiliateOnboardingPage';
import AffiliateDashboardPage from '@/pages/AffiliateDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';
import SellerAnalyticsPage from '@/pages/SellerAnalyticsPage';
import AffiliateAnalyticsPage from '@/pages/AffiliateAnalyticsPage';

// Components
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/seller/onboarding" element={<SellerOnboardingPage />} />
                <Route path="/affiliate/onboarding" element={<AffiliateOnboardingPage />} />
                
                {/* Protected routes */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* Seller routes */}
                <Route path="/seller/dashboard" element={
                  <ProtectedRoute roles={['seller']}>
                    <SellerDashboardPage />
                  </ProtectedRoute>
                } />
                
                {/* Affiliate routes */}
                <Route path="/affiliate/dashboard" element={
                  <ProtectedRoute roles={['affiliate']}>
                    <AffiliateDashboardPage />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />
                
                {/* Analytics routes */}
                <Route path="/seller/analytics" element={
                  <ProtectedRoute roles={['seller']}>
                    <SellerAnalyticsPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/affiliate/analytics" element={
                  <ProtectedRoute roles={['affiliate']}>
                    <AffiliateAnalyticsPage />
                  </ProtectedRoute>
                } />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;