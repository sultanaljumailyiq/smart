import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { Layout } from "./components/Layout";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { BookmarksProvider } from "./contexts/BookmarksContext";
import { SystemSettingsProvider } from "./contexts/SystemSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import MobileOptimizer from "./components/MobileOptimizer";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Accounts from "./pages/Accounts";
import Stocks from "./pages/Stocks";
import Reservations from "./pages/Reservations";
import Treatments from "./pages/Treatments";
import Staff from "./pages/Staff";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import CustomerSupport from "./pages/CustomerSupport";
import PaymentMethods from "./pages/PaymentMethods";
import Peripherals from "./pages/Peripherals";
import PatientDetail from "./pages/PatientDetail";
import LandingPage from "./pages/LandingPage";
import Community from "./pages/Community";
import Jobs from "./pages/Jobs";
import JobsNew from "./pages/JobsNew";
import JobsSimple from "./pages/JobsSimple";
import PlatformAdmin from "./pages/PlatformAdmin";
import Auth from "./pages/Auth";
import DentalSupplyMarket from "./pages/DentalSupplyMarket";
import DentalSupplyMarketResponsive from "./pages/DentalSupplyMarketResponsive";
import DentalSupplyMarketMobileFixed from "./pages/DentalSupplyMarketMobileFixed";
import StoreLayout from "./components/StoreLayout";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import Messages from "./pages/Messages";
import BrandDetail from "./pages/BrandDetail";
import AllProducts from "./pages/AllProducts";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Students from "./pages/Students";
import Trending from "./pages/Trending";
import Featured from "./pages/Featured";
import Offers from "./pages/Offers";
import Suppliers from "./pages/Suppliers";
import Brands from "./pages/Brands";
import CategoryProducts from "./pages/CategoryProducts";
import SupplierProfile from "./pages/SupplierProfile";
import UserDashboard from "./pages/UserDashboard";
import DentistHub from "./pages/DentistHub";
import ClinicDashboard from "./pages/ClinicDashboard";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";
import ProductDetail from "./pages/ProductDetail";
import AllCategories from "./pages/AllCategories";
import CommunityJobsAdmin from "./pages/CommunityJobsAdmin";
import CommunityGroups from "./pages/CommunityGroups";
import CommunityExperts from "./pages/CommunityExperts";
import CommunityEvents from "./pages/CommunityEvents";
import SupplierOrders from "./pages/supplier/SupplierOrders";
import SupplierStore from "./pages/supplier/SupplierStore";
import SupplierCustomers from "./pages/supplier/SupplierCustomers";
import SupplierAnalytics from "./pages/supplier/SupplierAnalytics";
import SupplierShipping from "./pages/supplier/SupplierShipping";
import SupplierPayments from "./pages/supplier/SupplierPayments";
import SupplierProducts from "./pages/supplier/SupplierProducts";
import SupplierDashboard from "./pages/supplier/SupplierDashboard";
import Education from "./pages/Education";
import Models3D from "./pages/Models3D";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import AIDiagnosis from "./pages/AIDiagnosis";
import SmartChat from "./pages/SmartChat";
import PhotoAnalysis from "./pages/PhotoAnalysis";
import CategoriesNew from "./pages/CategoriesNew";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import AppWithUnifiedHeader from "./components/AppWithUnifiedHeader";
import ClinicBooking from "./pages/ClinicBooking";
import ModernAppointmentBooking from "./pages/ModernAppointmentBooking";
import SimplifiedAppointmentBooking from "./pages/SimplifiedAppointmentBooking";
import IntegratedDentistProfile from "./pages/IntegratedDentistProfile";
import CommunityEducationHub from "./pages/CommunityEducationHub";
import ModernMedicalServices from "./pages/ModernMedicalServices";
import BookingShowcase from "./components/BookingShowcase";
import ClinicAdmin from "./pages/ClinicAdmin";
import AdvancedClinicManagement from "./pages/AdvancedClinicManagement";
import Notifications from "./pages/Notifications";
import UnifiedNotifications from "./pages/UnifiedNotifications";
import Emergency from "./pages/Emergency";
import UnifiedMedicalServices from "./pages/UnifiedMedicalServices";
import About from "./pages/About";
import PatientLandingPage from "./pages/PatientLandingPage";
import AdminArticles from "./pages/AdminArticles";
import EnhancedTestPage from "./pages/EnhancedTestPage";
import EnhancedClinicDashboard from "./pages/EnhancedClinicDashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import AdminClinicDashboard from "./pages/AdminClinicDashboard";
import MobileBookingPage from "./pages/MobileBookingPage";
import FirstAidGuide from "./pages/FirstAidGuide";
import EmergencyHospitals from "./pages/EmergencyHospitals";
import PainManagement from "./pages/PainManagement";
import DentalEmergency from "./pages/DentalEmergency";
import BrowseDentists from "./pages/BrowseDentists";
import ClinicOnlineBooking from "./pages/ClinicOnlineBooking";
import ClinicsManager from "./pages/ClinicsManager";

