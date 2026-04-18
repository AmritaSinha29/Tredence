import React, { type ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, error, children }) => {
  return (
    <div className="mb-3.5">
      <label className="block text-[11px] font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
        {label}
        {required && <span className="text-pink-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-pink-400 mt-1">{error}</p>}
    </div>
  );
};

export const inputClassName =
  'w-full px-3 py-2 text-[13px] bg-white/[0.04] border border-white/[0.08] rounded-lg ' +
  'text-white/90 placeholder:text-white/20 ' +
  'focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/50 ' +
  'hover:border-white/15 transition-all duration-150';

export const selectClassName =
  'w-full px-3 py-2 text-[13px] bg-white/[0.04] border border-white/[0.08] rounded-lg ' +
  'text-white/90 ' +
  'focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/50 ' +
  'transition-all duration-150 appearance-none cursor-pointer';

export const textareaClassName =
  'w-full px-3 py-2 text-[13px] bg-white/[0.04] border border-white/[0.08] rounded-lg ' +
  'text-white/90 placeholder:text-white/20 ' +
  'focus:outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/50 ' +
  'transition-all duration-150 resize-none';
