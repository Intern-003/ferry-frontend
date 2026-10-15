// src/components/layout/Header.jsx
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, UserCircle2 } from "lucide-react";
import { NAV_LINKS } from "../../lib/constants";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`bg-white/95 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "shadow-card" : "shadow-soft"
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mist to-powder/40 border border-powder/60 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl font-black bg-brand-gradient bg-clip-text text-transparent">
              GP
            </span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-extrabold text-ink text-base tracking-tight">
              GramiPay Digitech
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-crimson">
              Ferry Booking &amp; Travel Services
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `relative px-4 py-2.5 text-sm font-bold tracking-tight transition-colors group ${
                  isActive ? "text-navy" : "text-ink/70 hover:text-navy"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-crimson transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>
<div className="hidden lg:flex items-center gap-3">
  <Link
    to="/my-bookings"
    className="text-sm font-bold text-ink/80 hover:text-crimson transition-colors"
  >
    My Bookings
  </Link>
  <Link
    to="/login"
    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-white text-sm font-bold shadow-md hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
  >
    <UserCircle2 size={16} className="group-hover:rotate-12 transition-transform" />
    Login
  </Link>
</div>
        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-mist transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} className="text-ink" /> : <Menu size={24} className="text-ink" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-500 ease-out bg-white border-t border-powder/50 ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <nav className="container-x py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive ? "bg-navy text-white" : "text-ink hover:bg-mist"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
<Link
  to="/login"
  onClick={() => setOpen(false)}
  className="mt-2 px-4 py-3 rounded-xl bg-ink text-white text-sm font-bold text-center flex items-center justify-center gap-2"
>
  <UserCircle2 size={16} /> Login
</Link>
        </nav>
      </div>
    </header>
  );
}