import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, ShieldCheck, ArrowRightCircle } from 'lucide-react';
import { register } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
  const { loading, setLoading } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const strongRe = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
      if (!strongRe.test(form.password)) {
        showToast('Password should be strong', 'error');
        setLoading(false);
        return;
      }
      await register(form);
      showToast('Account created successfully. Please login.');
      navigate('/login');
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
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
          <p className="text-sm uppercase tracking-[0.35em] text-neon-violet">New legacy</p>
          <h1 className="text-3xl font-semibold text-white">Create your GhostMode identity</h1>
          <p className="text-sm leading-6 text-slate-400">Secure your story with premium vault controls and future messaging.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><UserPlus className="h-4 w-4" /> Full name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" required />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email address</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><ShieldCheck className="h-4 w-4" /> Create password</span>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required />
          </label>
          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon-violet px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRightCircle className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Already registered? <Link to="/login" className="font-semibold text-white hover:text-neon-violet">Sign in</Link></p>
      </motion.div>
    </main>
  );
};

export default RegisterPage;
