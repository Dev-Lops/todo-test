export const validation = {
  required: (value: any): string | undefined => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Este campo é obrigatório';
    }
  },

  email: (value: string): string | undefined => {
    if (!value) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'E-mail inválido';
    }
  },

  minLength: (length: number) => (value: string): string | undefined => {
    if (!value) return;
    if (value.length < length) {
      return `Deve ter no mínimo ${length} caracteres`;
    }
  },

  maxLength: (length: number) => (value: string): string | undefined => {
    if (!value) return;
    if (value.length > length) {
      return `Deve ter no máximo ${length} caracteres`;
    }
  },

  compose: (...validators: Array<(value: any) => string | undefined>) => {
    return (value: any): string | undefined => {
      for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
    };
  },
}; 