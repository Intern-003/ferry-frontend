// src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, User, Phone, ArrowRight, Check } from "lucide-react";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import BrandLogo from "../components/ui/BrandLogo";
import { publicApi } from "../api/public.api";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  name:     z.string().min(2, "Name is too short"),
  email:    z.string().email("Invalid email"),
  phone:    z.string().min(10, "Invalid phone").max(15).optional().or(z.literal("")),
  password: z.string().min(6, "Min 6 characters"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await publicApi.register(data);
      if (res?.data?.success) {
        saveAuth(res.data.data);
        toast.success("Welcome aboard! 🎉");
        navigate("/");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      const errorsBag = err?.response?.data?.errors;
      if (errorsBag) {
        Object.values(errorsBag).flat().forEach((m) => toast.error(m));
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden lg:flex relative bg-navy-gradient overflow-hidden p-12 flex-col justify-between">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/20 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-powder/10 blur-3xl translate-y-1/3 -translate-x-1/3" />

        <span to="/" className="relative flex items-center gap-3">&nbsp;</span>

        <div className="relative text-white">
          <h2 className="text-4xl font-black tracking-tight leading-tight mb-5">
            Your island<br />journey starts here.
          </h2>
          <p className="text-powder/80 leading-relaxed mb-8">
            Create your free account to book ferries, track bookings and manage your island trips.
          </p>
          <ul className="space-y-3">
            {["Instant booking confirmation", "Pay on boarding", "Cancel up to 24 hours before", "Free account — no charges"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-crimson flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-powder/60 text-xs">
          © {new Date().getFullYear()} Spay Fintech Pvt Ltd Private Limited
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-mist">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight mb-2">
              Create account
            </h1>
            <p className="text-navy/60">Book your ferry in a few clicks.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Phone (optional)"
              placeholder="+91 98765 43210"
              leftIcon={<Phone size={16} />}
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              leftIcon={<Lock size={16} />}
              error={errors.password_confirmation?.message}
              {...register("password_confirmation")}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full mt-2"
              rightIcon={!submitting && <ArrowRight size={18} />}
            >
              {submitting ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-navy/60">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-ink hover:text-crimson transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}