import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Clock3, Flag, XCircle } from 'lucide-react';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { getMessages, deleteMessage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const statusStyles = {
  pending: 'bg-neon-blue/10 text-neon-blue',
  delivered: 'bg-emerald-500/10 text-emerald-300',
  failed: 'bg-rose-500/10 text-rose-300'
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const { data } = await getMessages();
        setMessages(data);
      } catch (error) {
        showToast('Unable to load messages', 'error');
      }
      setLoading(false);
    };
    loadMessages();
  }, [showToast]);

  const removeMessage = async (id) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((item) => item._id !== id));
      showToast('Scheduled message canceled');
    } catch (error) {
      showToast('Could not cancel message', 'error');
    }
  };

  return (
    <AuthenticatedLayout title="Scheduled Messages">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-neon-violet">Future dispatches</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Send a message into tomorrow.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Manage recipient journeys with glowing timelines and delivery status visibility.</p>
        </div>
        <Link to="/messages/new" className="inline-flex items-center gap-2 rounded-full bg-neon-blue px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          <Send className="h-4 w-4" /> Schedule a dispatch
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : messages.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {messages.map((message, index) => (
            <motion.div key={message._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{message.recipientEmail}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{message.subject}</h3>
                </div>
                <span className={`rounded-full px-4 py-2 text-xs font-semibold ${statusStyles[message.status] || 'bg-white/10 text-slate-200'}`}>{message.status}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{message.message}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" /> {new Date(message.deliveryDate).toLocaleString()}</span>
                {message.isFlagged && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-rose-200"><Flag className="h-3.5 w-3.5" /> Flagged</span>
                )}
              </div>
              <button onClick={() => removeMessage(message._id)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400">
                <XCircle className="h-4 w-4" /> Cancel dispatch
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-white/15 bg-slate-950/70 p-12 text-center text-slate-400">
          <p className="text-lg font-semibold text-white">No scheduled messages yet.</p>
          <p className="mt-3 text-sm">Create your first dispatch and stay connected across time.</p>
        </div>
      )}
    </AuthenticatedLayout>
  );
};

export default Messages;
