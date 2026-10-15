// src/components/charter/CharterModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { User, Phone, Mail, MapPin, Calendar, Users, FileText } from "lucide-react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { publicApi } from "../../api/public.api";

const schema = z.object({
  charter_start_at:    z.string().min(1, "Start required"),
  charter_end_at:      z.string().min(1, "End required"),
  charter_route_notes: z.string().min(5, "Tell us your route").max(1000),
  seats_count:         z.coerce.number().min(1, "At least 1 passenger").max(500),
  passenger_name:      z.string().min(2, "Name required"),
  passenger_phone:     z.string().min(10, "Invalid phone"),
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
    defaultValues: { seats_count: 4 },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await publicApi.createCharter({
        boat_id: boat.id,
        ...data,
      });

      if (res?.data?.success) {
        toast.success("Charter request submitted!");
        onClose();
        reset();
        navigate(`/booking/${res.data.data.booking_reference}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Request failed");
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
          Your request will be reviewed by our team and you'll receive a confirmation
          shortly. Payment is collected on boarding.
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Start Date & Time *"
            type="datetime-local"
            leftIcon={<Calendar size={16} />}
            error={errors.charter_start_at?.message}
            {...register("charter_start_at")}
          />
          <Input
            label="End Date & Time *"
            type="datetime-local"
            leftIcon={<Calendar size={16} />}
            error={errors.charter_end_at?.message}
            {...register("charter_end_at")}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-navy/70 uppercase tracking-[0.15em] mb-2">
            <MapPin size={12} className="inline mr-1" /> Route / Itinerary *
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Port Blair → Ross Island → North Bay → Port Blair"
            className="w-full px-4 py-3 rounded-xl border-2 border-powder/60 bg-white text-sm focus:border-steel focus:outline-none"
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