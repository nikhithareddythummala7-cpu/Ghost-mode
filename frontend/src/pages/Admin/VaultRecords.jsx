import { useEffect, useState } from 'react';
import { getAdminVault, deleteAdminVaultItem } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const VaultRecords = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const { showToast } = useToast();

  const loadVault = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminVault({ search, type });
      setItems(data);
    } catch (error) {
      showToast('Unable to load vault records', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVault();
  }, [search, type]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this vault item?');
    if (!confirmed) return;

    try {
      await deleteAdminVaultItem(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      showToast('Vault item deleted');
    } catch (error) {
      showToast('Unable to delete vault item', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Memory Vault Records</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">View and manage uploaded files across the platform.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vault items..."
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option value="">All types</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="note">Note</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto overflow-y-auto max-h-[56vh] rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3">Vault Item ID</th>
                <th className="px-4 py-3">File Type</th>
                <th className="px-4 py-3">Uploaded By</th>
                <th className="px-4 py-3">File Size</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-4 font-mono text-xs text-slate-800 dark:text-slate-200">{item._id}</td>
                  <td className="px-4 py-4 capitalize">{item.fileType}</td>
                  <td className="px-4 py-4">{item.userId?.name || 'Unknown'}</td>
                  <td className="px-4 py-4">{item.fileSize ? `${(item.fileSize / 1024).toFixed(2)} KB` : 'N/A'}</td>
                  <td className="px-4 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => handleDelete(item._id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500">Delete</button>
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

export default VaultRecords;
