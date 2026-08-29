import { useState } from 'react';
import { Shield, KeyRound } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const SecuritySettings = ({
  securityData = {},
  onSave,
  triggerToast,
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      triggerToast('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      triggerToast('Password must be at least 8 characters');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    triggerToast('✓ Password updated successfully');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Security & Authentication</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Manage account authentication credentials and password settings
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Password Section */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-slate-600" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Account Password</h4>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Last changed: <strong className="text-slate-800">{securityData.passwordLastChanged || 'Recently'}</strong>
            </p>
          </div>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-4 py-2 text-xs font-extrabold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Account Password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SecuritySettings;
