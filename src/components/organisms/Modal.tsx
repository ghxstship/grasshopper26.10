'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/atoms/IconButton';
import { Button } from '@/components/atoms/Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'gvteway' | 'compvss' | 'atlvs';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

const variantClasses = {
  default: 'bg-gray-900 border-gray-800',
  gvteway: 'bg-gvteway-red/10 border-gvteway-red/30',
  compvss: 'bg-compvss-cyan/10 border-compvss-cyan/30',
  atlvs: 'bg-black border-gray-800',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  variant = 'default',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
}) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          'relative w-full rounded-xl border shadow-2xl animate-in zoom-in-95 duration-200',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-gray-800">
            <div className="flex-1">
              {title && (
                <h2 className="text-h4 font-bebas text-white uppercase">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-body-sm text-gray-400 font-oswald">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <IconButton
                icon={<X className="w-5 h-5" />}
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                aria-label="Close modal"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Nested Modal Support
export interface NestedModalProps extends ModalProps {
  parentZIndex?: number;
}

export const NestedModal: React.FC<NestedModalProps> = ({
  parentZIndex = 50,
  ...props
}) => {
  const zIndexClass = `z-${parentZIndex + 10}`;
  return (
    <div className={zIndexClass}>
      <Modal {...props} />
    </div>
  );
};

// Confirmation Modal Helper
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'gvteway' | 'compvss' | 'atlvs';
  destructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  destructive = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={variant}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={destructive ? 'destructive' : variant}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-300 font-oswald">{message}</p>
    </Modal>
  );
};
