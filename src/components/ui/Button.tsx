"use client";
import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
          {
            "bg-[#2C2825] text-[#F5F0EB] hover:bg-[#3d3632] focus:ring-[#2C2825]": variant === "primary",
            "bg-[#F5F0EB] text-[#2C2825] hover:bg-[#E8E3DE] focus:ring-[#8A8279]": variant === "secondary",
            "bg-transparent text-[#2C2825] hover:bg-[#F5F0EB] focus:ring-[#8A8279]": variant === "ghost",
            "border-2 border-[#2C2825] text-[#2C2825] hover:bg-[#2C2825] hover:text-[#F5F0EB] focus:ring-[#2C2825]": variant === "outline",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-base": size === "md",
            "px-8 py-3.5 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
