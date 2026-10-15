import { useState, useEffect, useCallback } from "react";
import api from "../api/axios"; // 🔥 use global axios

export function useGet(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (customEndpoint) => {
      setLoading(true);
      setError(null);

      try {
        const finalEndpoint = customEndpoint || endpoint;
        // 🔥 IMPORTANT CHANGE
        const response = await api.get(finalEndpoint);

        setData(response.data);
        return response.data;
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    },
    [endpoint],
  );

  useEffect(() => {
    if (!endpoint) return;
    fetchData();
  }, [fetchData, endpoint]);

  return { data, loading, error, refetch: fetchData };
}


 