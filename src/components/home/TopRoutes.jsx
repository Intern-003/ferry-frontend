// src/components/home/TopRoutes.jsx
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useGet } from "../../hooks/useGet";
import Reveal from "../ui/Reveal";

const FALLBACK = {
  "1-2": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80",
  "2-3": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1000&q=80",
  "3-1": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1000&q=80",
  default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80",
};

const getImage = (route) => {
  if (route.image_url) return route.image_url;
  const key = `${route.from_id}-${route.to_id}`;
  return FALLBACK[key] || FALLBACK.default;
};

export default function TopRoutes() {
  const { data: resp, loading } = useGet("/featured-routes");
  const routes = resp?.data || [];

  if (!loading && routes.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-powder/30 blur-3xl -translate-y-1/2" />

      <div className="relative container-x">
        <Reveal>
          <div className="text-center mb-16">
            <div className="section-label">Popular Routes</div>
            <h2 className="section-title">Top destinations in Andaman</h2>
            <p className="text-navy/60 mt-5">
              Popular routes selected by travellers for island hopping.
            </p>
          </div>
        </Reveal>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-mist rounded-3xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {routes.map((r, i) => (
              <Reveal key={r.id} delay={i * 120}>
                <Link
                  to={`/ferry-booking?from=${r.from_id}&to=${r.to_id}`}
                  className="group relative block h-80 rounded-3xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-500 hover:-translate-y-2"
                >
                  <img
                    src={getImage(r)}
                    alt={`${r.from} to ${r.to}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-90" />

                  {/* Route pin */}
                  <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                    <MapPin size={11} className="text-crimson-light" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Daily
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="text-2xl font-black tracking-tight mb-1.5 leading-tight">
                      {r.from} <span className="text-powder mx-1">→</span> {r.to}
                    </div>
                    <div className="text-xs text-powder/80 mb-5">
                      Daily departures • Instant confirmation
                    </div>
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-ink text-xs font-black rounded-xl group-hover:bg-crimson group-hover:text-white transition-all duration-300">
                      View Ferries
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}