import { useEffect, useState } from 'react';
import { getAdminCapsules, deleteAdminCapsule, toggleCapsuleSuspicious } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const CapsulesManagement = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { showToast } = useToast();

  const loadCapsules = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminCapsules({ search, status });
      setCapsules(data);
    } catch (error) {
      showToast('Unable to load capsules', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCapsules();
  }, [search, status]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this capsule permanently?');
    if (!confirmed) return;

    try {
      await deleteAdminCapsule(id);
      setCapsules((prev) => prev.filter((capsule) => capsule._id !== id));
      showToast('Capsule deleted');
    } catch (error) {
      showToast('Unable to delete capsule', 'error');
    }
  };

  const handleToggleSuspicious = async (capsule) => {
    try {
      const updated = await toggleCapsuleSuspicious(capsule._id, !capsule.isSuspicious);
      setCapsules((prev) => prev.map((item) => (item._id === capsule._id ? { ...item, isSuspicious: updated.data.isSuspicious } : item)));
      showToast(`Capsule marked ${updated.data.isSuspicious ? 'suspicious' : 'normal'}`);
    } catch (error) {
      showToast('Unable to update capsule status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Capsules Management</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review platform capsules and remove inappropriate content.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search capsules..."
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option value="">All status</option>
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3">Capsule ID</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Unlock Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Suspicious</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {capsules.map((capsule) => (
                <tr key={capsule._id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-4 font-mono text-xs text-slate-800 dark:text-slate-200">{capsule._id}</td>
                  <td className="px-4 py-4">{capsule.userId?.name || 'Unknown'}</td>
                  <td className="px-4 py-4">{new Date(capsule.unlockDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 capitalize">{capsule.status}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${capsule.isSuspicious ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'}`}>
                      {capsule.isSuspicious ? 'Suspicious' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-4 py-4">{new Date(capsule.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => handleToggleSuspicious(capsule)} className={`rounded-2xl px-3 py-2 text-xs font-semibold text-white transition ${capsule.isSuspicious ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'}`}>
                      {capsule.isSuspicious ? 'Mark Normal' : 'Mark Suspicious'}
                    </button>
                    <button onClick={() => handleDelete(capsule._id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500">Delete</button>
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

export default CapsulesManagement;
