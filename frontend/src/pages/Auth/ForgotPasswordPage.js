import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRightCircle } from 'lucide-react';
import { forgotPassword } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await forgotPassword({ email });
      showToast(data.message);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to send reset email', 'error');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="glass-card w-full max-w-md border-white/10 p-8 shadow-panel backdrop-blur-2xl">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Recover access</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Forgot your password?</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Enter your email and we’ll send secure reset instructions.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> Email address</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Send reset link
            <ArrowRightCircle className="h-5 w-5" />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">Remembered your password? <Link to="/login" className="font-semibold text-white hover:text-neon-blue">Login</Link></p>
      </motion.div>
    </main>
  );
};

export default ForgotPasswordPage;
