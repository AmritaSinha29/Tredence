import { useState, useEffect } from 'react';
import { type AutomationAction } from '../types';
import { fetchAutomations } from '../api/mockApi';

/**
 * Hook to fetch available automation actions from mock API.
 */
export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAutomations()
      .then((data) => {
        if (!cancelled) {
          setAutomations(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { automations, loading, error };
}
