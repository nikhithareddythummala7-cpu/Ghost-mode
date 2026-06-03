import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Sparkles, Settings2 } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, saveUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const { showToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await updateProfile(form);
      saveUser(data.user);
      showToast('Profile updated');
    } catch (error) {
      showToast('Unable to update profile', 'error');
    }
  };

  return (
    <AuthenticatedLayout title="Profile Settings">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 text-neon-blue">
            <UserCircle className="h-5 w-5" />
            <p className="text-sm uppercase tracking-[0.35em]">Personal command</p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Your profile</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Update your identity and keep your digital legacy profile current.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="block text-sm font-medium text-slate-300">Full name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" required />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-slate-300">Avatar URL</span>
              <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} type="url" />
            </label>
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-neon-violet px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
              <Settings2 className="h-4 w-4" /> Save profile
            </button>
          </form>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 text-neon-violet">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm uppercase tracking-[0.35em]">Account vault</p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">Secure account details</h2>
          <div className="mt-6 space-y-4 text-sm text-slate-400">
            <div className="rounded-[28px] bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Email</p>
              <p className="mt-2 text-base font-semibold text-white">{user?.email}</p>
            </div>
            <div className="rounded-[28px] bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Role</p>
              <p className="mt-2 text-base font-semibold text-white">{user?.role}</p>
            </div>
            <div className="rounded-[28px] bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Joined</p>
              <p className="mt-2 text-base font-semibold text-white">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AuthenticatedLayout>
  );
};

export default Profile;
