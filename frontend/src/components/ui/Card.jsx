import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Card = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
));
Card.displayName = "Card";
