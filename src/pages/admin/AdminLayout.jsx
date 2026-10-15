// src/pages/admin/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Ship, CalendarClock, Ticket, MapPin,
  LogOut, Menu, X, ExternalLink, ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { publicApi } from "../../api/public.api";
import { useAuth } from "../../hooks/useAuth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/bookings",  label: "Bookings",  icon: Ticket },
  { to: "/admin/trips",     label: "Trips",     icon: CalendarClock },
  { to: "/admin/boats",     label: "Boats",     icon: Ship },
  { to: "/admin/locations", label: "Locations", icon: MapPin },
];

export default function AdminLayout() {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try { await publicApi.logout(); } catch { /* ignore */ }
    clearAuth();
    toast.success("Signed out");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-mist flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-ink/50 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen w-72
          bg-ink text-white flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-lg font-black bg-brand-gradient bg-clip-text text-transparent">
                GP
              </span>
            </div>
            <div className="min-w-0">
              <div className="font-extrabold tracking-tight truncate">GramiPay</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-crimson-light">
                Admin Panel
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden absolute top-6 right-6 p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-crimson to-crimson-dark text-white shadow-glowCrimson"
                    : "text-powder/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <item.icon size={18} />
                {item.label}
              </span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
            </NavLink>
          ))}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-powder/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={18} /> View Site
          </a>
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center font-black">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm truncate">{user?.name || "Admin"}</div>
              <div className="text-[10px] text-powder/60 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-crimson text-sm font-bold transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Topbar (mobile menu toggle) */}
        <header className="sticky top-0 z-30 bg-white border-b border-powder/50 lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg hover:bg-mist"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="font-black text-ink">Admin Panel</div>
            <div className="w-10" />
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}