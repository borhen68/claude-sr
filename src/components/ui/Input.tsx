"use client";
import { clsx } from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#2C2825]">{label}</label>
        )}
        <input
          ref={ref}
          className={clsx(
            "w-full px-4 py-2.5 rounded-lg border bg-white text-[#2C2825] placeholder-[#8A8279] transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[#2C2825] focus:border-transparent",
            error ? "border-red-400" : "border-[#D4CEC7]",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
