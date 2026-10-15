// src/hooks/usePost.jsx
import { useState } from "react";
import api from "../api/axios";

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (url, data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(url, data);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, response };
};