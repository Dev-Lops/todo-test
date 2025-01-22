import { ReactNode } from 'react';
import {
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  FormProvider,
} from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void> | void;
  children: ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            await onSubmit(data);
          } catch (error) {
            console.error('Form submission error:', error);
          }
        })}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
} 