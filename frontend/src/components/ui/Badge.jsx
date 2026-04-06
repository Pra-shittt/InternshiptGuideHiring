import { cn } from "../../utils/cn";

const variants = {
  default: "bg-slate-100 text-slate-600 border-slate-200",
  primary: "bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20",
  success: "bg-green-50 text-green-600 border-green-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  danger: "bg-red-50 text-red-600 border-red-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
};

export function Badge({ children, variant = "default", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
