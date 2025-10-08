import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard, PublicOnly } from "@/components/auth/AuthGuard";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WIDGET_REGISTRY } from "@/components/widgets/registry";
import { useEffect, lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/advanced";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Widgets = lazy(() => import("./pages/Widgets"));
const SmartHome = lazy(() => import("./pages/SmartHome"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const News = lazy(() => import("./pages/News"));
const Calendar = lazy(() => import("./pages/Calendar"));
const VoiceHelp = lazy(() => import("./pages/VoiceHelp"));
const Auth = lazy(() => import("./pages/Auth"));
const Welcome = lazy(() => import("./pages/Welcome"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <ProfileProvider>
              <WidgetProvider availableWidgets={WIDGET_REGISTRY}>
                <BrowserRouter>
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <LoadingSpinner size="lg" />
                    </div>
                  }>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/welcome" element={<Welcome />} />
                      <Route path="/auth" element={
                        <PublicOnly>
                          <Auth />
                        </PublicOnly>
                      } />
                      
                      {/* Protected routes */}
                      <Route path="/" element={
                        <AuthGuard>
                          <MainLayout />
                        </AuthGuard>
                      }>
                        <Route index element={<Index />} />
                        <Route path="widgets" element={<Widgets />} />
                        <Route path="smarthome" element={<SmartHome />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="news" element={<News />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="voice-help" element={<VoiceHelp />} />
                      </Route>
                      
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </WidgetProvider>
            </ProfileProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
