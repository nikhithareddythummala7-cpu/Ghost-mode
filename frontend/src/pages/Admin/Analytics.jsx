import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { getAdminAnalytics } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const { data } = await getAdminAnalytics();
        setAnalytics(data);
      } catch (error) {
        showToast('Unable to load analytics data', 'error');
      }
      setLoading(false);
    };
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Platform trends for users, capsules, messages, and vault activity.</p>
      </div>
      {loading || !analytics ? <LoadingSpinner /> : (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">User Registration Growth</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.userGrowth} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#userGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Capsules Created Per Month</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.capsuleGrowth} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="capsuleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#14b8a6" fill="url(#capsuleGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Scheduled Messages Per Month</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.messageGrowth} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="messageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#f97316" fill="url(#messageGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Memory Upload Statistics</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.vaultGrowth} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Spam Attempts</h3>
              <div className="mt-6 text-4xl font-semibold text-slate-900 dark:text-white">{analytics.spamAttempts}</div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Total flagged messages awaiting review.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Delivery Success Rate</h3>
              <div className="mt-6 text-4xl font-semibold text-slate-900 dark:text-white">{analytics.deliverySuccessRate}%</div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Rate of successfully delivered messages.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
