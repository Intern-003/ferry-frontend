// src/components/home/ReviewsSection.jsx
import { Star, Quote } from "lucide-react";
import { useGet } from "../../hooks/useGet";
import Reveal from "../ui/Reveal";

export default function ReviewsSection() {
  const { data: resp } = useGet("/reviews");
  const reviews = resp?.data || [];

  const fallback = [
    { id: 1, name: "Ankit Mehta",    location: "Traveller", rating: 5, comment: "Booking our ferry tickets was quick and hassle-free. The website made it easy to check available schedules and complete our booking." },
    { id: 2, name: "Sneha Malhotra", location: "Traveller", rating: 5, comment: "The booking process was smooth and straightforward. We were able to select our preferred travel option and receive our booking confirmation without any difficulty." },
    { id: 3, name: "Mansi",          location: "Traveller", rating: 5, comment: "Very convenient booking experience. The website was easy to navigate, and we received our booking confirmation promptly." },
  ];

  const list = reviews.length > 0 ? reviews : fallback;

  return (
    <section className="py-24 bg-mist relative overflow-hidden">
      <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-powder/40 blur-3xl" />

      <div className="relative container-x">
        <Reveal>
          <div className="text-center mb-16">
            <div className="section-label">Traveller Reviews</div>
            <h2 className="section-title">What they say about us</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.slice(0, 3).map((r, i) => (
            <Reveal key={r.id} delay={i * 120}>
              <div className="group relative bg-white rounded-3xl p-7 border border-powder/40 shadow-card hover:shadow-cardHover transition-all duration-500 hover:-translate-y-2">
                <Quote
                  size={44}
                  className="absolute top-6 right-6 text-powder/50 group-hover:text-crimson/20 transition-colors duration-500"
                />

                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className={j < r.rating ? "fill-crimson text-crimson" : "text-powder"}
                    />
                  ))}
                </div>

                <p className="text-sm text-navy/70 leading-relaxed italic mb-7 min-h-[80px]">
                  "{r.comment}"
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-powder/50">
                  <div className="w-11 h-11 rounded-2xl bg-brand-gradient flex items-center justify-center text-white font-black shadow-md">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-ink">{r.name}</div>
                    <div className="text-[11px] text-navy/50 font-medium uppercase tracking-wider">
                      {r.location || "Traveller"}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}