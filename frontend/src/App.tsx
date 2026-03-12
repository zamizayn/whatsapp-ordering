import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import OrderList from './pages/OrderList';
import CreateOrder from './pages/CreateOrder';
import OrderDetail from './pages/OrderDetail';
import CustomerEntry from './pages/CustomerEntry';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import MessageHistory from './pages/MessageHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import SetupAdmin from './pages/SetupAdmin';
import UserManagement from './pages/UserManagement';
import ProductCatalog from './pages/ProductCatalog';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-500 font-medium animate-pulse">Verifying access...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/setup-admin" element={<SetupAdmin />} />
      <Route path="/order-now" element={<CustomerEntry />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/new" element={<CreateOrder />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="products" element={<ProductCatalog />} />
        <Route path="messages" element={<MessageHistory />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
