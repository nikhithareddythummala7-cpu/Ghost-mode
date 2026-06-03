import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { getAdminSettings, updateAdminSettings } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: 'GhostMode',
    maxMessagesPerDay: 25,
    spamDetectionEnabled: true,
    maintenanceMode: false,
    autoDeleteFailedMessages: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const { data } = await getAdminSettings();
        setSettings({
          platformName: data.platformName || 'GhostMode',
          maxMessagesPerDay: data.maxMessagesPerDay || 25,
          spamDetectionEnabled: data.spamDetectionEnabled ?? true,
          maintenanceMode: data.maintenanceMode ?? false,
          autoDeleteFailedMessages: data.autoDeleteFailedMessages ?? false
        });
      } catch (error) {
        showToast('Unable to load settings', 'error');
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminSettings(settings);
      showToast('Platform settings saved successfully', 'success');
    } catch (error) {
      showToast('Unable to save platform settings', 'error');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Platform Settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage privacy-safe configuration for GhostMode without exposing email credentials.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Name</h3>
              <input
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </section>

          </div>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Messaging Limits</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Set a daily limit for scheduled message submissions.</p>
            <input
              type="number"
              min={1}
              value={settings.maxMessagesPerDay}
              onChange={(e) => handleChange('maxMessagesPerDay', Number(e.target.value))}
              className="mt-4 w-40 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            {[
              {
                title: 'Spam Detection',
                description: 'Enable or disable automated spam filtering for scheduled messages.',
                field: 'spamDetectionEnabled'
              },
              {
                title: 'Maintenance Mode',
                description: 'Disable new activity across the platform while performing maintenance.',
                field: 'maintenanceMode'
              },
              {
                title: 'Auto Delete Failed Messages',
                description: 'Remove failed messages automatically to keep records clean.',
                field: 'autoDeleteFailedMessages'
              }
            ].map((option) => (
              <section key={option.field} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{option.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{option.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange(option.field, !settings[option.field])}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${settings[option.field] ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {settings[option.field] ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </section>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Privacy & Production</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Email credentials stay safe in backend environment configuration and are never exposed in the admin UI.</p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-3xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
