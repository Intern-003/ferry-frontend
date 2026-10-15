// src/components/home/OperatorsSection.jsx
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useGet } from "../../hooks/useGet";
import Reveal from "../ui/Reveal";

const FALLBACK_IMAGES = {
  nautika:      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  makruzz:      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
  "blue ocean": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  "green ocean":"https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80",
  default:      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
};

const getImage = (boat) => {
  if (boat.image_url) return boat.image_url;
  const key = (boat.name || "").toLowerCase();
  return FALLBACK_IMAGES[key] || FALLBACK_IMAGES.default;
};

export default function OperatorsSection() {
  const { data: resp, loading } = useGet("/featured-operators");
  const operators = resp?.data || [];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-powder/30 blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative container-x">
        <Reveal>
          <div className="text-center mb-16">
            <div className="section-label">Our Operators</div>
            <h2 className="section-title">We are collaborated with</h2>
            <p className="text-navy/60 mt-5 max-w-2xl mx-auto leading-relaxed">
              Choose from leading ferry operators and book your preferred schedule in a few clicks.
            </p>
          </div>
        </Reveal>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-mist rounded-3xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && operators.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {operators.map((op, i) => (
              <Reveal key={op.id} delay={i * 100}>
                <div className="group card overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImage(op)}
                      alt={op.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[900ms] ease-out"
                    />
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md flex items-center gap-1 shadow-md">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-ink">{op.rating?.toFixed(1)}</span>
                    </div>
                    {/* Bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/60 to-transparent" />
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="text-xl font-black text-ink tracking-tight">{op.name}</h3>

                    <div className="flex items-center justify-center gap-1 mt-2">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={13}
                          className={
                            j < Math.floor(op.rating || 0)
                              ? "fill-crimson text-crimson"
                              : "text-powder"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm text-navy/60 mt-3 leading-relaxed min-h-[40px]">
                      {op.tagline || ""}
                    </p>

                    <Link
                      to="/ferry-booking"
                      className="mt-5 inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-ink text-white text-sm font-bold hover:bg-brand-gradient hover:shadow-glowCrimson transition-all duration-300"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {!loading && operators.length === 0 && (
          <div className="text-center py-16 text-navy/40">No operators available yet.</div>
        )}
      </div>
    </section>
  );
}