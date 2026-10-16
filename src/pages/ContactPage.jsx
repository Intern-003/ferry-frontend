// src/pages/ContactPage.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";

import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import { publicApi } from "../api/public.api";
import { COMPANY_PHONE, COMPANY_EMAIL, COMPANY_NAME } from "../lib/constants";

const schema = z.object({
  name:         z.string().min(2, "Name required"),
  email:        z.string().email("Invalid email").optional().or(z.literal("")),
  phone:        z.string().min(10, "Invalid phone").max(15),
  enquiry_type: z.string().min(1, "Please select an enquiry type"),
  message:      z.string().min(5, "Message too short").max(2000),
});

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { enquiry_type: "Ferry Booking" },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await publicApi.contact(data);
      if (res?.data?.success) {
        toast.success(res.data.message || "Message sent!");
        setSent(true);
        reset();
      }
    } catch (err) {
      const errorsBag = err?.response?.data?.errors;
      if (errorsBag) Object.values(errorsBag).flat().forEach((m) => toast.error(m));
      else toast.error(err?.response?.data?.message || "Failed to send");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-mist min-h-screen">
      {/* Hero */}
      <div className="relative bg-navy-gradient overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/15 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative container-x py-20 md:py-24">
          <div className="max-w-2xl">
            <div className="section-label text-crimson-light">Get in Touch</div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-powder/80 leading-relaxed">
              Need help with a ferry, private boat or travel enquiry? Send us a message
              and our team will get back to you shortly.
            </p>
          </div>
        </div>
      </div>

      <div className="container-x py-16">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Contact info */}
          <Reveal>
            <div className="space-y-5">
              <div className="card p-7">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson to-crimson-dark flex items-center justify-center mb-5 shadow-md">
                  <Phone size={22} className="text-white" />
                </div>
                <h3 className="font-black text-ink text-lg mb-2 tracking-tight">
                  Talk to our team
                </h3>
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="text-lg font-black text-crimson hover:underline"
                >
                  {COMPANY_PHONE}
                </a>
                <p className="text-sm text-navy/60 mt-2 leading-relaxed">
                  Mon–Sat, 9:00 AM – 8:00 PM IST
                </p>
              </div>

              <div className="card p-7">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-steel to-navy flex items-center justify-center mb-5 shadow-md">
                  <Mail size={22} className="text-white" />
                </div>
                <h3 className="font-black text-ink text-lg mb-2 tracking-tight">Email</h3>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="font-bold text-ink hover:text-crimson transition-colors break-all"
                >
                  {COMPANY_EMAIL}
                </a>
                <p className="text-sm text-navy/60 mt-2 leading-relaxed">
                  Response within 24 hours
                </p>
              </div>

              <div className="card p-7">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-ink flex items-center justify-center mb-5 shadow-md">
                  <MapPin size={22} className="text-white" />
                </div>
                <h3 className="font-black text-ink text-lg mb-2 tracking-tight">Office</h3>
                <p className="text-sm text-navy/70 leading-relaxed">
                  {COMPANY_NAME}<br />
                  Office-316, Floor 3, 316 Laxmi Plaza,<br />
                  Andheri West, Mumbai, Maharashtra 400053.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={150}>
            <div className="card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-md">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-ink tracking-tight">
                    Send an Enquiry
                  </h2>
                  <p className="text-sm text-navy/60">We'll reply as soon as possible.</p>
                </div>
              </div>

              {sent && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-sm text-emerald-800">
                  ✅ Thank you! Your enquiry has been received. Our team will contact you shortly.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Name *"
                    placeholder="Your name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Mobile *"
                    placeholder="+91 98765 43210"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Email (optional)"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <Select
                    label="Enquiry Type *"
                    error={errors.enquiry_type?.message}
                    options={[
                      { value: "Ferry Booking",     label: "Ferry Booking" },
                      { value: "Private Boat",      label: "Private Boat" },
                      { value: "Cancellation",      label: "Cancellation" },
                      { value: "Refund",            label: "Refund" },
                      { value: "General",           label: "General Enquiry" },
                    ]}
                    {...register("enquiry_type")}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy/70 uppercase tracking-[0.15em] mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm focus:outline-none transition-colors ${
                      errors.message ? "border-crimson" : "border-powder/60 focus:border-steel"
                    }`}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs font-semibold text-crimson">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={submitting}
                  rightIcon={!submitting && <Send size={16} />}
                  className="w-full"
                >
                  {submitting ? "Sending…" : "Send Enquiry"}
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}