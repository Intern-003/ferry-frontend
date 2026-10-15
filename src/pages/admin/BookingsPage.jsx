// src/pages/admin/BookingsPage.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Check, X, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/public.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency, formatDateTime } from "../../lib/formatters";

export default function BookingsPage() {
  const [params] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(params.get("approval_status") ? "" : "");
  const [approvalFilter, setApprovalFilter] = useState(params.get("approval_status") || "");
  const [typeFilter, setTypeFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.bookings({
        search: search || undefined,
        status: statusFilter || undefined,
        approval_status: approvalFilter || undefined,
        booking_type: typeFilter || undefined,
      });
      setBookings(res?.data?.data?.data || res?.data?.data?.items || res?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter, approvalFilter, typeFilter]);

  const handleAction = async (fn, ref, successMsg) => {
    try {
      await fn(ref);
      toast.success(successMsg);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  const statusVariant = (s) =>
    s === "confirmed" ? "success" :
    s === "cancelled" ? "danger" :
    s === "completed" ? "info" : "warning";

  const approvalVariant = (s) =>
    s === "approved" ? "success" :
    s === "rejected" ? "danger" : "warning";

  return (
    <div className="space-y-6">
      <div>
        <div className="section-label">Manage</div>
        <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight">Bookings</h1>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="grid md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by reference, name, phone…"
            leftIcon={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm font-semibold focus:border-steel focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm font-semibold focus:border-steel focus:outline-none cursor-pointer"
          >
            <option value="">All Approvals</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm font-semibold focus:border-steel focus:outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="seat">Ferry (Seat)</option>
            <option value="charter">Charter</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" onClick={load}>Apply Filters</Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Spinner variant="centered" />
      ) : bookings.length === 0 ? (
        <div className="card p-16 text-center text-navy/40">No bookings found.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-mist text-navy/60 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="text-left px-5 py-3 font-bold">Ref</th>
                  <th className="text-left px-5 py-3 font-bold">Type</th>
                  <th className="text-left px-5 py-3 font-bold">Passenger</th>
                  <th className="text-left px-5 py-3 font-bold">Route / Boat</th>
                  <th className="text-left px-5 py-3 font-bold">Seats</th>
                  <th className="text-left px-5 py-3 font-bold">Total</th>
                  <th className="text-left px-5 py-3 font-bold">Status</th>
                  <th className="text-right px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-powder/40 hover:bg-mist/40 transition-colors">
                    <td className="px-5 py-4">
                      <Link to={`/admin/bookings/${b.booking_reference}`} className="font-bold text-ink hover:text-crimson">
                        {b.booking_reference}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={b.booking_type === "charter" ? "info" : "default"} size="sm">
                        {b.booking_type}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink text-xs">{b.passenger_name}</div>
                      <div className="text-navy/50 text-[11px]">{b.passenger_phone}</div>
                    </td>
                    <td className="px-5 py-4 text-navy/70 text-xs">
                      {b.trip
                        ? `${b.trip.from_location?.name} → ${b.trip.to_location?.name}`
                        : b.boat?.name || "—"}
                    </td>
                    <td className="px-5 py-4 text-navy/70">{b.seats_count}</td>
                    <td className="px-5 py-4 font-bold text-ink">
                      {formatCurrency(b.total_amount)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge variant={statusVariant(b.status)} size="sm">{b.status}</Badge>
                        {b.approval_status === "pending" && (
                          <Badge variant="warning" size="sm">Awaiting approval</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 justify-end">
                        {b.approval_status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction(adminApi.approveBooking, b.booking_reference, "Approved")}
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Approve"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleAction(adminApi.rejectBooking, b.booking_reference, "Rejected")}
                              className="p-2 rounded-lg bg-red-50 text-crimson hover:bg-red-100 transition-colors"
                              title="Reject"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {b.payment_status !== "paid" && b.status !== "cancelled" && (
                          <button
                            onClick={() => handleAction(adminApi.markPaid, b.booking_reference, "Marked as paid")}
                            className="p-2 rounded-lg bg-mist text-navy hover:bg-powder/40 transition-colors"
                            title="Mark Paid"
                          >
                            <CheckCheck size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}