// src/pages/admin/DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ship, Ticket, TrendingUp, CalendarClock, ArrowRight, Clock } from "lucide-react";

import { adminApi } from "../../api/public.api";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import { formatCurrency, formatDateTime } from "../../lib/formatters";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.dashboard();
        setData(res?.data?.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner variant="centered" label="Loading dashboard…" />;

  const stats = [
    { label: "Boats",     value: data?.total_boats     ?? 0, icon: Ship,         color: "from-steel to-navy" },
    { label: "Trips",     value: data?.total_trips     ?? 0, icon: CalendarClock,color: "from-navy to-ink" },
    { label: "Bookings",  value: data?.total_bookings  ?? 0, icon: Ticket,       color: "from-crimson to-crimson-dark" },
    { label: "Revenue",   value: formatCurrency(data?.total_revenue ?? 0), icon: TrendingUp, color: "from-emerald-500 to-emerald-700" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="section-label">Overview</div>
        <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5 group relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-md`}>
              <s.icon size={20} className="text-white" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1">
              {s.label}
            </div>
            <div className="text-2xl font-black text-ink tracking-tight truncate">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pending alert */}
      {data?.pending_booking > 0 && (
        <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-black text-amber-900 mb-1">
              {data.pending_booking} booking{data.pending_booking > 1 ? "s" : ""} awaiting approval
            </div>
            <div className="text-sm text-amber-800 mb-3">
              These are charter requests. Review and approve or reject them.
            </div>
            <Link
              to="/admin/bookings?approval_status=pending"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-900 hover:underline"
            >
              Review now <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-powder/50 flex items-center justify-between">
          <h2 className="font-black text-ink tracking-tight">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-xs font-bold text-crimson hover:underline flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {!data?.recent_bookings?.length ? (
          <div className="p-16 text-center text-navy/40">No bookings yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-mist text-navy/60 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="text-left px-6 py-3 font-bold">Reference</th>
                  <th className="text-left px-6 py-3 font-bold">Passenger</th>
                  <th className="text-left px-6 py-3 font-bold">Boat</th>
                  <th className="text-left px-6 py-3 font-bold">Seats</th>
                  <th className="text-left px-6 py-3 font-bold">Total</th>
                  <th className="text-left px-6 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_bookings.map((b) => (
                  <tr key={b.reference} className="border-t border-powder/40 hover:bg-mist/40 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/admin/bookings/${b.reference}`} className="font-bold text-ink hover:text-crimson">
                        {b.reference}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-navy/70">{b.passenger_name}</td>
                    <td className="px-6 py-4 text-navy/70">{b.boat || "—"}</td>
                    <td className="px-6 py-4 text-navy/70">{b.seats}</td>
                    <td className="px-6 py-4 font-bold text-ink">{formatCurrency(b.total)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "danger" : "warning"} size="sm">
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}