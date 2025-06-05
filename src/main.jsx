// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ColorModeContext, useMode } from './styles/theme';
import { AuthProvider } from './utils/hooks/useAuth-new';
import App from './App';
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import ProfileEntry from './pages/ProfileEntry/index';
import BillingPage from './pages/BillingPage/index';
import SQLPlayground from './pages/SQLPlayground/index';
import ErrorPage from './pages/ErrorPage/index';
import AuthWrapper from './components/AuthWrapper';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { RBACProvider } from './rbac/context-new.jsx';
import { Protected } from './rbac/components-new.jsx';
import AdminPortal from './pages/admin/AdminPortal.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AuthProvider>
          <RBACProvider>
            <App />
          </RBACProvider>
        </AuthProvider>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'pricing',
        element: <PricingPage />
      },
      {
        path: 'profile',
        element: (
          <AuthWrapper>
            <ProfileEntry />
          </AuthWrapper>
        )
      },
      {
        path: 'billing',
        element: (
          <AuthWrapper>
            <Protected page="billing">
              <BillingPage />
            </Protected>
          </AuthWrapper>
        )
      },
      {
        path: 'playground',
        element: (
          <AuthWrapper>
            <Protected page="sqlPlayground">
              <SQLPlayground />
            </Protected>
          </AuthWrapper>
        )
      },
      {
        path: 'admin',
        element: (
          <AuthWrapper>
            <Protected page="admin">
              <AdminPortal />
            </Protected>
          </AuthWrapper>
        )
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
]);

function Root() {
  const [theme, colorMode] = useMode();

  return (
    <React.StrictMode>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);