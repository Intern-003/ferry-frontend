// src/components/ui/Modal.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-2xl",
  closeOnOverlay = true,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/60 backdrop-blur-sm animate-fade-in"
      onClick={closeOnOverlay ? onClose : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full ${maxWidth} max-h-[92vh] overflow-hidden
          bg-white rounded-t-3xl sm:rounded-3xl shadow-modal
          animate-slide-up flex flex-col
        `}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-powder/50 shrink-0">
            <div className="min-w-0">
              {title && (
                <h2 className="text-xl font-black text-ink tracking-tight truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-navy/60 mt-1">{subtitle}</p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-9 h-9 rounded-full bg-mist hover:bg-powder/50 flex items-center justify-center text-navy transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}