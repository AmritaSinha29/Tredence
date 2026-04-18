import React, { type ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, error, children }) => {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-slate-600 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
};

// Reusable input styles
export const inputClassName =
  'w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-lg ' +
  'focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 ' +
  'placeholder:text-slate-300 transition-all duration-150';

export const selectClassName =
  'w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-lg ' +
  'focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 ' +
  'transition-all duration-150 appearance-none cursor-pointer';

export const textareaClassName =
  'w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-lg ' +
  'focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 ' +
  'placeholder:text-slate-300 transition-all duration-150 resize-none';
