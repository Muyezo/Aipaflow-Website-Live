import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/Home';
import { AppointmentAgentPage } from '@/pages/services/AppointmentAgent';
import { CustomerServicePage } from '@/pages/services/CustomerService';
import { CustomerAcquisitionPage } from '@/pages/services/CustomerAcquisition';
import { BlogList } from '@/pages/Blog/BlogList';
import { BlogPost } from '@/pages/Blog/BlogPost';
import { BlogEditor } from '@/pages/Blog/BlogEditor';
import { AboutPage } from '@/pages/About';
import { ContactPage } from '@/pages/Contact';
import { DashboardPage } from '@/pages/Dashboard';
import { ProfilePage } from '@/pages/Profile';
import { SettingsPage } from '@/pages/Settings';
import { DemoRequestPage } from '@/pages/DemoRequest';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicy';
import { TermsOfServicePage } from '@/pages/TermsOfService';
import { FAQPage } from '@/pages/FAQ';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import { AdminRoute } from '@/components/auth/AdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HelmetProvider>
          <Router>
            <div className="min-h-screen aurora-bg flex flex-col">
              <div className="relative z-10 flex-1">
                <Navbar />
                <main className="pt-16">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services/appointment-agent" element={<AppointmentAgentPage />} />
                    <Route path="/services/customer-service" element={<CustomerServicePage />} />
                    <Route path="/services/customer-acquisition" element={<CustomerAcquisitionPage />} />
                    <Route path="/blog" element={<BlogList />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/blog/new" element={
                      <AdminRoute>
                        <BlogEditor />
                      </AdminRoute>
                    } />
                    <Route path="/blog/edit/:slug" element={
                      <AdminRoute>
                        <BlogEditor />
                      </AdminRoute>
                    } />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/request-demo" element={<DemoRequestPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                    <Route path="/faq" element={<FAQPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
          </Router>
        </HelmetProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}