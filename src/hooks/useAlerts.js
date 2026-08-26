import { useState, useEffect, useCallback } from 'react';
import { alertService } from '../services/api/alertService';

export const useAlerts = (initialSeverity = null) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async (severity = initialSeverity) => {
    setLoading(true);
    setError(null);
    try {
      const res = await alertService.getAlerts(severity ? { severity } : {});
      setAlerts(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [initialSeverity]);

  const markAsRead = async (id) => {
    try {
      await alertService.markAlertAsRead(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
      );
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return {
    alerts,
    loading,
    error,
    unreadCount,
    refetch: fetchAlerts,
    markAsRead,
  };
};
