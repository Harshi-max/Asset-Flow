import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, required, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean(props.value) || Boolean(props.defaultValue);
    const isFloating = focused || hasValue;

    return (
      <div className="group relative w-full">
        <div className={`relative w-full rounded-xl border transition-colors duration-200 ${
          error ? "border-rose-500 bg-rose-50/10" : focused ? "border-indigo-500 bg-white dark:bg-slate-900" : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
        }`}>
          <label
            className={`pointer-events-none absolute left-3 transition-all duration-200 ${
              isFloating ? "top-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider" : "top-3.5 text-sm text-slate-500 dark:text-slate-400"
            }`}
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <input
            ref={ref}
            required={required}
            className={`w-full bg-transparent px-3 pb-2 pt-6 text-sm text-slate-900 outline-none placeholder:text-transparent dark:text-white ${className}`}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0 }}
                className="absolute right-3 top-3.5 text-rose-500"
              >
                <AlertCircle className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 ml-1 text-xs text-rose-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
