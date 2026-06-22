import React from 'react';

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function PillButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false
}: PillButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest rounded-full transition-all duration-300';

  const sizes = {
    sm: 'px-5 py-2 text-[9px]',
    md: 'px-8 py-3 text-[10px]',
    lg: 'px-10 py-4 text-xs'
  };

  const variants = {
    primary: 'bg-gold text-charcoal hover:bg-gold-dark hover:text-parchment shadow-md hover:shadow-lg active:scale-95',
    secondary: 'bg-charcoal text-parchment hover:bg-gold-dark border border-charcoal/10 active:scale-95',
    ghost: 'border border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal/5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
