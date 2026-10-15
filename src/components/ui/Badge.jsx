// src/components/ui/Badge.jsx
export default function Badge({ children, variant = "default", size = "md", className = "" }) {
  const variants = {
    default: "bg-powder/50 text-navy",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger:  "bg-red-50 text-crimson border border-red-200",
    info:    "bg-steel/15 text-steel-dark border border-steel/30",
    dark:    "bg-ink text-white",
    crimson: "bg-crimson text-white",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-bold rounded-full
        uppercase tracking-wider whitespace-nowrap
        ${sizes[size]} ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}