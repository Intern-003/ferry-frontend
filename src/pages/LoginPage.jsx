// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, ShieldCheck, User } from "lucide-react";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import BrandLogo from "../components/ui/BrandLogo";
import { publicApi } from "../api/public.api";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveAuth } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const res = await publicApi.login(data);

      if (res?.data?.success) {
        const { user, token } = res.data.data;
        saveAuth({ user, token });

        toast.success(`Welcome, ${user.name}!`);

        // ── Role-based redirect ────────────────────────────────
        const role = user.role?.toLowerCase();

        if (role === "admin") {
          // Admin always lands on dashboard
          navigate("/admin", { replace: true });
          return;
        }

        // Customer — go to intended page (if any) or home
        const intended = location.state?.from?.pathname;
        navigate(intended && intended !== "/login" ? intended : "/", { replace: true });
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || "Login failed";

      // Pending approval special message
      if (err?.response?.data?.code === "pending_approval") {
        toast.error("Your account is awaiting admin approval.");
      } else if (status === 403) {
        toast.error(msg || "Account is disabled.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid lg:grid-cols-2">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex relative bg-navy-gradient overflow-hidden p-12 flex-col justify-between">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-crimson/20 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-powder/10 blur-3xl translate-y-1/3 -translate-x-1/3" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
            <BrandLogo />
          </div>
          <div className="text-white">
            <div className="font-extrabold tracking-tight">Spay Fintech Pvt Ltd</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-crimson-light">
              Ferry Booking
            </div>
          </div>
        </Link>

        <div className="relative text-white">
          <h2 className="text-4xl font-black tracking-tight leading-tight mb-5">
            Welcome<br />back aboard.
          </h2>
          <p className="text-powder/80 leading-relaxed mb-8 max-w-sm">
            One sign-in for customers, agents and administrators. Access your bookings, dashboard or
            settings — everything in one place.
          </p>

          <div className="space-y-4">
            <PerkRow
              icon={<User size={16} />}
              title="Customers"
              desc="View bookings, track trips, print tickets"
            />
            <PerkRow
              icon={<ShieldCheck size={16} />}
              title="Admins & Agents"
              desc="Manage boats, trips, seats, bookings"
            />
          </div>
        </div>

        <div className="relative text-powder/60 text-xs">
          © {new Date().getFullYear()} Spay Fintech Pvt Ltd Private Limited
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-mist">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-ink tracking-tight mb-2">
              Sign in
            </h1>
            <p className="text-navy/60">
              Use your email to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              autoComplete="email"
              autoFocus
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={16} />}
              error={errors.password?.message}
              autoComplete="current-password"
              {...register("password")}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full mt-2"
              rightIcon={!submitting && <ArrowRight size={18} />}
            >
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-navy/60">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-ink hover:text-crimson transition-colors"
            >
              Create one
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-powder/50">
            <div className="text-xs text-navy/50 text-center leading-relaxed">
              <p className="font-semibold text-navy/70 mb-2">Access levels</p>
              <p>Customers → My Bookings &amp; Ferry Booking</p>
              <p>Admins → Full management dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerkRow({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-lg bg-crimson/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-crimson-light">{icon}</span>
      </span>
      <div>
        <div className="text-white font-bold text-sm">{title}</div>
        <div className="text-powder/70 text-xs">{desc}</div>
      </div>
    </div>
  );
}