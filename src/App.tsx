import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminStoreProvider } from './contexts/AdminStore';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/Dashboard';
import { UserManagementPage } from './pages/UserManagementPage';
import { AllMessagesPage } from './pages/AllMessagesPage';
import { CommunityPostsPage } from './pages/CommunityPostsPage';
import { ReportManagementPage } from './pages/ReportManagementPage';
import { TopicsPage } from './pages/Topics';
import { ResourcesPage } from './pages/ResourcesPage';
import { ResourceEditorPage } from './pages/ResourceEditorPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { FaqPage } from './pages/FaqPage';
import { SettingsPage } from './pages/Settings';
import { PublicResourcePage } from './pages/PublicResourcePage';

interface AppProps {
  /** Initial color mode for the console. Users can still toggle it in the top bar. */
  initialTheme?: 'light' | 'dark';
}

export function App({ initialTheme = 'light' }: AppProps) {
  return (
    <ThemeProvider initialTheme={initialTheme}>
      <AdminStoreProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Standalone Public Receiver Website Route */}
              <Route path="/resource/:slug" element={<PublicResourcePage />} />

              {/* Admin Console Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/community-posts" element={<CommunityPostsPage />} />
                  <Route path="/topics" element={<TopicsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/resources/new" element={<ResourceEditorPage />} />
                  <Route path="/resources/edit/:id" element={<ResourceEditorPage />} />
                  <Route path="/users" element={<UserManagementPage />} />
                  <Route path="/messages" element={<AllMessagesPage />} />
                  <Route path="/reports" element={<ReportManagementPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/policies" element={<Navigate to="/privacy" replace />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                borderRadius: '12px',
              },
            }}
          />
        </AuthProvider>
      </AdminStoreProvider>
    </ThemeProvider>
  );
}