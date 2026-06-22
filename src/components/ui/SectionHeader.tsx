import React from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ eyebrow, title, subtitle, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 ${className}`}>
      <div className="max-w-2xl">
        <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
          {eyebrow}
        </span>
        <h2 className="font-serif font-semibold text-3xl md:text-[48px] text-charcoal leading-[1.2]">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-sm md:text-base text-charcoal-light mt-3 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
