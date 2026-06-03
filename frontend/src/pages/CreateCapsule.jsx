import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Clock3, Sparkles } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { createCapsule } from '../services/api';
import { useToast } from '../context/ToastContext';

const CreateCapsule = () => {
  const [form, setForm] = useState({ title: '', message: '', unlockDate: '', visibility: 'private', attachments: '' });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, attachments: form.attachments ? [form.attachments] : [] };
      await createCapsule(payload);
      showToast('Capsule created');
      navigate('/capsules');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not create capsule', 'error');
    }
  };

  return (
    <AuthenticatedLayout title="Create Time Capsule">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="glass-card p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Time capsule design</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Lock your future message</h1>
          </div>
          <Layers className="h-8 w-8 text-neon-blue" />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">Create a secure capsule that unlocks on a selected date and holds your private message.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Title</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} type="text" required />
          </label>
          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Message</span>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="5" required className="min-h-[140px]" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 text-sm font-medium text-slate-300">Unlock date</span>
              <input value={form.unlockDate} onChange={(e) => setForm({ ...form, unlockDate: e.target.value })} type="date" required />
            </label>
            <label className="block">
              <span className="mb-2 text-sm font-medium text-slate-300">Visibility</span>
              <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Attachment URL</span>
            <input value={form.attachments} onChange={(e) => setForm({ ...form, attachments: e.target.value })} type="url" placeholder="Optional media URL" />
          </label>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-neon-violet px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-500">
            <Clock3 className="h-4 w-4" /> Save capsule
          </button>
        </form>
      </motion.div>
    </AuthenticatedLayout>
  );
};

export default CreateCapsule;
