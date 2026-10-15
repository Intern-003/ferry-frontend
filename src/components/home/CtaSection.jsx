// src/components/home/CtaSection.jsx
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import Reveal from "../ui/Reveal";
import { COMPANY_PHONE } from "../../lib/constants";

export default function CtaSection() {
  return (
    <section className="py-20 bg-mist">
      <div className="container-x">
        <Reveal>
          <div className="relative rounded-[32px] overflow-hidden bg-navy-gradient p-10 md:p-16 text-center shadow-modal">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/20 blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-powder/20 blur-3xl translate-y-1/3 -translate-x-1/3" />

            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                Ready to sail the Andamans?
              </h2>
              <p className="text-powder/90 text-base md:text-lg mb-9 leading-relaxed">
                Book your ferry in under 2 minutes. Instant confirmation. Pay on boarding.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/ferry-booking"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-crimson-gradient text-white font-black shadow-lg hover:shadow-glowCrimson hover:-translate-y-0.5 transition-all duration-300"
                >
                  Book Your Ferry
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-bold hover:bg-white/10 hover:border-white/60 transition-all duration-300"
                >
                  <Phone size={16} /> Call {COMPANY_PHONE}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}