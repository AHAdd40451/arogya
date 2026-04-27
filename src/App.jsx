import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import RequireAuth from "@/components/auth/RequireAuth";

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function App() {
  const guardedPages = {
    PatientDashboard: { requiredRole: "patient", allowIncompleteOnboarding: false },
    ProviderDashboard: { requiredRole: "provider", allowIncompleteOnboarding: false },

    PatientOnboarding1: { requiredRole: "patient", allowIncompleteOnboarding: true },
    PatientOnboarding2: { requiredRole: "patient", allowIncompleteOnboarding: true },
    PatientOnboarding3: { requiredRole: "patient", allowIncompleteOnboarding: true },
    PatientOnboarding4: { requiredRole: "patient", allowIncompleteOnboarding: true },

    ProviderOnboarding1: { requiredRole: "provider", allowIncompleteOnboarding: true },
    ProviderOnboarding2: { requiredRole: "provider", allowIncompleteOnboarding: true },
    ProviderOnboarding3: { requiredRole: "provider", allowIncompleteOnboarding: true },
    ProviderOnboarding4: { requiredRole: "provider", allowIncompleteOnboarding: true },
    ProviderOnboarding5: { requiredRole: "provider", allowIncompleteOnboarding: true },

    Chat: { requiredRole: null, allowIncompleteOnboarding: false },
  };

  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <LayoutWrapper currentPageName={mainPageKey}>
                <MainPage />
              </LayoutWrapper>
            }
          />
          {Object.entries(Pages).map(([path, Page]) => (
            <Route
              key={path}
              path={`/${path}`}
              element={
                <LayoutWrapper currentPageName={path}>
                  {guardedPages[path] ? (
                    <RequireAuth
                      requiredRole={guardedPages[path].requiredRole}
                      allowIncompleteOnboarding={guardedPages[path].allowIncompleteOnboarding}
                    >
                      <Page />
                    </RequireAuth>
                  ) : (
                    <Page />
                  )}
                </LayoutWrapper>
              }
            />
          ))}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
