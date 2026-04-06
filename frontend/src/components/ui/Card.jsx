import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Card = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border border-[#e2ddd8] bg-white text-[#1e293b] shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";
