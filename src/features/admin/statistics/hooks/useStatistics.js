import { useEffect, useState } from 'react';
import { api } from '../../../../services/api';

export function useStatistics({ lang, onError }) {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getStats()
      .then(data => {
        if (active) setStatistics(data);
      })
      .catch(error => {
        if (active) onError(error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [lang, onError]);

  return { statistics, loading };
}
