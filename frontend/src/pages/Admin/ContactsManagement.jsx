import { useEffect, useState } from 'react';
import { getAdminContactsOverview } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const ContactsManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const loadContacts = async () => {
    setLoading(true);
    try {
      const { data } = await getAdminContactsOverview();
      setContacts(data);
    } catch (error) {
      showToast('Unable to load emergency contact summaries', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Emergency Contacts</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review contact counts without exposing private contact details.</p>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="overflow-x-auto overflow-y-auto max-h-[56vh] rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Contact Count</th>
                <th className="px-4 py-3">Relationships</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.userId} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="px-4 py-4">{contact.userName || 'Unknown'}</td>
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{contact.contactCount}</td>
                  <td className="px-4 py-4">{contact.relationships.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;
