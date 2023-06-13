import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/User/UserPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import DashboardAppPage from './pages/Dashboard/DashboardAppPage';
import ProductPage from './pages/Product/ProductPage';
import NewProductPage from './pages/Product/NewProductPage';
import ProviderPage from './pages/Provider/ProviderPage';
import NewProviderPage from './pages/Provider/NewProviderPage';
import PurchasePage from './pages/Purchase/PurchasePage';
import WelcomeInvitationPage from './pages/Invitation/WelcomeInvitationPage';

// ----------------------------------------------------------------------

export default function Router() {
  const companyId = localStorage.getItem('company-id');
  const access_token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  const isAdminLoggedIn = companyId && access_token && role === 'admin';
  const isUserLoggedIn = companyId && access_token && role === 'user';

  const routes = useRoutes([
    {
      path: '/dashboard',
      element:
        isAdminLoggedIn || isUserLoggedIn ? (
          <DashboardLayout />
        ) : (
          <Navigate to="/login" />
        ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        {
          path: 'user',
          element: isAdminLoggedIn ? <UserPage /> : <Navigate to="/login" />,
        },
        {
          path: 'products',
          element: isAdminLoggedIn ? <ProductPage /> : <Navigate to="/login" />,
        },
        {
          path: 'products/create',
          element: isAdminLoggedIn ? (
            <NewProductPage />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: 'providers/create',
          element: isAdminLoggedIn ? (
            <NewProviderPage />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: 'purchases',
          element: isAdminLoggedIn ? (
            <PurchasePage />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: 'providers',
          element: isAdminLoggedIn ? (
            <ProviderPage />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: 'inventory',
          element: isAdminLoggedIn ? (
            <InventoryPage />
          ) : (
            <Navigate to="/login" />
          ),
        },
      ],
    },
    {
      path: 'login',
      element:
        isAdminLoggedIn || isUserLoggedIn ? (
          <Navigate to="/dashboard/app" />
        ) : (
          <LoginPage />
        ),
    },
    {
      path: 'register',
      element:
        isAdminLoggedIn || isUserLoggedIn ? (
          <Navigate to="/dashboard/app" />
        ) : (
          <RegisterPage />
        ),
    },
    {
      path: 'accept-invitation',
      element: <WelcomeInvitationPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '*', element: <Navigate to="/login" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ]);

  return routes;
}
