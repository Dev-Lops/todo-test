import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  code?: string;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError({ message: error.message });
    } else if (typeof error === 'string') {
      setError({ message: error });
    } else {
      setError({ message: 'Ocorreu um erro inesperado' });
    }

    // Limpa o erro após 5 segundos
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
} 