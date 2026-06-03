import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRightCircle } from 'lucide-react';
import { login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const { saveUser, loading, setLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await login(form);
      saveUser(data.user, data.token);
      showToast('Welcome back!');
      const redirectPath = data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-card w-full max-w-md border-white/10 p-8 shadow-panel backdrop-blur-2xl"
      >
        <div className="mb-8 space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">GhostMode Access</p>
          <h1 className="text-3xl font-semibold text-white">Welcome back to your legacy hub</h1>
          <p className="text-sm leading-6 text-slate-400">Sign in to continue curating your digital time capsules, scheduled messages, and vault.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Lock className="h-4 w-4" /> Password</span>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required />
          </label>
          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
            <ArrowRightCircle className="h-5 w-5" />
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:justify-between">
          <Link to="/forgot-password" className="hover:text-white">Forgot password?</Link>
          <Link to="/register" className="hover:text-white">Create a new account</Link>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;
