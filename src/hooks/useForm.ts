import { useState, ChangeEvent, FormEvent } from 'react';

interface ValidationRules {
  [key: string]: (value: string) => string | undefined;
}

interface UseFormProps<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit: (values: T) => Promise<void>;
}

export function useForm<T extends { [key: string]: any }>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (name: keyof T, value: string): string | undefined => {
    const validateRule = validationRules[name as string];
    return validateRule ? validateRule(value) : undefined;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    const error = validate(name as keyof T, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar todos os campos
    const newErrors: Partial<Record<keyof T, string>> = {};
    Object.keys(values).forEach((key) => {
      const error = validate(key as keyof T, values[key]);
      if (error) {
        newErrors[key as keyof T] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Erro no envio do formulário:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
  };
} 