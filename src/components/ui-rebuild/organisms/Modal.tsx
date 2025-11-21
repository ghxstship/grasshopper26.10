/**
 * Modal Component
 */

'use client';

import * as React from 'react';
import { H2, Body } from '../atoms/Typography';
import { Button } from '../atoms/Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {title && <H2 className="mb-4">{title}</H2>}
        <Body className="mb-6">{children}</Body>
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      </div>
    </div>
  );
}
