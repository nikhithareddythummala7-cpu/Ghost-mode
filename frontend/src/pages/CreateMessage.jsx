import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Clock3, Mail } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { createMessage } from '../services/api';
import { useToast } from '../context/ToastContext';

const CreateMessage = () => {
  const [form, setForm] = useState({ recipientEmail: '', subject: '', message: '', deliveryDate: '', attachment: '' });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createMessage(form);
      showToast('Message scheduled');
      navigate('/messages');
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not schedule message', 'error');
    }
  };

  return (
    <AuthenticatedLayout title="Schedule Future Message">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="glass-card p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-neon-blue">Future dispatch</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Schedule a legacy message</h1>
          </div>
          <Send className="h-8 w-8 text-neon-blue" />
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">Compose an important message and choose when it should arrive.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Recipient email</span>
            <input value={form.recipientEmail} onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })} type="email" required />
          </label>
          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Subject</span>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} type="text" required />
          </label>
          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Message</span>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="5" required className="min-h-[140px]" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 text-sm font-medium text-slate-300">Delivery date</span>
              <input value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} type="datetime-local" required />
            </label>
            <label className="block">
              <span className="mb-2 text-sm font-medium text-slate-300">Attachment URL</span>
              <input value={form.attachment} onChange={(e) => setForm({ ...form, attachment: e.target.value })} type="url" placeholder="Optional attachment URL" />
            </label>
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-neon-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            <Mail className="h-4 w-4" /> Schedule message
          </button>
        </form>
      </motion.div>
    </AuthenticatedLayout>
  );
};

export default CreateMessage;
