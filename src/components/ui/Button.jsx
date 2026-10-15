// src/components/ui/Button.jsx
import { forwardRef } from "react";

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = "",
    ...props
  },
  ref
) {
  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-2xl",
  };

  const variants = {
    primary:
      "bg-brand-gradient text-white shadow-md hover:shadow-glowCrimson hover:-translate-y-0.5",
    outline:
      "border-2 border-navy/20 text-navy bg-white hover:border-navy hover:bg-mist",
    ghost:
      "text-ink hover:bg-mist",
    danger:
      "bg-crimson text-white hover:bg-crimson-dark hover:shadow-glowCrimson",
    dark:
      "bg-ink text-white hover:bg-navy hover:shadow-glow",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg",
    soft:
      "bg-powder/50 text-ink hover:bg-powder",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-bold tracking-tight
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 disabled:hover:shadow-md
        overflow-hidden group
        ${sizes[size]}
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {/* Shimmer on primary */}
      {variant === "primary" && !disabled && !loading && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />
      )}

      {loading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}

      <span className="relative">{children}</span>

      {!loading && rightIcon && (
        <span className="shrink-0 group-hover:translate-x-0.5 transition-transform">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

export default Button;