import { cn } from "../../utils/cn";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={cn("bg-card w-full max-w-lg rounded-xl shadow-lg border border-border p-6 relative flex flex-col max-h-[90vh]", className)}>
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4 text-foreground">{title}</h2>}
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
