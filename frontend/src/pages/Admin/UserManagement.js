import { useEffect, useState } from 'react';
import { getAdminUsers, changeUserStatus, deleteUser } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { showToast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminUsers({ search, status });
      setUsers(data);
    } catch (error) {
      showToast('Unable to load users', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [search, status]);

  const handleToggle = async (user) => {
    try {
      await changeUserStatus(user._id, !user.isActive);
      setUsers((prev) => prev.map((item) => (item._id === user._id ? { ...item, isActive: !item.isActive } : item)));
      showToast('User status updated');
    } catch (error) {
      showToast('Unable to update user status', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this user permanently?');
    if (!confirmed) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((item) => item._id !== id));
      showToast('User deleted');
    } catch (error) {
      showToast('Unable to delete user', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">User Management</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search, review, and manage platform users.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option value="">All users</option>
            <option value="active">Active</option>
            <option value="inactive">Disabled</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4 capitalize">{user.role}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs ${user.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200'}`}>{user.isActive ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td className="px-4 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 space-x-2">
                    <button onClick={() => setSelectedUser(user)} className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">View</button>
                    <button onClick={() => handleToggle(user)} className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-500">{user.isActive ? 'Disable' : 'Enable'}</button>
                    <button onClick={() => handleDelete(user._id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title="User details" isOpen={!!selectedUser} onClose={() => setSelectedUser(null)}>
        {selectedUser && (
          <div className="space-y-4 text-slate-700 dark:text-slate-200">
            <div>
              <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Role</p>
                <p className="mt-2 font-semibold">{selectedUser.role}</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Status</p>
                <p className="mt-2 font-semibold">{selectedUser.isActive ? 'Active' : 'Disabled'}</p>
              </div>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Account created</p>
              <p className="mt-2 font-semibold">{new Date(selectedUser.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
