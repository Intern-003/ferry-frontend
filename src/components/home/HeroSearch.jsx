// src/components/home/HeroSearch.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ship, Anchor, Search, CalendarDays, Users, MapPin, Sparkles } from "lucide-react";
import { useGet } from "../../hooks/useGet";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2200&q=85";

export default function HeroSearch() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("ferry");
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax]   = useState("1");

  const { data: locationsResp } = useGet("/locations");
  const locations = locationsResp?.data || [];

  const onSearch = (e) => {
    e.preventDefault();
    if (mode === "boat") {
      navigate("/boat-list");
      return;
    }
    navigate(
      `/ferry-booking?from=${from}&to=${to}&date=${date}&passengers=${pax}`
    );
  };

  return (
    <section className="relative min-h-[640px] md:min-h-[720px] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Andaman ferry"
          className="w-full h-full object-cover scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Floating decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-steel/20 blur-3xl animate-float" />
      <div className="absolute bottom-40 left-10 w-64 h-64 rounded-full bg-crimson/15 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative container-x w-full pb-12 md:pb-20 pt-24">
        {/* Eyebrow */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold uppercase tracking-[0.22em] text-white border border-white/20">
            <Sparkles size={12} className="text-crimson-light" />
            Andaman Islands • Ferry &amp; Private Boats
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-10 md:mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
            Book Your Island Journey
            <br />
            <span className="bg-gradient-to-r from-powder via-white to-powder bg-clip-text text-transparent">
              the Easy Way
            </span>
          </h1>
          <p className="text-powder/90 text-sm md:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Trusted ferry operators and private charters across Port Blair, Havelock, Neil Island
            and beyond — all in one place.
          </p>
        </div>

        {/* Search card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-modal overflow-hidden animate-slide-up" style={{ animationDelay: "0.15s" }}>
          {/* Tabs */}
          <div className="flex border-b border-powder/40 relative">
            <TabButton
              active={mode === "ferry"}
              onClick={() => setMode("ferry")}
              icon={<Ship size={18} />}
              label="Ferry"
            />
            <TabButton
              active={mode === "boat"}
              onClick={() => setMode("boat")}
              icon={<Anchor size={18} />}
              label="Private Boat"
            />
          </div>

          {/* Form */}
          <form onSubmit={onSearch} className="p-5 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FieldWrapper icon={<MapPin size={14} />} label="From">
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-bold text-ink focus:outline-none cursor-pointer"
                >
                  <option value="">Select origin</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={<MapPin size={14} />} label="To">
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-bold text-ink focus:outline-none cursor-pointer"
                >
                  <option value="">Select destination</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id} disabled={String(l.id) === String(from)}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </FieldWrapper>

              <FieldWrapper icon={<CalendarDays size={14} />} label="Travel Date">
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-bold text-ink focus:outline-none cursor-pointer"
                />
              </FieldWrapper>

              <FieldWrapper icon={<Users size={14} />} label="Passengers">
                <select
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-ink focus:outline-none cursor-pointer"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                    <option key={n} value={n}>{n} Passenger{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </FieldWrapper>

              <button
                type="submit"
                className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-gradient text-white font-bold shadow-lg hover:shadow-glowCrimson hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-shimmer animate-shimmer" />
                <Search size={18} className="relative group-hover:scale-110 transition-transform" />
                <span className="relative">{mode === "ferry" ? "Search Ferry" : "Browse Boats"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 md:px-10 py-4 font-bold text-sm transition-all duration-300 relative ${
        active ? "text-white bg-brand-gradient" : "text-ink/60 hover:text-ink hover:bg-mist"
      }`}
    >
      <span className={active ? "scale-110 transition-transform" : "transition-transform"}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function FieldWrapper({ icon, label, children }) {
  return (
    <div className="relative group">
      <label className="flex items-center gap-1.5 text-[9px] font-bold text-navy/60 uppercase tracking-[0.18em] mb-1.5 px-1">
        {icon} {label}
      </label>
      <div className="px-4 py-3 rounded-xl border-2 border-powder/60 bg-mist/50 group-focus-within:border-steel group-focus-within:bg-white group-hover:border-steel/50 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}