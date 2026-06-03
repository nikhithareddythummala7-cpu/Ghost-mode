import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRightCircle } from 'lucide-react';
import { resetPassword } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await resetPassword({ token, password });
      showToast('Password reset successful');
      navigate('/login');
    } catch (error) {
      showToast(error.response?.data?.message || 'Reset failed', 'error');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="glass-card w-full max-w-md border-white/10 p-8 shadow-panel backdrop-blur-2xl">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-neon-violet">Secure reset</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Reset your password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Create a strong password to continue protecting your legacy vault.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Lock className="h-4 w-4" /> New password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Reset password
            <ArrowRightCircle className="h-5 w-5" />
          </button>
        </form>
      </motion.div>
    </main>
  );
};

export default ResetPasswordPage;
