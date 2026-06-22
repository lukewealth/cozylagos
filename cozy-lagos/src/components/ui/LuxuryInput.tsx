import React from 'react';

interface LuxuryInputProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function LuxuryInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  className = '',
  required = false
}: LuxuryInputProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-0 border-b border-charcoal/20 pb-2 text-sm font-semibold text-charcoal focus:outline-none focus:border-gold transition-colors placeholder:text-charcoal/30"
      />
    </div>
  );
}
