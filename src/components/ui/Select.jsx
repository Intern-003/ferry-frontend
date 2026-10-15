// src/components/ui/Select.jsx
import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, children, className = "", ...props },
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
          group relative
          transition-all duration-300
          ${
            error
              ? "text-crimson"
              : ""
          }
        `}
      >
        <select
          ref={ref}
          className={`
            w-full appearance-none cursor-pointer
            px-4 py-3 pr-11 rounded-xl border-2 bg-white
            text-sm font-medium text-ink
            transition-all duration-300
            focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-60
            ${
              error
                ? "border-crimson focus:border-crimson focus:shadow-[0_0_0_4px_rgba(220,38,38,0.1)]"
                : "border-powder/60 focus:border-steel focus:shadow-[0_0_0_4px_rgba(74,127,167,0.12)] hover:border-steel/60"
            }
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy/50 group-focus-within:text-steel group-focus-within:rotate-180 transition-all duration-300"
        />
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

export default Select;