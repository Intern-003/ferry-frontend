// src/components/home/FaqSection.jsx
import { useState } from "react";
import { Plus } from "lucide-react";
import { useGet } from "../../hooks/useGet";
import Reveal from "../ui/Reveal";

export default function FaqSection() {
  const { data: resp } = useGet("/faqs");
  const faqs = resp?.data || [];
  const [openId, setOpenId] = useState(null);

  const fallback = [
    { id: 1, question: "How do I book a ferry ticket?",  answer: "Search your route, pick a departure, select seats, fill passenger details and confirm." },
    { id: 2, question: "Which routes are available?",    answer: "Port Blair ↔ Havelock, Havelock ↔ Neil Island, Neil Island ↔ Port Blair and more." },
    { id: 3, question: "Can I cancel my ferry booking?", answer: "Yes. Free cancellation up to 24 hours before departure." },
    { id: 4, question: "Can I book a private boat?",     answer: "Yes. Choose Boat Booking, select your boat and submit a charter request." },
    { id: 5, question: "Is the fare per person?",        answer: "Yes for ferries. Private charters are priced per vessel." },
  ];

  const list = faqs.length > 0 ? faqs : fallback;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-powder/30 blur-3xl" />

      <div className="relative container-x max-w-3xl">
        <Reveal>
          <div className="text-center mb-14">
            <div className="section-label">FAQs</div>
            <h2 className="section-title">Frequently asked questions</h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {list.map((f, i) => {
            const open = openId === f.id;
            return (
              <Reveal key={f.id} delay={i * 80}>
                <div
                  className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                    open ? "border-steel shadow-card" : "border-powder/50 hover:border-steel/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(open ? null : f.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-bold text-ink text-sm md:text-base pr-4">
                      {f.question}
                    </span>
                    <span
                      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                        open ? "bg-crimson rotate-45" : "bg-ink"
                      }`}
                    >
                      <Plus size={16} />
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
                      open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-5 text-sm text-navy/70 leading-relaxed">
                      {f.answer}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}