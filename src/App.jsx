import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import PartnerRegisterPage from './pages/PartnerRegisterPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import PendingPage from './pages/PendingPage';
import CustomerLayout from './layouts/CustomerLayout';
import PartnerLayout from './layouts/PartnerLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public Routes */}
        <Route path="/register" element={<CustomerRegisterPage />} />
        <Route path="/partner/register" element={<PartnerRegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/partner/create-restaurant" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/pending" element={<PendingPage />} />

        {/* Customer Public Layout */}
        <Route path="/home" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Partner Protected Layout */}
        <Route path="/dashboard" element={<ProtectedRoute><PartnerLayout /></ProtectedRoute>}>
          <Route path="restaurant" element={<DashboardPage />} />
        </Route>

        {/* Admin Public Routes */}
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Layout */}
        <Route path="/admin" element={<ProtectedRoute isAdmin={true}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
