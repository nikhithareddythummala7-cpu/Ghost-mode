import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import Capsules from './pages/Capsules';
import CreateCapsule from './pages/CreateCapsule';
import Messages from './pages/Messages';
import CreateMessage from './pages/CreateMessage';
import Vault from './pages/Vault';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserManagement from './pages/Admin/UserManagement';
import CapsulesManagement from './pages/Admin/CapsulesManagement';
import FlaggedMessages from './pages/Admin/FlaggedMessages';
import MessagesManagement from './pages/Admin/MessagesManagement';
import VaultRecords from './pages/Admin/VaultRecords';
import ContactsManagement from './pages/Admin/ContactsManagement';
import Analytics from './pages/Admin/Analytics';
import Settings from './pages/Admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Toast from './components/Toast';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ghost-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),transparent_22%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[36rem] bg-[radial-gradient(circle,_rgba(59,130,246,0.12),transparent_24%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.04),transparent_30%)]" />
      <Toast />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/capsules" element={<ProtectedRoute><Capsules /></ProtectedRoute>} />
        <Route path="/capsules/new" element={<ProtectedRoute><CreateCapsule /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/new" element={<ProtectedRoute><CreateMessage /></ProtectedRoute>} />
        <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
        <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="capsules" element={<CapsulesManagement />} />
          <Route path="flagged" element={<FlaggedMessages />} />
          <Route path="messages" element={<MessagesManagement />} />
          <Route path="vault" element={<VaultRecords />} />
          <Route path="contacts" element={<ContactsManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
