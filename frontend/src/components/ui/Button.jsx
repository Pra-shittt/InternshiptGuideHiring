import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Button = forwardRef(({ className, variant = "primary", size = "md", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/50 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-[#1e3a5f] text-white hover:bg-[#0f172a] shadow-sm",
    secondary: "bg-white text-[#1e293b] border border-[#e2ddd8] hover:bg-[#f5f0eb] shadow-sm",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    ghost: "text-slate-600 hover:bg-[#f5f0eb] hover:text-[#1e293b]",
  };
  const sizes = {
    sm: "h-9 px-3",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

Button.displayName = "Button";
