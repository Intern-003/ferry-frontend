// src/components/ui/Input.jsx
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightIcon, className = "", ...props },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[10px] font-bold text-navy/70 uppercase tracking-[0.15em] mb-2">
          {label}
        </label>
      )}

      <div
        className={`
          group relative flex items-center gap-2
          px-4 py-3 rounded-xl border-2 bg-white
          transition-all duration-300
          ${
            error
              ? "border-crimson focus-within:border-crimson focus-within:shadow-[0_0_0_4px_rgba(220,38,38,0.1)]"
              : "border-powder/60 focus-within:border-steel focus-within:shadow-[0_0_0_4px_rgba(74,127,167,0.12)] hover:border-steel/60"
          }
        `}
      >
        {leftIcon && (
          <span className="shrink-0 text-navy/40 group-focus-within:text-steel transition-colors">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          className="
            flex-1 min-w-0 bg-transparent text-sm font-medium text-ink
            placeholder:text-navy/40 placeholder:font-normal
            focus:outline-none
            disabled:cursor-not-allowed disabled:text-navy/40
          "
          {...props}
        />

        {rightIcon && (
          <span className="shrink-0 text-navy/40">{rightIcon}</span>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-semibold text-crimson flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-crimson" /> {error}
        </p>
      )}

      {!error && hint && (
        <p className="mt-1.5 text-xs text-navy/50">{hint}</p>
      )}
    </div>
  );
});

export default Input;