import { useState, useEffect } from 'react';
import { Bell, Save, Check } from 'lucide-react';

export const NotificationSettings = ({ notificationData = {}, onSave, saving }) => {
  const [formData, setFormData] = useState({
    projectAlerts: notificationData.projectAlerts ?? true,
    aiRiskAlerts: notificationData.aiRiskAlerts ?? true,
    financialAnomalies: notificationData.financialAnomalies ?? true,
    projectDelayAlerts: notificationData.projectDelayAlerts ?? true,
    systemNotifications: notificationData.systemNotifications ?? true,
    severities: {
      critical: notificationData.severities?.critical ?? true,
      high: notificationData.severities?.high ?? true,
      medium: notificationData.severities?.medium ?? true,
      low: notificationData.severities?.low ?? false,
    },
    channels: {
      inDashboard: notificationData.channels?.inDashboard ?? true,
      email: notificationData.channels?.email ?? true,
    },
  });

  useEffect(() => {
    setFormData({
      projectAlerts: notificationData.projectAlerts ?? true,
      aiRiskAlerts: notificationData.aiRiskAlerts ?? true,
      financialAnomalies: notificationData.financialAnomalies ?? true,
      projectDelayAlerts: notificationData.projectDelayAlerts ?? true,
      systemNotifications: notificationData.systemNotifications ?? true,
      severities: {
        critical: notificationData.severities?.critical ?? true,
        high: notificationData.severities?.high ?? true,
        medium: notificationData.severities?.medium ?? true,
        low: notificationData.severities?.low ?? false,
      },
      channels: {
        inDashboard: notificationData.channels?.inDashboard ?? true,
        email: notificationData.channels?.email ?? true,
      },
    });
  }, [notificationData]);

  const handleToggle = (key) => {
    setFormData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSeverityToggle = (sevKey) => {
    setFormData((prev) => ({
      ...prev,
      severities: {
        ...prev.severities,
        [sevKey]: !prev.severities[sevKey],
      },
    }));
  };

  const handleChannelToggle = (channelKey) => {
    setFormData((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channelKey]: !prev.channels[channelKey],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, 'Notification preferences saved');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Notification Preferences</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Configure event triggers, severity thresholds, and delivery channels
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Toggles */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Event Categories
          </h4>

          {/* Project Alerts */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">Project Alerts</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Receive notifications when important project events occur.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('projectAlerts')}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                formData.projectAlerts ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.projectAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* AI Risk Alerts */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">AI Risk Alerts</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Receive alerts when high-risk projects are detected.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('aiRiskAlerts')}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                formData.aiRiskAlerts ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.aiRiskAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Financial Anomalies */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">Financial Anomalies</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Notify me about unusual financial activity.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('financialAnomalies')}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                formData.financialAnomalies ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.financialAnomalies ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Project Delay Alerts */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">Project Delay Alerts</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Notify me when projects are delayed or predicted to be delayed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('projectDelayAlerts')}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                formData.projectDelayAlerts ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.projectDelayAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* System Notifications */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <div className="text-xs font-extrabold text-slate-900">System Notifications</div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Receive important system notifications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('systemNotifications')}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                formData.systemNotifications ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.systemNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Alert Severity Checkboxes */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Alert Severity Filter
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'critical', label: 'Critical' },
              { id: 'high', label: 'High' },
              { id: 'medium', label: 'Medium' },
              { id: 'low', label: 'Low' },
            ].map((sev) => (
              <label
                key={sev.id}
                className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={formData.severities[sev.id]}
                  onChange={() => handleSeverityToggle(sev.id)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-500 accent-slate-900"
                />
                <span className="text-xs font-extrabold text-slate-900">{sev.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Delivery Preferences Toggles */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Delivery Channels
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-extrabold text-slate-900">In Dashboard</span>
              <button
                type="button"
                onClick={() => handleChannelToggle('inDashboard')}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  formData.channels.inDashboard ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formData.channels.inDashboard ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-extrabold text-slate-900">Email</span>
              <button
                type="button"
                onClick={() => handleChannelToggle('email')}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  formData.channels.email ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formData.channels.email ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;
