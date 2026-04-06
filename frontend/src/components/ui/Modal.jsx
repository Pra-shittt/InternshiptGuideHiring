import { cn } from "../../utils/cn";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={cn("bg-white w-full max-w-lg rounded-xl shadow-xl border border-[#e2ddd8] p-6 relative flex flex-col max-h-[90vh]", className)}>
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-600 hover:text-[#1e293b] transition-colors">
          <X className="h-5 w-5" />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4 text-[#1e293b]">{title}</h2>}
        <div className="overflow-y-auto pr-2 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
