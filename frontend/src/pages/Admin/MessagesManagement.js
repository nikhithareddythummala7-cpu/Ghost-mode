import { useEffect, useState } from 'react';
import { getAdminMessages, deleteAdminMessage } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { showToast } = useToast();

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminMessages({ search, status });
      setMessages(data);
    } catch (error) {
      showToast('Unable to load scheduled messages', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, [search, status]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this scheduled message?');
    if (!confirmed) return;

    try {
      await deleteAdminMessage(id);
      setMessages((prev) => prev.filter((message) => message._id !== id));
      showToast('Scheduled message deleted');
    } catch (error) {
      showToast('Unable to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Scheduled Messages</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor pending, delivered, and failed message deliveries.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option value="">All status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3">Message ID</th>
                <th className="px-4 py-3">Recipient Email</th>
                <th className="px-4 py-3">Delivery Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Flagged</th>
                <th className="px-4 py-3">Spam Score</th>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message._id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-4 font-mono text-xs text-slate-800 dark:text-slate-200">{message._id}</td>
                  <td className="px-4 py-4">{message.recipientEmail}</td>
                  <td className="px-4 py-4">{new Date(message.deliveryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 capitalize">{message.status}</td>
                  <td className="px-4 py-4">{message.isFlagged ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4">{message.spamScore}</td>
                  <td className="px-4 py-4">{message.userId?.name || 'Unknown'}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleDelete(message._id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MessagesManagement;
