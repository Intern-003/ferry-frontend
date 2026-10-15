// src/components/home/FeaturesSection.jsx
import { Zap, Ship, Ticket, LifeBuoy } from "lucide-react";
import Reveal from "../ui/Reveal";

const FEATURES = [
  { icon: Zap,     title: "Fast Ferries",   desc: "Comfortable and quick transfers between major islands.", color: "from-crimson to-crimson-dark" },
  { icon: Ship,    title: "Private Boats",  desc: "Flexible private boat options for families and groups.", color: "from-navy to-ink" },
  { icon: Ticket,  title: "Easy Booking",   desc: "Compare schedules, fares and availability online.",      color: "from-steel to-navy" },
  { icon: LifeBuoy,title: "Travel Support", desc: "Dedicated support before and after your journey.",       color: "from-powder-deep to-steel" },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-mist relative overflow-hidden">
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-powder/40 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-crimson/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative container-x">
        <Reveal>
          <div className="text-center mb-16">
            <div className="section-label">Ferry &amp; Boat</div>
            <h2 className="section-title">Choose your perfect island ride</h2>
            <p className="text-navy/60 mt-5 max-w-2xl mx-auto leading-relaxed">
              From fast ferries to private boats, find a convenient option for your island hopping plan.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div className="group relative bg-white rounded-3xl p-7 border border-powder/40 shadow-card hover:shadow-cardHover transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Gradient accent top edge */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${f.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <f.icon size={28} className="text-white" />
                </div>

                <h3 className="font-black text-lg text-ink mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{f.desc}</p>

                {/* Decorative number */}
                <div className="absolute bottom-4 right-5 text-6xl font-black text-powder/30 group-hover:text-powder/60 transition-colors">
                  0{i + 1}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}