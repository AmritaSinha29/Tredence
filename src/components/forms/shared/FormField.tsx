import React, { type ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, error, hint, children, htmlFor }) => (
  <div className="mb-4">
    <label htmlFor={htmlFor}
           className="block text-[11px] font-semibold text-[#5a5c78] mb-1.5 uppercase tracking-[0.06em]">
      {label}
      {required && <span className="text-[#e04e5e] ml-0.5" aria-label="required">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-[10px] text-[#b4b6c8] mt-1">{hint}</p>}
    {error && <p className="text-[11px] text-[#e04e5e] mt-1" role="alert">{error}</p>}
  </div>
);

export const inputClassName =
  'input-field';

export const selectClassName =
  'input-field appearance-none cursor-pointer';

export const textareaClassName =
  'input-field resize-none';
