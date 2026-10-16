// src/components/charter/CharterModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { User, Phone, Mail, MapPin, Calendar, Users } from "lucide-react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { publicApi } from "../../api/public.api";

const nowLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const plusHours = (hours) => {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const schema = z.object({
  charter_start_at:    z.string().min(1, "Start date & time required"),
  charter_end_at:      z.string().min(1, "End date & time required"),
  charter_route_notes: z.string().min(5, "Tell us your route (min 5 chars)").max(1000),
  seats_count:         z.coerce.number().min(1, "At least 1 passenger").max(500),
  passenger_name:      z.string().min(2, "Name required"),
  passenger_phone:     z.string().min(10, "Phone must be 10+ digits"),
  passenger_email:     z.string().email("Invalid email").optional().or(z.literal("")),
}).refine((d) => new Date(d.charter_end_at) > new Date(d.charter_start_at), {
  message: "End must be after start",
  path: ["charter_end_at"],
});

export default function CharterModal({ isOpen, onClose, boat }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      seats_count: 4,
      charter_start_at: plusHours(2),
      charter_end_at:   plusHours(6),
      charter_route_notes: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("SUBMITTING CHARTER:", data);
    setSubmitting(true);
    try {
      const res = await publicApi.createCharter({
        boat_id: boat.id,
        ...data,
      });

      console.log("CHARTER RESPONSE:", res.data);

      if (res?.data?.success) {
        toast.success("Charter request submitted!");
        onClose();
        reset();
        navigate(`/booking/${res.data.data.booking_reference}`);
      }
    } catch (err) {
      console.error("CHARTER ERROR FULL:", err);
      console.error("CHARTER ERROR RESPONSE:", err?.response);
      console.error("CHARTER ERROR DATA:", err?.response?.data);

      const errorsBag = err?.response?.data?.errors;
      const message   = err?.response?.data?.message;

      if (errorsBag) {
        Object.values(errorsBag).flat().forEach((m) => toast.error(m));
      } else if (message) {
        toast.error(message);
      } else {
        toast.error("Request failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!boat) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request ${boat.name}`}
      subtitle={`${boat.capacity} seats • Private charter`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-xl bg-mist p-4 text-xs text-navy/70 leading-relaxed">
          Your request will be reviewed by our team. Payment is collected on boarding.
        </div>

        {/* ⬇️⬇️⬇️ DATES — THIS IS WHAT WAS MISSING ⬇️⬇️⬇️ */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Start Date & Time *"
            type="datetime-local"
            min={nowLocal()}
            leftIcon={<Calendar size={16} />}
            error={errors.charter_start_at?.message}
            {...register("charter_start_at")}
          />
          <Input
            label="End Date & Time *"
            type="datetime-local"
            min={nowLocal()}
            leftIcon={<Calendar size={16} />}
            error={errors.charter_end_at?.message}
            {...register("charter_end_at")}
          />
        </div>
        {/* ⬆️⬆️⬆️ DATES ⬆️⬆️⬆️ */}

        <div>
          <label className="block text-[10px] font-bold text-navy/70 uppercase tracking-[0.15em] mb-2">
            <MapPin size={12} className="inline mr-1" /> Route / Itinerary *
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Port Blair → Ross Island → North Bay → Port Blair"
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-sm focus:outline-none transition-colors ${
              errors.charter_route_notes
                ? "border-crimson"
                : "border-powder/60 focus:border-steel"
            }`}
            {...register("charter_route_notes")}
          />
          {errors.charter_route_notes && (
            <p className="mt-1.5 text-xs font-semibold text-crimson">
              {errors.charter_route_notes.message}
            </p>
          )}
        </div>

        <Input
          label="Passengers *"
          type="number"
          min="1"
          max={boat.capacity}
          leftIcon={<Users size={16} />}
          error={errors.seats_count?.message}
          {...register("seats_count")}
        />

        <div className="pt-4 border-t border-powder/50">
          <div className="text-xs font-bold uppercase tracking-widest text-navy/60 mb-4">
            Your Contact Details
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="Your name"
              leftIcon={<User size={16} />}
              error={errors.passenger_name?.message}
              {...register("passenger_name")}
            />
            <Input
              label="Mobile Number *"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={16} />}
              error={errors.passenger_phone?.message}
              {...register("passenger_phone")}
            />
          </div>

          <Input
            label="Email (optional)"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            error={errors.passenger_email?.message}
            className="mt-4"
            {...register("passenger_email")}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" loading={submitting} className="flex-1">
            {submitting ? "Submitting…" : "Submit Request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}