// src/pages/BoatListPage.jsx
import { useEffect, useState } from "react";
import { Users, Anchor, Star, ArrowRight, Compass } from "lucide-react";
import toast from "react-hot-toast";

import { publicApi } from "../api/public.api";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import Reveal from "../components/ui/Reveal";
import CharterModal from "../components/charter/CharterModal";

const FALLBACK = "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1000&q=80";

const STEPS = [
  { n: "01", title: "Choose a boat",      desc: "Select a boat type that fits your group size and travel plan." },
  { n: "02", title: "Share your route",   desc: "Tell us your pickup, destination, date and preferred timing." },
  { n: "03", title: "Confirm details",    desc: "Our team checks availability and shares the final itinerary." },
  { n: "04", title: "Travel",             desc: "Receive your booking confirmation and enjoy your journey." },
];

export default function BoatListPage() {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await publicApi.charters();
        setBoats(res?.data?.data || []);
      } catch {
        toast.error("Failed to load boats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-mist min-h-screen">
      {/* Hero strip */}
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-powder/10 blur-3xl translate-y-1/3 -translate-x-1/3" />
        <div className="relative container-x py-16 md:py-20 text-white">
          <div className="section-label text-crimson-light">Private Boats</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            Private Boat Booking
          </h1>
          <p className="text-powder/80 max-w-xl leading-relaxed">
            Choose a private boat for families, groups, sightseeing and flexible island transfers.
          </p>
        </div>
      </div>

      {/* Boats */}
      <div className="container-x py-16">
        <Reveal>
          <div className="text-center mb-14">
            <div className="section-label">Private Boats</div>
            <h2 className="section-title">Boats to choose from</h2>
            <p className="text-navy/60 mt-5 max-w-2xl mx-auto">
              Request a suitable boat and our team can assist with availability and itinerary.
            </p>
          </div>
        </Reveal>

        {loading && <Spinner variant="centered" label="Loading boats…" />}

        {!loading && boats.length === 0 && (
          <div className="card p-16 text-center max-w-2xl mx-auto">
            <Anchor size={56} className="mx-auto text-powder mb-4" />
            <h3 className="text-xl font-bold text-ink mb-2">No boats listed yet</h3>
            <p className="text-navy/60">
              Our team is onboarding private boats. Contact us for custom charter inquiries.
            </p>
          </div>
        )}

        {!loading && boats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boats.map((boat, i) => (
              <Reveal key={boat.id} delay={i * 100}>
                <div className="group card overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-mist">
                    <img
                      src={boat.image_url || FALLBACK}
                      alt={boat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms]"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md flex items-center gap-1 shadow">
                      <Users size={11} className="text-steel" />
                      <span className="text-[10px] font-bold text-ink">
                        {boat.capacity} seats
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/50 to-transparent" />
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-black text-lg text-ink tracking-tight mb-2">
                      {boat.name}
                    </h3>
                    <p className="text-sm text-navy/60 leading-relaxed mb-4 line-clamp-3 flex-1">
                      {boat.description || "Premium private boat charter experience."}
                    </p>

                    <div className="flex justify-center gap-0.5 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelected(boat)}
                      rightIcon={<ArrowRight size={14} />}
                      className="w-full"
                    >
                      Request Booking
                    </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-white py-24">
        <div className="container-x">
          <Reveal>
            <div className="text-center mb-16">
              <div className="section-label">How It Works</div>
              <h2 className="section-title">How private boat booking works</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="group relative bg-mist rounded-3xl p-7 h-full hover:bg-white hover:shadow-cardHover transition-all duration-500 border border-transparent hover:border-powder/50">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-black text-lg mb-5 shadow-md group-hover:scale-110 transition-transform">
                    {s.n}
                  </div>
                  <h3 className="font-black text-ink text-lg mb-2 tracking-tight">{s.title}</h3>
                  <p className="text-sm text-navy/60 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <CharterModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        boat={selected}
      />
    </div>
  );
}