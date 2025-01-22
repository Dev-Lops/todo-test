import { useState, useCallback } from 'react';

interface ToastOptions {
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, options: ToastOptions = {}) => {
    const id = Date.now();
    const toast: Toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 3000,
    };

    setToasts((prev) => [...prev, toast]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    show,
    remove,
  };
} 