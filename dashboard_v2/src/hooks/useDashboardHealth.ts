import { useEffect, useState } from 'react';
import { fetchDashboardHealth, type DashboardHealth } from '../services/apiService';

export function useDashboardHealth() {
  const [health, setHealth] = useState<DashboardHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadHealth = async () => {
      try {
        const status = await fetchDashboardHealth();
        if (active) {
          setHealth(status);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard health');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHealth();

    return () => {
      active = false;
    };
  }, []);

  return {
    ready: Boolean(health?.ready),
    missing: health?.missing || [],
    loading,
    error,
  };
}