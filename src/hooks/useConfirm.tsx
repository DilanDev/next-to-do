// src/hooks/useConfirm.tsx
import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: '',
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((confirmOptions: ConfirmOptions): Promise<boolean> => {
    setOptions(confirmOptions);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
  }, [resolver]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
  }, [resolver]);

  return {
    confirm,
    isOpen,
    options,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };
}