// src/components/booking/TripCard.jsx
import { Clock, Users, Ship, ArrowRight } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatCurrency, formatDateTime, formatDuration } from "../../lib/formatters";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80";

export default function TripCard({ trip, onSelect }) {
  const available = trip.available_seats > 0;

  return (
    <div className="group card overflow-hidden">
      <div className="grid md:grid-cols-[200px_1fr_auto] gap-0">
        {/* Boat image */}
        <div className="relative h-40 md:h-full overflow-hidden">
          <img
            src={trip.boat?.image || FALLBACK_IMG}
            alt={trip.boat?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/0 md:to-white/20" />
        </div>

        {/* Trip info */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={available ? "success" : "danger"} size="sm">
                  {available ? "Available" : "Sold Out"}
                </Badge>
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy/50">
                  {trip.seat_class} class
                </span>
              </div>
              <h3 className="text-xl font-black text-ink tracking-tight">
                {trip.boat?.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-navy/60 mt-1">
                <Ship size={14} /> {trip.from} → {trip.to}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-mist flex items-center justify-center">
                <Clock size={14} className="text-steel" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Departure</div>
                <div className="font-bold text-ink">{formatDateTime(trip.departure_at)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-mist flex items-center justify-center">
                <Clock size={14} className="text-steel" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Duration</div>
                <div className="font-bold text-ink">{formatDuration(trip.duration_minutes)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-mist flex items-center justify-center">
                <Users size={14} className="text-steel" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Seats Left</div>
                <div className="font-bold text-ink">{trip.available_seats} / {trip.total_seats}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="p-6 md:border-l border-t md:border-t-0 border-powder/50 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 bg-mist/30 md:min-w-[200px]">
          <div className="md:text-right">
            <div className="text-[10px] font-bold uppercase tracking-widest text-navy/50">
              From
            </div>
            <div className="text-3xl font-black text-ink tracking-tight">
              {formatCurrency(trip.base_price)}
            </div>
            <div className="text-xs text-navy/50 font-medium">per passenger</div>
          </div>
          <Button
            variant="primary"
            disabled={!available}
            onClick={() => onSelect(trip)}
            rightIcon={<ArrowRight size={16} />}
          >
            {available ? "Book Now" : "Sold Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}