// النظام الجديد /clinic
import ClinicReservations from "./pages/clinic/ClinicReservations";
import ClinicPatients from "./pages/clinic/ClinicPatients";
import ClinicTreatments from "./pages/clinic/ClinicTreatments";
import ClinicNewDashboard from "./pages/clinic/ClinicNewDashboard";
import ClinicNewPatients from "./pages/clinic/ClinicNewPatients";
import ClinicNewReservations from "./pages/clinic/ClinicNewReservations";
import ClinicNewLab from "./pages/clinic/ClinicNewLab";
import ClinicOldLab from "./pages/ClinicOldLab";
import AIAssistantPage from "./pages/AIAssistantPage";
import SmartClinicAIAssistant from "./pages/SmartClinicAIAssistant";
import SmartClinicKnowledge from "./pages/SmartClinicKnowledge";
import SmartClinicMainRebuilt from "./pages/SmartClinicMainRebuilt";
import SmartClinicReports from "./pages/SmartClinicReports";
import SmartClinicChatbot from "./pages/SmartClinicChatbot";
import SmartClinicLearning from "./pages/SmartClinicLearning";
import ProtectedRoute from "./components/ProtectedRoute";
import FinanceUnified from "./pages/clinic_old/FinanceUnified";
import AssetsUnified from "./pages/clinic_old/AssetsUnified";
import DentistAIAssistant from "./components/DentistAIAssistant";

const queryClient = new QueryClient();

function AdminPatientsRedirect() {
  const params = useParams();
  const id = (params as any)?.id;
  return <Navigate to={`/clinic_old/patients/${id}`} replace />;
}

function ClinicPatientsRedirect() {
  return <Navigate to="/clinic_old/patients" replace />;
}

