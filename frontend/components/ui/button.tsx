import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button component with mobile-first design
 * - Min touch target: 44x44px
 * - Responsive sizing
 * - Multiple variants
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg",
        secondary:
          "bg-secondary text-white hover:bg-secondary-dark shadow-md hover:shadow-lg",
        success:
          "bg-success text-white hover:bg-success-dark shadow-md hover:shadow-lg",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "hover:bg-muted text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm min-h-[36px]", // Slightly below 44px for compact UIs
        default: "h-11 px-6 text-base min-h-[44px]", // Mobile-friendly
        lg: "h-14 px-8 text-lg min-h-[56px]", // Extra large for primary actions
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]", // Square icon button
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
