// src/hooks/useAuth.js
import { useState, useEffect } from "react";

const TOKEN_KEY = "spay_token";
const USER_KEY  = "spay_user";

export function useAuth() {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(null);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t) setToken(t);
    if (u) {
      try { setUser(JSON.parse(u)); } catch { /* ignore */ }
    }
    setReady(true);
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return { user, token, ready, saveAuth, clearAuth, isLoggedIn: !!token };
}