import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AssistanceProvider } from './contexts/AssistanceContext';
import { Navbar } from './components/navigation/Navbar';
import { MobileNav } from './components/navigation/MobileNav';
import { SosModal } from './components/common/SosModal';
import { LoginPage } from './pages/LoginPage';
import { CustomerHome } from './pages/CustomerHome';
import { LandingPage } from './pages/LandingPage';
import { AssistanceWizard } from './pages/AssistanceWizard';
import { ResQAIAssistant } from './pages/ResQAIAssistant';
import { LiveTracking } from './pages/LiveTracking';
import { VehiclesView } from './pages/VehiclesView';
import { RequestsHistory } from './pages/RequestsHistory';
import { SafePlacesView } from './pages/SafePlacesView';
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { ProviderProfile } from './pages/provider/ProviderProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// ─── Loading Screen ────────────────────────────────────────────────────
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center login-gradient-bg">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-orange-500/30 animate-ping" />
      </div>
      <div className="text-white/60 text-sm font-medium animate-pulse">Loading RoadResQ...</div>
    </div>
  </div>
);

// ─── Protected App Layout ──────────────────────────────────────────────
const MainLayout: React.FC = () => {
  const [isSosOpen, setIsSosOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col app-bg-mesh bg-slate-50 dark:bg-[#060c1a] text-slate-900 dark:text-slate-100 transition-colors pb-16 lg:pb-0">
      {/* Top Navbar */}
      <Navbar onOpenSos={() => setIsSosOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerHome />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/assistance" element={<AssistanceWizard />} />
          <Route path="/resq-ai" element={<ResQAIAssistant />} />
          <Route path="/tracking" element={<LiveTracking />} />
          <Route path="/vehicles" element={<VehiclesView />} />
          <Route path="/requests" element={<RequestsHistory />} />
          <Route path="/safe-places" element={<SafePlacesView />} />

          {/* Provider Routes */}
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/provider/jobs" element={<ProviderDashboard />} />
          <Route path="/provider/earnings" element={<ProviderDashboard />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/providers" element={<AdminDashboard />} />
          <Route path="/admin/requests" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Emergency SOS Modal */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
};

// ─── Root Router with Auth Gate ────────────────────────────────────────
const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return <MainLayout />;
};

// ─── App Root ──────────────────────────────────────────────────────────
export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AssistanceProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </AssistanceProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
