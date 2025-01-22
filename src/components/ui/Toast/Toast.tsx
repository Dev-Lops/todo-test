import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className={`
        fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white
        ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
        transition-all duration-300 ease-in-out
      `}
    >
      {message}
    </div>,
    document.body
  );
} 