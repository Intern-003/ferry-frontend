// src/pages/admin/TripSeatsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Ship } from "lucide-react";

import { adminApi } from "../../api/public.api";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { formatDateTime } from "../../lib/formatters";

export default function TripSeatsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.tripSeats(id);
        setData(res?.data?.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Spinner variant="centered" />;
  if (!data) return <div className="card p-16 text-center">Trip not found</div>;

  const { trip, seats, grouped, summary } = data;

  const seatColor = (status) =>
    status === "booked"  ? "bg-red-500 text-white" :
    status === "held"    ? "bg-amber-400 text-white" :
    status === "blocked" ? "bg-navy/30 text-white" :
    "bg-white text-ink border border-powder";

  return (
    <div className="space-y-6">
      <Link to="/admin/trips" className="inline-flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-crimson">
        <ArrowLeft size={16} /> Back to Trips
      </Link>

      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-mist flex items-center justify-center shrink-0">
            <Ship size={22} className="text-steel" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-ink tracking-tight">
              {trip.boat?.name}
            </h1>
            <p className="text-sm text-navy/60 mt-1">
              {trip.from_location?.name} → {trip.to_location?.name} • {formatDateTime(trip.departure_at)}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Stat label="Total"     value={summary.total}     color="text-ink" />
          <Stat label="Available" value={summary.available} color="text-emerald-600" />
          <Stat label="Booked"    value={summary.booked}    color="text-crimson" />
          <Stat label="Held"      value={summary.held}      color="text-amber-600" />
        </div>
      </div>

      {/* Seat Map */}
      <div className="card p-6">
        <h2 className="font-black text-ink tracking-tight mb-4">Seat Map</h2>

        <div className="flex flex-wrap gap-4 mb-6 text-xs font-bold">
          {[
            { label: "Available", cls: "bg-white border-2 border-powder" },
            { label: "Booked",    cls: "bg-red-500" },
            { label: "Held",      cls: "bg-amber-400" },
            { label: "Blocked",   cls: "bg-navy/30" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2 text-navy/70">
              <span className={`w-5 h-5 rounded-md ${l.cls}`} /> {l.label}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {seats.map((s) => (
            <div
              key={s.id}
              title={`Seat ${s.seat_number} — ${s.status}`}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                text-xs font-black transition-transform hover:scale-110
                ${seatColor(s.status)}
              `}
            >
              {s.seat_number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl bg-mist p-3">
      <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1">{label}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
    </div>
  );
}
