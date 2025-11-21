/**
 * Command Palette Component
 */

'use client';

import * as React from 'react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="bg-white p-4 rounded-lg w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Type a command..."
          className="w-full px-4 py-2 border-2 border-black"
          autoFocus
        />
      </div>
    </div>
  );
}
