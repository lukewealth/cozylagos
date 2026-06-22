import React from 'react';

interface ExperienceChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function ExperienceChip({ label, active = false, onClick }: ExperienceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
        active
          ? 'bg-gold text-charcoal border-gold-dark'
          : 'bg-gold/10 text-gold-dark border-gold/20 hover:border-gold hover:bg-gold/20'
      }`}
    >
      {label}
    </button>
  );
}
