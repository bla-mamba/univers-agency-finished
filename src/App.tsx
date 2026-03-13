import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CompareProvider } from './contexts/CompareContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CompareBar from './components/CompareBar';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import PackageDetailPage from './pages/PackageDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyWishlistPage from './pages/MyWishlistPage';
import MyProfilePage from './pages/MyProfilePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import OffersPage from './pages/OffersPage';
import ComparePage from './pages/ComparePage';
import PersonalizedTripPage from './pages/PersonalizedTripPage';
import CRMLayout from './pages/crm/CRMLayout';
import Dashboard from './pages/crm/Dashboard';
import PackageManagement from './pages/crm/PackageManagement';
import BookingManagement from './pages/crm/BookingManagement';
import CustomerManagement from './pages/crm/CustomerManagement';
import DestinationManagement from './pages/crm/DestinationManagement';
import CategoryManagement from './pages/crm/CategoryManagement';
import ReviewManagement from './pages/crm/ReviewManagement';
import NewsletterManagement from './pages/crm/NewsletterManagement';
import BlogManagement from './pages/crm/BlogManagement';
import OffersManagement from './pages/crm/OffersManagement';
import AvailabilityManagement from './pages/crm/AvailabilityManagement';
import TestimonialsManagement from './pages/crm/TestimonialsManagement';
import HeroMediaManagement from './pages/crm/HeroMediaManagement';
import PersonalizedTripManagement from './pages/crm/PersonalizedTripManagement';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CategoriesProvider>
        <CompareProvider>
          <ScrollToTop />
          <Routes>
            <Route
              path="/*"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/packages" element={<PackagesPage />} />
                      <Route path="/packages/:slug" element={<PackageDetailPage />} />
                      <Route path="/destinations" element={<DestinationsPage />} />
                      <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/my-bookings" element={<MyBookingsPage />} />
                      <Route path="/my-wishlist" element={<MyWishlistPage />} />
                      <Route path="/my-profile" element={<MyProfilePage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogDetailPage />} />
                      <Route path="/offers" element={<OffersPage />} />
                      <Route path="/compare" element={<ComparePage />} />
                      <Route path="/personalized-trip" element={<PersonalizedTripPage />} />
                    </Routes>
                  </main>
                  <Footer />
                  <WhatsAppButton />
                  <CompareBar />
                </div>
              }
            />

            <Route element={<AdminRoute />}>
              <Route path="/crm/*" element={<CRMLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="packages" element={<PackageManagement />} />
                <Route path="bookings" element={<BookingManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="destinations" element={<DestinationManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="reviews" element={<ReviewManagement />} />
                <Route path="newsletter" element={<NewsletterManagement />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="offers" element={<OffersManagement />} />
                <Route path="availability" element={<AvailabilityManagement />} />
                <Route path="testimonials" element={<TestimonialsManagement />} />
                <Route path="hero-media" element={<HeroMediaManagement />} />
                <Route path="personalized-trips" element={<PersonalizedTripManagement />} />
              </Route>
            </Route>
          </Routes>
        </CompareProvider>
        </CategoriesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
