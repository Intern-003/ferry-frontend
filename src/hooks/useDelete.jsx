import { useState } from "react";
import api from "../api/axios";

export function useDelete() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeDelete = async (endpoint, body = null) => {
    setLoading(true);
    setError(null);

    try {
      const config = {};

      // ✅ only attach body if exists
      if (body) {
        config.data = body;
        config.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await api.delete(endpoint, config);

      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, executeDelete };
}
