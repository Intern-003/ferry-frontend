// src/pages/FerryBookingPage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, CalendarDays, Users, MapPin, Filter, X } from "lucide-react";
import toast from "react-hot-toast";

import { publicApi } from "../api/public.api";
import { useGet } from "../hooks/useGet";
import TripCard from "../components/booking/TripCard";
import FilterSidebar from "../components/booking/FilterSidebar";
import BookingModal from "../components/booking/BookingModal";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";

const DEFAULT_FILTERS = {
  maxPrice: 100000,   // very high — will be auto-capped to real data
  minPrice: 0,
  sort: "departure",
  classes: [],
  operator: "",
};

export default function FerryBookingPage() {
  const [params, setParams] = useSearchParams();

  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo]     = useState(params.get("to") || "");
  const [date, setDate] = useState(
    params.get("date") || new Date().toISOString().split("T")[0]
  );
  const [pax, setPax]   = useState(params.get("passengers") || "1");

  const [trips, setTrips]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showFilters, setShowFilters]   = useState(false);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { data: locResp } = useGet("/locations");
  const locations = locResp?.data || [];

  /* =========================================================
   * Run search
   * ========================================================= */
  const runSearch = useCallback(async () => {
    if (!from || !to || !date) {
      toast.error("Please select origin, destination and date");
      return;
    }
    if (String(from) === String(to)) {
      toast.error("Origin and destination cannot be the same");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await publicApi.search({
        from,
        to,
        date,
        passengers: pax,
      });

      const items = res?.data?.data?.items || [];
      setTrips(items);

      // Reset filters but auto-set price range from real data
      if (items.length > 0) {
        const prices = items.map((t) => Number(t.base_price || 0));
        const maxTripPrice = Math.max(...prices);
        setFilters((prev) => ({
          ...prev,
          minPrice: 0,
          maxPrice: Math.ceil(maxTripPrice / 100) * 100 + 100, // round up to nearest 100
        }));
      } else {
        setFilters(DEFAULT_FILTERS);
      }

      // Sync URL so it's shareable
      setParams(
        { from, to, date, passengers: pax },
        { replace: true }
      );
    } catch (err) {
      const msg = err?.response?.data?.message || "Search failed. Please try again.";
      toast.error(msg);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [from, to, date, pax, setParams]);

  /* =========================================================
   * Auto-search on mount if URL has params
   * ========================================================= */
  useEffect(() => {
    if (from && to && date) {
      runSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
   * Applied filters
   * ========================================================= */
  const filteredTrips = useMemo(() => {
    let list = [...trips];

    // Price range
    list = list.filter((t) => {
      const price = Number(t.base_price || 0);
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Seat class
    if (filters.classes.length > 0) {
      list = list.filter((t) => filters.classes.includes(t.seat_class));
    }

    // Operator (boat name)
    if (filters.operator) {
      list = list.filter((t) =>
        t.boat?.name?.toLowerCase().includes(filters.operator.toLowerCase())
      );
    }

    // Sort
    switch (filters.sort) {
      case "price_asc":
        list.sort((a, b) => Number(a.base_price) - Number(b.base_price));
        break;
      case "price_desc":
        list.sort((a, b) => Number(b.base_price) - Number(a.base_price));
        break;
      case "duration":
        list.sort((a, b) => a.duration_minutes - b.duration_minutes);
        break;
      default:
        list.sort((a, b) => new Date(a.departure_at) - new Date(b.departure_at));
    }

    return list;
  }, [trips, filters]);

  /* =========================================================
   * Derived info for header
   * ========================================================= */
  const fromName = locations.find((l) => String(l.id) === String(from))?.name || "—";
  const toName   = locations.find((l) => String(l.id) === String(to))?.name || "—";

  const priceRange = useMemo(() => {
    if (trips.length === 0) return { min: 0, max: 10000 };
    const prices = trips.map((t) => Number(t.base_price || 0));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [trips]);

  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      maxPrice: Math.ceil(priceRange.max / 100) * 100 + 100,
    });
  };

  /* =========================================================
   * Render
   * ========================================================= */
  return (
    <div className="bg-mist min-h-screen">
      {/* Hero */}
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-powder/10 blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="relative container-x py-16 md:py-20 text-white">
          <div className="section-label text-crimson-light">Book Your Ferry</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            Ferry Booking
          </h1>
          <p className="text-powder/80 max-w-xl leading-relaxed">
            Search schedules, compare ferry operators and reserve seats for your Andaman journey.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="container-x -mt-10 relative z-10 mb-10">
        <div className="bg-white rounded-3xl shadow-modal p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <SelectField
              icon={<MapPin size={11} />}
              label="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Select origin</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </SelectField>

            <SelectField
              icon={<MapPin size={11} />}
              label="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Select destination</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id} disabled={String(l.id) === String(from)}>
                  {l.name}
                </option>
              ))}
            </SelectField>

            <div>
              <label className="flex items-center gap-1.5 text-[9px] font-bold text-navy/60 uppercase tracking-[0.18em] mb-1.5">
                <CalendarDays size={11} /> Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm font-semibold text-ink focus:border-steel focus:outline-none cursor-pointer"
              />
            </div>

            <SelectField
              icon={<Users size={11} />}
              label="Passengers"
              value={pax}
              onChange={(e) => setPax(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n} Passenger{n > 1 ? "s" : ""}
                </option>
              ))}
            </SelectField>

            <div className="flex items-end">
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={runSearch}
                leftIcon={!loading && <Search size={16} />}
                className="w-full"
              >
                {loading ? "Searching…" : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-x pb-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar (desktop) */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              priceRange={priceRange}
            />
          </div>

          <div>
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={showFilters ? <X size={16} /> : <Filter size={16} />}
                className="w-full"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              {showFilters && (
                <div className="mt-4">
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    onReset={handleResetFilters}
                    priceRange={priceRange}
                  />
                </div>
              )}
            </div>

            {/* Header */}
            {searched && !loading && (
              <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-black text-ink tracking-tight">
                    {filteredTrips.length} {filteredTrips.length === 1 ? "ferry" : "ferries"} found
                  </h2>
                  <p className="text-sm text-navy/60 mt-0.5">
                    {fromName} → {toName} • {new Date(date).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>
                {filters.classes.length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-crimson hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {loading && (
              <Spinner variant="centered" label="Searching for ferries…" />
            )}

            {!loading && searched && filteredTrips.length === 0 && (
              <div className="card p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-powder/40 flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-steel" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">No ferries found</h3>
                <p className="text-navy/60 mb-6">
                  {trips.length > 0
                    ? "Your filters removed all results. Try widening the price range."
                    : "Try a different date or route."}
                </p>
                {trips.length > 0 && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            )}

            {!loading && !searched && (
              <div className="card p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-powder/40 flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-steel" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">Search for ferries</h3>
                <p className="text-navy/60">Pick your route, date and passengers above.</p>
              </div>
            )}

            <div className="space-y-4">
              {!loading &&
                filteredTrips.map((trip) => (
                  <TripCard
                    key={trip.trip_id}
                    trip={trip}
                    onSelect={setSelectedTrip}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        trip={selectedTrip}
      />
    </div>
  );
}

/* =========================================================
 * Small helper
 * ========================================================= */
function SelectField({ icon, label, children, ...props }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-[9px] font-bold text-navy/60 uppercase tracking-[0.18em] mb-1.5">
        {icon} {label}
      </label>
      <select
        className="w-full px-3 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm font-semibold text-ink focus:border-steel focus:outline-none cursor-pointer"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}