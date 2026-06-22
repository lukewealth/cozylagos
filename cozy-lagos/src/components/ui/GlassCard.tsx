import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', blur = 40, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-[24px] overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0px 20px 50px rgba(26, 26, 26, 0.08)'
      }}
    >
      {children}
    </div>
  );
}
