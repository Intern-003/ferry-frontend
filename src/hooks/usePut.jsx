import { useState } from "react";
import api from "../api/axios";

export function usePut() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executePut = async (endpoint, body) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {};

      if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const response = await api.put(endpoint, body, { headers });

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executePut };
}






