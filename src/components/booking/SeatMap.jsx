// src/components/booking/SeatMap.jsx
export default function SeatMap({ seats = [], selectedIds = [], onToggle }) {
  // Group seats into rows by letter prefix
  const rows = {};
  seats.forEach((s) => {
    const letter = s.seat_number.replace(/\d+/g, "");
    const num = parseInt(s.seat_number.replace(/\D+/g, ""), 10);
    if (!rows[letter]) rows[letter] = [];
    rows[letter].push({ ...s, num });
  });
  Object.keys(rows).forEach((k) => rows[k].sort((a, b) => a.num - b.num));

  const getSeatClass = (seat) => {
    const selected = selectedIds.includes(seat.id);
    if (selected)             return "bg-brand-gradient text-white border-transparent shadow-md scale-105";
    if (seat.status === "booked")  return "bg-red-50 text-red-300 border-red-100 cursor-not-allowed";
    if (seat.status === "held")    return "bg-amber-50 text-amber-300 border-amber-100 cursor-not-allowed";
    if (seat.status === "blocked") return "bg-navy/5 text-navy/20 border-navy/10 cursor-not-allowed";
    return "bg-white text-ink border-powder hover:border-steel hover:bg-mist cursor-pointer";
  };

  const isClickable = (seat) =>
    seat.status === "available" || selectedIds.includes(seat.id);

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs font-bold">
        {[
          { label: "Available", cls: "bg-white border-2 border-powder" },
          { label: "Selected",  cls: "bg-brand-gradient" },
          { label: "Booked",    cls: "bg-red-50 border-2 border-red-100" },
          { label: "Held",      cls: "bg-amber-50 border-2 border-amber-100" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-navy/70">
            <span className={`w-5 h-5 rounded-md ${l.cls}`} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Boat shape wrapper */}
      <div className="relative bg-mist rounded-3xl p-6 border-2 border-dashed border-powder">
        {/* Deck label */}
        <div className="text-center mb-4">
          <div className="inline-block px-4 py-1 rounded-full bg-ink text-white text-[10px] font-bold uppercase tracking-widest">
            Main Deck
          </div>
        </div>

        {/* Seat grid */}
        <div className="space-y-2.5">
          {Object.entries(rows).map(([letter, rowSeats]) => (
            <div key={letter} className="flex items-center gap-2 justify-center flex-wrap">
              <span className="w-6 text-[10px] font-black text-navy/40">{letter}</span>
              {rowSeats.map((seat) => (
                <button
                  key={seat.id}
                  type="button"
                  disabled={!isClickable(seat)}
                  onClick={() => isClickable(seat) && onToggle(seat)}
                  title={`Seat ${seat.seat_number} — ${seat.status}`}
                  className={`
                    w-11 h-11 rounded-lg border-2 text-xs font-bold
                    transition-all duration-200
                    ${getSeatClass(seat)}
                  `}
                >
                  {seat.num}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bow indicator */}
        <div className="text-center mt-6">
          <div className="inline-block px-4 py-1 rounded-full bg-steel/20 text-steel text-[10px] font-bold uppercase tracking-widest">
            ▲ Bow
          </div>
        </div>
      </div>
    </div>
  );
}