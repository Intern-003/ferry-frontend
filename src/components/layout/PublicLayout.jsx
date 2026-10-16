// src/components/layout/PublicLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen grid grid-rows-[auto_auto_1fr_auto] bg-navy-50">
      <TopBar />
      <Header />
      <main className="grid">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}