function ClinicPatientDetailRedirect() {
  const params = useParams();
  const id = (params as any)?.id;
  return <Navigate to={`/clinic_old/patients/${id}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <BookmarksProvider>
                <SystemSettingsProvider>
                  <MobileOptimizer>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <NavigationProvider>
                        <ScrollToTop />
                        <AppWithUnifiedHeader>
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/landing" element={<LandingPage />} />
                            <Route
                              path="/patient-landing"
                              element={<PatientLandingPage />}
                            />
                            <Route
                              path="/community"
                              element={<Community />}
                            />
                            <Route
                              path="/community-old"
                              element={<CommunityEducationHub />}
                            />
                            <Route
                              path="/community/groups"
                              element={<CommunityGroups />}
                            />
                            <Route
                              path="/community/experts"
                              element={<CommunityExperts />}
                            />
                            <Route
                              path="/community/events"
                              element={<CommunityEvents />}
                            />
                            <Route path="/education" element={<Education />} />
                            <Route
                              path="/education/models"
                              element={<Models3D />}
                            />
                            <Route path="/jobs" element={<JobsNew />} />
                            <Route path="/jobs-old" element={<Jobs />} />
                            <Route
                              path="/jobs/dentists"
                              element={<BrowseDentists />}
                            />
                            <Route path="/articles" element={<Articles />} />
                            <Route
                              path="/articles/:id"
                              element={<ArticleDetail />}
                            />
                            <Route
                              path="/admin/articles"
                              element={<AdminArticles />}
                            />
                            <Route
                              path="/ai-diagnosis"
                              element={<AIDiagnosis />}
                            />
                            <Route path="/smart-chat" element={<SmartChat />} />
                            <Route
                              path="/photo-analysis"
                              element={<PhotoAnalysis />}
                            />
                            {/* Store Routes with Unified Layout */}
                            <Route
                              path="/dental-supply/*"
                              element={<StoreLayout />}
                            >
                              <Route
                                index
                                element={<DentalSupplyMarketMobileFixed />}
                              />
                              <Route
                                path="categories"
                                element={<AllCategories />}
                              />
                              <Route path="trending" element={<Trending />} />
                              <Route path="featured" element={<Featured />} />
                              <Route path="offers" element={<Offers />} />
                              <Route path="flash-deals" element={<Offers />} />
                              <Route
                                path="new-arrivals"
                                element={<Featured />}
                              />
                              <Route
                                path="products"
                                element={<AllProducts />}
                              />
                              <Route path="favorites" element={<Favorites />} />
                              <Route path="cart" element={<Cart />} />
                              <Route path="suppliers" element={<Suppliers />} />
                              <Route path="brands" element={<Brands />} />
                              <Route path="students" element={<Students />} />
                              <Route
                                path="product/:productId"
                                element={<ProductDetail />}
                              />
                              <Route
                                path="supplier/:supplierId"
                                element={<SupplierProfile />}
                              />
                              <Route
                                path="brand/:brandId"
                                element={<BrandDetail />}
                              />
                            </Route>

                            {/* Legacy Store Routes (for backward compatibility) */}
                            <Route
                              path="/dental-supply-old"
                              element={<DentalSupplyMarket />}
                            />
                            <Route path="/search" element={<Search />} />
                            <Route
                              path="/notifications"
                              element={<UnifiedNotifications />}
                            />
                            <Route
                              path="/dentist-hub/notifications"
                              element={<DentistHub />}
                            />
                            <Route
                              path="/notifications-old"
                              element={<Notifications />}
                            />
                            <Route
                              path="/messages"
                              element={<UnifiedNotifications />}
                            />
                            <Route
                              path="/messages-old"
                              element={<Messages />}
                            />
                            <Route
                              path="/medical-services"
                              element={<ModernMedicalServices />}
                            />
                            <Route
                              path="/medical-services-old"
                              element={<UnifiedMedicalServices />}
                            />

                            {/* مسارات الحجز المحسنة للهاتف */}
                            <Route
                              path="/booking/:clinicId"
                              element={<MobileBookingPage />}
                            />
                            <Route
                              path="/mobile-booking/:clinicId"
                              element={<MobileBookingPage />}
                            />
                            <Route
                              path="/dentist-hub"
                              element={<DentistHub />}
                            />
                            <Route
                              path="/profile"
                              element={<IntegratedDentistProfile />}
                            />
                            <Route
                              path="/dentist-hub/profile"
                              element={<DentistHub />}
                            />
                            <Route
                              path="/settings"
                              element={<IntegratedDentistProfile />}
                            />
                            <Route path="/emergency" element={<Emergency />} />
                            <Route
                              path="/emergency/first-aid"
                              element={<FirstAidGuide />}
                            />
                            <Route
                              path="/emergency/hospitals"
                              element={<EmergencyHospitals />}
                            />
                            <Route
                              path="/emergency/pain-management"
                              element={<PainManagement />}
                            />
                            <Route
                              path="/emergency/dental"
                              element={<DentalEmergency />}
                            />
                            <Route
                              path="/ai-assistant"
                              element={<AIAssistantPage />}
                            />
            <Route
              path="/dentist-hub/smart-clinic/main"
              element={<SmartClinicMainRebuilt />}
            />
            <Route
              path="/dentist-hub/smart-clinic/reports"
              element={<SmartClinicReports />}
            />
            <Route
              path="/dentist-hub/smart-clinic/chatbot"
              element={<SmartClinicChatbot />}
            />
            <Route
              path="/dentist-hub/smart-clinic/learning"
              element={<SmartClinicLearning />}
            />
                            <Route
                              path="/dentist-hub/smart-clinic/ai-assistant"
                              element={<SmartClinicAIAssistant />}
                            />
                            <Route
                              path="/dentist-hub/smart-clinic/knowledge"
                              element={<SmartClinicKnowledge />}
                            />
                            <Route path="/about" element={<About />} />
                            <Route
                              path="/clinic/:clinicId/booking"
                              element={<ClinicBooking />}
                            />
                            <Route
                              path="/modern-booking/:clinicId?"
                              element={<ModernAppointmentBooking />}
                            />
                            <Route
                              path="/simplified-booking/:clinicId?"
                              element={<SimplifiedAppointmentBooking />}
                            />
                            <Route
                              path="/booking-systems"
                              element={<BookingShowcase />}
                            />
                            <Route
                              path="/clinic/admin"
                              element={<AdvancedClinicManagement />}
                            />
                            <Route
                              path="/clinic/admin/old"
                              element={<ClinicAdmin />}
                            />
                            <Route path="/products" element={<AllProducts />} />
                            <Route
                              path="/categories"
                              element={<CategoriesNew />}
                            />
                            <Route
                              path="/clinics"
                              element={<Navigate to="/dentist-hub/clinics" replace />}
                            />
                            <Route
                              path="/favorites"
                              element={
                                <Navigate to="/dentist-hub/favorites" replace />
                              }
                            />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/students" element={<Students />} />
                            <Route path="/trending" element={<Trending />} />
                            <Route path="/featured" element={<Featured />} />
                            <Route path="/offers" element={<Offers />} />
                            <Route path="/suppliers" element={<Suppliers />} />
                            <Route
                              path="/suppliers/:supplierId"
                              element={<SupplierProfile />}
                            />
                            <Route path="/brands" element={<Brands />} />
                            <Route
                              path="/brand/:id"
                              element={<BrandDetail />}
                            />
                            <Route
                              path="/categories/:categoryName"
                              element={<CategoryProducts />}
                            />
                            <Route
                              path="/categories/:categoryName/:subcategoryName"
                              element={<CategoryProducts />}
                            />
                            <Route
                              path="/product/:productId"
                              element={<ProductDetail />}
                            />
                            <Route
                              path="/dashboard"
                              element={<UserDashboard />}
                            />
                            <Route
                              path="/dentist/dashboard"
                              element={<UserDashboard />}
                            />
                            <Route
                              path="/supplier/dashboard"
                              element={<SupplierDashboard />}
                            />
                            <Route
                              path="/supplier/orders"
                              element={<SupplierOrders />}
                            />
                            <Route
                              path="/supplier/store"
                              element={<SupplierStore />}
                            />
                            <Route
                              path="/supplier/customers"
                              element={<SupplierCustomers />}
                            />
                            <Route
                              path="/supplier/analytics"
                              element={<SupplierAnalytics />}
                            />
                            <Route
                              path="/supplier/shipping"
                              element={<SupplierShipping />}
                            />
                            <Route
                              path="/supplier/payments"
                              element={<SupplierPayments />}
                            />
                            <Route
                              path="/supplier/products"
                              element={<SupplierProducts />}
                            />
                            <Route
                              path="/admin/dashboard"
                              element={
                                <Layout>
                                  <SystemAdminDashboard />
                                </Layout>
                              }
                            />
                            <Route
                              path="/community-jobs-admin"
                              element={<CommunityJobsAdmin />}
                            />
                            <Route
                              path="/appointments"
                              element={
                                <Layout>
                                  <Reservations />
                                </Layout>
                              }
                            />

                            {/* Auth Routes */}
                            <Route
                              path="/auth"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signin"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup"
                              element={<Auth mode="signup" />}
                            />
                            <Route
                              path="/signin/patient"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup/patient"
                              element={<Auth mode="signup" />}
                            />
                            <Route
                              path="/signin/supplier"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup/supplier"
                              element={<Auth mode="signup" />}
                            />
                            <Route
                              path="/signin/admin"
                              element={<Auth mode="signin" />}
                            />
                            <Route
                              path="/signup/admin"
                              element={<Auth mode="signup" />}
                            />

                            {/* Dentist Hub Routes */}
                            <Route
                              path="/dentist-hub"
                              element={<DentistHub />}
                            />
                            <Route
                              path="/dentist-hub/clinics"
                              element={<ClinicsManager />}
                            />
                            <Route
                              path="/dentist-hub/*"
                              element={<DentistHub />}
                            />

                            {/* New Mobile-Optimized Clinic Management Routes */}
                            <Route
                              path="/clinic"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/patients"
                              element={<ClinicPatientsRedirect />}
                            />
                            <Route
                              path="/clinic/patients/:id"
                              element={<ClinicPatientDetailRedirect />}
                            />
                            <Route
                              path="/clinic/reservations"
                              element={<ClinicNewReservations />}
                            />
                            <Route
                              path="/clinic/treatments"
                              element={<ClinicTreatments />}
                            />
                            <Route
                              path="/clinic/staff"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/accounts"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/sales"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/purchases"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/stocks"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/peripherals"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/reports"
                              element={<ClinicNewDashboard />}
                            />
                            <Route
                              path="/clinic/lab"
                              element={<ClinicNewLab />}
                            />

                            {/* Legacy Clinic Dashboard */}
                            <Route
                              path="/clinic/legacy"
                              element={<ClinicDashboard />}
                            />

                            {/* Legacy Clinic Management Routes - moved to clinic_old */}
                            <Route
                              path="/clinic_old"
                              element={
                                <Layout>
                                  <Dashboard />
                                </Layout>
                              }
                            />

                            {/* System Admin Routes - فقط ��مدير النظام */}
                            <Route
                              path="/admin"
                              element={
                                <ProtectedRoute adminOnly={true}>
                                  <Layout>
                                    <SystemAdminDashboard />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/dashboard"
                              element={
                                <ProtectedRoute adminOnly={true}>
                                  <Layout>
                                    <SystemAdminDashboard />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/system-admin"
                              element={
                                <ProtectedRoute adminOnly={true}>
                                  <Layout>
                                    <SystemAdminDashboard />
                                  </Layout>
                                </ProtectedRoute>
                              }
                            />
                            {/* Clinic Old Management Routes - النظام ��لقديم */}
                            <Route
                              path="/clinic_old/patients"
                              element={
                                <Layout>
                                  <Patients />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/patient/:id"
                              element={<ClinicPatientDetailRedirect />}
                            />
                            <Route
                              path="/clinic_old/patients/:id"
                              element={<PatientDetailsPage />}
                            />
                            <Route
                              path="/clinic_old/accounts"
                              element={
                                <Layout>
                                  <Accounts />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/stocks"
                              element={
                                <Layout>
                                  <Stocks />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/reservations"
                              element={
                                <Layout>
                                  <Reservations />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/treatments"
                              element={
                                <Layout>
                                  <Treatments />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/staff"
                              element={
                                <Layout>
                                  <Staff />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/sales"
                              element={
                                <Layout>
                                  <Sales />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/purchases"
                              element={
                                <Layout>
                                  <Purchases />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/reports"
                              element={
                                <Layout>
                                  <Reports />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/customer-support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/payment-methods"
                              element={
                                <Layout>
                                  <PaymentMethods />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/peripherals"
                              element={
                                <Layout>
                                  <Peripherals />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/finance"
                              element={
                                <Layout>
                                  <FinanceUnified />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/assets"
                              element={
                                <Layout>
                                  <AssetsUnified />
                                </Layout>
                              }
                            />
                            <Route
                              path="/clinic_old/lab"
                              element={
                                <Layout>
                                  <ClinicOldLab />
                                </Layout>
                              }
                            />

                            {/* Legacy Routes - المسارات القديمة للتوافق مع الإصدارات السابقة */}
                            <Route
                              path="/admin/dashboard/old"
                              element={
                                <Layout>
                                  <Dashboard />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/clinic-dashboard"
                              element={<EnhancedClinicDashboard />}
                            />
                            <Route
                              path="/admin/patient/:id"
                              element={
                                <Layout>
                                  <PatientDetail />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/patients/:id"
                              element={<AdminPatientsRedirect />}
                            />
                            <Route
                              path="/admin/patients/:id/old"
                              element={
                                <Layout>
                                  <PatientDetail />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/customer-support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/support"
                              element={
                                <Layout>
                                  <CustomerSupport />
                                </Layout>
                              }
                            />
                            <Route
                              path="/admin/payment-methods"
                              element={
                                <Layout>
                                  <PaymentMethods />
                                </Layout>
                              }
                            />

                            {/* System Admin Routes - مسارات إدارة النظام */}
                            <Route
                              path="/system-admin"
                              element={<SystemAdminDashboard />}
                            />
                            <Route
                              path="/system-admin/dashboard"
                              element={<SystemAdminDashboard />}
                            />
                            <Route
                              path="/system-admin/*"
                              element={<SystemAdminDashboard />}
                            />
                            <Route
                              path="/platform-admin"
                              element={<PlatformAdmin />}
                            />
                            <Route
                              path="/admin/platform-admin"
                              element={<PlatformAdmin />}
                            />
                            <Route
                              path="/super-admin"
                              element={<SuperAdminSettings />}
                            />
                            <Route
                              path="/admin/users"
                              element={<AdminUsers />}
                            />
                            <Route
                              path="/admin/settings"
                              element={<AdminSettings />}
                            />
                            <Route path="/messages" element={<Messages />} />

                            {/* Enhanced Test Page */}
                            <Route
                              path="/test-enhanced"
                              element={<EnhancedTestPage />}
                            />

                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </AppWithUnifiedHeader>
                        <DentistAIAssistant />
                      </NavigationProvider>
                    </BrowserRouter>
                  </MobileOptimizer>
                </SystemSettingsProvider>
              </BookmarksProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
