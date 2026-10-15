// src/pages/admin/AdminBookingDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Ship, MapPin, Calendar, Users, Check, X,
  CheckCheck, Trash2, Printer, User, Phone, Mail, Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminApi, publicApi } from "../../api/public.api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency, formatDateTime } from "../../lib/formatters";

export default function AdminBookingDetailPage() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.booking(reference);
      setData(res?.data?.data);
    } catch {
      toast.error("Booking not found");
      navigate("/admin/bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [reference]);

  const run = async (fn, msg) => {
    setBusy(true);
    try {
      await fn(reference);
      toast.success(msg);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner variant="centered" />;
  if (!data) return <div className="card p-16 text-center">Not found</div>;

  const statusVariant = (s) =>
    s === "confirmed" ? "success" :
    s === "cancelled" ? "danger" :
    s === "completed" ? "info" : "warning";

  const seatNumbers = data.seats?.map((s) => s.trip_seat?.seat_number).filter(Boolean) || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => navigate("/admin/bookings")}
        className="inline-flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-crimson"
      >
        <ArrowLeft size={16} /> Back to Bookings
      </button>

      {/* Header card */}
      <div className="card overflow-hidden">
        <div className="relative bg-navy-gradient p-7 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-crimson/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-powder/70 mb-1">
                Booking Reference
              </div>
              <div className="text-3xl font-black tracking-tight">{data.booking_reference}</div>
              <div className="text-xs text-powder/70 mt-2">
                Created {formatDateTime(data.created_at)}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={statusVariant(data.status)} size="md">{data.status}</Badge>
              {data.approval_status === "pending" && (
                <Badge variant="warning" size="md">Awaiting Approval</Badge>
              )}
              <Badge variant={data.payment_status === "paid" ? "success" : "warning"} size="md">
                {data.payment_status === "paid" ? "Paid" : "Unpaid"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 border-b border-powder/50 flex flex-wrap gap-3">
          {data.approval_status === "pending" && (
            <>
              <Button
                variant="success"
                size="sm"
                loading={busy}
                leftIcon={<Check size={14} />}
                onClick={() => run(adminApi.approveBooking, "Approved")}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={busy}
                leftIcon={<X size={14} />}
                onClick={() => run(adminApi.rejectBooking, "Rejected")}
              >
                Reject
              </Button>
            </>
          )}

          {data.payment_status !== "paid" && data.status !== "cancelled" && (
            <Button
              variant="dark"
              size="sm"
              loading={busy}
              leftIcon={<CheckCheck size={14} />}
              onClick={() => run(adminApi.markPaid, "Marked as paid")}
            >
              Mark Paid
            </Button>
          )}

          {data.status !== "cancelled" && data.status !== "completed" && (
            <Button
              variant="outline"
              size="sm"
              loading={busy}
              leftIcon={<Trash2 size={14} />}
              onClick={() => {
                if (confirm("Cancel this booking and free the seats?")) {
                  run(adminApi.cancelBooking, "Booking cancelled");
                }
              }}
            >
              Cancel Booking
            </Button>
          )}

          <a
            href={`${import.meta.env.VITE_API_URL}/bookings/${data.booking_reference}/ticket`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto"
          >
            <Button variant="outline" size="sm" leftIcon={<Printer size={14} />}>
              Print Ticket
            </Button>
          </a>
        </div>

        {/* Main content */}
        <div className="p-7 space-y-7">
          {/* Passenger */}
          <div>
            <div className="section-label mb-3">Passenger</div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Info icon={<User size={12} />} label="Name" value={data.passenger_name} />
              <Info icon={<Phone size={12} />} label="Phone" value={data.passenger_phone} />
              <Info icon={<Mail size={12} />} label="Email" value={data.passenger_email || "—"} />
            </div>
          </div>

          {/* Ferry Booking */}
          {data.booking_type === "seat" && data.trip && (
            <>
              <div className="pt-6 border-t border-powder/50">
                <div className="section-label mb-3">Journey</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Info icon={<Ship size={12} />} label="Boat" value={data.trip.boat?.name} />
                  <Info icon={<MapPin size={12} />} label="Route"
                        value={`${data.trip.from_location?.name} → ${data.trip.to_location?.name}`} />
                  <Info icon={<Calendar size={12} />} label="Departure"
                        value={formatDateTime(data.trip.departure_at)} />
                  <Info icon={<Users size={12} />} label="Seat Class" value={data.trip.seat_class} />
                </div>
              </div>

              <div className="pt-6 border-t border-powder/50">
                <div className="section-label mb-3">Seats ({seatNumbers.length})</div>
                <div className="flex flex-wrap gap-2">
                  {seatNumbers.map((s) => (
                    <span
                      key={s}
                      className="px-3.5 py-2 rounded-xl bg-brand-gradient text-white text-sm font-black shadow-md"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Charter Booking */}
          {data.booking_type === "charter" && (
            <div className="pt-6 border-t border-powder/50">
              <div className="section-label mb-3">Charter</div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Info icon={<Ship size={12} />} label="Boat" value={data.boat?.name || "—"} />
                <Info icon={<Users size={12} />} label="Passengers" value={data.seats_count} />
                <Info icon={<Calendar size={12} />} label="Start" value={formatDateTime(data.charter_start_at)} />
                <Info icon={<Clock size={12} />} label="End" value={formatDateTime(data.charter_end_at)} />
              </div>
              {data.charter_route_notes && (
                <div className="mt-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-2">
                    Itinerary / Notes
                  </div>
                  <div className="rounded-xl bg-mist p-4 text-sm text-navy/80 leading-relaxed">
                    {data.charter_route_notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment */}
          <div className="pt-6 border-t border-powder/50">
            <div className="section-label mb-3">Payment</div>
            <div className="rounded-2xl bg-mist p-5 space-y-3">
              <Row label="Subtotal" value={formatCurrency(data.subtotal)} />
              <Row label="Tax & Fees" value={formatCurrency(data.tax_amount)} />
              <div className="pt-3 border-t border-powder/50 flex items-center justify-between">
                <span className="font-bold text-ink">Total</span>
                <span className="text-2xl font-black text-crimson tracking-tight">
                  {formatCurrency(data.total_amount)}
                </span>
              </div>
              <Row
                label="Payment Status"
                value={
                  <Badge variant={data.payment_status === "paid" ? "success" : "warning"} size="sm">
                    {data.payment_status}
                  </Badge>
                }
              />
            </div>
          </div>

          {/* Status history */}
          {data.history?.length > 0 && (
            <div className="pt-6 border-t border-powder/50">
              <div className="section-label mb-3">Status History</div>
              <div className="space-y-3">
                {data.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-crimson mt-2 shrink-0" />
                    <div className="flex-1">
                      <div className="font-semibold text-ink">
                        {h.old_status ? `${h.old_status} → ` : ""}
                        <span className="text-crimson">{h.new_status}</span>
                      </div>
                      {h.reason && <div className="text-xs text-navy/60">{h.reason}</div>}
                      <div className="text-xs text-navy/50 mt-0.5">
                        {formatDateTime(h.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50 mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="font-bold text-ink text-sm">{value}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-navy/70">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}