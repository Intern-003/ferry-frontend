// src/components/ui/Spinner.jsx
export default function Spinner({
  size = "md",
  variant = "inline",
  label,
  className = "",
}) {
  const sizes = {
    xs: "w-3 h-3 border",
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-[3px]",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const colorMap = {
    primary: "border-powder border-t-steel",
    light:   "border-white/30 border-t-white",
    dark:    "border-navy/20 border-t-navy",
    crimson: "border-crimson/20 border-t-crimson",
  };

  const circle = (
    <div
      className={`
        ${sizes[size]}
        ${colorMap.primary}
        rounded-full animate-spin
      `}
    />
  );

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {circle}
        {label && <span className="text-sm font-medium text-navy/60">{label}</span>}
      </span>
    );
  }

  if (variant === "centered") {
    return (
      <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
        <div className="relative">
          {/* Outer ring pulse */}
          <div className="absolute inset-0 w-12 h-12 border-4 border-powder/40 border-t-steel rounded-full animate-spin" />
          <div className="absolute inset-2 w-8 h-8 border-[3px] border-transparent border-t-crimson rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.7s" }} />
        </div>
        {label && <span className="text-sm font-medium text-navy/60">{label}</span>}
      </div>
    );
  }

  if (variant === "fullscreen") {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm ${className}`}>
        <div className="bg-white rounded-2xl p-8 shadow-modal flex flex-col items-center gap-4">
          {circle}
          {label && <span className="text-sm font-bold text-ink">{label}</span>}
        </div>
      </div>
    );
  }

  // Overlay variant
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-inherit z-10 ${className}`}>
      <div className="flex flex-col items-center gap-3">
        {circle}
        {label && <span className="text-xs font-bold text-navy/70 uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
}