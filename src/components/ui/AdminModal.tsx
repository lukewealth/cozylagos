import React from 'react';
import UniversalModal, { ModalSize } from './UniversalModal';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}: AdminModalProps) {
  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      variant="auto"
      className={className}
    >
      {children}
    </UniversalModal>
  );
}
