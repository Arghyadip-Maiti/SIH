import { useState, useEffect } from 'react';
import { User, Edit3, Save, X, ShieldAlert } from 'lucide-react';

export const ProfileSettings = ({ profileData = {}, onSave, saving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profileData.name || 'Admin User',
    role: profileData.role || 'Administrator',
    department: profileData.department || 'Ministry of Statistics & Programme Implementation',
    email: profileData.email || 'admin@example.gov.in',
  });

  useEffect(() => {
    setFormData({
      name: profileData.name || 'Admin User',
      role: profileData.role || 'Administrator',
      department: profileData.department || 'Ministry of Statistics & Programme Implementation',
      email: profileData.email || 'admin@example.gov.in',
    });
  }, [profileData]);

  const handleSave = async (e) => {
    e.preventDefault();
    const success = await onSave(formData, 'Profile updated successfully');
    if (success !== false) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profileData.name || 'Admin User',
      role: profileData.role || 'Administrator',
      department: profileData.department || 'Ministry of Statistics & Programme Implementation',
      email: profileData.email || 'admin@example.gov.in',
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Profile Information</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Personal identity details and official department assignments
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          ) : (
            <div className="text-sm font-bold text-slate-900 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
              {formData.name}
            </div>
          )}
        </div>

        {/* Role (Read-only) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Government Role
            </label>
            <span className="text-[10px] font-bold text-slate-400 italic">
              System Admin Role (Managed by Backend)
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <span>{formData.role}</span>
            <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
              Active Access
            </span>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
            Ministry / Department
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          ) : (
            <div className="text-sm font-bold text-slate-900 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
              {formData.department}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
            Official Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          ) : (
            <div className="text-sm font-bold text-slate-900 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
              {formData.email}
            </div>
          )}
        </div>

        {/* Edit Actions Bar */}
        {isEditing && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSettings;
